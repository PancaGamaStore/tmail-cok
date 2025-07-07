import { useState } from "react";

export function SetPinModal({ onSave }: { onSave: (pin: string) => void }) {
  const [pin, setPin] = useState("");

  const handleSave = () => {
    if (/^\d{6}$/.test(pin)) {
      onSave(pin);
    } else {
      alert("PIN harus 6 digit angka");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-white">Set PIN untuk Email</h2>
        <input
          type="password"
          placeholder="Masukkan 6 digit PIN"
          className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 mb-4"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded"
        >
          Simpan PIN
        </button>
      </div>
    </div>
  );
}
