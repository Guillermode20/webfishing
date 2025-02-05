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
        <header className="header-container ps1-window bg-indigo-900 text-green-400 p-4 flex justify-between items-center">
          <h1 className="retro-text text-2xl">WEBFISHING</h1>
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="retro-button bg-green-400 text-indigo-900"
            >
              MENU
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={openUserModal} className="dropdown-item">USER</button>
                <button onClick={openInventoryModal} className="dropdown-item">INVENTORY</button>
                <button onClick={handleLogout} className="dropdown-item">LOGOUT</button>
              </div>
            )}
          </div>
        </header>

        {isUserModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                onClick={closeUserModal}
                className="retro-button absolute -top-12 right-0 bg-red-500 text-white"
              >
                CLOSE
              </button>
              <User />
            </div>
          </div>
        )}

        {isInventoryModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                onClick={closeInventoryModal}
                className="retro-button absolute -top-12 right-0 bg-red-500 text-white"
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
                <h2 className="retro-text text-2xl mb-4">Fishing</h2>
                <div className="flex flex-col items-center justify-between h-[400px]">
                  {question ? (
                    <div className="text-center w-full">
                      <p className="retro-text text-base mb-6">{question.question}</p>
                      <p className="retro-text text-sm mb-6">TIME REMAINING: {timer}s</p>
                      <form onSubmit={handleAnswerSubmit} className="space-y-4">
                        <input
                          type="text"
                          ref={answerRef}
                          onChange={(e) => answerRef.current = e.target.value}
                          className="retro-input w-full mb-4"
                          placeholder="YOUR ANSWER..."
                        />
                        <button 
                          type="submit" 
                          className="retro-button bg-green-400 text-indigo-900 w-full"
                        >
                          SUBMIT
                        </button>
                      </form>
                    </div>
                  ) : (
                    <>
                      <p className="retro-text text-base">READY TO FISH?</p>
                      <button 
                        onClick={requestQuestion}
                        className="retro-button bg-green-400 text-indigo-900"
                      >
                        CAST LINE
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
