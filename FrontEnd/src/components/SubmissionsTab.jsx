import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { History, CheckCircle2, Bot, Clock, Cpu, X, Maximize2, Calendar } from "lucide-react";
import Editor from "@monaco-editor/react";
import { getUserSubmissions } from "../lib/api/problems";
import { formatDistanceToNow } from "date-fns";

export default function SubmissionsTab({ problem }) {
  const { getToken, userId } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSubmissions = async () => {
      if (!problem?.slug || !userId) return;

      try {
        setLoading(true);
        const token = await getToken();
        const data = await getUserSubmissions(problem.slug, token);
        if (isMounted) {
          setSubmissions(data.submissions || []);
        }
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        if (isMounted) {
          setError("Failed to load submissions.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubmissions();
    return () => { isMounted = false; };
  }, [problem?.slug, userId, getToken]);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("customNavyTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "C9D1D9" },
        { token: "comment", foreground: "6B7280" },
        { token: "keyword", foreground: "FF7B72" },
        { token: "string", foreground: "A5D6FF" },
        { token: "number", foreground: "79C0FF" },
        { token: "type", foreground: "FFA657" },
        { token: "type.identifier", foreground: "FFA657" },
        { token: "delimiter", foreground: "C9D1D9" },
        { token: "operator", foreground: "FF7B72" },
        { token: "identifier", foreground: "A5D6FF" },
        { token: "variable", foreground: "A5D6FF" },
        { token: "variable.predefined", foreground: "79C0FF" },
        { token: "function", foreground: "D2A8FF" },
        { token: "function.identifier", foreground: "D2A8FF" },
        { token: "tag", foreground: "7EE787" },
        { token: "attribute.name", foreground: "FFA657" },
        { token: "attribute.value", foreground: "A5D6FF" }
      ],
      colors: {
        "editor.background": "#1b1b1f",
        "editor.foreground": "#C9D1D9",
        "editorLineNumber.foreground": "#6E7681",
        "editorLineNumber.activeForeground": "#C9D1D9",
        "editorCursor.foreground": "#79C0FF",
        "editor.selectionBackground": "#1F3B5B",
        "editor.inactiveSelectionBackground": "#1F3B5B88",
        "editor.lineHighlightBackground": "#111113",
        "editorLineNumber.background": "#020817",
        "editorIndentGuide.background1": "#1B2433",
        "editorIndentGuide.activeBackground1": "#2F3B52"
      }
    });
  };

  return (
    <div className="p-0 h-full flex flex-col min-h-0 bg-[#16161a] relative">
      <div className="px-6 py-4 border-b border-[#16161a] bg-[#1b1b1f] flex items-center justify-between shadow-sm z-10 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-[#2cbb5d]" />
            Your Correct Submissions
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Review your successful past solutions for this problem.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-4 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-gray-400 h-full gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27272a]"></div>
            <p className="text-sm font-medium">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-red-400 h-full gap-2">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 h-full gap-4 opacity-70">
            <History className="w-12 h-12 mb-2" />
            <p className="text-sm font-medium">No successful submissions found.</p>
            <p className="text-xs">Solve the problem to record your first accepted answer!</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-5xl mx-auto">
            {submissions.map((sub) => (
              <div
                key={sub._id}
                onClick={() => setSelectedSubmission(sub)}
                // Kept the clean, simple outer background and layout
                className="group relative bg-[#1a1a1e] border border-white/5 hover:border-white/20 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-[#202024] flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden"
              >
                <div className="flex items-start sm:items-center gap-4 relative z-10">
                  {/* Restored exact original icon */}
                  <div className="bg-[#2cbb5d]/10 p-2.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#2cbb5d]" />
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm flex items-center gap-2 group-hover:text-[#2cbb5d] transition-colors">
                      Accepted
                      {/* Restored exact original language tag */}
                      <span className="text-xs text-gray-500 font-medium ml-2 bg-[#16161a] px-2 py-0.5 rounded-md border border-[#3e3e42]/50 uppercase tracking-widest">
                        {sub.language}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                      {sub?.createdAt ? formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true }) : 'Unknown date'}
                    </p>
                  </div>
                </div>

                {/* Restored exact original stats box */}
                <div className="flex items-center gap-6 text-xs font-mono text-gray-400 bg-[#16161a] px-4 py-2 rounded-lg border border-[#3e3e42]/50 self-start sm:self-auto shrink-0 relative z-10">
                  <div className="flex items-center gap-1.5" title="Execution Time">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {sub.runtimeMs ? `${sub.runtimeMs} ms` : "N/A"}
                  </div>
                  <div className="flex items-center gap-1.5" title="Memory (Optional)">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    O(n)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code Viewer Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1b1b1f] border border-[#3e3e42] rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-[#3e3e42] flex items-center justify-between bg-[#1b1b1f] shrink-0">
              <div className="flex items-center gap-3">
                {/* Restored exact original modal icon */}
                <div className="bg-[#2cbb5d]/20 p-1.5 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-[#2cbb5d]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    Submission details
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 font-mono">
                    {/* Restored exact original modal language text */}
                    <span className="uppercase text-[#2cbb5d] font-bold">{selectedSubmission.language}</span>
                    <span>•</span>
                    <span>{selectedSubmission?.createdAt ? formatDistanceToNow(new Date(selectedSubmission.createdAt), { addSuffix: true }) : 'Unknown date'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white p-1.5 hover:bg-[#3e3e42] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Editor */}
            <div className="flex-1 min-h-0 bg-[#020817] w-full">
              <Editor
                beforeMount={handleEditorWillMount}
                height="100%"
                language={selectedSubmission.language === "cpp" ? "cpp" : selectedSubmission.language === "python" ? "python" : selectedSubmission.language === "java" ? "java" : "javascript"}
                theme="customNavyTheme"
                value={selectedSubmission.code}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineNumbers: "on",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}