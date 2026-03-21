import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { getProblems, getProblemBySlug } from "../lib/api/problems.js";
import { trackProblemEvent } from "../lib/api/analytics.js";

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
import ProblemNavbar from "../components/ProblemNavbar";

// Icons (Trimmed down to only what is used in the main body)
import {
  ChevronRight,
  X,
  EyeOff,
  PhoneOffIcon,
  LogOutIcon,
  Loader2
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
      
      setLoadingProblem(true);
      try {
        let slugToFetch = session.problem;
        
        if (problemList.length > 0) {
           const match = problemList.find(p => p.title === session.problem || p.id === session.problem);
           if (match) slugToFetch = match.id;
        }

        const data = await getProblemBySlug(slugToFetch);
        setCurrentProblem(data);
      } catch (err) {
        console.error("Failed to load session problem", err);
        // If it really fails to fetch a specific problem, we should ideally handle it
        // but not necessarily trigger the global "Not Found" UI if the session itself exists.
        setCurrentProblem(null);
      } finally {
        setLoadingProblem(false);
      }
    }
    
    // Only attempt to load problem if we have a session problem string
    if (session?.problem) {
      loadProblemData();
    } else if (!loadingSession && !session) {
      // If session fetch is done and there's no session, we won't have a problem to load
      setLoadingProblem(false);
    }
  }, [session?.problem, problemList, loadingSession]);

  const currentProblemId = currentProblem?.id;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

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

    const result = await submitCode(currentProblemId, selectedLanguage, code);
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
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
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

  // 2. Show "Blank Screen" if session hasn't arrived yet
  // This prevents the "Not Found" flash. If it stayed blank for longer than 3 seconds, 
  // we could show an error, but for now we'll just keep it blank as requested.
  if (!loadingSession && !session) {
    return <div className="h-screen bg-[#111113]" />;
  }

  // 3. Optional: Problem data failed to load - also show blank or subtle message
  if (session && session.problem && !currentProblem && !loadingProblem) {
    return <div className="h-screen bg-[#111113]" />;
  }

  const showNavTime = isTimerActive || timeElapsed > 0 || timeRemaining > 0;
  const currentNavTime = timerMode === 'stopwatch' ? formatTime(timeElapsed) : formatTime(timeRemaining);

  return (
    <div className="h-screen bg-[#111113] flex flex-col overflow-hidden">

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