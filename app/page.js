"use client";
import { useState } from "react";

export default function Home() {
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExtracting(true);
    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/extract", { method: "POST", body: formData });
    const data = await res.json();
    if (data.text) setCvText(data.text);
    setExtracting(false);
  };

  const handleRoast = async () => {
    if (!cvText) return;
    setLoading(true);
    setResult("");
    const res = await fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-[#e5e5e5] flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center gap-3">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="22" fill="#1a1a1a"/>
            <path d="M22 8 C18 12 14 16 16 20 C14 19 13 17 13 17 C11 21 13 25 16 27 C15 26 15 24 16 23 C17 27 20 29 22 30 C24 29 27 27 28 23 C29 24 29 26 28 27 C31 25 33 21 31 17 C31 17 30 19 28 20 C30 16 26 12 22 8Z" fill="#ff6b35"/>
            <path d="M22 20 C21 22 20 23 21 25 C21.5 24 22 24 22 25 C22 24 22.5 24 23 25 C24 23 23 22 22 20Z" fill="#ffcc00"/>
            <ellipse cx="19" cy="33" rx="2" ry="1.5" fill="#555"/>
            <ellipse cx="25" cy="33" rx="2" ry="1.5" fill="#555"/>
            <rect x="17" y="34" width="10" height="1.5" rx="0.75" fill="#444"/>
            <circle cx="19" cy="26.5" r="1.2" fill="#1a1a1a"/>
            <circle cx="25" cy="26.5" r="1.2" fill="#1a1a1a"/>
            <path d="M20 29.5 Q22 31 24 29.5" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl font-medium text-[#ff6b35] tracking-tight">RoastMyCV</span>
        </div>
        <p className="text-sm text-[#888]">Upload your CV. We'll be brutally honest. 🔥</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-xl bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl p-6">
        {/* Upload Zone */}
        <label htmlFor="fileInput" className="flex flex-col items-center gap-2 border-2 border-dashed border-[#333] hover:border-[#ff6b35] rounded-xl p-8 cursor-pointer transition-colors mb-4">
          <span className="text-3xl">📎</span>
          <p className="text-sm text-[#888]">
            {extracting ? "Reading file..." : fileName ? `✅ ${fileName}` : <><span className="text-[#ff6b35]">Click to upload</span> PDF or DOCX</>}
          </p>
          <input id="fileInput" type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden"/>
        </label>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#2e2e2e]"/>
          <span className="text-xs text-[#555]">or paste manually</span>
          <div className="flex-1 h-px bg-[#2e2e2e]"/>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full bg-[#111] border border-[#2e2e2e] focus:border-[#ff6b35] rounded-xl p-3 text-[#ccc] text-sm resize-none outline-none min-h-[120px] leading-relaxed"
          placeholder="Paste your CV content here..."
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleRoast}
          disabled={loading || !cvText}
          className="w-full mt-4 py-3.5 rounded-xl font-medium text-white bg-[#ff6b35] hover:bg-[#e55a25] disabled:bg-[#333] disabled:text-[#666] disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Roasting... 🔥" : "🔥 Roast My CV"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-5 bg-[#111] border border-[#2e2e2e] rounded-xl p-4">
            <p className="text-xs text-[#ff6b35] font-medium mb-2">🔥 ROAST RESULT</p>
            <p className="text-sm text-[#ccc] leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}