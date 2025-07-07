import { useState, useEffect } from "react";
import Head from "next/head";
import { Inbox } from "@/components/Inbox";
import { generateRandomUsername } from "@/lib/generateEmail";
import { AdBanner } from "@/components/AdBanner";
import { AdPopup } from "@/components/AdPopup";

const domains = ["okekang.my.id", "jaycok.my.id"];

export default function Home() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [restoreEmail, setRestoreEmail] = useState("");
  const [restorePin, setRestorePin] = useState("");
  const [restoreMessage, setRestoreMessage] = useState("");
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const generateEmail = () => {
    const user = generateRandomUsername();
    const mail = `${user}@${selectedDomain}`;
    setUsername(user);
    setEmail(mail);
    localStorage.setItem("temp_email", mail);
  };

  useEffect(() => {
    const saved = localStorage.getItem("temp_email");
    if (saved) {
      setEmail(saved);
    } else {
      generateEmail();
    }

    const timer = setTimeout(() => setShowAdPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const regenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      generateEmail();
      setIsLoading(false);
    }, 3000);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const domain = e.target.value;
    setSelectedDomain(domain);
    const mail = `${username || generateRandomUsername()}@${domain}`;
    setEmail(mail);
    localStorage.setItem("temp_email", mail);
  };

  const handleAdPopupClose = () => {
    setShowAdPopup(false);
    setTimeout(() => setShowAdPopup(true), 5000);
  };

  const handleSaveEmail = () => {
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setSaveMessage("PIN harus 6 digit angka.");
      return;
    }

    const savedEmails = JSON.parse(localStorage.getItem("saved_emails") || "{}");
    savedEmails[email] = { pin };
    localStorage.setItem("saved_emails", JSON.stringify(savedEmails));
    setSaveMessage("Email berhasil disimpan!");
    setShowPinInput(false);
    setPin("");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleRestore = () => {
    const savedEmails = JSON.parse(localStorage.getItem("saved_emails") || "{}");
    if (!savedEmails[restoreEmail]) {
      setRestoreMessage("Email tidak ditemukan atau belum disimpan.");
      setRestoreSuccess(false);
      return;
    }

    if (savedEmails[restoreEmail].pin === restorePin) {
      setEmail(restoreEmail);
      setUsername(restoreEmail.split("@")[0]);
      localStorage.setItem("temp_email", restoreEmail);
      setRestoreMessage("Berhasil dipulihkan!");
      setRestoreSuccess(true);
    } else {
      setRestoreMessage("PIN salah. Coba lagi.");
      setRestoreSuccess(false);
    }
  };

  return (
    <>
      <Head>
        <title>TempMail Generator</title>
      </Head>
      <main className="min-h-screen bg-background-dark text-white font-sans flex flex-col justify-start items-center px-4 py-10 relative overflow-hidden">
        {/* Judul */}
        <header className="w-full max-w-4xl text-center mb-8">
          <h1 className="text-4xl font-extrabold text-brand animate-fade-in">
            T-Mail Cok
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Buat email sementara tanpa ribet
          </p>
        </header>

        {/* Kotak Email + Tombol */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 animate-fade-in">
          <div className="bg-background-card/40 backdrop-blur-md px-5 py-3 rounded-xl border border-zinc-700 shadow-glow min-w-[250px] text-center">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full bg-brand animate-ping" />
                <span className="text-sm text-zinc-400">Menghasilkan email...</span>
              </div>
            ) : (
              email
            )}
          </div>

          <button
            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl shadow-glow transition-all duration-200"
            onClick={() => navigator.clipboard.writeText(email)}
            disabled={isLoading}
          >
            Salin
          </button>

          <button
            className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-glow transition-all duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={regenerate}
            disabled={isLoading}
          >
            Ganti Email
          </button>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-glow transition-all duration-200"
            onClick={() => setShowPinInput(true)}
            disabled={isLoading}
          >
            Simpan
          </button>
        </div>

        {/* Input PIN */}
        {showPinInput && (
          <div className="mb-4 flex flex-col items-center gap-2">
            <input
              type="password"
              placeholder="Masukkan PIN (6 digit)"
              className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white text-sm"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-xl text-sm"
              onClick={handleSaveEmail}
            >
              Simpan Sekarang
            </button>
            {saveMessage && <p className="text-sm text-green-400">{saveMessage}</p>}
          </div>
        )}

        {/* Domain selector */}
        <div className="mb-6">
          <select
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white shadow-inner"
            value={selectedDomain}
            onChange={handleDomainChange}
            disabled={isLoading}
          >
            {domains.map((d) => (
              <option key={d} value={d}>
                @{d}
              </option>
            ))}
          </select>
        </div>

        {/* Formulir Pulihkan Email */}
        <div className="w-full max-w-md bg-background-card/30 border border-zinc-700 p-4 rounded-xl mb-6">
          <h3 className="text-lg font-semibold text-brand mb-3">Pulihkan Email Lama</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Masukkan email kamu"
              className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-white"
              value={restoreEmail}
              onChange={(e) => setRestoreEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="PIN (6 digit)"
              className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-white"
              maxLength={6}
              value={restorePin}
              onChange={(e) => setRestorePin(e.target.value)}
            />
            <button
              onClick={handleRestore}
              className="bg-brand hover:bg-brand-dark text-white rounded-xl px-4 py-2 shadow-glow transition"
            >
              Pulihkan Email
            </button>
            {restoreMessage && (
              <p className={`text-sm mt-1 ${restoreSuccess ? "text-green-400" : "text-red-400"}`}>
                {restoreMessage}
              </p>
            )}
          </div>
        </div>

        {/* Inbox */}
        <Inbox email={email} />

        {/* Banner Ad */}
        <AdBanner />

        {/* Footer */}
        <footer className="mt-16 text-sm text-zinc-500 border-t border-zinc-800 pt-6 w-full text-center">
          <p>
            © <span className="text-brand font-semibold">Masjjoooo</span>{" "}
            {new Date().getFullYear()}
          </p>
        </footer>

        {/* Pop-up Ad */}
        {showAdPopup && <AdPopup />}
      </main>
    </>
  );
}
