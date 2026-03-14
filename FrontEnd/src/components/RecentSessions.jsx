import { Code2, Clock, Users, HistoryIcon, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-2xl shadow-lg flex flex-col">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-[#231c2f] flex flex-wrap items-center gap-3 bg-[#1b1b1f]/50">
        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <HistoryIcon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Recent History</h2>
          <p className="text-xs text-gray-400">Review your past practice sessions</p>
        </div>
      </div>

      {/* BODY GRID */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 space-y-4">
              <Loader className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm text-gray-400">Loading history...</p>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => {
              const isActive = session.status === "active";
              const difficultyCapitalized = session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1);

              return (
                <div
                  key={session._id}
                  className={`relative flex flex-col rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                      : "bg-[#111113] border-[#231c2f] hover:border-purple-500/30"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${
                        isActive ? "bg-emerald-500/10 border-emerald-500/20" : "bg-[#1b1b1f] border-[#231c2f]"
                      }`}>
                        <Code2 className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="font-bold text-white text-sm truncate mb-1" title={session.problem}>
                          {session.problem}
                        </h3>
                        <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getDifficultyBadgeClass(session.difficulty).replace('badge', '')}`}>
                          {difficultyCapitalized}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-400 mt-auto mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span>
                          {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 opacity-70" />
                        <span>
                          {session.participant ? "2 Participants" : "Solo Session"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#231c2f] flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-gray-500 uppercase tracking-wider">Last Activity</span>
                      <span className="text-gray-400">
                        {new Date(session.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 mb-4 bg-[#231c2f]/50 border border-[#231c2f] rounded-2xl flex items-center justify-center">
                <HistoryIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-base font-semibold text-gray-300 mb-1">No past sessions</p>
              <p className="text-sm text-gray-500">Your practice history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;