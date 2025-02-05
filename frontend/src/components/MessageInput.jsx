export default function MessageInput({ input, setInput, handleFormSubmit, inputRef }) {
  return (
    <form onSubmit={handleFormSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          className="retro-input"
          placeholder="TYPE MESSAGE..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
        />
        <button
          type="submit"
          className="retro-button bg-green-400 text-indigo-900"
        >
          SEND
        </button>
      </div>
    </form>
  );
}
