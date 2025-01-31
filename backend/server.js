// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { handleWebSocket, broadcastServerMessage, heartbeat } = require('./websocket');
const authRoutes = require('./routes/auth');

// Configuration
const config = {
    port: process.env.PORT || 4000,
};

// Middleware
const middleware = {
    logUserRegistration: (req, res, next) => {
        const { email, username } = req.body;
        console.log(`[Server] User registering: Email - ${email}, Username - ${username}`);
        next();
    },
    logUserLogin: (req, res, next) => {
        const { username } = req.body;
        console.log(`[Server] User logging in: Username - ${username}`);
        next();
    },
    logUserLogout: (req, res, next) => {
        const { username } = req.body;
        console.log(`[Server] User logging out: Username - ${username}`);
        next();
    },
    errorHandler: (err, req, res, next) => {
        console.error(`[Server] Error: ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
};

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Apply logging middleware
app.post('/auth/register', middleware.logUserRegistration);
app.post('/auth/login', middleware.logUserLogin);
app.post('/auth/logout', middleware.logUserLogout);

// Routes
app.use('/auth', authRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Initialize heartbeat mechanism
heartbeat(wss);

// WebSocket connection handler
wss.on('connection', (ws, req) => handleWebSocket(ws, req, wss));

// Endpoint to send a message to all connected clients
app.post('/send-message', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Message is required');
    }
    broadcastServerMessage(wss, message);
    res.status(200).send('Message sent');
});

// Error handling middleware
app.use(middleware.errorHandler);

// Start the server
server.listen(config.port, () => {
    console.log(`[Server] Server is running on http://localhost:${config.port}`);
});