import { jsPDF } from "jspdf";
import { FileText, Download, LogOut, CheckCircle2, XCircle, Clock, Code2, BarChart2 } from "lucide-react";

/**
 * SessionReportModal
 * Shown at the end of a session — displays a summary and allows PDF download.
 *
 * Props:
 *  - problem:        { title, difficulty, slug }
 *  - timeElapsed:    number (seconds) from the stopwatch
 *  - timeRemaining:  number (seconds left if countdown mode was used)
 *  - timerMode:      "stopwatch" | "timer"what the in th session is going on you dyam wna
 *  - language:       string  (e.g. "javascript")
 *  - runCount:       number
 *  - submitCount:    number
 *  - lastVerdict:    string  (e.g. "Accepted", "Wrong Answer", null)
 *  - sessionId:      string
 *  - hostName:       string, 
 *  - participantName:string
 *  - onClose:        () => void  (navigate to dashboard)
 */
export default function SessionReportModal({
  problem,
  timeElapsed,
  timeRemaining,
  timerMode,
  language,
  runCount,
  submitCount,
  lastVerdict,
  sessionId,
  hostName,
  participantName,
  onClose,
}) {
  // ── Helpers ────────────────────────────────────────────────────────────────
  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  const durationSeconds =
    timerMode === "stopwatch"
      ? timeElapsed
      : timerMode === "timer" && timeElapsed > 0
        ? timeElapsed
        : 0;

  const verdictColor =
    lastVerdict === "Accepted"
      ? "text-emerald-400"
      : lastVerdict
        ? "text-red-400"
        : "text-gray-400";

  const difficultyColor =
    problem?.difficulty === "easy"
      ? "text-emerald-400"
      : problem?.difficulty === "medium"
        ? "text-amber-400"
        : "text-red-400";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ── PDF Generation ──────────────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    let y = 50;

    // Header bar
    doc.setFillColor(27, 27, 31);
    doc.rect(0, 0, w, 90, "F");

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Clyric · Session Report", 40, 38);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 170);
    doc.text(`Generated: ${dateStr} at ${timeStr}`, 40, 60);
    doc.text(`Session ID: ${sessionId || "—"}`, 40, 76);

    y = 115;

    // Section helper
    const section = (title) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 120);
      doc.text(title.toUpperCase(), 40, y);
      doc.setDrawColor(50, 50, 60);
      doc.line(40, y + 4, w - 40, y + 4);
      y += 22;
    };

    const row = (label, value, valueColor) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 165);
      doc.text(label, 50, y);
      doc.setFont("helvetica", "bold");
      if (valueColor) doc.setTextColor(...valueColor);
      else doc.setTextColor(230, 230, 240);
      doc.text(String(value || "—"), 220, y);
      doc.setTextColor(230, 230, 240);
      y += 22;
    };

    // Problem Section
    section("Problem");
    row("Title", problem?.title || "Unknown");
    row(
      "Difficulty",
      problem?.difficulty
        ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)
        : "—",
      problem?.difficulty === "easy"
        ? [52, 211, 153]
        : problem?.difficulty === "medium"
          ? [251, 191, 36]
          : [248, 113, 113]
    );
    y += 8;

    // Performance Section
    section("Performance");
    row("Duration", durationSeconds > 0 ? fmt(durationSeconds) : "Not tracked");
    row("Language", language ? language.charAt(0).toUpperCase() + language.slice(1) : "—");
    row("Code Runs", String(runCount ?? 0));
    row("Submissions", String(submitCount ?? 0));
    row(
      "Final Verdict",
      lastVerdict || "Not submitted",
      lastVerdict === "Accepted"
        ? [52, 211, 153]
        : lastVerdict
          ? [248, 113, 113]
          : [140, 140, 155]
    );
    y += 8;

    // Participants Section
    section("Participants");
    row("Host", hostName || "—");
    row("Participant", participantName || "—");

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(27, 27, 31);
    doc.rect(0, pageH - 40, w, 40, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 115);
    doc.text("clyric.dev · Interview Practice Platform", 40, pageH - 16);

    const slug = problem?.slug || problem?.title?.toLowerCase().replace(/\s+/g, "-") || "session";
    doc.save(`clyric-report-${slug}-${now.toISOString().slice(0, 10)}.pdf`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e1e2e] to-[#18181b] px-6 py-5 border-b border-[#27272a] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">Session Summary</h2>
            <p className="text-gray-500 text-xs">{dateStr} · {timeStr}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Problem card */}
          <div className="bg-[#111113] rounded-xl p-4 border border-[#27272a]">
            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Problem</p>
            <p className="text-gray-100 font-semibold text-sm leading-snug">{problem?.title || "Unknown"}</p>
            <span className={`text-[11px] font-medium mt-1 inline-block ${difficultyColor}`}>
              {problem?.difficulty
                ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)
                : "—"}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Clock className="w-4 h-4 text-blue-400" />} label="Duration" value={durationSeconds > 0 ? fmt(durationSeconds) : "—"} />
            <StatCard icon={<Code2 className="w-4 h-4 text-purple-400" />} label="Language" value={language ? language.charAt(0).toUpperCase() + language.slice(1) : "—"} />
            <StatCard icon={<BarChart2 className="w-4 h-4 text-amber-400" />} label="Runs / Submits" value={`${runCount ?? 0} / ${submitCount ?? 0}`} />
            <div className="bg-[#111113] rounded-xl p-3.5 border border-[#27272a] flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                {lastVerdict === "Accepted"
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : <XCircle className="w-4 h-4 text-red-400" />}
                <span className="text-gray-500 text-[11px] font-medium">Final Verdict</span>
              </div>
              <span className={`text-sm font-bold ${verdictColor}`}>
                {lastVerdict || "Not submitted"}
              </span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#111113] rounded-xl px-3.5 py-3 border border-[#27272a]">
              <p className="text-gray-600 text-[10px] uppercase font-semibold">Host</p>
              <p className="text-gray-300 text-sm font-medium truncate">{hostName || "—"}</p>
            </div>
            <div className="flex-1 bg-[#111113] rounded-xl px-3.5 py-3 border border-[#27272a]">
              <p className="text-gray-600 text-[10px] uppercase font-semibold">Participant</p>
              <p className="text-gray-300 text-sm font-medium truncate">{participantName || "—"}</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 text-sm font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// Small stat card sub-component
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#111113] rounded-xl p-3.5 border border-[#27272a] flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-gray-500 text-[11px] font-medium">{label}</span>
      </div>
      <span className="text-gray-200 text-sm font-semibold">{value}</span>
    </div>
  );
}
