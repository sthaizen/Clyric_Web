import { HistoryIcon, Loader2Icon } from "lucide-react";
// Assuming you keep these imports for the populated state when sessions exist
import { Code2, Clock, Users } from "lucide-react"; 
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-xl shadow-sm flex flex-col min-h-[250px] overflow-hidden">
      
      {/* HEADER */}
      <div className="p-5 flex items-start gap-3">
        <div className="p-2 bg-[#2a1f36] rounded-lg border border-[#3b3350] shrink-0">
          <HistoryIcon className="w-5 h-5 text-[#b570e9]" />
        </div>
        <div>
          <h3 className="text-[15px] font-medium text-white mb-0.5">Recent History</h3>
          <p className="text-xs text-gray-400">Review your past practice sessions</p>
        </div>
      </div>

      {/* BODY GRID / LIST */}
      <div className="px-5 pb-5 flex-1 flex flex-col">
        {isLoading ? (
          /* Exact Loading State from Screenshot */
          <div className="flex flex-col items-center justify-center flex-grow text-gray-500 min-h-[150px]">
            <Loader2Icon className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
            <span className="text-sm">Finding active sessions...</span> {/* Matched the text from the image, you might want to change this to "Loading history..." in reality */}
          </div>
        ) : sessions?.length > 0 ? (
          /* I have updated this grid layout slightly to match the flatter card styling used in the Active Sessions component above, ensuring consistency across your new dashboard. */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {sessions.map((session) => {
              const isActive = session.status === "active";
              const difficultyCapitalized = session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1);

              return (
                <div
                  key={session._id}
                  className={`relative flex flex-col rounded-xl border p-4 transition-colors ${
                    isActive
                      ? "bg-[#141d1a]/50 border-emerald-500/20"
                      : "bg-[#171619]/50 border-[#2a2538] hover:border-[#3b3350]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 text-emerald-500">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold tracking-wider">LIVE</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-4">
                    <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${
                      isActive ? "bg-[#141d1a] border-emerald-500/30" : "bg-[#2a2538] border-[#3b3350]"
                    }`}>
                      <Code2 className={`w-5 h-5 ${isActive ? "text-emerald-500" : "text-indigo-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-medium text-white text-sm truncate mb-1" title={session.problem}>
                        {session.problem}
                      </h3>
                      <span className={`inline-block text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${getDifficultyBadgeClass(session.difficulty)}`}>
                        {difficultyCapitalized}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-400 mt-auto mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      <span>{session.participant ? "2 Participants" : "Solo Session"}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2a2538] flex justify-between items-center text-[11px]">
                    <span className="font-medium text-gray-500 uppercase tracking-wider">Last Activity</span>
                    <span className="text-gray-400">
                      {new Date(session.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State Fallback */
          <div className="flex flex-col items-center justify-center flex-grow text-center min-h-[150px]">
            <div className="w-12 h-12 mb-3 bg-[#2a2538] border border-[#3b3350] rounded-xl flex items-center justify-center">
              <HistoryIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-gray-300 mb-1">No past sessions</p>
            <p className="text-xs text-gray-500">Your practice history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentSessions;