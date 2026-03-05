import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Menu, Lock } from 'lucide-react';

const CodeMasterUI = () => {
  const [activeTab, setActiveTab] = useState('All Topics');
  
  const problems = [
    { id: 1, name: 'Array Sum Calculator', acceptance: '56.7%', difficulty: 'Easy', locked: true },
    { id: 2, name: 'Linked List Addition', acceptance: '47.5%', difficulty: 'Med.', locked: true },
    { id: 3, name: 'Unique Character Finder', acceptance: '38.1%', difficulty: 'Med.', locked: true },
    { id: 4, name: 'Binary Array Median', acceptance: '45.4%', difficulty: 'Hard', locked: true },
    { id: 5, name: 'Palindrome Sequence', acceptance: '37.0%', difficulty: 'Med.', locked: true },
    { id: 6, name: 'Pattern Converter', acceptance: '53.1%', difficulty: 'Med.', locked: true },
    { id: 7, name: 'Number Reversal', acceptance: '31.2%', difficulty: 'Med.', locked: true },
    { id: 8, name: 'String Parser', acceptance: '20.3%', difficulty: 'Med.', locked: true },
    { id: 9, name: 'Palindrome Validator', acceptance: '60.0%', difficulty: 'Easy', locked: true },
    { id: 10, name: 'Pattern Matcher', acceptance: '30.1%', difficulty: 'Hard', locked: true },
  ];

  const companies = [
    { name: 'Google', count: 2181 },
    { name: 'Amazon', count: 1911 },
    { name: 'Uber', count: 413 },
    { name: 'Meta', count: 1341 },
    
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      {/* <header className="bg-[#282828] border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-sm">CM</div>
              <span className="font-bold text-lg">CodeMaster</span>
            </div>
            <nav className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white">Explore</a>
              <a href="#" className="text-white border-b-2 border-white pb-3">Challenges</a>
              <a href="#" className="text-gray-300 hover:text-white">Compete</a>
              <a href="#" className="text-gray-300 hover:text-white">Community</a>
              <a href="#" className="text-gray-300 hover:text-white">Prepare</a>
              <a href="#" className="text-gray-300 hover:text-white">Shop</a>
            </nav>
            <div className="flex space-x-2">
              <div className="text-2xl">❄️</div>
              <div className="text-2xl">❄️</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[#1a1a1a] border border-gray-600 rounded pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-gray-500"
              />
            </div>
            <span className="text-sm text-gray-300">Register</span>
            <span className="text-sm text-gray-300">or</span>
            <span className="text-sm text-gray-300">Log in</span>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded text-sm font-medium">Premium</button>
          </div>
        </div>
      </header> */}

      <div className="flex max-w-screen-3xl mx-auto">
        {/* Sidebar */}
        <aside className="w-56 bg-[#262626] border-r border-gray-700 min-h-screen p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <Menu className="w-5 h-5" />
              <span>Library</span>
            </div>
            <div className="flex items-center justify-between bg-[#1a1a1a] rounded px-3 py-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm"> Quest</span>
              </div>
              <span className="bg-blue-500 text-xs px-2 py-0.5 rounded">New</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-2">
              <span className="text-sm"> Learning Path</span>
            </div>
            <div className="border-t border-gray-700 pt-4 text-sm text-gray-400">
              <p>Sign in to view lists and track progress.</p>
              <button className="mt-3 w-full border border-gray-600 rounded px-4 py-2 text-white hover:bg-gray-700">
                Sign in
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Hero Cards */}
          {/* <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl opacity-20">❄️</div>
              <h2 className="text-3xl font-bold mb-1">2025</h2>
              <p className="text-sm text-purple-200 mb-4">Year in<br/>Review</p>
              <button className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
                ▶ View Highlights
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 relative">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">NEW</span>
              <h3 className="text-black font-bold mt-2 mb-1">Quest</h3>
              <p className="text-gray-600 text-xs mb-4">Turn coding practice into an<br/>epic adventure</p>
              <button className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
                ⚔️ Begin Now
              </button>
              <div className="absolute bottom-4 right-4 text-4xl">🎁</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6">
              <h3 className="text-white font-bold mb-1">JavaScript</h3>
              <p className="text-orange-100 text-xs mb-1">30 Days Challenge</p>
              <p className="text-orange-200 text-xs mb-4">Beginner Friendly</p>
              <button className="bg-white text-orange-600 px-4 py-2 rounded text-sm font-medium hover:bg-orange-50">
                Start Learning
              </button>
              <div className="mt-2 text-white text-sm font-bold">DAY<br/>30</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6">
              <h3 className="text-white font-bold text-xl mb-2">Top Interview<br/>Questions</h3>
              <button className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-blue-50">
                Get Started
              </button>
            </div>
          </div> */}

          {/* Topics Bar */}
          <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
            <div className="text-gray-400 text-sm space-x-4 flex">
              <span>Array <span className="text-gray-600">2070</span></span>
              <span>String <span className="text-gray-600">838</span></span>
              <span>Hash Table <span className="text-gray-600">766</span></span>
              <span>Math <span className="text-gray-600">644</span></span>
              <span>Dynamic Programming <span className="text-gray-600">633</span></span>
              <span>Sorting <span className="text-gray-600">492</span></span>
              <span>Greedy <span className="text-gray-600">451</span></span>
              <span>Depth-First Search <span className="text-gray-600">332</span></span>
              <span>Binary... <span className="text-gray-600">Expand</span></span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mb-6">
            {['All Topics', 'Algorithms', 'Database', 'Shell', 'Concurrency', 'JavaScript', 'pandas'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeTab === tab 
                    ? 'bg-white text-black' 
                    : 'bg-[#2d2d2d] text-gray-300 hover:bg-[#383838]'
                }`}
              >
                {tab === 'All Topics' && ' '}
                {tab === 'Algorithms' && ' '}
                {tab === 'Database' && ' '}
                {tab === 'Shell' && ' '}
                {tab === 'Concurrency' && ' '}
                {tab === 'JavaScript' && ' '}
                {tab === 'pandas' && ' '}
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search challenges" 
                className="bg-[#2d2d2d] border border-gray-600 rounded pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:border-gray-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">0/3792 Solved</span>
            </div>
          </div>

          {/* Problems List */}
          <div className="bg-[#262626] rounded-lg overflow-hidden">
            <div className="border-b border-gray-700 p-4 bg-[#2d2d2d]">
              <div className="flex items-center text-blue-400">
                <span className="text-sm"> Questions</span>
              </div>
            </div>
            
            {problems.map((problem, idx) => (
              <div 
                key={idx}
                className="border-b border-gray-700 px-4 py-3 hover:bg-[#2d2d2d] cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-gray-400 text-sm w-8">{problem.id}.</span>
                  <span className="text-white text-sm flex-1">{problem.name}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-gray-400 text-sm w-16 text-right">{problem.acceptance}</span>
                  <span className={`text-sm w-12 text-right ${
                    problem.difficulty === 'Easy' ? 'text-green-400' : 
                    problem.difficulty === 'Med.' ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                  {problem.locked && <Lock className="w-4 h-4 text-gray-500" />}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-[#262626] border-l border-gray-700 p-4">
          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Day 29</span>
              <span className="text-xs text-gray-400">(+4:45 GMT)</span>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3">
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                <div className="text-gray-500">S</div>
                <div className="text-gray-500">M</div>
                <div className="text-gray-500">T</div>
                <div className="text-gray-500">W</div>
                <div className="text-gray-500">T</div>
                <div className="text-gray-500">F</div>
                <div className="text-gray-500">S</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {[...Array(31)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`p-1 rounded ${
                      i + 1 === 29 ? 'bg-green-500 text-black font-bold' : 
                      'text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-yellow-500 text-sm"> Weekly Premium</span>
              <span className="text-xs text-gray-400">2 days left</span>
            </div>
            <div className="flex space-x-2 mt-2">
              {['W1', 'W2', 'W3', 'W4'].map((week, idx) => (
                <div key={week} className={`flex-1 text-center py-1 rounded text-xs ${
                  idx === 3 ? 'bg-yellow-500 text-black font-bold' : 'bg-[#1a1a1a] text-gray-400'
                }`}>
                  {week}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-green-400">● 0 Redeem</span>
              <span className="text-gray-400">Rules</span>
            </div>
          </div>

          {/* Trending Companies */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Trending Companies</h3>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-700 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for a company..." 
                className="bg-[#1a1a1a] border border-gray-600 rounded pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:border-gray-500"
              />
            </div>
            <div className="space-y-2">
              {companies.map((company, idx) => (
                <button 
                  key={idx}
                  className="bg-[#1a1a1a] hover:bg-[#2d2d2d] rounded px-3 py-2 text-sm flex items-center justify-between w-full"
                >
                  <span>{company.name}</span>
                  <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                    {company.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CodeMasterUI;