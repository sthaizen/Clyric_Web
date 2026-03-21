import { useUser } from "@clerk/clerk-react";
// You can remove TerminalIcon and ArrowRightIcon from your imports if you no longer use them elsewhere in this file!

function WelcomeSection({ onCreateSession }) {
  // Kept your hook to ensure no logic breaks, even if we aren't displaying the name in this specific UI update
  const { user } = useUser();

  return (
    <div className="bg-[#16161a] border border-[#231c2f] rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full shadow-sm">
      
      {/* Left Side: Header & Subtitle */}
      <div>
        <h2 className="text-[17px] font-medium text-white mb-1 tracking-wide">
          Start Practicing
        </h2>
        <p className="text-sm text-gray-400">
          Create a collaborative coding session and level up your skills.
        </p>
      </div>

      {/* Right Side: CTA Button */}
      <button
        onClick={onCreateSession}
        className="w-full sm:w-auto bg-[#5c4dff] hover:bg-[#4b3ce0] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0 shadow-[0_0_15px_rgba(92,77,255,0.15)]"
      >
        + Create Session
      </button>
      
    </div>
  );
}

export default WelcomeSection;