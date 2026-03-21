import { Link } from "react-router-dom";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
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
  LayoutTemplate,
  Sparkles // <-- Added Sparkles for the AI button
} from "lucide-react";

export default function ProblemNavbar({
  // Problem Navigation
  isFirstProblem,
  isLastProblem,
  handlePrevProblem,
  handleNextProblem,
  handleRandomProblem,
  
  // Sidebar State
  isProblemListOpen,
  setIsProblemListOpen,
  
  // Execution
  isRunning,
  isSubmitting,
  handleRunCode,
  handleSubmitCode,
  
  // Layout Options
  isLayoutMenuOpen,
  setIsLayoutMenuOpen,
  layoutMode,
  setLayoutMode,
  
  // Settings
  setIsSettingsModalOpen,
  
  // Timer State & Functions
  isTimerOpen,
  setIsTimerOpen,
  showNavTime,
  currentNavTime,
  timerMode,
  setTimerMode,
  isTimerActive,
  timeElapsed,
  timeRemaining,
  timerHours,
  setTimerHours,
  timerMinutes,
  setTimerMinutes,
  toggleTimer,
  resetTimer,
  formatTime,

  // --- NEW: AI Chat State ---
  isAiChatOpen,
  setIsAiChatOpen
}) {
  return (
    <nav className="flex items-center justify-between h-[50px] px-4 bg-[#1b1b1f] text-gray-400 text-sm border-b border-[#111113]">
      {/* --- LEFT SECTION --- */}
      <div className="flex items-center h-full w-[30%]">
        <Link to="/problems" className="flex items-center justify-center h-6 mr-4 hover:opacity-80 transition-opacity">
          <div className="flex flex-col gap-[2px]">
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
          <span className="p-2" style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: '-0.2px' }}>Clyric</span>
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
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1f] hover:bg-[#3e3e42] text-[#2cbb5d] font-medium text-[13px] rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
          Submit
        </button>
      </div>

      {/* --- RIGHT SECTION --- */}
      <div className="flex items-center justify-end gap-5 h-full w-[30%] relative">
        <div className="flex items-center gap-4">

          {/* --- NEW: AI CHAT BUTTON --- */}
          <button
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 border ${
              isAiChatOpen 
                ? 'bg-[#ffa116]/10 text-[#ffa116] border-[#ffa116]/30' 
                : 'text-gray-400 hover:text-white hover:bg-[#3e3e42] border-transparent'
            }`}
            title="Ask AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[12px] font-medium hidden lg:block">Ask AI</span>
          </button>

          {/* LAYOUT BUTTON & DROPDOWN */}
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
                  {/* Default Layout Option */}
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

                  {/* Columns Layout Option */}
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

                  {/* Focus Layout Option */}
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

          {/* SETTINGS ICON MODIFIED */}
          <div
            className="p-1.5 rounded-lg transition-colors flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3e3e42] cursor-pointer"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <Settings className="w-4 h-4" />
          </div>

          {/* TIMER FEATURE CONTAINER */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsTimerOpen(!isTimerOpen)}
              className={`p-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${isTimerOpen ? 'bg-[#3e3e42] text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#3e3e42]'}`}
            >
              {showNavTime && <span className="text-[13px] font-mono text-gray-200">{currentNavTime}</span>}
              <Timer className="w-[18px] h-[18px]" />
            </button>

            {/* TIMER DROPDOWN MENU */}
            {isTimerOpen && (
              <div className="absolute top-[42px] right-0 w-[290px] bg-[#1b1b1f] border border-[#111113] rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-3">
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
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-[13px] font-medium hover:opacity-60 transition-opacity">
              Register or Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <div className="flex items-center gap-3">
          <button className="bg-[#ffa116]/20 text-[#ffa116] px-3 py-1 rounded font-medium text-[13px] hover:bg-[#ffa116]/30 transition-colors">Premium</button>
        </div>
      </div>
    </nav>
  );
}