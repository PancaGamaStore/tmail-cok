import { useEffect, useState } from "react";

type Message = {
  id: string;
  from: string;
  subject: string;
  preview: string;
};

export function Inbox({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInbox = async () => {
    try {
      const res = await fetch(`/api/inbox?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Gagal mengambil pesan.");
      const data = await res.json();
      setMessages(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
    const interval = setInterval(loadInbox, 10000); // auto refresh 10 detik
    return () => clearInterval(interval);
  }, [email]);

  if (loading) return <p className="mt-6 text-zinc-400">📥 Memuat pesan...</p>;
  if (error) return <p className="mt-6 text-red-400">❌ {error}</p>;
  if (messages.length === 0)
    return <p className="mt-6 text-zinc-500">📭 Belum ada pesan masuk.</p>;

  return (
    <div className="w-full max-w-2xl mt-6 px-4">
      <ul className="space-y-4">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="bg-background-card p-5 rounded-2xl border border-zinc-700 shadow-glow"
          >
            <p className="text-sm text-zinc-400 mb-1">📤 Dari: {msg.from}</p>
            <p className="text-lg font-semibold text-white">{msg.subject}</p>
            <p className="text-sm mt-2 text-zinc-300">{msg.preview}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
