import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu, Grid, Settings, Info, Play, Upload, Maximize2, Shuffle, X, Sparkles } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function LeetCodeUI() {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [language, setLanguage] = useState('python');
  const [testOutput, setTestOutput] = useState('You must run your code first');
  const [activeTab, setActiveTab] = useState('testcase');
  const [testCase, setTestCase] = useState('nums = [2,7,11,15]\ntarget = 9');
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const defaultCode = {
    python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

        `,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`
  };

  useEffect(() => {
    // Load Monaco Editor
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.require.config({ 
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } 
      });
      
      window.require(['vs/editor/editor.main'], function() {
        if (editorRef.current && !monacoRef.current) {
          monacoRef.current = window.monaco.editor.create(editorRef.current, {
            value: defaultCode[language],
            language: language,
            theme: 'vs-dark',
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          });
        }
      });
    };

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
        monacoRef.current = null;
      }
    };
  }, []);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    if (monacoRef.current && window.monaco) {
      const model = monacoRef.current.getModel();
      window.monaco.editor.setModelLanguage(model, newLang);
      monacoRef.current.setValue(defaultCode[newLang]);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab('result');
    
    // Simulate code execution
    setTimeout(() => {
      const code = monacoRef.current ? monacoRef.current.getValue() : '';
      
      // Simple simulation - check if code has some content
      if (code.trim().length > 50) {
        setTestOutput(`Accepted

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Expected: [0,1]

Runtime: 45 ms
Memory: 15.2 MB`);
      } else {
        setTestOutput(`Error: Solution is incomplete

Please implement the twoSum function.`);
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    setActiveTab('result');
    
    // Simulate submission
    setTimeout(() => {
      const code = monacoRef.current ? monacoRef.current.getValue() : '';
      
      if (code.trim().length > 50) {
        setTestOutput(`✓ Accepted

Runtime: 45 ms (Beats 85.2% of users)
Memory: 15.2 MB (Beats 78.9% of users)

All test cases passed!
- 63/63 test cases passed
- Total time: 847 ms`);
      } else {
        setTestOutput(`✗ Wrong Answer

Test case failed:
Input: nums = [2,7,11,15], target = 9
Output: null
Expected: [0,1]`);
      }
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-gray-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-700 bg-[#262626]">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button 
          onClick={() => navigate("/")}
          className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <ChevronLeft size={20} />
          </button>
          
          <button className="flex items-center gap-2 px-2 py-1 text-gray-400 hover:text-gray-200 transition-colors">
            <Menu size={16} />
            <span className="text-sm">Problem List</span>
          </button>

          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <ChevronLeft size={18} />
          </button>

          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <ChevronRight size={18} />
          </button>

          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <Shuffle size={18} />
          </button>
        </div>

        {/* Center */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <Grid size={18} />
          </button>

          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="p-2 bg-gray-700 rounded text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <Play size={18} />
          </button>

          <button 
            onClick={handleSubmit}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium text-sm disabled:opacity-50"
          >
            <Upload size={16} />
            Submit
          </button>

          <button className="p-2 bg-gray-700 rounded text-gray-300 hover:bg-gray-600 transition-colors">
            <X size={18} />
          </button>

          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <Sparkles size={18} />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <Grid size={18} />
          </button>

          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors">
            <Settings size={18} />
          </button>

          <button className="p-1.5 text-blue-400 hover:text-blue-300 transition-colors">
            <Info size={18} />
          </button>

          <span className="text-sm text-gray-400">Register</span>
          <span className="text-sm text-gray-600">or</span>
          <span className="text-sm text-gray-400">Log in</span>
          <span className="text-sm text-yellow-500 font-medium ml-1">Premium</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden transparent-scrollbar">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex items-center px-4 py-2 border-b border-gray-700 bg-[#1e1e1e] gap-4 text-sm">
            <button className="text-white border-b-2 border-white pb-2">Description</button>
            <button className="text-gray-400 hover:text-gray-200 pb-2">Editorial</button>
            <button className="text-gray-400 hover:text-gray-200 pb-2">Solutions</button>
            <button className="text-gray-400 hover:text-gray-200 pb-2">Submissions</button>
          </div>

          {/* Problem Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">1. Two Sum</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">Easy</span>
              <span className="text-gray-400 text-xs flex items-center gap-1">
                 Topics
              </span>
              <span className="text-gray-400 text-xs flex items-center gap-1">
                 Companies
              </span>
              <span className="text-gray-400 text-xs flex items-center gap-1">
                 Hint
              </span>
            </div>

            <div className="text-sm leading-relaxed space-y-4">
              <p>
                Given an array of integers <code className="bg-gray-800 px-1 py-0.5 rounded text-orange-400">nums</code> and an integer <code className="bg-gray-800 px-1 py-0.5 rounded text-orange-400">target</code>, return <em>indices of the two numbers such that they add up to</em> <code className="bg-gray-800 px-1 py-0.5 rounded text-orange-400">target</code>.
              </p>

              <p>
                You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
              </p>

              <p>You can return the answer in any order.</p>

              <div className="mt-6">
                <p className="font-semibold mb-2">Example 1:</p>
                <div className="bg-[#262626] p-4 rounded border border-gray-700 font-mono text-xs">
                  <div><strong>Input:</strong> nums = [2,7,11,15], target = 9</div>
                  <div className="mt-1"><strong>Output:</strong> [0,1]</div>
                  <div className="mt-1"><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-semibold mb-2">Example 2:</p>
                <div className="bg-[#262626] p-4 rounded border border-gray-700 font-mono text-xs">
                  <div><strong>Input:</strong> nums = [3,2,4], target = 6</div>
                  <div className="mt-1"><strong>Output:</strong> [1,2]</div>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-semibold mb-2">Example 3:</p>
                <div className="bg-[#262626] p-4 rounded border border-gray-700 font-mono text-xs">
                  <div><strong>Input:</strong> nums = [3,3], target = 6</div>
                  <div className="mt-1"><strong>Output:</strong> [0,1]</div>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-semibold mb-2">Constraints:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-300">
                  <li>2 &lt;= nums.length &lt;= 10<sup>4</sup></li>
                  <li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
                  <li>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></li>
                  <li><strong>Only one valid answer exists.</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-700 bg-[#1e1e1e] text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                👍 <span>0</span>
              </span>
              <span className="flex items-center gap-1">
                👎
              </span>
              <span className="flex items-center gap-1">
                💬 <span>0</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                0 Online
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Code Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#262626]">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span className="text-sm">Code</span>
            </div>
            <button className="text-gray-400 hover:text-gray-200">
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#1e1e1e] text-xs">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-[#262626] text-gray-300 px-2 py-1 rounded border border-gray-600 cursor-pointer"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <span className="text-gray-500">Auto</span>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 bg-[#1e1e1e]">
            <div ref={editorRef} className="h-full w-full"></div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 bg-[#1e1e1e]">
            {/* Saved Status */}
            <div className="px-4 py-2 bg-[#262626] text-xs text-gray-400 flex items-center justify-between">
              <span>Saved</span>
              <span>Ln 5, Col 26</span>
            </div>



            {/* Test Results Tabs */}
            <div className="flex items-center px-4 py-2 border-t border-gray-700 text-xs gap-4">
              <button 
                onClick={() => setActiveTab('testcase')}
                className={`pb-2 ${activeTab === 'testcase' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Testcase
              </button>
              <button 
                onClick={() => setActiveTab('result')}
                className={`pb-2 ${activeTab === 'result' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Test Result
              </button>
            </div>

            {/* Test Area */}
            {activeTab === 'testcase' ? (
              <div className="p-4">
                <div className="text-xs text-gray-400 mb-2">Case 1</div>
                <textarea
                  value={testCase}
                  onChange={(e) => setTestCase(e.target.value)}
                  className="w-full h-24 bg-[#262626] text-gray-200 p-3 rounded border border-gray-700 font-mono text-xs resize-none focus:outline-none focus:border-gray-600"
                  placeholder="Enter test case..."
                />
              </div>
            ) : (
              <div className="px-4 py-6">
                {isRunning ? (
                  <div className="text-center text-gray-400 text-sm">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                    <div>Running code...</div>
                  </div>
                ) : (
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {testOutput}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}