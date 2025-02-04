export default function MessageInput({ input, setInput, handleFormSubmit, inputRef }) {
  return (
    <form onSubmit={handleFormSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          className="flex-1 bg-indigo-950 text-green-400 retro-text text-xs p-4 border-4 border-green-400 focus:outline-none"
          placeholder="TYPE MESSAGE..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
        />
        <button
          type="submit"
          className="retro-button bg-green-400 text-indigo-900 px-6 py-4"
        >
          SEND
        </button>
      </div>
    </form>
  );
}
