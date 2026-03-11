import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { PROBLEMS } from "../data/problem";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";

// Use our new backend service instead of piston
import { runCode, submitCode } from "../lib/codeExecution";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

import {
  List,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Settings,
  Timer,
  History,
  Bug,
  Play,
  Pause,
  RotateCcw,
  CloudUpload,
  Loader2,
  X,
  EyeOff
} from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const DEFAULT_PROBLEM_ID = Object.keys(PROBLEMS)[0];
  const [currentProblemId, setCurrentProblemId] = useState(DEFAULT_PROBLEM_ID);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  // Track code for all languages separately so switching doesn't wipe them out
  const [codePerLanguage, setCodePerLanguage] = useState({});

  // Unified output state sent to OutputPanel
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- TIMER & STOPWATCH STATES ---
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' | 'timer'
  const [timerHours, setTimerHours] = useState("01");
  const [timerMinutes, setTimerMinutes] = useState("00");

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // For stopwatch
  const [timeRemaining, setTimeRemaining] = useState(0); // For timer

  // Problem List Sidebar State
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId] ?? null;

  // Initialize per-language code cache when problem changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);

      const defaultCodes = {};
      Object.entries(PROBLEMS[id].starterCode).forEach(([lang, src]) => {
        defaultCodes[lang] = src;
      });
      setCodePerLanguage(defaultCodes);
      setOutput(null);
    }
  }, [id]);

  // --- TIMER & STOPWATCH LOGIC ---
  useEffect(() => {
    let interval = null;

    if (isTimerActive) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setTimeElapsed(prev => prev + 1);
        } else if (timerMode === 'timer') {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              setIsTimerActive(false);
              toast("Time's up!", { icon: '⏰' });
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else if (!isTimerActive && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timerMode]);

  // Reset timers when switching modes to avoid background confusion
  useEffect(() => {
    setIsTimerActive(false);
  }, [timerMode]);

  const toggleTimer = () => {
    if (timerMode === 'timer' && !isTimerActive && timeRemaining === 0) {
      const totalSeconds = (parseInt(timerHours) || 0) * 3600 + (parseInt(timerMinutes) || 0) * 60;
      if (totalSeconds > 0) {
        setTimeRemaining(totalSeconds);
      } else {
        toast.error("Please enter a valid time");
        return;
      }
    }
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeElapsed(0);
    setTimeRemaining(0);
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- EDITOR & EXECUTION LOGIC ---
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setOutput(null);
  };

  const handleCodeChange = (newCode) => {
    setCodePerLanguage(prev => ({ ...prev, [selectedLanguage]: newCode }));
  };

  const currentCode = codePerLanguage[selectedLanguage] || "";

  const handleResetCode = () => {
    if (!currentProblem) return;
    setCodePerLanguage(prev => ({
      ...prev,
      [selectedLanguage]: currentProblem.starterCode[selectedLanguage]
    }));
    toast.success("Code reset back to starter code.");
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  const handleRunCode = async () => {
    if (!currentProblem || !currentCode) return;

    setIsRunning(true);
    setOutput({ type: "running" });

    const sampleInput = currentProblem.examples[0]?.input || "";
    const stdin = String(sampleInput).replace(/"/g, '');

    const result = await runCode(selectedLanguage, currentCode, stdin);

    setOutput({
      type: "run",
      ...result
    });

    setIsRunning(false);

    if (result.success && result.verdict === "Executed") {
      toast.success("Run Finished.");
    } else {
      toast.error(result.verdict || "Error running code");
    }
  };

  const handleSubmitCode = async () => {
    if (!currentProblem || !currentCode) return;

    setIsSubmitting(true);
    setOutput({ type: "submitting" });

    const result = await submitCode(currentProblemId, selectedLanguage, currentCode);

    setOutput({
      type: "submit",
      ...result
    });

    setIsSubmitting(false);

    if (result.success && result.verdict === "Accepted") {
      triggerConfetti();
      toast.success("Accepted! All tests passed.");
    } else if (result.success) {
      toast.error(`Submission failed: ${result.verdict}`);
    } else {
      toast.error("Code submission encountered an error.");
    }
  };

  if (!currentProblem) {
    return (
      <div className="h-screen bg-[#1a1a1a] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold text-white">Problem Not Found</h1>
          <p className="text-gray-400">The problem &ldquo;{id}&rdquo; does not exist.</p>
          <button className="px-4 py-2 bg-[#2cbb5d] text-white rounded-md hover:bg-[#2cbb5d]/90" onClick={() => navigate("/problems")}>
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  // Determine if we should show the active time next to the nav icon
  const showNavTime = isTimerActive || timeElapsed > 0 || timeRemaining > 0;
  const currentNavTime = timerMode === 'stopwatch' ? formatTime(timeElapsed) : formatTime(timeRemaining);

  return (
    <div className="h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">

      {/* INLINE LEETCODE NAVBAR */}
      <nav className="flex items-center justify-between h-[50px] px-4 bg-[#282828] text-gray-400 text-sm border-b border-[#3e3e42]">

        {/* --- LEFT SECTION --- */}
        <div className="flex items-center h-full w-[30%]">
          <Link to="/" className="flex items-center justify-center w-6 h-6 mr-4 hover:opacity-80 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M13 18.6667L19 15.3333V8.66667L13 5.33333V18.6667Z" stroke="#FFA116" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 5.33333L5 8.66667V15.3333L11 18.6667V5.33333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Toggle Problem List Sidebar */}
          <div
            className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors mr-4"
            onClick={() => setIsProblemListOpen(!isProblemListOpen)}
          >
            <List className="w-4 h-4" />
            <span className="font-medium text-gray-200">Problem List</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-[#3e3e42] hover:text-white rounded cursor-pointer transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1 hover:bg-[#3e3e42] hover:text-white rounded cursor-pointer transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="p-1 hover:bg-[#3e3e42] hover:text-white rounded cursor-pointer transition-colors ml-1">
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- CENTER SECTION --- */}
        <div className="flex items-center justify-center gap-2 h-full flex-1">
          <button className="p-1.5 bg-[#3e3e42]/50 hover:bg-[#3e3e42] hover:text-white rounded-md transition-colors flex items-center justify-center">
            <Bug className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3e3e42]/50 hover:bg-[#3e3e42] text-gray-300 hover:text-white rounded-md transition-colors disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <Play className="w-3 h-3 text-[#2cbb5d]" fill="currentColor" />}
            <span className="text-[13px] font-medium">Run</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#282828] hover:bg-[#3e3e42] text-[#2cbb5d] font-medium text-[13px] rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
            Submit
          </button>
        </div>

        {/* --- RIGHT SECTION --- */}
        <div className="flex items-center justify-end gap-5 h-full w-[30%]">
          <div className="flex items-center gap-4">
            <Settings className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />

            {/* TIMER FEATURE CONTAINER */}
            <div className="relative flex items-center">
              <button
                onClick={() => setIsTimerOpen(!isTimerOpen)}
                className={`p-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${isTimerOpen ? 'bg-[#3e3e42] text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#3e3e42]'}`}
              >
                <Timer className="w-[18px] h-[18px]" />
                {showNavTime && <span className="text-[13px] font-mono text-gray-200">{currentNavTime}</span>}
              </button>

              {/* TIMER DROPDOWN MENU */}
              {isTimerOpen && (
                <div className="absolute top-[42px] right-0 w-[290px] bg-[#282828] border border-[#3e3e42] rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-3">
                  <div className="flex gap-2 h-[110px]">

                    {/* Stopwatch Card */}
                    <div
                      onClick={() => { if (!isTimerActive) setTimerMode('stopwatch') }}
                      className={`border border-[#3e3e42] rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${timerMode === 'stopwatch' ? 'flex-1 bg-[#3e3e42]/20' : 'w-[75px] hover:bg-[#3e3e42]/40'}`}
                    >
                      {timerMode === 'stopwatch' && showNavTime ? (
                        <span className="text-2xl font-mono text-white tracking-wider font-medium">{formatTime(timeElapsed)}</span>
                      ) : (
                        <>
                          <Timer className={`w-7 h-7 ${timerMode === 'stopwatch' ? 'text-blue-500 mb-2' : 'text-blue-500/60'}`} />
                          {timerMode === 'stopwatch' && <span className="text-[14px] font-medium text-gray-200">Stopwatch</span>}
                        </>
                      )}
                    </div>

                    {/* Timer Card */}
                    <div
                      onClick={() => { if (!isTimerActive) setTimerMode('timer') }}
                      className={`border border-[#3e3e42] rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${timerMode === 'timer' ? 'flex-1 bg-[#3e3e42]/20' : 'w-[75px] hover:bg-[#3e3e42]/40'}`}
                    >
                      {timerMode === 'timer' && (isTimerActive || timeRemaining > 0) ? (
                        <span className="text-2xl font-mono text-white tracking-wider font-medium">{formatTime(timeRemaining)}</span>
                      ) : (
                        <>
                          <History className={`w-7 h-7 ${timerMode === 'timer' ? 'text-[#f59e0b] mb-3' : 'text-[#f59e0b]/60 mb-1'}`} />
                          {timerMode === 'timer' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="flex items-baseline gap-1">
                                <input
                                  type="text"
                                  value={timerHours}
                                  onChange={(e) => setTimerHours(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                  className="w-[42px] h-9 bg-[#3e3e42]/40 border border-[#3e3e42]/80 rounded-md text-white text-center text-[15px] font-medium outline-none focus:border-gray-400"
                                />
                                <span className="text-[12px] text-gray-400 font-medium">hr</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <input
                                  type="text"
                                  value={timerMinutes}
                                  onChange={(e) => setTimerMinutes(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                  className="w-[42px] h-9 bg-[#3e3e42]/40 border border-[#3e3e42]/80 rounded-md text-white text-center text-[15px] font-medium outline-none focus:border-gray-400"
                                />
                                <span className="text-[12px] text-gray-400 font-medium">min</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[13px] text-gray-400">Timer</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={toggleTimer}
                      className="flex-1 bg-[#f8f8f8] hover:bg-white text-black py-2.5 rounded-lg font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors"
                    >
                      {isTimerActive ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                      {isTimerActive ? 'Pause' : 'Start'} {timerMode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
                    </button>

                    {showNavTime && (
                      <button
                        onClick={resetTimer}
                        title="Reset"
                        className="px-3 bg-[#3e3e42]/40 hover:bg-[#3e3e42] border border-[#3e3e42] rounded-lg flex items-center justify-center transition-colors"
                      >
                        <RotateCcw className="w-[18px] h-[18px] text-gray-300" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] hover:text-white cursor-pointer transition-colors">Register or Log in</span>
            <button className="bg-[#ffa116]/20 text-[#ffa116] px-3 py-1 rounded font-medium text-[13px] hover:bg-[#ffa116]/30 transition-colors">Premium</button>
          </div>
        </div>
      </nav>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 p-2 relative flex gap-2 h-full overflow-hidden">

        {/* PROBLEM LIST OVERLAY / DRAWER */}
        {isProblemListOpen && (
          <>
            {/* Darkened Backdrop */}
            <div
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-[1px] transition-opacity"
              onClick={() => setIsProblemListOpen(false)}
            />

            {/* Sidebar Overlay Flush to Left */}
            <div className="absolute left-0 top-0 bottom-0 z-50 w-[380px] bg-[#1a1a1a] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-left-8 duration-200 border-r border-[#3e3e42]">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4">
                <div
                  className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors text-gray-200"
                  onClick={() => setIsProblemListOpen(false)}
                >
                  <span className="font-semibold text-[15px]">Daily Question</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <X
                  className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setIsProblemListOpen(false)}
                />
              </div>

              {/* Tag Button Area */}
              <div className="flex justify-end px-4 pb-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#282828] hover:bg-[#3e3e42] text-gray-400 hover:text-gray-300 text-[11px] font-medium rounded-full border border-[#3e3e42] transition-colors">
                  <EyeOff className="w-3.5 h-3.5" /> Tag
                </button>
              </div>

              {/* Sidebar Problems List (Pills) */}
              <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#3e3e42] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                {Object.values(PROBLEMS).map((p, index) => {
                  const isActive = p.id === currentProblemId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        handleProblemChange(p.id);
                        setIsProblemListOpen(false); // Optional: auto-close on selection
                      }}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer text-[13px] rounded-lg transition-colors ${isActive
                          ? 'bg-[#3e3e42] text-white'
                          : 'bg-[#282828] text-gray-300 hover:bg-[#3e3e42]/80'
                        }`}
                    >
                      <span className={`truncate pr-4 ${isActive ? 'font-medium' : ''}`}>
                        {index + 1}. {p.title}
                      </span>
                      <span className={`text-[12px] font-medium ${p.difficulty === 'Easy' ? 'text-[#00b8a3]' :
                          p.difficulty === 'Medium' ? 'text-[#ffc01e]' :
                            'text-[#ff375f]'
                        } shrink-0`}>
                        {p.difficulty === 'Medium' ? 'Med.' : p.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </>
        )}

        {/* Existing Resizable Panel Group */}
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel - Problem Description */}
          <Panel defaultSize={50} minSize={30} className="bg-[#282828] rounded-lg border border-[#3e3e42] flex flex-col overflow-hidden">
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />

          {/* Right Panel - Code Editor & Output */}
          <Panel defaultSize={50} minSize={30} className="flex flex-col">
            <PanelGroup direction="vertical">
              {/* Top Right Panel - Editor */}
              <Panel defaultSize={60} minSize={30} className="bg-[#282828] rounded-lg border border-[#3e3e42] flex flex-col overflow-hidden">
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={currentCode}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={handleCodeChange}
                  onRunCode={handleRunCode}
                  onResetCode={handleResetCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 cursor-row-resize hover:bg-[#3e3e42]/50 transition-colors" />

              {/* Bottom Right Panel - Dynamic Output panel */}
              <Panel defaultSize={40} minSize={30} className="bg-[#282828] rounded-lg border border-[#3e3e42] flex flex-col overflow-hidden">
                <OutputPanel
                  output={output}
                  sampleTestcase={currentProblem.examples[0]}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>

      </div>
    </div>
  );
}

export default ProblemPage;