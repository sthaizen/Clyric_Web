import { useState } from "react";
import { CheckSquare, TerminalSquare, Code, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";

function OutputPanel({ output, sampleTestcase }) {
  const [activeTab, setActiveTab] = useState("testcase");

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "Accepted":
      case "Executed":
        return "text-green-500";
      case "Wrong Answer":
        return "text-red-500";
      case "Time Limit Exceeded":
        return "text-orange-500";
      case "Compile Error":
      case "Runtime Error":
      case "Internal Error":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case "Accepted":
      case "Executed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "Wrong Answer":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "Time Limit Exceeded":
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (output && activeTab === "testcase" && output.type !== "running" && output.type !== "submitting") {
    setActiveTab("result");
  }

  // Helper for UI display logic to mimic picture
  const splitInput = sampleTestcase?.input?.includes("target") 
     ? sampleTestcase.input.split("target") 
     : null;

  return (
    <div className="h-full flex flex-col bg-[#282828] text-gray-300 relative">
      
      {/* TABS HEADER */}
      <div className="flex items-center gap-6 px-4 bg-[#282828] border-b border-[#3e3e42] text-[13px]">
        <div 
          onClick={() => setActiveTab("testcase")}
          className={`flex items-center gap-2 py-3 cursor-pointer relative ${
            activeTab === "testcase" 
              ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white" 
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${activeTab === 'testcase' ? 'text-green-500' : ''}`} /> Testcase
        </div>
        <div 
          onClick={() => setActiveTab("result")}
          className={`flex items-center gap-2 py-3 cursor-pointer relative ${
            activeTab === "result" 
              ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white" 
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <TerminalSquare className={`w-4 h-4 ${activeTab === 'result' ? 'text-green-500' : ''}`} /> Test Result
        </div>
        {/* Output tab hidden generally in pure Leetcode unless active, but preserving function */}
        <div 
          onClick={() => setActiveTab("output")}
          className={`flex items-center gap-2 py-3 cursor-pointer relative ${
            activeTab === "output" 
              ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white" 
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Code className={`w-4 h-4 ${activeTab === 'output' ? 'text-purple-500' : ''}`} /> Output
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        
        {/* === TESTCASE TAB === */}
        {activeTab === "testcase" && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <button className="px-3 py-1.5 bg-[#3e3e42]/60 hover:bg-[#3e3e42] text-gray-200 text-xs font-medium rounded-lg transition-colors">
                Case 1
              </button>
              <button className="px-3 py-1.5 hover:bg-[#3e3e42] text-gray-400 text-xs font-medium rounded-lg transition-colors">
                Case 2
              </button>
              <button className="px-3 py-1.5 bg-[#3e3e42]/60 hover:bg-[#3e3e42] text-gray-200 text-xs font-medium rounded-lg transition-colors">
                Case 3
              </button>
              <button className="px-2 py-1 text-gray-400 hover:text-white">
                +
              </button>
            </div>

            <div className="space-y-4">
              {splitInput ? (
                <>
                  <div>
                    <div className="text-xs text-gray-400 mb-2">nums =</div>
                    <textarea 
                      className="w-full bg-[#3e3e42]/40 text-gray-300 text-[13px] font-mono p-3 rounded-lg border border-[#3e3e42]/50 resize-none outline-none"
                      value={splitInput[0].replace(/[^0-9,[\]-]/g, '')}
                      readOnly
                      rows={1}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-2">target =</div>
                    <textarea 
                      className="w-full bg-[#3e3e42]/40 text-gray-300 text-[13px] font-mono p-3 rounded-lg border border-[#3e3e42]/50 resize-none outline-none"
                      value={splitInput[1].replace(/[^0-9-]/g, '')}
                      readOnly
                      rows={1}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-xs text-gray-400 mb-2">Input Data:</div>
                  <textarea 
                    className="w-full bg-[#3e3e42]/40 text-gray-300 text-[13px] font-mono p-3 rounded-lg border border-[#3e3e42]/50 resize-none h-24 outline-none"
                    defaultValue={sampleTestcase?.input || ""}
                    readOnly
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* === RESULT TAB === */}
        {activeTab === "result" && (
          <div className="flex flex-col h-full">
            
            {/* Loading States */}
            {output?.type === "running" && <div className="text-gray-400 animate-pulse">Running Code...</div>}
            {output?.type === "submitting" && <div className="text-gray-400 animate-pulse">Judging Submission...</div>}
            
            {/* Empty State */}
            {!output && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                You must run your code first
              </div>
            )}

            {/* Results Display */}
            {output && output.type !== "running" && output.type !== "submitting" && (
              <div className="animate-in fade-in duration-300 flex flex-col gap-4">
                
                {/* Header: Verdict & Time */}
                <div className="flex items-center justify-between border-b border-[#3e3e42] pb-3">
                  <div className="flex items-center gap-2">
                    {getVerdictIcon(output.verdict)}
                    <span className={`text-lg font-bold ${getVerdictColor(output.verdict)}`}>
                      {output.verdict}
                    </span>
                  </div>
                  {output.executionTime !== undefined && (
                    <div className="text-xs text-gray-500">
                      Runtime: <span className="text-gray-300">{output.executionTime} ms</span>
                    </div>
                  )}
                </div>

                {/* Submissions showing TestCase progress */}
                {output.type === "submit" && output.totalTestCases > 0 && (
                  <div className="bg-[#3e3e42]/30 p-3 rounded-md border border-[#3e3e42]">
                    <div className="text-sm">
                      <span className="text-gray-400">Testcases Passed: </span>
                      <span className="font-bold text-white">{output.testCasesPassed}</span>
                      <span className="text-gray-400"> / {output.totalTestCases}</span>
                    </div>
                  </div>
                )}

                {/* Stdout / Stderr for RUN requests */}
                {output.type === "run" && (
                  <>
                    {output.compileError && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-red-400 mb-1">Compile Error:</div>
                        <pre className="text-sm font-mono text-red-400 bg-red-950/20 p-3 rounded-md whitespace-pre-wrap border border-red-900/50">
                          {output.compileError}
                        </pre>
                      </div>
                    )}
                    
                    {output.runtimeError && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-yellow-400 mb-1">Runtime Error:</div>
                        <pre className="text-sm font-mono text-yellow-400 bg-yellow-950/20 p-3 rounded-md whitespace-pre-wrap border border-yellow-900/50">
                          {output.runtimeError}
                        </pre>
                      </div>
                    )}

                    {(!output.compileError && !output.runtimeError) && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-400 mb-1">Stdout:</div>
                        <pre className="text-sm font-mono text-gray-200 bg-[#1e1e1e] p-3 rounded-md whitespace-pre-wrap border border-[#3e3e42] min-h-[40px]">
                          {output.stdout || "No output generated"}
                        </pre>
                      </div>
                    )}
                  </>
                )}

                {/* Detailed Results for Failed SUBMIT requests */}
                {output.type === "submit" && output.verdict === "Wrong Answer" && output.results && (
                  <div className="mt-2 space-y-4">
                    {output.results.filter(r => r.status === "Wrong Answer").map((res, i) => (
                      <div key={i} className="bg-[#1e1e1e] border border-red-900/50 rounded-md p-3">
                        <div className="text-sm font-semibold text-red-500 mb-3 border-b border-red-900/30 pb-2">
                          Failed on Testcase #{res.case}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Actual Output:</div>
                            <pre className="text-sm font-mono text-red-400 bg-[#282828] p-2 rounded whitespace-pre-wrap">
                              {res.actual || "Empty string"}
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Expected Output:</div>
                            <pre className="text-sm font-mono text-green-400 bg-[#282828] p-2 rounded whitespace-pre-wrap">
                              {res.expected}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Detailed Errors for Failed SUBMIT requests */}
                {output.type === "submit" && ['Compile Error', 'Runtime Error', 'Time Limit Exceeded'].includes(output.verdict) && (
                   <div className="mt-2">
                      <div className="text-xs font-medium text-yellow-400 mb-1">Execution Failure:</div>
                      <pre className="text-sm font-mono text-yellow-400 bg-yellow-950/20 p-3 rounded-md whitespace-pre-wrap border border-yellow-900/50">
                        {output.results?.find(r => r.status !== "Accepted")?.message || "Execution limits exceeded or compilation failed."}
                      </pre>
                    </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* === OUTPUT TAB === */}
        {activeTab === "output" && (
          <div className="flex flex-col h-full">
            {!output ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                Run or Submit code to see standard output here.
              </div>
            ) : output.type === "running" || output.type === "submitting" ? (
              <div className="text-gray-400 animate-pulse">Running Code...</div>
            ) : (
              <div className="animate-in fade-in duration-300 space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Standard Output:</div>
                  <pre className="text-sm font-mono text-gray-200 bg-[#1e1e1e] p-3 rounded-md whitespace-pre-wrap border border-[#3e3e42] min-h-[100px]">
                    {output.stdout || "No output generated"}
                  </pre>
                </div>
                {output.stderr && (
                  <div>
                    <div className="text-xs text-red-400 mb-1.5">Standard Error:</div>
                    <pre className="text-sm font-mono text-red-400 bg-red-950/20 p-3 rounded-md whitespace-pre-wrap border border-red-900/50 min-h-[40px]">
                      {output.stderr}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER SOURCE LINK */}
      <div className="px-4 py-2 border-t border-[#3e3e42] flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-white cursor-pointer transition-colors bg-[#282828] mt-auto">
        <Code className="w-4 h-4" /> Source
      </div>
      
    </div>
  );
}

export default OutputPanel;