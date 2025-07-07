import { useState, useEffect } from "react";
import Head from "next/head";
import { Inbox } from "@/components/Inbox";
import { generateRandomEmail } from "@/lib/generateEmail";

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
      <main className="min-h-screen bg-background-dark text-white font-sans flex flex-col justify-start items-center px-4 py-10 relative overflow-x-hidden">
        {/* Judul di atas tengah */}
        <header className="w-full max-w-4xl text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-brand drop-shadow">
            📧 TempMail Generator
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Buat email sementara tanpa ribet
          </p>
        </header>

        {/* Email dan tombol */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6 animate-fade-in">
          <div className="px-5 py-3 rounded-xl border border-white/10 backdrop-blur bg-white/10 text-white shadow-glow">
            {email}
          </div>
          <button
            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl shadow-glow transition duration-200 backdrop-blur bg-white/10 border border-white/10"
            onClick={() => navigator.clipboard.writeText(email)}
          >
            Salin
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-glow transition duration-200 backdrop-blur bg-white/10 border border-white/10"
            onClick={regenerate}
          >
            Ganti Email
          </button>
        </div>

        {/* Inbox */}
        <Inbox email={email} />

        {/* Footer */}
        <footer className="mt-16 text-sm text-zinc-500 border-t border-zinc-800 pt-6 w-full text-center">
          <p>
            © <span className="text-brand font-semibold">Masjjoooo</span>{" "}
            {new Date().getFullYear()}
          </p>

          {/* Banner Iklan */}
          <div className="mt-6">
            {/* Tempelkan script iklan banner di bawah ini */}
            <div className="w-full max-w-xl mx-auto h-24 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 text-sm">
              Slot Iklan Banner
            </div>
          </div>
        </footer>

        {/* Popup Iklan */}
        {showAdPopup && (
          <div className="fixed bottom-6 right-6 bg-white/10 border border-white/20 backdrop-blur-lg text-white rounded-xl p-4 shadow-glow z-50 animate-fade-in">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm text-zinc-200">Slot Iklan Pop-up</p>
                <p className="text-xs text-zinc-400">
                  Tempelkan script iklan popup di sini
                </p>
              </div>
              <button
                className="text-white hover:text-red-500 font-bold"
                onClick={() => setShowAdPopup(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
