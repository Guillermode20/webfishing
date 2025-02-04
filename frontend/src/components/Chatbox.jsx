export default function Chatbox({ messages = [] }) {
  return (
    <div className="h-64 bg-indigo-950 bg-opacity-50 p-4 border-4 border-green-400 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((msg, index) => {
          const [meta, text] = msg.split(']: ');
          return (
            <div key={index} className="bg-indigo-950 bg-opacity-50 p-2">
              <span className="retro-text text-xs text-green-600">{meta}]</span>
              <span className="retro-text text-xs text-green-400">: {text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
