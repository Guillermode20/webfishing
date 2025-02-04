import { useState, useEffect, useRef } from 'preact/hooks';
import useWebSocket from './hooks/useWebSocket';
import Chatbox from './components/Chatbox';
import MessageInput from './components/MessageInput';
import Auth from './components/Auth';
import User from './components/User';
import Inventory from './components/Inventory';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  
  const answerRef = useRef('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    submitAnswer(answerRef.current);
    answerRef.current = '';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openUserModal = () => {
    setIsUserModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  const openInventoryModal = () => {
    setIsInventoryModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeInventoryModal = () => {
    setIsInventoryModalOpen(false);
  };

  if (!isAuthenticated) {
    return <Auth onAuth={setIsAuthenticated} />;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 crt-effect retro-bg">
        <header className="ps1-window bg-indigo-900 text-green-400 p-4 flex justify-between items-center">
          <h1 className="retro-text text-2xl">Webfishing Chat</h1>
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="retro-button bg-green-400 text-indigo-900 px-4 py-2"
            >
              Menu
            </button>
            {isDropdownOpen && (
              <div className="ps1-window absolute right-0 mt-2 w-48 bg-indigo-900 border-green-400">
                <button 
                  onClick={openUserModal}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  User
                </button>
                <button 
                  onClick={openInventoryModal}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Inventory
                </button>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {isUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-11/12 max-w-2xl">
              <button 
                onClick={closeUserModal}
                className="retro-button absolute top-4 right-4 bg-red-500 text-white px-4 py-2"
              >
                CLOSE
              </button>
              <User />
            </div>
          </div>
        )}

        {isInventoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-11/12 max-w-2xl">
              <button 
                onClick={closeInventoryModal}
                className="retro-button absolute top-4 right-4 bg-red-500 text-white px-4 py-2"
              >
                CLOSE
              </button>
              <Inventory />
            </div>
          </div>
        )}

        <div className="outer-container flex flex-col items-center p-4">
          <div className="container flex gap-6">
            <div className="w-1/2">
              <div className="ps1-window bg-indigo-900 p-6 text-green-400 dither-bg">
                <h2 className="retro-text text-xl mb-4">Chatbox</h2>
                <Chatbox messages={messages} />
                <MessageInput
                  input={input}
                  setInput={setInput}
                  handleFormSubmit={handleFormSubmit}
                  inputRef={inputRef}
                />
              </div>
            </div>
            <div className="w-1/2">
              <div className="ps1-window bg-indigo-900 p-6 text-green-400 dither-bg">
                <h2 className="retro-text text-xl mb-4">Fishing</h2>
                <div className="flex flex-col items-center justify-between h-[400px]">
                  {question ? (
                    <div className="text-center">
                      <p className="text-lg mb-4">{question.question}</p>
                      <p className="text-sm mb-4">Time remaining: {timer}s</p>
                      <form onSubmit={handleAnswerSubmit}>
                        <input
                          type="text"
                          ref={answerRef}
                          onChange={(e) => answerRef.current = e.target.value}
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
        </div>
      </div>
    </>
  );
}
