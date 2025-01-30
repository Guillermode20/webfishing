export default function MessageInput({ input, setInput, handleFormSubmit, inputRef }) {
  return (
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
  );
}
