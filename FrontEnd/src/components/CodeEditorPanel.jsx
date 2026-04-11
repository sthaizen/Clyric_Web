import { useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket";
import Editor from "@monaco-editor/react";
import { Code2, Maximize2, Minimize2, RotateCcw, Bookmark, Code, ChevronDown, Lock } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problem";

function CodeEditorPanel({
  selectedLanguage,
  code,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onResetCode,
  roomId, // Passed if collaboration is needed
  user,    // Current user context
  onRemoteLanguageChange, // Added callback if parent needs notification
  onToggleMaximize,
  isMaximized,
  settings, // Added settings prop
  allowedLanguages, // Array of language keys the current user can use
  upgradeTierLabel, // e.g. "Career Plus" — shown in the locked tooltip
  problemSlug = "",
}) {
  const isRemoteUpdate = useRef(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved"
  const saveTimerRef = useRef(null);
  const savedTimerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- COLLABORATION LOGIC ---
  useEffect(() => {
    if (!roomId || !user) return;

    // Connect and join room
    socket.connect();
    socket.emit("join-room", roomId);

    // Listen for remote updates
    const handleSyncCode = (receivedCode) => {
      isRemoteUpdate.current = true;
      if (onCodeChange) onCodeChange(receivedCode);
    };

    const handleSyncLanguage = (receivedLanguage) => {
      isRemoteUpdate.current = true;
      if (onRemoteLanguageChange) onRemoteLanguageChange(receivedLanguage);
    };

    socket.on("sync-code", handleSyncCode);
    socket.on("sync-language", handleSyncLanguage);

    return () => {
      socket.off("sync-code", handleSyncCode);
      socket.off("sync-language", handleSyncLanguage);
      // Do NOT disconnect here — the socket is shared with WebRTC signaling
      // and other app-level features. Let App.jsx manage the lifecycle.
    };
  }, [roomId, user, onCodeChange, onRemoteLanguageChange]);

  const handleLocalCodeChange = (newCode) => {
    if (onCodeChange) onCodeChange(newCode);

    // Emit only if it's a local edit
    if (roomId && !isRemoteUpdate.current) {
      socket.emit("code-update", { roomId, code: newCode });
    }
    isRemoteUpdate.current = false;
  };

  const wrapLanguageChange = (e) => {
    if (onLanguageChange) onLanguageChange(e);
    if (roomId) {
      socket.emit("language-update", { roomId, language: e.target.value });
      // Optionally emit the starter code too if that's the desired behavior
    }
  };

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

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
  };

  // Map font family from settings to CSS font-family strings
  const getFontFamily = (font) => {
    switch (font) {
      case "JetBrains Mono":
        return "'JetBrains Mono', monospace";
      case "Fira Code":
        return "'Fira Code', monospace";
      case "Consolas":
        return "Consolas, 'Courier New', monospace";
      case "Default":
      default:
        return "'JetBrains Mono', 'Fira Code', monospace";
    }
  };

  // React to settings changes
  useEffect(() => {
    if (!editorInstance) return;

    const editor = editorInstance;

    // Update global editor options
    editor.updateOptions({
      fontSize: settings?.fontSize || 14,
      fontFamily: getFontFamily(settings?.fontFamily),
      fontLigatures: settings?.fontLigatures || false,
      wordWrap: settings?.wordWrap ? "on" : "off",
      lineNumbers: settings?.relativeLineNumbers ? "relative" : "on",
    });

    // Update model options for tab size and spacing
    const model = editor.getModel();
    if (model) {
      model.updateOptions({
        tabSize: settings?.tabSize || 4,
        insertSpaces: true,
      });
    }
  }, [settings]);

  // Auto-save code to localStorage
  useEffect(() => {
    if (!code || !problemSlug || !selectedLanguage || code.trim() === "") return;

    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      const key = `clyric_autosave_${problemSlug}_${selectedLanguage}`;
      localStorage.setItem(key, code);
      setSaveStatus("saved");
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1500);

    return () => {
      clearTimeout(saveTimerRef.current);
      clearTimeout(savedTimerRef.current);
    };
  }, [code, problemSlug, selectedLanguage]);

  return (
    <div className="h-full flex flex-col bg-[#111113] relative">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b1b1f] border-b border-[#111113]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 cursor-pointer px-2">
            <Code2 className="w-4 h-4" /> Code
          </div>

          <div className="flex items-center text-[13px] text-gray-300 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#111113] hover:bg-[#8a6bfe]/10 text-gray-300 py-1.5 px-3 rounded-md border border-[#ffffff0a] transition-all duration-200 outline-none min-w-[120px]"
            >
              <img
                src={LANGUAGE_CONFIG[selectedLanguage]?.logo}
                alt=""
                className="w-4 h-4 object-contain opacity-90"
              />
              <span className="flex-1 text-left font-medium">
                {LANGUAGE_CONFIG[selectedLanguage]?.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-[160px] bg-[#1b1b1f] border border-[#ffffff10] rounded-xl shadow-2xl overflow-hidden z-[50] animate-in fade-in zoom-in-95 duration-100">
                {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => {
                  const isLocked = allowedLanguages && !allowedLanguages.includes(key);
                  const isSelected = selectedLanguage === key;
                  return (
                    <button
                      key={key}
                      disabled={isLocked}
                      onClick={() => {
                        wrapLanguageChange({ target: { value: key } });
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors duration-150
                           ${isSelected ? 'bg-[#8a6bfe]/20 text-[#8a6bfe]' : 'text-gray-400 hover:bg-[#ffffff0a]'}
                           ${isLocked ? 'opacity-40 cursor-not-allowed filter grayscale' : 'cursor-pointer'}
                        `}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={lang.logo} alt="" className="w-4 h-4 object-contain" />
                        <span className="text-[13px] font-medium">{lang.name}</span>
                      </div>
                      {isLocked && <Lock className="w-3.5 h-3.5 text-gray-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="text-[13px] text-gray-400 hover:text-gray-200 cursor-pointer px-1 rounded transition-colors">
            • Auto
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-400 px-2">
          {/* Auto-save indicator */}
          {saveStatus !== "idle" && (
            <span className={`text-[11px] transition-all duration-300 ${saveStatus === "saving" ? "text-gray-500" : "text-emerald-500"
              }`}>
              {saveStatus === "saving" ? "Saving..." : "Saved ✓"}
            </span>
          )}
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

          <button
            onClick={onToggleMaximize}
            className="hover:text-white transition-colors"
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4 cursor-pointer" />
            ) : (
              <Maximize2 className="w-4 h-4 cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-[#020817]">
        <Editor
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || "javascript"}
          value={code}
          onChange={handleLocalCodeChange}
          theme="customNavyTheme"
          options={{
            fontSize: settings?.fontSize || 14,
            fontFamily: getFontFamily(settings?.fontFamily),
            fontLigatures: settings?.fontLigatures || false,
            tabSize: settings?.tabSize || 4,
            wordWrap: settings?.wordWrap ? "on" : "off",
            lineNumbers: settings?.relativeLineNumbers ? "relative" : "on",
            insertSpaces: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 16 },
          }}
        />
      </div>



    </div>
  );
}

export default CodeEditorPanel;