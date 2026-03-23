import { 
  Code2Icon, 
  LoaderIcon, 
  PlusIcon, 
  XIcon, 
  ChevronRightIcon, 
  TerminalIcon,
  BookOpen,
  ActivityIcon,
  HashIcon,
  CpuIcon,
  GlobeIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { getProblems } from "../lib/api/problems.js";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    async function fetchProblems() {
      if (isOpen && problems.length === 0) {
        setIsLoading(true);
        try {
          const res = await getProblems({ limit: 1000 });
          if (res.problems) setProblems(res.problems);
        } catch (err) {
          console.error("Failed to load problems for modal:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchProblems();
  }, [isOpen]);

  if (!isOpen) return null;

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-sky-400 bg-sky-400/10 border-sky-400/20";
      case "medium": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "hard": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const selectedProblemDetails = problems.find(p => p.title === roomConfig.problem);

  // Helper to extract just the main text overview
  const getProblemOverview = (description) => {
    if (!description) return "No description available.";
    if (typeof description === 'string') return description;
    return description.text || "No description available.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Split-Pane Modal */}
      <div className="relative bg-[#0b0b0c] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-5xl h-[75vh] max-h-[700px] min-h-[500px] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Pane: Problem Library (Master) */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#111113] flex flex-col h-1/2 md:h-full shrink-0 z-10 ">
          <div className="px-5 py-4 border-b border-white/[0.08] bg-[#111113]">
            <h3 className="font-semibold text-gray-200 flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-indigo-400" />
              Problem Library
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoaderIcon className="w-5 h-5 text-indigo-500 animate-spin" />
              </div>
            ) : (
              problems.map((problem) => {
                const isSelected = roomConfig.problem === problem.title;
                return (
                  <button
                    key={problem.id}
                    onClick={() => setRoomConfig({
                      difficulty: problem.difficulty,
                      problem: problem.title,
                      problemId: problem.id,
                    })}
                    className={`w-full text-left px-3 py-3 rounded-xl flex items-center justify-between group transition-all duration-200 ${
                      isSelected 
                        ? "bg-indigo-500/10 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-indigo-500/20" 
                        : "text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent"
                    }`}
                  >
                    <span className="text-[13px] font-medium truncate pr-2">
                      {problem.title}
                    </span>
                    {isSelected && <ChevronRightIcon className="w-4 h-4 shrink-0 opacity-70" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Configuration & Action (Detail) */}
        <div className="w-full md:w-2/3 flex flex-col bg-[#16161a] h-1/2 md:h-full relative">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-full hover:bg-white/[0.05] transition-colors z-20"
          >
            <XIcon className="w-4 h-4" />
          </button>

          {/* Dynamic Content Area */}
          <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto custom-scrollbar">
            {!selectedProblemDetails ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50 mt-12 md:mt-0">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05] mb-2">
                  <Code2Icon className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-sm text-gray-400 max-w-[250px]">Select a problem from the library to view its overview and configure the session.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Header & Tags */}
                <div className="space-y-5 mb-6 pr-8">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-wider uppercase">
                    <span className={`px-2.5 py-1 rounded-md border ${getDifficultyStyles(selectedProblemDetails.difficulty)}`}>
                      {selectedProblemDetails.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-md">
                      <ActivityIcon className="w-3 h-3" /> Core Algorithms
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    {selectedProblemDetails.title}
                  </h2>
                </div>

                {/* Problem Overview Card */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 mb-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-sm flex flex-col gap-6">
                  
                  {/* Top: Description */}
                  <div>
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      Brief Overview
                    </h3>
                    <p className="text-[13px] text-gray-300 leading-relaxed line-clamp-3">
                      {getProblemOverview(selectedProblemDetails.description)}
                    </p>
                  </div>

                  {/* Middle: Sample Testcase */}
                  {selectedProblemDetails.examples && selectedProblemDetails.examples.length > 0 && (
                    <div className="bg-[#0b0b0c] border border-white/[0.05] rounded-lg p-3.5">
                      <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <TerminalIcon className="w-3 h-3" />
                        Sample Testcase
                      </h4>
                      <div className="font-mono text-[12px] space-y-1">
                        <div className="flex gap-2 text-gray-300">
                          <span className="text-gray-500 select-none">Input:</span> 
                          <span className="break-all">{selectedProblemDetails.examples[0].input}</span>
                        </div>
                        <div className="flex gap-2 text-indigo-300">
                          <span className="text-gray-500 select-none">Output:</span> 
                          <span className="break-all">{selectedProblemDetails.examples[0].output}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom: Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/[0.05]">
                    {/* Suggested Language */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium">
                      <Code2Icon className="w-3 h-3" />
                      Suggested: JavaScript
                    </div>
                    {/* Problem Type / Domain */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-gray-400 text-[11px] font-medium">
                      <HashIcon className="w-3 h-3" />
                      Data Structures
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-gray-400 text-[11px] font-medium">
                      <CpuIcon className="w-3 h-3" />
                      Logic / Math
                    </div>
                  </div>

                </div>

                {/* Session Visibility Toggle */}
                <div className="mt-6 border-t border-white/[0.08] pt-5">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Session Visibility</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRoomConfig({ ...roomConfig, visibility: "public", password: "" })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                        (roomConfig.visibility || "public") === "public"
                          ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                          : "bg-white/[0.02] text-gray-400 border-white/[0.05] hover:bg-white/[0.04]"
                      }`}
                    >
                      <GlobeIcon className="w-4 h-4" />
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomConfig({ ...roomConfig, visibility: "private" })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                        roomConfig.visibility === "private"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          : "bg-white/[0.02] text-gray-400 border-white/[0.05] hover:bg-white/[0.04]"
                      }`}
                    >
                      <LockIcon className="w-4 h-4" />
                      Private
                    </button>
                  </div>

                  {/* Password input for private sessions */}
                  {roomConfig.visibility === "private" && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-2 mb-2">
                        <EyeOffIcon className="w-3.5 h-3.5 text-gray-500" />
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Room Password (optional)</label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter a password for extra security"
                          value={roomConfig.password || ""}
                          onChange={(e) => setRoomConfig({ ...roomConfig, password: e.target.value })}
                          className="w-full bg-[#0b0b0c] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[13px] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition-colors pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-2">A unique room code will be generated. Share it with your partner to join.</p>

                    </div>
                  )}
                </div>

                {/* Minimal Session Details */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-5">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Session Mode</p>
                    <p className="text-[13px] text-gray-200">1-on-1 Collaborative</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Environment</p>
                    <p className="text-[13px] text-gray-200">Real-time Sync</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="px-8 lg:px-12 py-5 border-t border-white/[0.08] bg-[#16161a] flex items-center justify-between shrink-0">
            <span className="text-[13px] text-gray-500 font-medium">
              {roomConfig.problem ? "Configuration complete" : "Awaiting problem selection..."}
            </span>
            
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[#563cdf] text-white hover:bg-[#563cdf]/90 disabled:opacity-50 disabled:bg-white/[0.05] disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:shadow-none"
              onClick={onCreateRoom}
              disabled={isCreating || !roomConfig.problem}
            >
              {isCreating ? (
                <LoaderIcon className="w-4 h-4 animate-spin text-current" />
              ) : (
                <PlusIcon className="w-4 h-4 text-current" />
              )}
              {isCreating ? "Initializing..." : "Start Session"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;