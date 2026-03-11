import Editor from "@monaco-editor/react";
import { Code2, Settings, Maximize2, RotateCcw, Bookmark, Code } from "lucide-react";
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
  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] relative">
      
      {/* HEADER TABS & ACTIONS */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#282828] border-b border-[#3e3e42]">
        
        {/* Left Side: Tab & Language Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 cursor-pointer px-2">
            <Code2 className="w-4 h-4" /> Code
          </div>
          
          <div className="flex items-center text-[13px] text-gray-300 group relative bg-[#3e3e42]/30 rounded">
            <select 
              className="appearance-none bg-transparent hover:bg-[#3e3e42] text-gray-300 py-1 pl-2 pr-6 rounded cursor-pointer outline-none transition-colors"
              value={selectedLanguage} 
              onChange={onLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-[#282828]">
                  {lang.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">▼</span>
          </div>
          <span className="text-[13px] text-gray-400 hover:text-gray-200 cursor-pointer px-1 rounded transition-colors">• Auto</span>
        </div>

        {/* Right Side: Icons */}
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

           {/* Hidden run code prop preserver */}
           <button className="hidden" onClick={onRunCode}></button>

           <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* MONACO EDITOR */}
      <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || "javascript"}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
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

      {/* BOTTOM BANNERS (Saved status & Auth prompt) */}
      <div className="w-full">
         <div className="bg-[#1e1e1e] px-4 py-1 flex justify-between items-center text-[11px] text-gray-500 border-t border-[#3e3e42]">
           <span>Saved</span>
           <span>Ln 1, Col 1</span>
         </div>
         <div className="bg-[#24354c]/60 text-gray-300 px-4 py-2 text-sm border-t border-[#3e3e42]">
           You need to <a href="#" className="text-blue-400 hover:underline">log in / sign up</a> to run or submit
         </div>
      </div>

    </div>
  );
}

export default CodeEditorPanel;