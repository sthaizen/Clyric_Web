import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProblemBySlug, getProblems } from "../lib/api/problems";
import { trackProblemEvent } from "../lib/api/analytics";
import { useAuth } from "@clerk/clerk-react";
import { useSubscription } from "../hooks/useSubscription";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import SettingsModal from "../components/SettingModal.jsx";
import ProblemNavbar from "../components/ProblemNavbar";
import AiChatPanel from "../components/AiChatPanel"; // <-- NEW IMPORT
import { Lock } from "lucide-react";

// Use our new backend service instead of piston
import { runCode, submitCode } from "../lib/codeExecution";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

import { ChevronRight, X, EyeOff } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, getToken } = useAuth(); // for tracking & auth
  const { getAllowedLanguages, permissions, tierLabel, showUpgradeToast } = useSubscription();

  const [problemList, setProblemList] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lockedDifficulty, setLockedDifficulty] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  // Track code for all languages separately so switching doesn't wipe them out
  const [codePerLanguage, setCodePerLanguage] = useState({});

  // Unified output state sent to OutputPanel
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- EDITOR SETTINGS STATE ---
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontFamily: "Default",
    fontSize: 13,
    fontLigatures: false,
    keyBinding: "Standard",
    tabSize: 4,
    wordWrap: true,
    relativeLineNumbers: false,
  });

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

  // --- LAYOUT & AI STATES ---
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState("default"); // 'default' | 'columns' | 'focus' | 'editor-only'
  const [previousLayoutMode, setPreviousLayoutMode] = useState("default");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false); // <-- NEW AI STATE

  const currentProblemId = id || "";

  // Fetch problem list for sidebar navigating
  useEffect(() => {
    async function fetchList() {
      try {
        const res = await getProblems({ limit: 1000 });
        if (res.problems) setProblemList(res.problems);
      } catch (err) {
        console.error("Failed to fetch problem list:", err);
      }
    }
    fetchList();
  }, []);

  // Fetch current problem details
  useEffect(() => {
    async function fetchProblem() {
      if (!id) return;
      setIsLoading(true);
      try {
        const token = await getToken();
        const problemData = await getProblemBySlug(id, token);
        setCurrentProblem(problemData);
        setLockedDifficulty(null);

        const defaultCodes = {};
        if (problemData && problemData.starterCode) {
          Object.entries(problemData.starterCode).forEach(([lang, src]) => {
            defaultCodes[lang] = src;
          });
        }
        setCodePerLanguage(defaultCodes);
        setOutput(null);
      } catch (err) {
        console.error("Failed to fetch problem details:", err);
        // fetch based handle error (code in .data)
        if (err.data?.code === "DIFFICULTY_LOCKED") {
          setLockedDifficulty(err.data.message);
        } else {
          setCurrentProblem(null);
          setLockedDifficulty(null);
        }
      } finally {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 300); // smooth transition
      }
    }
    fetchProblem();
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
    // Auto-start timer on first type if it's a new or reset session
    if (!isTimerActive && timeElapsed === 0 && timerMode === "stopwatch") {
      setIsTimerActive(true);
    }
  };

  const currentCode = codePerLanguage[selectedLanguage] || "";

  const handleResetCode = () => {
    if (!currentProblem) return;
    setCodePerLanguage(prev => ({
      ...prev,
      [selectedLanguage]: currentProblem.starterCode[selectedLanguage]
    }));
    toast.success("Code reset back to starter code.");

    if (userId) {
      trackProblemEvent({
        userId,
        problemSlug: currentProblemId,
        actionType: "code_reset",
        language: selectedLanguage
      });
    }
  };

  const handleProblemChange = (newProblemId) => {
    if (!newProblemId) return;
    navigate(`/problem/${newProblemId}`);
  };

  // --- NAVIGATION LOGIC ---
  const currentIndex = problemList.findIndex(p => p.id === id);
  const isFirstProblem = currentIndex <= 0;
  const isLastProblem = currentIndex === problemList.length - 1 || currentIndex === -1;

  const handlePrevProblem = () => {
    if (!isFirstProblem) {
      handleProblemChange(problemList[currentIndex - 1].id);
    }
  };

  const handleNextProblem = () => {
    if (!isLastProblem && currentIndex !== -1) {
      handleProblemChange(problemList[currentIndex + 1].id);
    }
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
    if (!currentProblem || !currentCode) return;

    setIsRunning(true);
    setOutput({ type: "running" });

    const result = await runCode(selectedLanguage, currentCode, "");

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
      if (!anyError && actualNormalized === expectedNormalized) {
        passed = true;
      } else {
        allPassed = false;
      }

      results.push({
        ...result,
        expected: example.output,
        actual: actual,
        passed: passed,
        stdin: example.input
      });
    }

    let finalVerdict = "Wrong Answer";
    if (anyError) {
      finalVerdict = result.verdict || "Error";
    } else if (allPassed) {
      finalVerdict = "Accepted";
    }

    setOutput({
      type: "run",
      verdict: finalVerdict,
      results,
      executionTime: result.executionTime
    });

    setIsRunning(false);

    if (allPassed && !anyError) {
      toast.success("Accepted! Output matches expected.");
    } else {
      toast.error(finalVerdict === "Wrong Answer" ? "Wrong Answer. Output does not match expected." : (finalVerdict || "Error"));
    }

    if (userId) {
      trackProblemEvent({
        userId,
        problemSlug: currentProblemId,
        actionType: "run",
        language: selectedLanguage,
        verdict: finalVerdict,
        runtimeMs: result.executionTime || 0,
        memoryKb: 0,
        timeSpentSeconds: timeElapsed > 0 ? timeElapsed : 0,
        mode: "practice"
      });
    }
  };

  const handleSubmitCode = async () => {
    if (!currentProblem || !currentCode) return;

    // Client-side daily submission limit guard
    if (permissions.maxSubmissionsPerDay !== Infinity) {
      const today = new Date().toISOString().split("T")[0];
      const key = `submissions_${userId}_${today}`;
      const usedToday = parseInt(sessionStorage.getItem(key) || "0", 10);
      if (usedToday >= permissions.maxSubmissionsPerDay) {
        showUpgradeToast("Daily limit reached. Upgrade for more submissions.");
        return;
      }
      sessionStorage.setItem(key, usedToday + 1);
    }

    setIsSubmitting(true);
    setOutput({ type: "submitting" });

    const result = await submitCode(currentProblemId, selectedLanguage, currentCode);

    setOutput({
      type: "submit",
      ...result
    });

    setIsSubmitting(false);

    const actualVerdict = result.success && result.verdict === "Accepted" ? "Accepted" : result.verdict || "Error";

    if (actualVerdict === "Accepted") {
      setIsTimerActive(false);
      triggerConfetti();
      toast.success("Accepted! All tests passed.");
    } else if (result.success) {
      toast.error(`Submission failed: ${actualVerdict}`);
    } else {
      toast.error("Code submission encountered an error.");
    }

    if (userId) {
      trackProblemEvent({
        userId,
        problemSlug: currentProblemId,
        actionType: "submit",
        language: selectedLanguage,
        verdict: actualVerdict,
        runtimeMs: result.executionTime || 0,
        memoryKb: 0,
        timeSpentSeconds: timeElapsed > 0 ? timeElapsed : 0,
        mode: "practice"
      });
    }
  };

  const handleToggleMaximize = () => {
    if (layoutMode === "editor-only") {
      setLayoutMode(previousLayoutMode || "default");
    } else {
      setPreviousLayoutMode(layoutMode);
      setLayoutMode("editor-only");
    }
  };

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <div className="h-screen bg-[#111113] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-indigo-500 border-indigo-500/20 rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-400">Loading problem data...</span>
        </div>
      </div>
    );
  }

  if (lockedDifficulty) {
    return (
      <div className="h-screen bg-[#111113] flex flex-col overflow-hidden">
        <ProblemNavbar 
           isPrevDisabled={true} isNextDisabled={true} // disable nav in locked state
           setIsLayoutMenuOpen={() => {}} setIsSettingsModalOpen={() => {}}
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-[#1b1b1f] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-[#ff375f]/10 flex items-center justify-center ring-1 ring-[#ff375f]/20">
             <Lock className="w-8 h-8 text-[#ff375f]" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Difficulty Locked</h2>
            <p className="text-gray-400 max-w-[340px] leading-relaxed mx-auto">
              {lockedDifficulty} Upgrade your plan to access Medium and Hard level challenges.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[400px]">
            <button 
               onClick={() => navigate("/problems")}
               className="flex-1 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all active:scale-95"
            >
              Back to Overview
            </button>
            <button 
               onClick={() => navigate("/pricing")}
               className="flex-1 px-8 py-3 bg-[#ff375f] hover:bg-[#ff1b47] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#ff375f]/20 active:scale-95"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return <div className="h-screen bg-[#111113]" />;
  }

  // Determine if we should show the active time next to the nav icon
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
        isAiChatOpen={isAiChatOpen}           // <-- NEW PROP
        setIsAiChatOpen={setIsAiChatOpen}     // <-- NEW PROP
      />

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
            <div className="absolute left-0 top-0 bottom-0 z-50 w-[380px] bg-[#111113] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-left-8 duration-200 border-r border-[#111113]">

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
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#3e3e42] text-gray-400 hover:text-gray-300 text-[11px] font-medium rounded-full border border-[#111113] transition-colors">
                  <EyeOff className="w-3.5 h-3.5" /> Tag
                </button>
              </div>

              {/* Sidebar Problems List (Pills) */}
              <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#3e3e42] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                {problemList.map((p, index) => {
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

        {/* Dynamic Resizable Panel Groups based on Layout Mode */}

        {/* --- DEFAULT LAYOUT --- */}
        {layoutMode === 'default' && (
          <PanelGroup direction="horizontal" className="flex-1">
            <Panel defaultSize={isAiChatOpen ? 40 : 50} minSize={25} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden transition-all duration-300">
              <ProblemDescription problem={currentProblem} currentProblemId={currentProblemId} onProblemChange={handleProblemChange} allProblems={problemList} />
            </Panel>

            <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />

            <Panel defaultSize={isAiChatOpen ? 35 : 50} minSize={25} className="flex flex-col transition-all duration-300">
              <PanelGroup direction="vertical">
                <Panel defaultSize={60} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                  <CodeEditorPanel
                    selectedLanguage={selectedLanguage}
                    code={currentCode}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={handleCodeChange}
                    onRunCode={handleRunCode}
                    onResetCode={handleResetCode}
                    settings={editorSettings}
                    onToggleMaximize={handleToggleMaximize}
                    isMaximized={layoutMode === "editor-only"}
                    allowedLanguages={getAllowedLanguages()}
                  />
                </Panel>
                <PanelResizeHandle className="h-2 cursor-row-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={40} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden">
                  <OutputPanel output={output} testCases={currentProblem.examples} />
                </Panel>
              </PanelGroup>
            </Panel>

            {/* AI Panel Appended to the right */}
            {isAiChatOpen && (
              <>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={25} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-300">
                  <AiChatPanel onClose={() => setIsAiChatOpen(false)} currentProblemId={currentProblemId} />
                </Panel>
              </>
            )}
          </PanelGroup>
        )}

        {/* --- COLUMNS LAYOUT --- */}
        {layoutMode === 'columns' && (
          <PanelGroup direction="horizontal" className="flex-1">
            <Panel defaultSize={isAiChatOpen ? 25 : 33} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden transition-all duration-300">
              <ProblemDescription problem={currentProblem} currentProblemId={currentProblemId} onProblemChange={handleProblemChange} allProblems={problemList} />
            </Panel>
            <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
            <Panel defaultSize={isAiChatOpen ? 25 : 33} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden transition-all duration-300">
              <CodeEditorPanel
                selectedLanguage={selectedLanguage}
                code={currentCode}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                onLanguageChange={handleLanguageChange}
                onCodeChange={handleCodeChange}
                onRunCode={handleRunCode}
                onResetCode={handleResetCode}
                settings={editorSettings}
                onToggleMaximize={handleToggleMaximize}
                isMaximized={layoutMode === "editor-only"}
                allowedLanguages={getAllowedLanguages()}
              />
            </Panel>
            <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
            <Panel defaultSize={isAiChatOpen ? 25 : 34} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden transition-all duration-300">
              <OutputPanel output={output} testCases={currentProblem.examples} />
            </Panel>

            {/* AI Panel Appended to the right */}
            {isAiChatOpen && (
              <>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={25} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-300">
                  <AiChatPanel onClose={() => setIsAiChatOpen(false)} currentProblemId={currentProblemId} />
                </Panel>
              </>
            )}
          </PanelGroup>
        )}

        {/* --- FOCUS LAYOUT --- */}
        {layoutMode === 'focus' && (
          <PanelGroup direction="horizontal" className="flex-1">
            <Panel defaultSize={isAiChatOpen ? 75 : 100} minSize={50} className="flex flex-col transition-all duration-300">
              <PanelGroup direction="vertical" className="flex-1">
                <Panel defaultSize={70} minSize={30} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden shadow-2xl">
                  <CodeEditorPanel
                    selectedLanguage={selectedLanguage}
                    code={currentCode}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={handleCodeChange}
                    onRunCode={handleRunCode}
                    onResetCode={handleResetCode}
                    settings={editorSettings}
                    onToggleMaximize={handleToggleMaximize}
                    isMaximized={layoutMode === "editor-only"}
                    allowedLanguages={getAllowedLanguages()}
                  />
                </Panel>
                <PanelResizeHandle className="h-2 cursor-row-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={30} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden shadow-xl">
                  <OutputPanel output={output} testCases={currentProblem.examples} />
                </Panel>
              </PanelGroup>
            </Panel>

            {/* AI Panel Appended to the right */}
            {isAiChatOpen && (
              <>
                <PanelResizeHandle className="w-2 cursor-col-resize hover:bg-[#3e3e42]/50 transition-colors" />
                <Panel defaultSize={25} minSize={20} className="bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-300">
                  <AiChatPanel onClose={() => setIsAiChatOpen(false)} currentProblemId={currentProblemId} />
                </Panel>
              </>
            )}
          </PanelGroup>
        )}

        {/* --- EDITOR-ONLY LAYOUT --- */}
        {layoutMode === 'editor-only' && (
          <div className="flex-1 bg-[#1b1b1f] rounded-lg border border-[#111113] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <CodeEditorPanel
              selectedLanguage={selectedLanguage}
              code={currentCode}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onLanguageChange={handleLanguageChange}
              onCodeChange={handleCodeChange}
              onRunCode={handleRunCode}
              onResetCode={handleResetCode}
              settings={editorSettings}
              onToggleMaximize={handleToggleMaximize}
              isMaximized={true}
              allowedLanguages={getAllowedLanguages()}
            />
          </div>
        )}

      </div>

      {/* RENDER THE SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={editorSettings}
        setSettings={setEditorSettings}
      />
    </div>
  );
}

export default ProblemPage;