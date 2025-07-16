import { useEffect, useState } from "react";

interface Message {
  _id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: number;
}

export function Inbox({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [history, setHistory] = useState<Message[][]>([]);

  const loadInbox = async () => {
    if (!email) {
      setError("Alamat email tidak tersedia.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/inbox?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch inbox");
      }

      const messages: Message[] = data.messages || [];

      // Simpan ke riwayat (maks 5)
      setHistory((prev) => {
        const updated = [messages, ...prev].slice(0, 5);
        return updated;
      });

      // Deteksi pesan baru
      if (messages.length > messages.length) {
        const latest = messages[0];
        if (!messages.some((msg) => msg._id === latest._id)) {
          setNewMessageId(latest._id);
          setShowPopup(true);
          new Audio("/notif.mp3").play().catch((err) => console.error("Error playing sound:", err));
          setTimeout(() => {
            setShowPopup(false);
            setNewMessageId(null);
          }, 5000);
        }
      }

      setMessages(messages);
      setError("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengambil pesan.");
      console.error("Fetch inbox error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadMessage = (msg: Message) => {
    const blob = new Blob([JSON.stringify(msg, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-${msg._id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadInbox();
    const interval = setInterval(loadInbox, 10000);
    return () => clearInterval(interval);
  }, [email]);

  if (loading) return <p className="mt-6 text-zinc-400 animate-pulse">📥 Memuat pesan...</p>;
  if (error) return <p className="mt-6 text-red-400">❌ {error}</p>;
  if (messages.length === 0)
    return <p className="mt-6 text-zinc-500">📭 Belum ada pesan masuk.</p>;

  return (
    <>
      <div className="w-full max-w-2xl mt-6 px-4 animate-fade-in">
        {/* Developer Mode & Riwayat */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="text-sm text-zinc-400">🛠️ Mode Developer</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={developerMode}
              onChange={() => setDeveloperMode(!developerMode)}
            />
            <div className="w-11 h-6 bg-zinc-600 rounded-full p-1 flex items-center transition-all">
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  developerMode ? "translate-x-5" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>

        {/* List Pesan */}
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className={`bg-white/5 backdrop-blur-md border border-zinc-700 rounded-2xl shadow-glow p-5 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl ${
                newMessageId === msg._id ? "ring-2 ring-brand" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center text-white text-lg shadow-md">
                    📨
                  </div>
                  <p className="text-sm text-zinc-400">Dari: {msg.from}</p>
                </div>
                <button
                  onClick={() => downloadMessage(msg)}
                  className="text-xs text-brand hover:underline"
                >
                  ⬇️ Unduh
                </button>
              </div>
              <div className="border-t border-zinc-700 pt-3">
                <p className="text-lg font-semibold text-white">{msg.subject}</p>
                <p className="text-sm mt-1 text-zinc-300">{msg.body}</p>
              </div>
              {developerMode && (
                <pre className="mt-4 text-xs bg-zinc-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(msg, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>

        {/* Riwayat Inbox */}
        <div className="mt-10">
          <h3 className="text-zinc-400 text-sm mb-2">📂 Riwayat Inbox (max 5 snapshot)</h3>
          <ul className="space-y-2 text-xs text-zinc-500">
            {history.map((snapshot, i) => (
              <li key={i}>
                Snapshot #{i + 1}: {snapshot.length} pesan
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notifikasi Pop-up */}
      {showPopup && (
        <div className="fixed bottom-6 right-6 bg-brand text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in z-50">
          📬 Pesan baru diterima!
        </div>
      )}
    </>
  );
}
