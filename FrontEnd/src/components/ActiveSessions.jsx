import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  UsersIcon,
  RadioIcon,
  Loader2Icon, // Swapped to Loader2Icon for a more standard spinner look
  SparklesIcon
} from "lucide-react";
import { Link } from "react-router-dom"; // Assuming you are using react-router-dom
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-xl shadow-sm flex flex-col min-h-[300px] overflow-hidden">
      
      {/* HEADER */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2a2538] rounded-lg border border-[#3b3350]">
            <RadioIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-white mb-0.5">Live Sessions</h3>
            <p className="text-xs text-gray-400">Join active coding rooms</p>
          </div>
        </div>

        {/* Status Badge - Top Right */}
        <div className="flex items-center gap-2 bg-[#141d1a] border border-[#1b3327] px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-medium text-emerald-500/90">{sessions?.length || 0} Active</span>
        </div>
      </div>

      {/* LIST BODY */}
      <div className="px-5 pb-5 flex-1 flex flex-col max-h-[450px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          /* Exact Loading State from Screenshot */
          <div className="flex flex-col items-center justify-center flex-grow text-gray-500">
            <Loader2Icon className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
            <span className="text-sm">Finding active sessions...</span>
          </div>
        ) : sessions?.length > 0 ? (
          <div className="space-y-3 mt-2">
            {sessions.map((session) => {
              const difficultyCapitalized = session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1);
              const isFull = session.participant && !isUserInSession(session);

              return (
                <div
                  key={session._id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#111113]/50 border border-[#2a2538] hover:border-[#3b3350] transition-colors"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#2a2538] border border-[#3b3350] flex items-center justify-center">
                      <Code2Icon className="w-5 h-5 text-indigo-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white truncate text-sm">{session.problem}</h3>
                        <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${getDifficultyBadgeClass(session.difficulty)}`}>
                          {difficultyCapitalized}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="w-3.5 h-3.5 text-yellow-500" />
                          <span className="truncate max-w-[100px]">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-3.5 h-3.5" />
                          <span>{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {isFull ? (
                          <span className="text-rose-400 font-medium">FULL</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                    {isFull ? (
                      <button disabled className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-[#2a2538] text-gray-500 font-medium text-xs border border-[#3b3350] cursor-not-allowed">
                        Room Full
                      </button>
                    ) : (
                      <Link 
                        to={`/session/${session._id}`} 
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#5c4dff]/10 hover:bg-[#5c4dff]/20 text-indigo-300 font-medium text-xs border border-[#5c4dff]/30 transition-colors"
                      >
                        {isUserInSession(session) ? "Rejoin" : "Join Room"}
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State fallback (just in case) */
          <div className="flex flex-col items-center justify-center flex-grow text-center">
            <div className="w-12 h-12 mb-3 bg-[#2a2538] border border-[#3b3350] rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-gray-300 mb-1">No active sessions</p>
            <p className="text-xs text-gray-500">Create a session to start collaborating.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default ActiveSessions;