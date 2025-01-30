import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

export function App() {
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

  return (
    <>
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl">Webfishing In-Dev</h1>
      </header>

      <div className="outer-container flex flex-col items-center">
        <div className="container p-4 bg-white shadow-md rounded mt-4">
          <h2 className="text-xl mb-4">Chatbox</h2>
          
          <div className="w-full h-64 p-2 border rounded overflow-y-auto">
            {messages.map((msg, index) => {
              const [meta, text] = msg.split(']: ');
              return (
                <div key={index}>
                  <span className="message-meta">{meta}]</span>: {text}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleFormSubmit} className="mt-2">
            <input
              className="w-full p-2 border rounded"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              ref={inputRef}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded ml-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

