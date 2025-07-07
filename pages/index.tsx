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

  // Fungsi untuk generate email
  const generateEmail = () => {
    const newUser = generateRandomUsername();
    const newMail = `${newUser}@${selectedDomain}`;
    setUsername(newUser);
    setEmail(newMail);
    localStorage.setItem("temp_email", newMail);
  };

  useEffect(() => {
    const saved = localStorage.getItem("temp_email");
    if (saved) {
      setEmail(saved);
    } else {
      generateEmail();
    }

    // Tampilkan popup pertama kali setelah 5 detik
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
    setSelectedDomain(e.target.value);
    const newMail = `${username || generateRandomUsername()}@${e.target.value}`;
    setEmail(newMail);
    localStorage.setItem("temp_email", newMail);
  };

  // Setiap kali popup ditutup, buka lagi 5 detik kemudian
  const handleAdPopupClose = () => {
    setShowAdPopup(false);
    setTimeout(() => setShowAdPopup(true), 5000);
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
          <p className="text-zinc-400 mt-1 text-sm">Buat email sementara tanpa ribet</p>
        </header>

        {/* Kotak Email + Tombol */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6 animate-fade-in">
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
        </div>

        {/* Domain selector */}
        <div className="mb-8">
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

        {/* Inbox */}
        <Inbox email={email} />

        {/* Banner Ad */}
        <AdBanner />

        {/* Footer */}
        <footer className="mt-16 text-sm text-zinc-500 border-t border-zinc-800 pt-6 w-full text-center">
          <p>
            © <span className="text-brand font-semibold">Masjjoooo</span> {new Date().getFullYear()}
          </p>
        </footer>

        {/* Pop-up Ad (selalu muncul ulang setiap 5 detik setelah ditutup) */}
        {showAdPopup && <AdPopup onClose={handleAdPopupClose} />}
      </main>
    </>
  );
}
