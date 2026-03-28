import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  UsersIcon,
  RadioIcon,
  Loader2Icon,
  SparklesIcon,
  KeyRound,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useJoinSessionByCode } from "../hooks/useSessions";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  const navigate = useNavigate();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const joinMutation = useJoinSessionByCode();

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    joinMutation.mutate(
      { roomId: roomCode.trim(), password: roomPassword || undefined },
      {
        onSuccess: (data) => {
          setShowJoinForm(false);
          setRoomCode("");
          setRoomPassword("");
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  return (
    <div className="bg-[#16161a] border border-[#231c2f] rounded-xl shadow-sm flex flex-col min-h-[300px] overflow-hidden">
      
      {/* HEADER */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#232329] rounded-lg border border-[#3b3350]">
              <RadioIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-white mb-0.5">Live Sessions</h3>
              <p className="text-xs text-gray-400">Join active coding rooms</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJoinForm(!showJoinForm)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                showJoinForm
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                  : "bg-[#232329]/50 text-gray-400 border-white/[0.05] hover:bg-[#2a2a32] hover:text-gray-200"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              {showJoinForm ? "Cancel" : "Join by Code"}
            </button>
            <div className="flex items-center gap-2 bg-[#141d1a] border border-[#1b3327] px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[11px] font-medium text-emerald-500/90">{sessions?.length || 0} Active</span>
            </div>
          </div>
        </div>

        {/* JOIN BY CODE FORM */}
        {showJoinForm && (
          <form 
            onSubmit={handleJoinByCode}
            className="animate-in fade-in slide-in-from-top-2 duration-200 p-4 bg-[#0b0b0c] border border-white/[0.08] rounded-xl flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Room Code (e.g., A3X-9K2)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#16161a] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors"
                maxLength={7}
                required
              />
              <div className="flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (optional)"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full bg-[#16161a] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!roomCode.trim() || joinMutation.isPending}
              className="px-4 py-2 rounded-lg bg-[#563cdf] text-white text-xs font-medium hover:bg-[#563cdf]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-w-[100px]"
            >
              {joinMutation.isPending ? (
                <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowRightIcon className="w-3.5 h-3.5" />
              )}
              Join
            </button>
          </form>
        )}
      </div>

      {/* LIST BODY */}
      <div className="px-5 pb-5 flex flex-col max-h-[310px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
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
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#232329]/20 border border-[#2a2538] hover:border-[#3b3350] transition-colors"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#232329] border border-[#3b3350] flex items-center justify-center">
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
          <div className="flex flex-col items-center justify-center flex-grow text-center">
            <div className="w-12 h-12 mb-3 bg-[#232329] border border-[#3b3350] rounded-xl flex items-center justify-center">
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