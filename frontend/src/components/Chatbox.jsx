export default function Chatbox({ messages = [] }) {
  return (
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
  );
}
