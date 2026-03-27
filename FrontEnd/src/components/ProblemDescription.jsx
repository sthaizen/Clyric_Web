import {
  FileText,
  BookOpen,
  FlaskConical,
  History,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Share,
  Lightbulb,
  ChevronDown,
  PenLine,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import SolutionsDiagramTab from "./SolutionsDiagramTab";
import SubmissionsTab from "./SubmissionsTab";
import DiscussionSection from "./DiscussionSection";
import NotesSection from "./NotesSection";
import { trackProblemEvent } from "../lib/api/analytics";
import { useAuth } from "@clerk/clerk-react";
import debounce from "lodash.debounce";

function ProblemDescription({ problem, currentProblemId }) {
  const [activeTab, setActiveTab] = useState("Description");
  const { userId } = useAuth();

  const handleHintClick = (hintIndex) => {
    if (userId && currentProblemId) {
      trackProblemEvent({
        userId,
        problemSlug: currentProblemId,
        actionType: "hint"
      });
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff?.toLowerCase() === "easy") return "text-[#00b8a3] bg-[#00b8a3]/10";
    if (diff?.toLowerCase() === "medium") return "text-[#ffc01e] bg-[#ffc01e]/10";
    if (diff?.toLowerCase() === "hard") return "text-[#ff375f] bg-[#ff375f]/10";
    return "text-[#00b8a3] bg-[#00b8a3]/10";
  };

  if (!problem) {
    return (
      <div className="h-full flex flex-col bg-[#1b1b1f] text-gray-300">
        <div className="flex items-center bg-[#1b1b1f] border-b border-[#111113] text-[13px] font-medium text-gray-400 overflow-x-auto select-none shrink-0">
          <div className="flex items-center gap-1.5 px-4 py-2 text-white bg-[#111113] border-b-2 border-b-[#2cbb5d]">
            <FileText className="w-4 h-4 text-blue-400" /> Description
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center text-gray-400">
          No problem selected.
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-[#1b1b1f] border-t border-[#111113] text-xs text-gray-400 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5" /> 68K
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsDown className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> 1.9K
            </div>
            <Star className="w-3.5 h-3.5" />
            <Share className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> 2224 Online
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1b1b1f] text-gray-300">
      <style>{`
        .quill-dark-theme .ql-toolbar {
          background: #1e1e24;
          border: 1px solid #28282c;
          border-radius: 12px;
          padding: 8px 12px;
          margin: 12px 24px 0 24px;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .quill-dark-theme .ql-toolbar::-webkit-scrollbar {
          display: none;
        }
        .quill-dark-theme .ql-container {
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 15px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .quill-dark-theme .ql-editor {
          flex-grow: 1;
          color: #e5e7eb;
          padding: 24px 32px;
          font-size: 15px;
          line-height: 1.7;
          min-height: 100%;
          overflow-y: auto;
        }
        /* Custom formatting for headings */
        .quill-dark-theme .ql-editor h1 { font-size: 1.8em; margin-bottom: 0.5em; color: #fff; font-weight: 700; }
        .quill-dark-theme .ql-editor h2 { font-size: 1.5em; margin-bottom: 0.4em; color: #fff; font-weight: 600; }
        .quill-dark-theme .ql-editor h3 { font-size: 1.3em; margin-bottom: 0.3em; color: #fff; font-weight: 600; }
        
        .quill-dark-theme .ql-editor::-webkit-scrollbar {
          width: 6px;
        }
        .quill-dark-theme .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .quill-dark-theme .ql-editor::-webkit-scrollbar-thumb {
          background-color: #28282c;
          border-radius: 20px;
        }
        .quill-dark-theme .ql-toolbar button {
          border-radius: 8px;
          transition: all 0.2s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }
        .quill-dark-theme .ql-toolbar button:hover {
          background: rgba(44, 187, 93, 0.08);
          color: #2cbb5d;
        }
        .quill-dark-theme .ql-toolbar button.ql-active {
          background: rgba(44, 187, 93, 0.1);
          color: #2cbb5d;
        }
        .quill-dark-theme .ql-stroke {
          stroke: currentColor;
          transition: stroke 0.2s ease;
          stroke-width: 2;
        }
        .quill-dark-theme .ql-fill {
          fill: currentColor;
          transition: fill 0.2s ease;
        }
        .quill-dark-theme .ql-picker {
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
        }
        .quill-dark-theme .ql-picker-label {
          border-radius: 8px;
          transition: all 0.2s ease;
          padding: 0 10px;
          display: flex;
          align-items: center;
          height: 32px;
          border: 1px solid transparent;
        }
        .quill-dark-theme .ql-picker-label:hover {
          color: #2cbb5d;
          background: rgba(44, 187, 93, 0.08);
        }
        .quill-dark-theme .ql-picker-options {
          background-color: #1e1e24;
          border: 1px solid #28282c;
          border-radius: 10px;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.7);
          padding: 6px;
          margin-top: 8px;
        }
        .quill-dark-theme .ql-picker-item {
          color: #9ca3af;
          border-radius: 6px;
          padding: 8px 12px;
          transition: all 0.2s ease;
        }
        .quill-dark-theme .ql-picker-item:hover {
          color: #fff;
          background: rgba(44, 187, 93, 0.15);
        }
        .quill-dark-theme .ql-tooltip {
          background-color: #1e1e24;
          border: 1px solid #28282c;
          border-radius: 10px;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.7);
          color: #e5e7eb;
          padding: 10px;
        }
        .quill-dark-theme .ql-editor.ql-blank::before {
          color: #4b5563;
          font-style: normal;
          left: 32px;
        }
      `}</style>

      <div className="flex items-center bg-[#1b1b1f] border-b border-[#111113] text-[13px] font-medium text-gray-400 overflow-x-auto select-none shrink-0">
        <div
          onClick={() => setActiveTab("Description")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${activeTab === "Description"
            ? "text-white bg-[#111113] border-b-2 border-b-[#2cbb5d]"
            : "hover:text-gray-200 border-b-2 border-b-transparent"
            }`}
        >
          <FileText className="w-4 h-4 text-blue-400" /> Description
        </div>

        <div
          onClick={() => setActiveTab("Solutions")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${activeTab === "Solutions"
            ? "text-white bg-[#151519] border-b-2 border-b-[#2cbb5d]"
            : "hover:text-gray-200 border-b-2 border-b-transparent"
            }`}
        >
          <FlaskConical className="w-4 h-4 text-blue-500" /> Visualizer
        </div>

        <div
          onClick={() => setActiveTab("Notes")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${activeTab === "Notes"
            ? "text-white bg-[#151519] border-b-2 border-b-[#2cbb5d]"
            : "hover:text-gray-200 border-b-2 border-b-transparent"
            }`}
        >
          <PenLine className="w-4 h-4 text-purple-400" /> Notes
        </div>

        <div
          onClick={() => setActiveTab("Discussion")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${activeTab === "Discussion"
            ? "text-white bg-[#151519] border-b-2 border-b-[#2cbb5d]"
            : "hover:text-gray-200 border-b-2 border-b-transparent"
            }`}
        >
          <MessageSquare className="w-4 h-4 text-green-400" /> Discussion
        </div>

        <div
          onClick={() => setActiveTab("Submissions")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${activeTab === "Submissions"
            ? "text-white bg-[#151519] border-b-2 border-b-[#2cbb5d]"
            : "hover:text-gray-200 border-b-2 border-b-transparent"
            }`}
        >
          <History className="w-4 h-4" /> Submissions
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full flex flex-col">
        {activeTab === "Description" && (
          <div className="p-5">
            <h1 className="text-xl font-bold text-white mb-3">{problem.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-medium">
              <span className={`${getDifficultyColor(problem.difficulty)} px-2.5 py-1 rounded-full`}>
                {problem.difficulty}
              </span>

              <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 hover:bg-[#8a6bfe]/20 bg-[#111113] px-2.5 py-1 rounded-full cursor-pointer transition-colors">
                Topics
              </span>

              <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 hover:bg-[#8a6bfe]/20 bg-[#111113] px-2.5 py-1 rounded-full cursor-pointer transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-orange-400" /> Companies
              </span>

              <span className="flex items-center gap-1 text-gray-400 hover:text-gray-300 hover:bg-[#8a6bfe]/20 bg-[#111113] px-2.5 py-1 rounded-full cursor-pointer transition-colors">
                <Lightbulb className="w-3.5 h-3.5" /> Hint
              </span>
            </div>

            <div className="space-y-4 text-sm leading-relaxed mb-8">
              <p>{problem.description?.text}</p>

              {problem.description?.notes?.map((note, idx) => (
                <p key={idx}>{note}</p>
              ))}
            </div>

            <div className="space-y-6 mb-8">
              {problem.examples?.map((example, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-white mb-3 text-sm">Example {idx + 1}:</p>

                  <div className="border-l-2 border-[#f1a120] bg-[#111113] px-3 py-2 ml-1 text-sm font-mono space-y-1.5 rounded-r-md">
                    <div>
                      <span className="font-bold text-white">Input:</span> {example.input}
                    </div>

                    <div>
                      <span className="font-bold text-white">Output:</span> {example.output}
                    </div>

                    {example.explanation && (
                      <div>
                        <span className="font-bold text-white">Explanation:</span> {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <p className="font-semibold text-white mb-2 text-sm">Constraints:</p>

              <ul className="space-y-2 text-sm list-disc pl-5">
                {problem.constraints?.map((constraint, idx) => (
                  <li key={idx} className="marker:text-gray-500">
                    <code className="bg-[#111113] text-gray-300 px-1.5 py-0.5 rounded text-[13px]">
                      {constraint}
                    </code>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-sm border-b border-[#111113] pb-8 mb-4">
              <span className="font-bold text-white">Follow-up: </span>
              Can you come up with an algorithm that is less than{" "}
              <code className="bg-[#111113] text-gray-300 px-1.5 py-0.5 rounded text-[13px]">
                O(n<sup>2</sup>)
              </code>{" "}
              time complexity?
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-400 mb-6">
              <div>
                Accepted <span className="text-white font-semibold">20,957,464</span>
                <span className="text-gray-500 text-[10px]">/36.7M</span>
              </div>
              <div>
                Acceptance Rate <span className="text-white font-semibold">57.2%</span>
              </div>
            </div>

            <div className="space-y-0.5 border-t border-[#111113] pt-2">
              {["Topics", "Companies", "Hint 1", "Hint 2", "Hint 3", "Similar Questions"].map((item, idx) => (
                <div
                  key={item}
                  onClick={() => {
                    if (item.includes("Hint")) handleHintClick(idx);
                  }}
                  className="flex items-center justify-between py-2.5 text-sm hover:text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    {item === "Companies" ? (
                      <BookOpen className="w-4 h-4 text-orange-400" />
                    ) : item.includes("Hint") ? (
                      <Lightbulb className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    {item}
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}

              <div className="flex items-center justify-between py-2.5 text-sm hover:text-white cursor-pointer group">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Discussion (1.9K)
                </div>
                <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notes" && (
          <NotesSection problemId={currentProblemId} problemTitle={problem.title} />
        )}

        {activeTab === "Discussion" && (
          <DiscussionSection problemId={currentProblemId} problemTitle={problem.title} />
        )}

        {activeTab === "Solutions" && (
          <SolutionsDiagramTab currentProblemId={currentProblemId} problem={problem} />
        )}

        {activeTab === "Submissions" && (
          <SubmissionsTab problem={problem} />
        )}

        {activeTab !== "Description" && activeTab !== "Notes" && activeTab !== "Solutions" && activeTab !== "Submissions" && activeTab !== "Discussion" && (
          <div className="flex items-center justify-center p-5 text-gray-500 h-full">
            {activeTab} view not implemented.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-3 bg-[#1b1b1f] border-t border-[#111113] text-xs text-gray-400 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <ThumbsUp className="w-3.5 h-3.5" /> 68K
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <ThumbsDown className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <MessageSquare className="w-3.5 h-3.5" /> 1.9K
          </div>
          <Star className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          <Share className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> 2224 Online
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;