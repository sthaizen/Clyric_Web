import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problem.js";

// Execution & Utilities
import { runCode, submitCode } from "../lib/codeExecution.js";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

// Stream Video
import useStreamClient from "../hooks/useStreamClient.js";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI.jsx";

// Components & UI
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";

// Icons
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
  EyeOff,
  LayoutTemplate,
  PhoneOffIcon,
  LogOutIcon
} from "lucide-react";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  // --- SESSION MAIN LOGIC ---
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const currentProblem = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;
    
  const currentProblemId = currentProblem?.id;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(currentProblem?.starterCode?.[selectedLanguage] || "");

  // Auto-join session
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // Redirect on completion
  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // Update code when problem loads or language changes
  useEffect(() => {
    if (currentProblem?.starterCode?.[selectedLanguage]) {
      setCode(currentProblem.starterCode[selectedLanguage]);
    }
  }, [currentProblem, selectedLanguage]);

  // --- TIMER & UI STATES (From ProblemPage) ---
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerMode, setTimerMode] = useState("stopwatch");
  const [timerHours, setTimerHours] = useState("01");
  const [timerMinutes, setTimerMinutes] = useState("00");

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState("default");

  // --- TIMER LOGIC ---
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
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- EDITOR LOGIC ---
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const starterCode = currentProblem?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleResetCode = () => {
    if (!currentProblem) return;
    setCode(currentProblem.starterCode[selectedLanguage]);
    toast.success("Code reset back to starter code.");
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  // Navigation Logic
  const problemIds = Object.keys(PROBLEMS);
  const currentIndex = currentProblemId ? problemIds.indexOf(currentProblemId) : 0;
  const isFirstProblem = currentIndex === 0;
  const isLastProblem = currentIndex === problemIds.length - 1;

  const handlePrevProblem = () => {
    if (!isFirstProblem) handleProblemChange(problemIds[currentIndex - 1]);
  };
  const handleNextProblem = () => {
    if (!isLastProblem) handleProblemChange(problemIds[currentIndex + 1]);
  };
  const handleRandomProblem = () => {
    if (problemIds.length <= 1) return;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * problemIds.length);
    } while (randomIndex === currentIndex);
    handleProblemChange(problemIds[randomIndex]);
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  const handleRunCode = async () => {
    if (!currentProblem || !code) return;
    setIsRunning(true);
    setOutput({ type: "running" });

    const result = await runCode(selectedLanguage, code, "");
    const results = [];
    let allPassed = true;
    let anyError = !!(result.compileError || result.runtimeError);
    const actualLines = result.stdout ? result.stdout.trim().split('\n').map(line => line.trim()) : [];

    for (let i = 0; i < currentProblem.examples.length; i++) {
        const example = currentProblem.examples[i];
        const actual = actualLines[i] || "";
        const expectedNormalized = String(example.output).replace(/\s/g, '');
        const actualNormalized = actual.replace(/\s/g, '');

        let passed = false;
        if (!anyError && actualNormalized === expectedNormalized) passed = true;
        else allPassed = false;

        results.push({
            ...result,
            expected: example.output,
            actual: actual,
            passed: passed,
            stdin: example.input
        });
    }

    let finalVerdict = "Wrong Answer";
    if (anyError) finalVerdict = result.verdict || "Error";
    else if (allPassed) finalVerdict = "Accepted";

    setOutput({ type: "run", verdict: finalVerdict, results, executionTime: result.executionTime });
    setIsRunning(false);

    if (allPassed && !anyError) toast.success("Accepted! Output matches expected.");
    else toast.error(finalVerdict === "Wrong Answer" ? "Wrong Answer. Output does not match expected." : (finalVerdict || "Error"));
  };

  const handleSubmitCode = async () => {
    if (!currentProblem || !code) return;
    setIsSubmitting(true);
    setOutput({ type: "submitting" });

    const result = await submitCode(currentProblemId, selectedLanguage, code);
    setOutput({ type: "submit", ...result });
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

  const handleEndSession = () => {
    if (window.confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  if (!currentProblem && !loadingSession) {
    return (
      <div className="h-screen bg-[#111113] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold text-white">Problem/Session Not Found</h1>
          <button className="px-4 py-2 bg-[#2cbb5d] text-white rounded-md hover:bg-[#2cbb5d]/90" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const showNavTime = isTimerActive || timeElapsed > 0 || timeRemaining > 0;
  const currentNavTime = timerMode === 'stopwatch' ? formatTime(timeElapsed) : formatTime(timeRemaining);

  return (
    <div className="h-screen bg-[#111113] flex flex-col overflow-hidden">

      {/* --- UNTOUCHED INLINE NAVBAR --- */}
      <nav className="flex items-center justify-between h-[50px] px-4 bg-[#1b1b1f] text-gray-400 text-sm border-b border-[#111113]">
        <div className="flex items-center h-full w-[30%]">
          <Link to="/problems" className="flex items-center justify-center h-6 mr-4 hover:opacity-80 transition-opacity">
            <div className="flex flex-col gap-[2px] ">
              <div className="w-[16px] h-[4px] rounded-[2px] rounded-tl-sm bg-[#F3F3EF]"></div>
              <div className="flex gap-[2px]">
                <div className="w-[4px] h-[4px] rounded-[2px] bg-[#F3F3EF]"></div>
                <div className="w-[12px] h-[4px] rounded-[2px] bg-[#fba120]"></div>
              </div>
              <div className="flex gap-[2px]">
                <div className="w-[10px] h-[4px] bg-transparent"></div>
                <div className="w-[6px] h-[6px] rounded-[2px] rounded-br-sm bg-[#F3F3EF]"></div>
              </div>
            </div>
            <span className="p-2"style={{ color:'#fff', fontWeight:700, fontSize:17, letterSpacing:'-0.2px' }}>Clyric</span>
          </Link>

          <div
            className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors mr-4"
            onClick={() => setIsProblemListOpen(!isProblemListOpen)}
          >
            <List className="w-4 h-4" />
            <span className="font-medium text-gray-200">Problem List</span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrevProblem}
              disabled={isFirstProblem}
              className="p-1 hover:bg-[#3e3e42] hover:text-white rounded cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Question"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextProblem}
              disabled={isLastProblem}
              className="p-1 hover:bg-[#3e3e42] hover:text-white rounded cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next Question"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRandomProblem}
              className="p-1 hover:bg-[#3e3e42] hover:text-white rounded cursor-pointer transition-colors ml-1"
              title="Pick One"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#3e3e42] text-[#2cbb5d] font-medium text-[13px] rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
            Submit
          </button>
        </div>

        <div className="flex items-center justify-end gap-5 h-full w-[30%] relative">
          <div className="flex items-center gap-4">
            
            <div className="relative flex items-center">
              <button 
                onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
                className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${isLayoutMenuOpen ? 'bg-[#3e3e42] text-white' : 'text-gray-400 hover:text-white hover:bg-[#3e3e42]'}`}
              >
                <LayoutTemplate className="w-4 h-4" />
              </button>

              {isLayoutMenuOpen && (
                <div className="absolute top-[42px] right-0 w-[260px] bg-[#1b1b1f] border border-[#3e3e42] rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] font-semibold text-gray-200">Layouts</span>
                    <LayoutTemplate className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => { setLayoutMode('default'); setIsLayoutMenuOpen(false); }}
                      className={`flex flex-col gap-2 cursor-pointer p-2 rounded-lg border transition-all ${layoutMode === 'default' ? 'border-[#2cbb5d] bg-[#2cbb5d]/10' : 'border-transparent hover:bg-[#3e3e42]/50'}`}
                    >
                      <div className="h-[40px] flex gap-1 w-full opacity-80">
                        <div className="w-[45%] bg-[#3e3e42] rounded-sm"></div>
                        <div className="w-[55%] flex flex-col gap-1">
                          <div className="h-[60%] bg-[#3e3e42] rounded-sm"></div>
                          <div className="h-[40%] bg-[#3e3e42] rounded-sm"></div>
                        </div>
                      </div>
                      <span className="text-[12px] text-center font-medium text-gray-300">Default</span>
                    </div>

                    <div 
                      onClick={() => { setLayoutMode('columns'); setIsLayoutMenuOpen(false); }}
                      className={`flex flex-col gap-2 cursor-pointer p-2 rounded-lg border transition-all ${layoutMode === 'columns' ? 'border-[#2cbb5d] bg-[#2cbb5d]/10' : 'border-transparent hover:bg-[#3e3e42]/50'}`}
                    >
                      <div className="h-[40px] flex gap-1 w-full opacity-80">
                        <div className="w-1/3 bg-[#3e3e42] rounded-sm"></div>
                        <div className="w-1/3 bg-[#3e3e42] rounded-sm"></div>
                        <div className="w-1/3 bg-[#3e3e42] rounded-sm"></div>
                      </div>
                      <span className="text-[12px] text-center font-medium text-gray-300">3 Columns</span>
                    </div>

                    <div 
                      onClick={() => { setLayoutMode('focus'); setIsLayoutMenuOpen(false); }}
                      className={`flex flex-col gap-2 cursor-pointer p-2 rounded-lg border transition-all ${layoutMode === 'focus' ? 'border-[#ffa116] bg-[#ffa116]/10' : 'border-transparent hover:bg-[#3e3e42]/50'} col-span-2`}
                    >
                       <div className="h-[40px] flex flex-col gap-1 w-full opacity-80">
                          <div className="h-[70%] bg-[#3e3e42] rounded-sm flex items-center justify-center"><span className="text-[8px] font-bold text-gray-500">EDITOR</span></div>
                          <div className="h-[30%] bg-[#3e3e42] rounded-sm"></div>
                       </div>
                       <span className="text-[12px] text-center font-medium text-[#ffa116]">Focus Mode</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Settings className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />

            <div className="relative flex items-center">
              <button
                onClick={() => setIsTimerOpen(!isTimerOpen)}
                className={`p-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${isTimerOpen ? 'bg-[#3e3e42] text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#3e3e42]'}`}
              >
                <Timer className="w-[18px] h-[18px]" />
                {showNavTime && <span className="text-[13px] font-mono text-gray-200">{currentNavTime}</span>}
              </button>

              {isTimerOpen && (
                <div className="absolute top-[42px] right-0 w-[290px] bg-[#1b1b1f] border border-[#111113] rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-3">
                  <div className="flex gap-2 h-[110px]">
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
      {/* --- END UNTOUCHED INLINE NAVBAR --- */}


      {/* MAIN WORKSPACE */}
      <div className="flex-1 p-2 relative flex gap-2 h-full overflow-hidden">

        {isProblemListOpen && (
          <>
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-[1px] transition-opacity" onClick={() => setIsProblemListOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 z-50 w-[380px] bg-[#111113] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-left-8 duration-200 border-r border-[#111113]">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors text-gray-200" onClick={() => setIsProblemListOpen(false)}>
                  <span className="font-semibold text-[15px]">Daily Question</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <X className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors" onClick={() => setIsProblemListOpen(false)} />
              </div>

              <div className="flex justify-end px-4 pb-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#3e3e42] text-gray-400 hover:text-gray-300 text-[11px] font-medium rounded-full border border-[#111113] transition-colors">
                  <EyeOff className="w-3.5 h-3.5" /> Tag
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#3e3e42] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                {Object.values(PROBLEMS).map((p, index) => {
                  const isActive = p.id === currentProblemId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        handleProblemChange(p.id);
                        setIsProblemListOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer text-[13px] rounded-lg transition-colors ${isActive
                          ? 'bg-[#3e3e42] text-white'
                          : 'bg-[#1b1b1f] text-gray-300 hover:bg-[#3e3e42]/80'
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

        {/* Dynamic Resizable Panels + Video UI Integrated Safely */}
        <PanelGroup direction="horizontal" className="flex-1">
          
          {/* LEFT AREA: Workstation */}
          <Panel defaultSize={75} minSize={40} className="flex flex-col h-full">
            
            {layoutMode === 'default' && (
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                  <ProblemDescription problem={currentProblem} currentProblemId={currentProblemId} onProblemChange={handleProblemChange} allProblems={Object.values(PROBLEMS)} />
                </Panel>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={50} minSize={30} className="flex flex-col">
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={60} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                      <CodeEditorPanel selectedLanguage={selectedLanguage} code={code} isRunning={isRunning} isSubmitting={isSubmitting} onLanguageChange={handleLanguageChange} onCodeChange={(value) => setCode(value)} onRunCode={handleRunCode} onResetCode={handleResetCode} />
                    </Panel>
                    <PanelResizeHandle className="h-2 cursor-row-resize hover:bg-[#3e3e42]/50 transition-colors" />
                    <Panel defaultSize={40} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                      <OutputPanel output={output} testCases={currentProblem?.examples} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            )}

            {layoutMode === 'columns' && (
              <PanelGroup direction="horizontal">
                <Panel defaultSize={33} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                  <ProblemDescription problem={currentProblem} currentProblemId={currentProblemId} onProblemChange={handleProblemChange} allProblems={Object.values(PROBLEMS)} />
                </Panel>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={33} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                  <CodeEditorPanel selectedLanguage={selectedLanguage} code={code} isRunning={isRunning} isSubmitting={isSubmitting} onLanguageChange={handleLanguageChange} onCodeChange={(value) => setCode(value)} onRunCode={handleRunCode} onResetCode={handleResetCode} />
                </Panel>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={34} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                   <OutputPanel output={output} testCases={currentProblem?.examples} />
                </Panel>
              </PanelGroup>
            )}

            {layoutMode === 'focus' && (
              <PanelGroup direction="vertical">
                 <Panel defaultSize={70} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden shadow-2xl">
                   <CodeEditorPanel selectedLanguage={selectedLanguage} code={code} isRunning={isRunning} isSubmitting={isSubmitting} onLanguageChange={handleLanguageChange} onCodeChange={(value) => setCode(value)} onRunCode={handleRunCode} onResetCode={handleResetCode} />
                 </Panel>
                 <PanelResizeHandle className="h-2 cursor-row-resize hover:bg-[#3e3e42]/50 transition-colors" />
                 <Panel defaultSize={30} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden shadow-xl">
                   <OutputPanel output={output} testCases={currentProblem?.examples} />
                 </Panel>
              </PanelGroup>
            )}
          </Panel>

          <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
          
          {/* RIGHT AREA: Video Session Logic */}
          <Panel defaultSize={25} minSize={15} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
            
            {/* Session Actions Header */}
            <div className="flex items-center justify-between p-3 border-b border-[#111113] bg-[#1b1b1f]/80">
               <div className="flex flex-col">
                  <span className="text-gray-200 font-semibold text-[13px] flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> 
                     Live Session
                  </span>
               </div>
               {isHost && session?.status === "active" && (
                 <button
                   onClick={handleEndSession}
                   disabled={endSessionMutation.isPending}
                   className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-xs font-medium transition-colors"
                 >
                   {endSessionMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOutIcon className="w-3 h-3" />}
                   End
                 </button>
               )}
            </div>

            {/* Stream Call UI */}
            <div className="flex-1 bg-transparent p-2 overflow-auto flex flex-col">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#2cbb5d] mb-3" />
                    <p className="text-sm text-gray-300">Connecting...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="bg-[#111113] rounded-xl border border-[#3e3e42] p-6 text-center shadow-lg w-full">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PhoneOffIcon className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-[15px] font-semibold text-gray-200">Connection Failed</h2>
                    <p className="text-[12px] text-gray-400 mt-1">Unable to connect to call</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex-1 rounded-md overflow-hidden bg-black relative">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;