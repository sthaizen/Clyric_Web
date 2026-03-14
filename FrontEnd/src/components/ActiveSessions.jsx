import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  RadioIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
      
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-[#231c2f] flex flex-wrap items-center justify-between gap-4 bg-[#1b1b1f]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <RadioIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Sessions</h2>
            <p className="text-xs text-gray-400">Join active coding rooms</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#111113] px-3 py-1.5 rounded-full border border-[#231c2f]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-300">{sessions.length} Active</span>
        </div>
      </div>

      {/* LIST BODY */}
      <div className="p-4 sm:p-6 flex-1 max-h-[450px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <LoaderIcon className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-gray-400">Finding active sessions...</p>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => {
              const difficultyCapitalized = session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1);
              const isFull = session.participant && !isUserInSession(session);

              return (
                <div
                  key={session._id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#111113] border border-[#231c2f] hover:border-indigo-500/30 transition-all duration-200"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#1b1b1f] border border-[#231c2f] flex items-center justify-center group-hover:bg-[#231c2f] transition-colors">
                      <Code2Icon className="w-6 h-6 text-gray-400 group-hover:text-indigo-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-white truncate text-base">{session.problem}</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getDifficultyBadgeClass(session.difficulty).replace('badge', '')}`}>
                          {difficultyCapitalized}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="w-3.5 h-3.5 text-amber-500/80" />
                          <span className="truncate max-w-[100px]">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-3.5 h-3.5" />
                          <span>{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {isFull ? (
                          <span className="text-rose-400 font-medium bg-rose-400/10 px-1.5 py-0.5 rounded border border-rose-400/20">FULL</span>
                        ) : (
                          <span className="text-emerald-400 font-medium bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                    {isFull ? (
                      <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1b1b1f] text-gray-500 font-medium text-sm border border-[#231c2f] cursor-not-allowed">
                        Room Full
                      </button>
                    ) : (
                      <Link 
                        to={`/session/${session._id}`} 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white font-medium text-sm border border-indigo-500/20 hover:border-indigo-600 transition-all duration-200"
                      >
                        {isUserInSession(session) ? "Rejoin" : "Join Room"}
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 mb-4 bg-[#231c2f]/50 border border-[#231c2f] rounded-2xl flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-base font-semibold text-gray-300 mb-1">No active sessions</p>
            <p className="text-sm text-gray-500">Create a session to start collaborating.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveSessions;