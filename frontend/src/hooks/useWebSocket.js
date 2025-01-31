import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

export default function useWebSocket() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [question, setQuestion] = useState(null);
    const [timer, setTimer] = useState(0);
    const inputRef = useRef(null);
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const messageQueue = useRef([]);
    const heartbeatInterval = useRef(null);
    const [connectionState, setConnectionState] = useState('disconnected');

    const sendMessage = useCallback((message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            messageQueue.current.push(message);
        }
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        setConnectionState('connecting');
        const ws = new WebSocket('ws://your-server-url'); // Replace with your actual WebSocket URL

        ws.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            setConnectionState('connected');
            reconnectAttempts.current = 0;

            // Send queued messages
            while (messageQueue.current.length > 0) {
                const message = messageQueue.current.shift();
                ws.send(JSON.stringify(message));
            }

            // Setup heartbeat
            heartbeatInterval.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, 25000);
        };

        ws.onclose = (event) => {
            console.log('WebSocket disconnected', event);
            setIsConnected(false);
            setConnectionState('disconnected');
            clearInterval(heartbeatInterval.current);

            // Attempt to reconnect if not exceeded max attempts
            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current += 1;
                setTimeout(connect, 1000 * Math.min(reconnectAttempts.current, 30));
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'pong') return;
            // ... existing message handling code ...
        };

        wsRef.current = ws;
    }, []);

    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                clearInterval(heartbeatInterval.current);
                wsRef.current.close();
            }
        };
    }, [connect]);

    // ... rest of your existing code ...

    return {
        // ...existing returns...
        sendMessage,
        connectionState,
    };
}
