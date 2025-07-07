import { useEffect, useState } from "react";

type Message = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  [key: string]: any; // agar JSON lengkap bisa ditampilkan
};

export function Inbox({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);

  const loadInbox = async () => {
    try {
      const res = await fetch(`/api/inbox?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Gagal mengambil pesan.");
      const data = await res.json();

      // Deteksi pesan baru
      if (data.length > messages.length) {
        const latest = data[0];
        if (!messages.some((msg) => msg.id === latest.id)) {
          setNewMessageId(latest.id);
          setShowPopup(true);

          // Suara notifikasi
          const audio = new Audio("/notif.mp3");
          audio.play();

          setTimeout(() => {
            setShowPopup(false);
            setNewMessageId(null);
          }, 5000);
        }
      }

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

        {/* Mode Developer Toggle */}
        <div className="mb-4 flex items-center justify-between">
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
              key={msg.id}
              className={`bg-white/5 backdrop-blur-md border border-zinc-700 rounded-2xl shadow-glow p-5 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl ${
                newMessageId === msg.id ? "ring-2 ring-brand" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center text-white text-lg shadow-md">
                  📨
                </div>
                <p className="text-sm text-zinc-400">Dari: {msg.from}</p>
              </div>
              <div className="border-t border-zinc-700 pt-3">
                <p className="text-lg font-semibold text-white">{msg.subject}</p>
                <p className="text-sm mt-1 text-zinc-300">{msg.preview}</p>
              </div>

              {/* Developer JSON view */}
              {developerMode && (
                <pre className="mt-4 text-xs bg-zinc-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(msg, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Pop-up Notifikasi */}
      {showPopup && (
        <div className="fixed bottom-6 right-6 bg-brand text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in z-50">
          📬 Pesan baru diterima!
        </div>
      )}
    </>
  );
}
