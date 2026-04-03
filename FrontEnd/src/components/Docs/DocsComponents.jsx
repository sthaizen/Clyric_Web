import React, { useState } from "react";
import { Info, AlertTriangle, Lightbulb, CheckCircle, Copy, Check } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";

// ─── Step Component ────────────────────────────────────────────────────────────
export const Step = ({ number, title, children }) => (
  <div className="flex gap-4 my-6 group">
    <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-100 text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
      {number}
    </div>
    <div className="flex-1 min-w-0">
      {title && <p className="text-[16px] font-bold text-zinc-100 mb-1.5">{title}</p>}
      {children && <div className="text-[15px] leading-relaxed text-zinc-400 mb-5">{children}</div>}
    </div>
  </div>
);

// ─── Callout Component ─────────────────────────────────────────────────────────
const CALLOUT_STYLES = {
  info: { border: "border-blue-500/20", icon: Info, color: "text-blue-400", label: "Info" },
  warning: { border: "border-amber-500/20", icon: AlertTriangle, color: "text-amber-400", label: "Warning" },
  tip: { border: "border-emerald-500/20", icon: Lightbulb, color: "text-emerald-400", label: "Tip" },
  success: { border: "border-emerald-500/20", icon: CheckCircle, color: "text-emerald-400", label: "Success" },
};

export const Callout = ({ type = "info", title, children }) => {
  const s = CALLOUT_STYLES[type] || CALLOUT_STYLES.info;
  const Icon = s.icon;
  return (
    <div className={`flex gap-4 p-5 my-6 rounded-2xl border bg-white/5 backdrop-blur-sm transition-all hover:shadow-sm ${s.border}`}>
      <div className={`mt-0.5 shrink-0 ${s.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        {title && <p className={`text-[14px] font-bold mb-1 ${s.color}`}>{title}</p>}
        <div className="text-[14px] leading-7 text-zinc-300 opacity-90">{children}</div>
      </div>
    </div>
  );
};

// ─── CodeBlock Component ───────────────────────────────────────────────────────
export const CodeBlock = ({ language = "bash", children }) => {
  const [copied, setCopied] = useState(false);
  const code = (children || "").trim();
  const lineCount = code.split("\n").length;
  const height = Math.max(56, Math.min(lineCount * 19 + 28, 520));

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-sm bg-[#09090b]">
      <div className="flex items-center justify-between bg-white/5 px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-500"></div>
          </div>
          <span className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 hover:text-zinc-100 transition-colors py-1 px-2 rounded-md hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-1">
        <MonacoEditor
          height={height}
          language={language === "bash" ? "shell" : language}
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: "on",
            renderLineHighlight: "none",
            folding: false,
            contextmenu: false,
            scrollbar: { vertical: "hidden", horizontal: "auto" },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'Fira Code', 'Courier New', monospace",
          }}
        />
      </div>
    </div>
  );
};
