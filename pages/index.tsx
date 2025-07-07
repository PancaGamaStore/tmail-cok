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
        <title>TempMail - Generator</title>
      </Head>
      <main className="min-h-screen bg-background-dark text-white font-sans flex flex-col items-center justify-center px-4 py-10">
        {/* Judul di tengah */}
        <h1 className="text-4xl font-bold text-center mb-8 text-brand shadow-glow">
          📧 Temp Mail Cok
        </h1>

        {/* Email & Tombol */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="bg-background-card px-5 py-3 rounded-xl border border-zinc-700 shadow-glow text-sm md:text-base">
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

        {/* Kotak Inbox */}
        <Inbox email={email} />
      </main>
    </>
  );
}
