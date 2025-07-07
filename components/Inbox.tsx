import { useEffect, useState } from "react";

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
}

export function Inbox({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInbox = async () => {
    try {
      const res = await fetch(`/api/inbox?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Gagal memuat inbox:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
    const interval = setInterval(loadInbox, 10000);
    return () => clearInterval(interval);
  }, [email]);

  if (loading)
    return <p className="mt-6 text-zinc-400 animate-pulse">Memuat pesan...</p>;

  if (messages.length === 0)
    return <p className="mt-6 text-zinc-500 italic">Belum ada pesan masuk.</p>;

  return (
    <div className="w-full max-w-2xl mt-6 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-background-card border border-zinc-700 rounded-2xl p-4 shadow-md hover:shadow-lg transition"
        >
          <p className="text-sm text-zinc-400 mb-1">📩 Dari: <span className="font-medium">{msg.from}</span></p>
          <p className="text-brand font-semibold text-lg">{msg.subject}</p>
          <p className="text-sm mt-1 text-zinc-300">{msg.preview}</p>
        </div>
      ))}
    </div>
  );
}
