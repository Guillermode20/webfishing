import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

export default function useWebSocket() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(null);
  const wsRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const handleMessage = useCallback((event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'chat':
        setMessages((prevMessages) => [...prevMessages, data.message]);
        break;
      
      case 'question':
        setQuestion(data.data);
        setTimer(data.data.timeLimit);
        // Start countdown timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setQuestion(null);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
        break;
      
      case 'answerResult':
        const message = data.data.isCorrect ? 'Correct! You caught a fish!' : 'Wrong answer! The fish got away!';
        setMessages(prev => [...prev, `[System]: ${message}`]);
        break;
    }
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

  const sendMessage = useCallback((type, payload) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    wsRef.current.send(JSON.stringify({ type, ...payload }));
  }, []);

  const handleChatSubmit = useCallback((e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    sendMessage('chat', { message: trimmedInput });
    setInput('');
    inputRef.current.focus();
  }, [input, sendMessage]);

  const requestQuestion = useCallback(() => {
    sendMessage('requestQuestion');
  }, [sendMessage]);

  const submitAnswer = useCallback((answer) => {
    if (!question) return;
    
    sendMessage('submitAnswer', {
      answer,
      correctAnswer: question.answer
    });
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setQuestion(null);
    setTimer(null);
  }, [question, sendMessage]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    messages,
    input,
    setInput,
    handleFormSubmit: handleChatSubmit,
    inputRef,
    question,
    timer,
    requestQuestion,
    submitAnswer
  };
}
