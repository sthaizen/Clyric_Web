import { Code2Icon, LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problem.js";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative bg-[#1b1b1f] border border-[#231c2f] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#231c2f] flex items-center justify-between bg-[#1b1b1f]/80">
          <h3 className="font-bold text-lg text-white">Create New Session</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#231c2f] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Select Problem <span className="text-rose-500">*</span>
            </label>

            <select
              className="w-full bg-[#111113] border border-[#231c2f] text-gray-200 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow appearance-none cursor-pointer"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled className="text-gray-500">
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title} className="bg-[#1b1b1f] text-gray-200">
                  {problem.title} ({problem.difficulty.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {roomConfig.problem && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 animate-in slide-in-from-top-2 duration-200">
              <Code2Icon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-indigo-300 mb-1">Room Summary</p>
                <div className="text-gray-300 space-y-1">
                  <p>Problem: <span className="font-medium text-white">{roomConfig.problem}</span></p>
                  <p>Format: <span className="font-medium text-white">1-on-1 Collaborative</span></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#231c2f] bg-[#111113]/50 flex items-center justify-end gap-3">
          <button 
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#231c2f] transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="w-4 h-4 animate-spin" />
            ) : (
              <PlusIcon className="w-4 h-4" />
            )}
            {isCreating ? "Creating..." : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;