import { useEffect, useState } from "react";

export function AdPopup({ onClose }: { onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className={`fixed bottom-10 right-6 z-50 transition-all duration-300 ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
      <div className="bg-background-card/70 backdrop-blur-lg border border-zinc-600 p-4 rounded-2xl shadow-glow w-64">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-brand">Iklan</span>
          <button onClick={handleClose} className="text-zinc-400 hover:text-white">✕</button>
        </div>
        <div className="text-zinc-300 text-sm text-center">[Slot Iklan Pop-up]</div>
      </div>
    </div>
  );
}
