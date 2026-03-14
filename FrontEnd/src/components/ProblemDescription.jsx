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
import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";

function ProblemDescription({ problem, currentProblemId }) {
  const [activeTab, setActiveTab] = useState("Description");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (currentProblemId) {
      const savedNotes = localStorage.getItem(`notes_${currentProblemId}`);
      setNotes(savedNotes || "");
    } else {
      setNotes("");
    }
  }, [currentProblemId]);

  const handleNotesChange = (content) => {
    setNotes(content);
    if (currentProblemId) {
      localStorage.setItem(`notes_${currentProblemId}`, content);
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
          background: transparent;
          border: none;
          border-bottom: 1px solid #3e3e42;
          padding: 12px;
          border-radius: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
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
          padding: 24px;
          font-size: 15px;
          line-height: 1.6;
          min-height: 100%;
          overflow-y: auto;
        }
        .quill-dark-theme .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        .quill-dark-theme .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .quill-dark-theme .ql-editor::-webkit-scrollbar-thumb {
          background-color: #3e3e42;
          border-radius: 20px;
        }
        .quill-dark-theme .ql-toolbar button {
          border-radius: 6px;
          transition: all 0.2s ease;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quill-dark-theme .ql-toolbar button:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .quill-dark-theme .ql-toolbar button.ql-active {
          background: rgba(44, 187, 93, 0.1);
        }
        .quill-dark-theme .ql-stroke {
          stroke: #9ca3af;
          transition: stroke 0.2s ease;
        }
        .quill-dark-theme .ql-fill {
          fill: #9ca3af;
          transition: fill 0.2s ease;
        }
        .quill-dark-theme .ql-toolbar button:hover .ql-stroke,
        .quill-dark-theme .ql-toolbar button.ql-active .ql-stroke {
          stroke: #e5e7eb;
        }
        .quill-dark-theme .ql-toolbar button.ql-active .ql-stroke {
          stroke: #2cbb5d;
        }
        .quill-dark-theme .ql-toolbar button:hover .ql-fill,
        .quill-dark-theme .ql-toolbar button.ql-active .ql-fill {
          fill: #e5e7eb;
        }
        .quill-dark-theme .ql-toolbar button.ql-active .ql-fill {
          fill: #2cbb5d;
        }
        .quill-dark-theme .ql-picker {
          color: #9ca3af;
        }
        .quill-dark-theme .ql-picker-label {
          border-radius: 6px;
          transition: all 0.2s ease;
          padding-left: 8px;
        }
        .quill-dark-theme .ql-picker-label:hover {
          color: #e5e7eb;
          background: rgba(255, 255, 255, 0.05);
        }
        .quill-dark-theme .ql-picker-label:hover .ql-stroke {
          stroke: #e5e7eb;
        }
        .quill-dark-theme .ql-picker-options {
          background-color: #1b1b1f;
          border: 1px solid #3e3e42;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          padding: 4px;
          margin-top: 4px;
        }
        .quill-dark-theme .ql-picker-item {
          color: #9ca3af;
          border-radius: 4px;
          padding: 6px 10px;
          transition: all 0.2s ease;
        }
        .quill-dark-theme .ql-picker-item:hover {
          color: #fff;
          background: rgba(44, 187, 93, 0.1);
        }
        .quill-dark-theme .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          border-color: #3e3e42;
        }
        .quill-dark-theme .ql-tooltip {
          background-color: #1b1b1f;
          border: 1px solid #3e3e42;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          color: #e5e7eb;
          padding: 8px 12px;
        }
        .quill-dark-theme .ql-tooltip input[type=text] {
          background: #111113;
          border: 1px solid #3e3e42;
          border-radius: 4px;
          color: white;
          padding: 4px 8px;
        }
        .quill-dark-theme .ql-tooltip input[type=text]:focus {
          border-color: #2cbb5d;
          outline: none;
        }
        .quill-dark-theme .ql-editor.ql-blank::before {
          color: #6b7280;
          font-style: normal;
        }
      `}</style>

      <div className="flex items-center bg-[#1b1b1f] border-b border-[#111113] text-[13px] font-medium text-gray-400 overflow-x-auto select-none shrink-0">
        <div
          onClick={() => setActiveTab("Description")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${
            activeTab === "Description"
              ? "text-white bg-[#111113] border-b-2 border-b-[#2cbb5d]"
              : "hover:text-gray-200 border-b-2 border-b-transparent"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" /> Description
        </div>

        <div
          onClick={() => setActiveTab("Editorial")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${
            activeTab === "Editorial"
              ? "text-white bg-[#111113] border-b-2 border-b-[#2cbb5d]"
              : "hover:text-gray-200 border-b-2 border-b-transparent"
          }`}
        >
          <BookOpen className="w-4 h-4 text-yellow-500" /> Editorial
        </div>

        <div
          onClick={() => setActiveTab("Solutions")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${
            activeTab === "Solutions"
              ? "text-white bg-[#111113] border-b-2 border-b-[#2cbb5d]"
              : "hover:text-gray-200 border-b-2 border-b-transparent"
          }`}
        >
          <FlaskConical className="w-4 h-4 text-blue-500" /> Solutions
        </div>

        <div
          onClick={() => setActiveTab("Submissions")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${
            activeTab === "Submissions"
              ? "text-white bg-[#111113] border-b-2 border-b-[#2cbb5d]"
              : "hover:text-gray-200 border-b-2 border-b-transparent"
          }`}
        >
          <History className="w-4 h-4" /> Submissions
        </div>

        <div
          onClick={() => setActiveTab("Notes")}
          className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer transition-colors ${
            activeTab === "Notes"
              ? "text-white bg-[#111113] border-b-2 border-b-[#2cbb5d]"
              : "hover:text-gray-200 border-b-2 border-b-transparent"
          }`}
        >
          <PenLine className="w-4 h-4 text-purple-400" /> Notes
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
              {["Topics", "Companies", "Hint 1", "Hint 2", "Hint 3", "Similar Questions"].map((item) => (
                <div
                  key={item}
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
          <div className="p-0 h-full flex flex-col min-h-0 relative bg-[#111113]">
            <div className="px-6 py-4 border-b border-[#111113] bg-[#1b1b1f] flex items-center justify-between shadow-sm z-10">
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-[#2cbb5d]" />
                  Personal Notes
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  Auto-saved to your local workspace.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-[#3e3e42]/40 text-gray-400 px-2 py-1 rounded border border-[#3e3e42]/50">
                  {problem.title}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col quill-dark-theme overflow-hidden">
              <ReactQuill
                key={`quill-${currentProblemId}`}
                theme="snow"
                value={notes}
                onChange={handleNotesChange}
                className="h-full flex flex-col"
                placeholder="Start typing your thoughts, approach, or edge cases here..."
              />
            </div>
          </div>
        )}

        {activeTab !== "Description" && activeTab !== "Notes" && (
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