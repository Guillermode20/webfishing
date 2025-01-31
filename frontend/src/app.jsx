import { useState, useEffect } from 'preact/hooks';
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
  
  const [answer, setAnswer] = useState('');
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
    submitAnswer(answer);
    setAnswer('');
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
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">Webfishing Chat</h1>
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Menu
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
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
          <div className="bg-white w-11/12 h-5/6 p-4 rounded shadow-lg overflow-auto">
            <button 
              onClick={closeUserModal}
              className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
            <User />
          </div>
        </div>
      )}

      {isInventoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-11/12 h-5/6 p-4 rounded shadow-lg overflow-auto">
            <button 
              onClick={closeInventoryModal}
              className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
            <Inventory />
          </div>
        </div>
      )}

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

