import { FileText, BookOpen, FlaskConical, History, ThumbsUp, ThumbsDown, MessageSquare, Star, Share, Lightbulb, ChevronDown } from "lucide-react";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  const getDifficultyColor = (diff) => {
    if (diff?.toLowerCase() === 'easy') return 'text-[#00b8a3] bg-[#00b8a3]/10';
    if (diff?.toLowerCase() === 'medium') return 'text-[#ffc01e] bg-[#ffc01e]/10';
    if (diff?.toLowerCase() === 'hard') return 'text-[#ff375f] bg-[#ff375f]/10';
    return 'text-[#00b8a3] bg-[#00b8a3]/10';
  };

  return (
    <div className="h-full flex flex-col bg-[#1b1b1f] text-gray-300">
      {/* TABS HEADER */}
      <div className="flex items-center bg-[#1b1b1f] border-b border-[#111113] text-[13px] font-medium text-gray-400 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-white px-4 py-2 bg-[#111113] border-t-2 border-t-transparent cursor-pointer">
          <FileText className="w-4 h-4 text-blue-400" /> Description
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 hover:text-gray-200 cursor-pointer">
          <BookOpen className="w-4 h-4 text-yellow-500" /> Editorial
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 hover:text-gray-200 cursor-pointer">
          <FlaskConical className="w-4 h-4 text-blue-500" /> Solutions
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 hover:text-gray-200 cursor-pointer">
          <History className="w-4 h-4" /> Submissions
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-5">
        
        {/* Title & Actions */}
        <h1 className="text-xl font-bold text-white mb-3">
           {problem.title}
        </h1>

        {/* Badges */}
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

        {/* Problem Description Text */}
        <div className="space-y-4 text-sm leading-relaxed mb-8">
          <p>{problem.description.text}</p>
          {problem.description.notes.map((note, idx) => (
            <p key={idx}>{note}</p>
          ))}
        </div>

        {/* Examples */}
        <div className="space-y-6 mb-8">
          {problem.examples.map((example, idx) => (
            <div key={idx}>
              <p className="font-semibold text-white mb-3 text-sm">Example {idx + 1}:</p>
              <div className="border-l-2 border-[#f1a120] bg-[#111113] px-3 py-2 ml-1 text-sm font-mono space-y-1.5 rounded-r-md">
                <div><span className="font-bold text-white">Input:</span> nums = {example.input.split("target")[0]}, target {example.input.split("target")[1]}</div>
                <div><span className="font-bold text-white">Output:</span> {example.output}</div>
                {example.explanation && (
                  <div><span className="font-bold text-white">Explanation:</span> {example.explanation}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="mb-8">
          <p className="font-semibold text-white mb-2 text-sm">Constraints:</p>
          <ul className="space-y-2 text-sm list-disc pl-5">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="marker:text-gray-500">
                <code className="bg-[#111113] text-gray-300 px-1.5 py-0.5 rounded text-[13px]">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow-up */}
        <div className="text-sm border-b border-[#111113] pb-8 mb-4">
          <span className="font-bold text-white">Follow-up: </span>
          Can you come up with an algorithm that is less than <code className="bg-[#111113] text-gray-300 px-1.5 py-0.5 rounded text-[13px]">O(n<sup>2</sup>)</code> time complexity?
        </div>

        {/* Footer Metrics & Accordions */}
        <div className="flex items-center gap-6 text-xs text-gray-400 mb-6">
          <div>Accepted <span className="text-white font-semibold">20,957,464</span><span className="text-gray-500 text-[10px]">/36.7M</span></div>
          <div>Acceptance Rate <span className="text-white font-semibold">57.2%</span></div>
        </div>

        <div className="space-y-0.5 border-t border-[#111113] pt-2">
           {[ "Topics", "Companies", "Hint 1", "Hint 2", "Hint 3", "Similar Questions"].map((item) => (
             <div key={item} className="flex items-center justify-between py-2.5 text-sm hover:text-white cursor-pointer group">
                <div className="flex items-center gap-2">
                  {item === "Companies" ? <BookOpen className="w-4 h-4 text-orange-400" /> : 
                   item.includes("Hint") ? <Lightbulb className="w-4 h-4" /> : 
                   <FileText className="w-4 h-4" />}
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

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1b1b1f] border-t border-[#111113] text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white"><ThumbsUp className="w-3.5 h-3.5" /> 68K</div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white"><ThumbsDown className="w-3.5 h-3.5" /></div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white"><MessageSquare className="w-3.5 h-3.5" /> 1.9K</div>
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