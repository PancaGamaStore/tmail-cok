import { useEffect, useState } from "react";

export function Inbox({ email }: { email: string }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInbox = async () => {
    const res = await fetch(`/api/inbox?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInbox();
    const interval = setInterval(loadInbox, 10000);
    return () => clearInterval(interval);
  }, [email]);

  if (loading) return <p className="mt-6 text-zinc-400">Memuat pesan...</p>;
  if (messages.length === 0)
    return <p className="mt-6 text-zinc-500">Belum ada pesan masuk.</p>;

  return (
    <div className="w-full max-w-2xl mt-6">
      <ul className="space-y-2">
        {messages.map((msg: any) => (
          <li key={msg.id} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <p className="text-sm text-zinc-400">Dari: {msg.from}</p>
            <p className="font-semibold text-lg">{msg.subject}</p>
            <p className="text-sm mt-1">{msg.preview}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
