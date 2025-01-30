const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

// Server configuration
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Utility functions
const formatMessage = (ip, port, message) => {
    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `[${ip}:${port}][${time}]: ${message}`;
};

// WebSocket handling
const handleWebSocket = (ws, req) => {
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

wss.on('connection', handleWebSocket);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});