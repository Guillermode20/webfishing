const WebSocket = require('ws');
const { formatMessage, formatServerMessage } = require('./utils');
const { generateQuestion, verifyAnswer } = require('./questions');

// Add heartbeat interval (in milliseconds)
const HEARTBEAT_INTERVAL = 30000;
const CLIENT_TIMEOUT = 35000;

// Add rate limit constants
const CHAT_WINDOW_MS = 60000; // 1 minute
const CHAT_MAX_MESSAGES = 10; // 10 messages per minute
const FISHING_WINDOW_MS = 30000; // 30 seconds
const FISHING_MAX_ATTEMPTS = 3; // 3 fishing attempts per 30 seconds

// Rate limit tracking
const chatLimits = new Map();
const fishingLimits = new Map();

const checkRateLimit = (map, clientId, windowMs, maxAttempts) => {
    const now = Date.now();
    const clientData = map.get(clientId) || { attempts: [], lastNotified: 0 };

    // Clean up old attempts
    clientData.attempts = clientData.attempts.filter(time => now - time < windowMs);

    if (clientData.attempts.length >= maxAttempts) {
        // Only notify once per window
        if (now - clientData.lastNotified > windowMs) {
            clientData.lastNotified = now;
            return { limited: true, notify: true };
        }
        return { limited: true, notify: false };
    }

    clientData.attempts.push(now);
    map.set(clientId, clientData);
    return { limited: false };
};

/**
 * Handles WebSocket connections and messages.
 *
 * @param {WebSocket} ws - The WebSocket connection instance.
 * @param {http.IncomingMessage} req - The HTTP request that initiated the WebSocket connection.
 * @param {WebSocket.Server} wss - The WebSocket server instance.
 */
const handleWebSocket = (ws, req, wss) => {
    const ip = req.socket.remoteAddress.replace('::1', '127.0.0.1')
        .replace('::ffff:', '');
    const port = req.socket.remotePort;
    const clientId = `${ip}:${port}`;

    // Add heartbeat tracking
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    console.log(`Client connected: ${ip}:${port}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            ws.isAlive = true; // Reset alive status on any message

            switch (data.type) {
                case 'chat':
                    const chatCheck = checkRateLimit(chatLimits, clientId, CHAT_WINDOW_MS, CHAT_MAX_MESSAGES);
                    if (chatCheck.limited) {
                        if (chatCheck.notify) {
                            ws.send(JSON.stringify({
                                type: 'error',
                                message: 'Chat rate limit exceeded. Please wait a moment.'
                            }));
                        }
                        return;
                    }
                    const formattedMessage = formatMessage(ip, port, data.message);
                    broadcastMessage(wss, formattedMessage);
                    break;

                case 'requestQuestion':
                    const fishingCheck = checkRateLimit(fishingLimits, clientId, FISHING_WINDOW_MS, FISHING_MAX_ATTEMPTS);
                    if (fishingCheck.limited) {
                        if (fishingCheck.notify) {
                            ws.send(JSON.stringify({
                                type: 'error',
                                message: 'Fishing attempt rate limit exceeded. Please wait a moment.'
                            }));
                        }
                        return;
                    }
                    const question = generateQuestion();
                    ws.send(JSON.stringify({
                        type: 'question',
                        data: question
                    }));
                    break;

                case 'submitAnswer':
                    const isCorrect = verifyAnswer(data.answer, data.correctAnswer);
                    ws.send(JSON.stringify({
                        type: 'answerResult',
                        data: { isCorrect }
                    }));
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Clean up rate limit data when client disconnects
    ws.on('close', () => {
        chatLimits.delete(clientId);
        fishingLimits.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for ${ip}:${port}:`, error);
    });
};

/**
 * Broadcasts a message from the server to all connected clients.
 *
 * @param {WebSocket.Server} wss - The WebSocket server instance.
 * @param {string} message - The message to broadcast.
 */
const broadcastServerMessage = (wss, message) => {
    const formattedMessage = formatServerMessage(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(formattedMessage);
        }
    });
};

const broadcastMessage = (wss, message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'chat', message }));
        }
    });
};

// Add heartbeat checker
const heartbeat = (wss) => {
    setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) {
                console.log('Terminating stale connection');
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping();
        });
    }, HEARTBEAT_INTERVAL);
};

// Modified exports
module.exports = {
    handleWebSocket,
    broadcastServerMessage,
    heartbeat
};
