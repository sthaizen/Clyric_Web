import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { getProblems, getProblemBySlug } from "../lib/api/problems.js";
import { trackProblemEvent } from "../lib/api/analytics.js";

// Execution & Utilities
import { runCode, submitCode } from "../lib/codeExecution.js";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

// WebRTC Video
import useWebRTCSession from "../hooks/useWebRTCSession.js";
import WebRTCVideoUI from "../components/WebRTCVideoUI.jsx";
import { socket } from "../lib/socket.js";

// Components & UI
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import ProblemNavbar from "../components/ProblemNavbar";
import SessionReportModal from "../components/SessionReportModal";

// Icons (Trimmed down to only what is used in the main body)
import {
  ChevronRight,
  X,
  EyeOff,
  LogOutIcon,
  Loader2,
  NotebookPen,
  ChevronDown,
  Lightbulb,
  Send
} from "lucide-react";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();

  // --- SESSION MAIN LOGIC ---
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SESSION REPORT ---
  const [showReport, setShowReport] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [lastVerdict, setLastVerdict] = useState(null);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  // --- HOST SCRATCHPAD ---
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [scratchpadText, setScratchpadText] = useState("");
  const scratchpadSaveTimer = useRef(null);
  const [scratchpadSaved, setScratchpadSaved] = useState(false);

  // Load scratchpad from localStorage when session is ready (isHost is now in scope)
  useEffect(() => {
    if (!id || !isHost) return;
    const saved = localStorage.getItem(`clyric_scratchpad_${id}`);
    if (saved) setScratchpadText(saved);
  }, [id, isHost]);

  // Auto-save scratchpad to localStorage
  const handleScratchpadChange = (text) => {
    setScratchpadText(text);
    setScratchpadSaved(false);
    if (scratchpadSaveTimer.current) clearTimeout(scratchpadSaveTimer.current);
    scratchpadSaveTimer.current = setTimeout(() => {
      localStorage.setItem(`clyric_scratchpad_${id}`, text);
      setScratchpadSaved(true);
      setTimeout(() => setScratchpadSaved(false), 2000);
    }, 800);
  };

  // --- HINT DELIVERY ---
  const [hintInput, setHintInput] = useState("");
  const [hintSending, setHintSending] = useState(false);
  const [receivedHint, setReceivedHint] = useState(null);

  useEffect(() => {
    const handleReceiveHint = ({ hint }) => setReceivedHint(hint);
    socket.on("receive-hint", handleReceiveHint);
    return () => socket.off("receive-hint", handleReceiveHint);
  }, []);

  const handleSendHint = () => {
    const trimmed = hintInput.trim();
    if (!trimmed || !session?.callId) return;
    socket.emit("send-hint", { roomId: session.callId, hint: trimmed });
    setHintInput("");
    toast.success("Hint sent to participant!", { icon: "💡" });
  };

  const {
    localStream,
    remoteStream,
    connectionState,
    isInitializingCall,
    isMuted,
    isCameraOff,
    isSharingScreen,
    remoteIsMuted,
    remoteIsCameraOff,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    leaveCall,
  } = useWebRTCSession(session, loadingSession, isHost, isParticipant);

  const [currentProblem, setCurrentProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [problemList, setProblemList] = useState([]);

  // Fetch full problem list for navigating
  useEffect(() => {
    getProblems({ limit: 1000 }).then(res => {
      if (res.problems) setProblemList(res.problems);
    }).catch(console.error);
  }, []);

  // Fetch specific problem details based on session string
  useEffect(() => {
    async function loadProblemData() {
      if (!session?.problem) return;
      
      // If we don't have the problem list yet, we might try to fetch a raw title as a slug.
      // To improve UX, we wait for the list if there are spaces in the problem string (likely a title).
      if (problemList.length === 0 && session.problem.includes(" ")) {
        return; 
      }

      setLoadingProblem(true);
      try {
        let slugToFetch = session.problem;
        
        if (problemList.length > 0) {
           const match = problemList.find(p => p.title === session.problem || p.id === session.problem);
           if (match) {
             slugToFetch = match.id;
           } else if (session.problem.includes(" ")) {
             // If it's definitely a title but no match in the current list, 
             // it might be a problem that doesn't exist anymore or is wrong.
             throw new Error("Problem not found in library");
           }
        }

        const token = await getToken();
        const data = await getProblemBySlug(slugToFetch, token);
        setCurrentProblem(data);
      } catch (err) {
        console.error("Failed to load session problem", err);
        setCurrentProblem(null);
      } finally {
        setLoadingProblem(false);
      }
    }
    
    if (session?.problem) {
      loadProblemData();
    } else if (!loadingSession && !session) {
      setLoadingProblem(false);
    }
  }, [session?.problem, problemList, loadingSession, getToken]);

  const currentProblemId = currentProblem?.id;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // Auto-join session
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // Show report when session is completed (participant side, or any observer)
  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") setShowReport(true);
  }, [session, loadingSession]);

  // Update code when problem loads or language changes
  useEffect(() => {
    // Only apply starter code if we don't have code yet OR if it's a completely new problem
    if (currentProblem?.starterCode?.[selectedLanguage] && !code) {
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

  // Added this state so the ProblemNavbar settings button doesn't crash
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // --- TIMER LOGIC ---
  // Helper: emit current timer state to room (host only)
  const emitTimerSync = (patch) => {
    if (!isHost || !session?.callId) return;
    socket.emit("sync-timer", {
      roomId: session.callId,
      timerState: patch,
    });
  };

  // Participant: listen for timer state from host
  useEffect(() => {
    if (isHost) return; // host drives the timer, never receives
    const handleTimerSync = (state) => {
      if (state.timerMode   !== undefined) setTimerMode(state.timerMode);
      if (state.isTimerActive !== undefined) setIsTimerActive(state.isTimerActive);
      if (state.timeElapsed  !== undefined) setTimeElapsed(state.timeElapsed);
      if (state.timeRemaining !== undefined) setTimeRemaining(state.timeRemaining);
    };
    socket.on("receive-timer-sync", handleTimerSync);
    return () => socket.off("receive-timer-sync", handleTimerSync);
  }, [isHost]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setTimeElapsed(prev => {
            const next = prev + 1;
            // Sync every second so participant's display stays in lock-step
            emitTimerSync({ timeElapsed: next });
            return next;
          });
        } else if (timerMode === 'timer') {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              setIsTimerActive(false);
              emitTimerSync({ isTimerActive: false, timeRemaining: 0 });
              toast("Time's up!", { icon: '⏰' });
              return 0;
            }
            const next = prev - 1;
            emitTimerSync({ timeRemaining: next });
            return next;
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
        const nextActive = true;
        setIsTimerActive(nextActive);
        emitTimerSync({ timerMode, isTimerActive: nextActive, timeRemaining: totalSeconds, timeElapsed });
        return;
      } else {
        toast.error("Please enter a valid time");
        return;
      }
    }
    const nextActive = !isTimerActive;
    setIsTimerActive(nextActive);
    emitTimerSync({ timerMode, isTimerActive: nextActive, timeRemaining, timeElapsed });
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeElapsed(0);
    setTimeRemaining(0);
    emitTimerSync({ timerMode, isTimerActive: false, timeElapsed: 0, timeRemaining: 0 });
  };

  // Low time threshold: red warning when < 5 min remain in countdown
  const isLowTime = timerMode === 'timer' && isTimerActive && timeRemaining > 0 && timeRemaining < 300;

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
    // Parent state update
    setSelectedLanguage(newLang);
    const starterCode = currentProblem?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (!isTimerActive && timeElapsed === 0 && timerMode === "stopwatch") {
      setIsTimerActive(true);
    }
  };

  const handleResetCode = () => {
    if (!currentProblem) return;
    const starterCode = currentProblem.starterCode[selectedLanguage];
    setCode(starterCode);
    toast.success("Code reset back to starter code.");

    // Sync reset
    socket.emit("code-update", { roomId: id, code: starterCode });
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  // Navigation Logic
  const currentIndex = currentProblemId ? problemList.findIndex(p => p.id === currentProblemId) : 0;
  const isFirstProblem = currentIndex <= 0;
  const isLastProblem = currentIndex === problemList.length - 1 || currentIndex === -1;

  const handlePrevProblem = () => {
    if (!isFirstProblem) handleProblemChange(problemList[currentIndex - 1].id);
  };
  const handleNextProblem = () => {
    if (!isLastProblem) handleProblemChange(problemList[currentIndex + 1].id);
  };
  const handleRandomProblem = () => {
    if (problemList.length <= 1) return;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * problemList.length);
    } while (randomIndex === currentIndex);
    handleProblemChange(problemList[randomIndex].id);
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  const handleRunCode = async () => {
    if (!currentProblem || !code) return;
    setIsRunning(true);
    setOutput({ type: "running" });

    const token = await getToken();
    const result = await runCode(selectedLanguage, code, "", token);
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
    setRunCount(c => c + 1);

    if (allPassed && !anyError) toast.success("Accepted! Output matches expected.");
    else toast.error(finalVerdict === "Wrong Answer" ? "Wrong Answer. Output does not match expected." : (finalVerdict || "Error"));

    // Track analytics
    if (user?.id && currentProblem?.slug) {
      trackProblemEvent({
        userId: user.id,
        problemSlug: currentProblem.slug,
        actionType: "run",
        language: selectedLanguage,
        verdict: finalVerdict,
        runtimeMs: result.executionTime || 0,
        memoryKb: 0,
        timeSpentSeconds: timeElapsed > 0 ? timeElapsed : 0,
        mode: "interview"
      });
    }
  };

  const handleSubmitCode = async () => {
    if (!currentProblem || !code) return;
    setIsSubmitting(true);
    setOutput({ type: "submitting" });

    const token = await getToken();
    const result = await submitCode(currentProblemId, selectedLanguage, code, token);
    setOutput({ type: "submit", ...result });
    setIsSubmitting(false);

    if (result.success && result.verdict === "Accepted") {
      setIsTimerActive(false);
      triggerConfetti();
      toast.success("Accepted! All tests passed.");
    } else if (result.success) {
      toast.error(`Submission failed: ${result.verdict}`);
    } else {
      toast.error("Code submission encountered an error.");
    }

    // Track analytics
    const actualVerdict = result.success && result.verdict === "Accepted" ? "Accepted" : result.verdict || "Error";
    setLastVerdict(actualVerdict);
    setSubmitCount(c => c + 1);
    if (user?.id && currentProblem?.slug) {
      trackProblemEvent({
        userId: user.id,
        problemSlug: currentProblem.slug,
        actionType: "submit",
        language: selectedLanguage,
        verdict: actualVerdict,
        runtimeMs: result.executionTime || 0,
        memoryKb: 0,
        timeSpentSeconds: timeElapsed > 0 ? timeElapsed : 0,
        mode: "interview"
      });
    }
  };

  const handleEndSession = () => {
    if (window.confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => setShowReport(true) });
    }
  };

  // --- RENDER LOGIC ---

  // 1. Show global loading state if we are still fetching session OR initial problem data
  if (loadingSession || (session?.problem && loadingProblem && !currentProblem)) {
    return (
      <div className="h-screen bg-[#111113] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#2cbb5d]" />
      </div>
    );
  }


  if (!loadingSession && !session) {
    return <div className="h-screen bg-[#111113]" />;
  }

  if (session && session.problem && !currentProblem && !loadingProblem) {
    return <div className="h-screen bg-[#111113]" />;
  }

  const showNavTime = isTimerActive || timeElapsed > 0 || timeRemaining > 0;
  const currentNavTime = timerMode === 'stopwatch' ? formatTime(timeElapsed) : formatTime(timeRemaining);

  return (
    <div className="h-screen bg-[#111113] flex flex-col overflow-hidden">

      {/* POST-SESSION REPORT MODAL */}
      {showReport && (
        <SessionReportModal
          problem={currentProblem}
          timeElapsed={timeElapsed}
          timeRemaining={timeRemaining}
          timerMode={timerMode}
          language={selectedLanguage}
          runCount={runCount}
          submitCount={submitCount}
          lastVerdict={lastVerdict}
          sessionId={id}
          hostName={session?.host?.name}
          participantName={session?.participant?.name}
          onClose={() => navigate("/dashboard")}
        />
      )}

      {/* PARTICIPANT HINT BANNER — floating overlay at bottom-center */}
      {receivedHint && !isHost && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-full px-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1c1c44] border border-indigo-500/40 rounded-xl p-4 shadow-2xl flex items-start gap-3 backdrop-blur-sm">
            <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">Hint from Interviewer</p>
              <p className="text-gray-200 text-sm leading-relaxed">{receivedHint}</p>
            </div>
            <button
              onClick={() => setReceivedHint(null)}
              className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RENDER THE EXTERNAL NAVBAR */}
      <ProblemNavbar
        isFirstProblem={isFirstProblem}
        isLastProblem={isLastProblem}
        handlePrevProblem={handlePrevProblem}
        handleNextProblem={handleNextProblem}
        handleRandomProblem={handleRandomProblem}
        isProblemListOpen={isProblemListOpen}
        setIsProblemListOpen={setIsProblemListOpen}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        handleRunCode={handleRunCode}
        handleSubmitCode={handleSubmitCode}
        isLayoutMenuOpen={isLayoutMenuOpen}
        setIsLayoutMenuOpen={setIsLayoutMenuOpen}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        isTimerOpen={isTimerOpen}
        setIsTimerOpen={setIsTimerOpen}
        showNavTime={showNavTime}
        currentNavTime={currentNavTime}
        timerMode={timerMode}
        setTimerMode={setTimerMode}
        isTimerActive={isTimerActive}
        timeElapsed={timeElapsed}
        timeRemaining={timeRemaining}
        timerHours={timerHours}
        setTimerHours={setTimerHours}
        timerMinutes={timerMinutes}
        setTimerMinutes={setTimerMinutes}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        formatTime={formatTime}
        isLowTime={isLowTime}
      />

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
                {problemList.map((p, index) => {
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
                  <ProblemDescription problem={currentProblem} currentProblemId={currentProblemId} onProblemChange={handleProblemChange} allProblems={problemList} />
                </Panel>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={50} minSize={30} className="flex flex-col">
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={60} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                      <CodeEditorPanel 
                        selectedLanguage={selectedLanguage} 
                        code={code} 
                        isRunning={isRunning} 
                        isSubmitting={isSubmitting} 
                        onLanguageChange={handleLanguageChange} 
                        onCodeChange={handleCodeChange} 
                        onRunCode={handleRunCode} 
                        onResetCode={handleResetCode} 
                        roomId={id}
                        user={user}
                        onRemoteLanguageChange={setSelectedLanguage}
                      />
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
                  <ProblemDescription problem={currentProblem} currentProblemId={currentProblemId} onProblemChange={handleProblemChange} allProblems={problemList} />
                </Panel>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={33} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                  <CodeEditorPanel 
                    selectedLanguage={selectedLanguage} 
                    code={code} 
                    isRunning={isRunning} 
                    isSubmitting={isSubmitting} 
                    onLanguageChange={handleLanguageChange} 
                    onCodeChange={handleCodeChange} 
                    onRunCode={handleRunCode} 
                    onResetCode={handleResetCode} 
                    roomId={id}
                    user={user}
                    onRemoteLanguageChange={setSelectedLanguage}
                  />
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
                  <CodeEditorPanel 
                    selectedLanguage={selectedLanguage} 
                    code={code} 
                    isRunning={isRunning} 
                    isSubmitting={isSubmitting} 
                    onLanguageChange={handleLanguageChange} 
                    onCodeChange={handleCodeChange} 
                    onRunCode={handleRunCode} 
                    onResetCode={handleResetCode} 
                    roomId={id}
                    user={user}
                    onRemoteLanguageChange={setSelectedLanguage}
                  />
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

            {/* WebRTC Video UI */}
            <div className="flex-1 bg-transparent p-2 overflow-hidden flex flex-col min-h-0">
              <WebRTCVideoUI
                localStream={localStream}
                remoteStream={remoteStream}
                connectionState={isInitializingCall ? "initializing" : connectionState}
                isMuted={isMuted}
                isCameraOff={isCameraOff}
                remoteIsMuted={remoteIsMuted}
                remoteIsCameraOff={remoteIsCameraOff}
                isSharingScreen={isSharingScreen}
                onToggleMute={toggleMute}
                onToggleCamera={toggleCamera}
                onToggleScreenShare={toggleScreenShare}
                onLeave={() => { leaveCall(); navigate("/dashboard"); }}
                localLabel={user?.firstName || "You"}
                remoteLabel={isHost ? (session?.participant?.name || "Participant") : (session?.host?.name || "Host")}
                localImageUrl={user?.imageUrl}
                remoteImageUrl={isHost ? session?.participant?.profileImage : session?.host?.profileImage}
              />
            </div>

            {/* HOST-ONLY SCRATCHPAD */}
            {isHost && (
              <div className="shrink-0 border-t border-[#27272a]">
                {/* Toggle header */}
                <button
                  onClick={() => setScratchpadOpen(o => !o)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-[#27272a]/50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <NotebookPen className="w-3.5 h-3.5" />
                    Interviewer Notes
                    {scratchpadSaved && <span className="text-emerald-500 text-[10px] ml-1">Saved ✓</span>}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${scratchpadOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Collapsible content: hint sender + notes */}
                {scratchpadOpen && (
                  <div className="px-2 pb-2 flex flex-col gap-2">
                    {/* Send Hint row */}
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={hintInput}
                        onChange={(e) => setHintInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendHint()}
                        placeholder="Type a hint to send..."
                        className="flex-1 bg-[#111113] text-gray-300 text-[12px] placeholder-gray-600 rounded-lg border border-[#27272a] px-2.5 py-1.5 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                      <button
                        onClick={handleSendHint}
                        disabled={!hintInput.trim() || hintSending}
                        title="Send hint to participant"
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Private notes textarea */}
                    <textarea
                      value={scratchpadText}
                      onChange={(e) => handleScratchpadChange(e.target.value)}
                      placeholder="Private notes (only you can see this)..."
                      rows={4}
                      className="w-full bg-[#111113] text-gray-300 text-[12px] placeholder-gray-600 rounded-lg border border-[#27272a] p-2.5 resize-none focus:outline-none focus:border-[#3f3f46] transition-colors leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;