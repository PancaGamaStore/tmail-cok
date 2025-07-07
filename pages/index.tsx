import { useState, useEffect } from "react";
import Head from "next/head";
import { Inbox } from "@/components/Inbox";
import { generateRandomEmail } from "@/lib/generateEmail";

export default function Home() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("temp_email");
    if (saved) {
      setEmail(saved);
    } else {
      const newEmail = generateRandomEmail();
      setEmail(newEmail);
      localStorage.setItem("temp_email", newEmail);
    }
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
      <main className="min-h-screen bg-background-dark text-white font-sans flex flex-col justify-start items-center px-4 py-10">
        {/* Judul di atas tengah */}
        <header className="w-full max-w-4xl text-center mb-8">
          <h1 className="text-4xl font-extrabold text-brand">📧 TempMail Generator</h1>
          <p className="text-zinc-400 mt-1 text-sm">Buat email sementara tanpa ribet</p>
        </header>

        {/* Email dan tombol */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="bg-background-card px-5 py-3 rounded-xl border border-zinc-700 shadow-glow">
            {email}
          </div>
          <button
            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl shadow-glow"
            onClick={() => navigator.clipboard.writeText(email)}
          >
            Salin
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-glow"
            onClick={regenerate}
          >
            Ganti Email
          </button>
        </div>

        {/* Kotak inbox */}
        <Inbox email={email} />

        {/* Footer */}
        <footer className="mt-16 text-sm text-zinc-500 border-t border-zinc-800 pt-6 w-full text-center">
          <p>
            © <span className="text-brand font-semibold">Masjjoooo</span> {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
