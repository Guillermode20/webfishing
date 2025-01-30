import { useRef } from 'preact/hooks';
import useWebSocket from './hooks/useWebSocket';
import Chatbox from './components/Chatbox';
import MessageInput from './components/MessageInput';

export function App() {
  const { messages, input, setInput, handleFormSubmit, inputRef } = useWebSocket();

  return (
    <>
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl">Webfishing</h1>
      </header>

      <div className="outer-container flex flex-col items-center">
        <div className="container p-4 bg-white shadow-md rounded mt-4">
          <h2 className="text-xl mb-4">Chatbox</h2>
          
          <Chatbox messages={messages} />

          <MessageInput
            input={input}
            setInput={setInput}
            handleFormSubmit={handleFormSubmit}
            inputRef={inputRef}
          />
        </div>
      </div>
    </>
  );
}

