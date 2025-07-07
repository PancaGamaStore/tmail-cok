import { useState, useEffect } from "react";
import Head from "next/head";
import { Inbox } from "@/components/Inbox";
import { generateRandomEmail } from "@/lib/generateEmail";
import { AdBanner } from "@/components/AdBanner";
import { AdPopup } from "@/components/AdPopup";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showAdPopup, setShowAdPopup] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("temp_email");
    if (saved) {
      setEmail(saved);
    } else {
      const newEmail = generateRandomEmail();
      setEmail(newEmail);
      localStorage.setItem("temp_email", newEmail);
    }

    const timer = setTimeout(() => setShowAdPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const regenerate = () => {
    const newEmail = generateRandomEmail();
    setEmail(newEmail);
    localStorage.setItem("temp_email", newEmail);
  };

  return (
    <>
      <Head>
        <title>TempMail Generator</title>
      </Head>
      <main className="min-h-screen bg-background-dark text-white font-sans flex flex-col justify-start items-center px-4 py-10 relative overflow-hidden">
        {/* Judul di atas tengah */}
        <header className="w-full max-w-4xl text-center mb-8">
          <h1 className="text-4xl font-extrabold text-brand animate-fade-in">
            T-Mail Cok
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">Buat email sementara tanpa ribet</p>
        </header>

        {/* Email dan tombol */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="bg-background-card/40 backdrop-blur-md px-5 py-3 rounded-xl border border-zinc-700 shadow-glow">
            {email}
          </div>
          <button
            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl shadow-glow transition-all duration-200"
            onClick={() => navigator.clipboard.writeText(email)}
          >
            Salin
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-glow transition-all duration-200"
            onClick={regenerate}
          >
            Ganti Email
          </button>
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

        {/* Popup Ad */}
        {showAdPopup && <AdPopup onClose={() => setShowAdPopup(false)} />}
      </main>
    </>
  );
}
