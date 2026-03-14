import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, TerminalIcon, PlusIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity group-hover:bg-indigo-500/20"></div>

      <div className="relative z-10 pb-13 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
        
        {/* Left Side: Greeting */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex w-14 h-14 rounded-xl bg-[#231c2f] border border-indigo-500/30 items-center justify-center shadow-inner">
            <TerminalIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
              Welcome back, {user?.firstName || "there"}!
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
              <span>Ready to level up your coding skills?</span>
              {/* Note: You might still want to change text-[#231c2f] to text-gray-500 here so the dot is visible! */}
              <span className="hidden sm:inline text-[#231c2f]">•</span>
              <span className="bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/20 text-xs font-medium">
                Live Collaboration
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: CTA */}
        <button
          onClick={onCreateSession}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Session</span>
        </button>
        
      </div>
    </div>
  );
}

export default WelcomeSection;