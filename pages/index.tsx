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
        <title>TempMail - Inbox</title>
      </Head>
      <main className="min-h-screen bg-zinc-900 text-white flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">📧 TempMail</h1>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
            {email}
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            onClick={() => navigator.clipboard.writeText(email)}
          >
            Salin
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            onClick={regenerate}
          >
            Ganti Email
          </button>
        </div>
        <Inbox email={email} />
      </main>
    </>
  );
}
