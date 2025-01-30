const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { handleWebSocket, broadcastServerMessage } = require('./websocket');

// Server configuration
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => handleWebSocket(ws, req, wss));

app.post('/send-message', express.json(), (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Message is required');
    }
    broadcastServerMessage(wss, message);
    res.status(200).send('Message sent');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
