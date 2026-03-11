import Editor from "@monaco-editor/react";
import { Code2, Maximize2, RotateCcw, Bookmark, Code } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problem";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isSubmitting,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onResetCode
}) {
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
        "editor.background": "#020817",
        "editor.foreground": "#C9D1D9",
        "editorLineNumber.foreground": "#6E7681",
        "editorLineNumber.activeForeground": "#C9D1D9",
        "editorCursor.foreground": "#79C0FF",
        "editor.selectionBackground": "#1F3B5B",
        "editor.inactiveSelectionBackground": "#1F3B5B88",
        "editor.lineHighlightBackground": "#0B1220",
        "editorLineNumber.background": "#020817",
        "editorIndentGuide.background1": "#1B2433",
        "editorIndentGuide.activeBackground1": "#2F3B52"
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#111113] relative">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b1b1f] border-b border-[#111113]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 cursor-pointer px-2">
            <Code2 className="w-4 h-4" /> Code
          </div>

          <div className="flex items-center text-[13px] text-gray-300 group relative bg-[#111113] rounded">
            <select
              className="appearance-none bg-transparent hover:bg-[#8a6bfe]/20 text-gray-300 py-1 pl-2 pr-6 rounded cursor-pointer outline-none transition-colors"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-[#1b1b1f]">
                  {lang.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
              ▼
            </span>
          </div>

          <span className="text-[13px] text-gray-400 hover:text-gray-200 cursor-pointer px-1 rounded transition-colors">
            • Auto
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-400 px-2">
          <Bookmark className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <Code className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />

          <button
            onClick={onResetCode}
            title="Reset to starter code"
            className="hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4 cursor-pointer" />
          </button>

          <button className="hidden" onClick={onRunCode}></button>

          <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-[#020817]">
        <Editor
          beforeMount={handleEditorWillMount}
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || "javascript"}
          value={code}
          onChange={onCodeChange}
          theme="customNavyTheme"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;