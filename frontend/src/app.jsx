import { useState } from 'preact/hooks';
import useWebSocket from './hooks/useWebSocket';
import Chatbox from './components/Chatbox';
import MessageInput from './components/MessageInput';

export function App() {
  const { 
    messages, 
    input, 
    setInput, 
    handleFormSubmit, 
    inputRef,
    question,
    timer,
    requestQuestion,
    submitAnswer 
  } = useWebSocket();
  
  const [answer, setAnswer] = useState('');

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    submitAnswer(answer);
    setAnswer('');
  };

  return (
    <>
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl">Webfishing</h1>
      </header>

      <div className="outer-container flex flex-col items-center">
        <div className="container flex p-4 bg-white shadow-md rounded mt-4">
          <div className="w-1/2 p-4">
            <h2 className="text-xl mb-4">Chatbox</h2>
            <Chatbox messages={messages} />
            <MessageInput
              input={input}
              setInput={setInput}
              handleFormSubmit={handleFormSubmit}
              inputRef={inputRef}
            />
          </div>
          <div className="w-1/2 p-4">
            <h2 className="text-xl mb-4">Fishing</h2>
            <div className="flex flex-col items-center justify-between h-[400px]">
              {question ? (
                <div className="text-center">
                  <p className="text-lg mb-4">{question.question}</p>
                  <p className="text-sm mb-4">Time remaining: {timer}s</p>
                  <form onSubmit={handleAnswerSubmit}>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="border p-2 rounded mr-2"
                      placeholder="Your answer..."
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Submit
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <p className="text-lg">Click button to Fish!</p>
                  <button 
                    onClick={requestQuestion}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                    Cast Line
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

