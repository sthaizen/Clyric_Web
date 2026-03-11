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
    <div className="h-full flex flex-col bg-[#111113] relative">
      
      {/* HEADER TABS & ACTIONS */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b1b1f] border-b border-[#111113]">
        
        {/* Left Side: Tab & Language Dropdown */}
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
      <div className="flex-1 overflow-hidden bg-[#111113]">
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
      {/* <div className="w-full">
         <div className="bg-[#111113] px-4 py-1 flex justify-between items-center text-[11px] text-gray-500 border-t border-[#111113]">
           <span>Saved</span>
           <span>Ln 1, Col 1</span>
         </div>
         <div className="bg-[#8a6bfe]/10 text-gray-300 px-4 py-2 text-sm border-t border-[#111113]">
           You need to <a href="#" className="text-blue-400 hover:underline">log in / sign up</a> to run or submit
         </div>
      </div> */}

    </div>
  );
}

export default CodeEditorPanel;