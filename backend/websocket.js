const WebSocket = require('ws');
const { formatMessage, formatServerMessage } = require('./utils');

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

    console.log(`Client connected: ${ip}:${port}`);

    ws.on('message', (message) => {
        try {
            const formattedMessage = formatMessage(ip, port, message.toString());
            console.log('Formatted message:', formattedMessage);

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(formattedMessage);
                }
            });
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${ip}:${port}`);
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

module.exports = { handleWebSocket, broadcastServerMessage };
