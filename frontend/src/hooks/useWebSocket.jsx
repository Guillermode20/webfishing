import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

export default function useWebSocket() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const wsRef = useRef(null);
  const inputRef = useRef(null);

  const handleMessage = useCallback((event) => {
    setMessages((prevMessages) => [...prevMessages, event.data]);
  }, []);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');
    wsRef.current = socket;

    socket.onmessage = handleMessage;
    socket.onerror = (error) => console.error('WebSocket error:', error);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [handleMessage]);

  const sendMessage = useCallback(() => {
    const trimmedInput = input.trim();
    if (!trimmedInput || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    console.log('Sending message:', trimmedInput);
    wsRef.current.send(trimmedInput);
    setInput('');
    inputRef.current.focus();
  }, [input]);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    sendMessage();
  }, [sendMessage]);

  return {
    messages,
    input,
    setInput,
    handleFormSubmit,
    inputRef
  };
}
