import React from 'react';

const LANG_COLORS = {
  'JavaScript': 'bg-[#facc15]',
  'Python': 'bg-[#6366f1]',
  'Java': 'bg-[#f97316]',
  'C++': 'bg-[#4338ca]',
};

const ExecutionIntelligence = ({ languages = [], errors = {}, recentIncidents = [] }) => {
  const {
    wrongAnswer = 0,
    tle = 0,
    runtime = 0,
    compile = 0,
  } = errors;

  const displayLanguages = languages.length > 0 ? languages.slice(0, 3) : [
    { name: 'No data', percent: 0 }
  ];

  const incidents = [
    { label: 'WA', full: '(WRONG ANSWER)', value: wrongAnswer.toString(), borderColor: 'border-l-[#f87171]' },
    { label: 'TLE', full: '(TIME LIMIT)', value: tle.toString(), borderColor: 'border-l-[#facc15]' },
    { label: 'RE', full: '(RUNTIME ERROR)', value: runtime.toString(), borderColor: 'border-l-[#818cf8]' },
    { label: 'CE', full: '(COMPILATION)', value: compile.toString(), borderColor: 'border-l-[#9ca3af]' },
  ];

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getIncidentIcon = (verdict) => {
    if (verdict === 'Wrong Answer') return '●';
    if (verdict === 'Time Limit Exceeded') return '⌛';
    if (verdict === 'Runtime Error') return '⚠';
    if (verdict === 'Compile Error') return '⌨';
    return '•';
  };

  return (
    <div className="bg-[#1b1b1f] rounded-2xl p-6 flex flex-col h-full border border-[#2a2a35] shadow-sm overflow-hidden">
      <h3 className="text-[17px] font-bold text-gray-100 mb-8">Execution Intelligence</h3>

      <div className="mb-8">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">
          LANGUAGE USAGE
        </h4>
        <div className="flex flex-col gap-4">
          {displayLanguages.map(lang => (
            <div key={lang.name} className="flex flex-col gap-2">
              <div className="flex justify-between text-[12px] font-medium text-gray-300">
                <span>{lang.name}</span>
                <span>{lang.percent}%</span>
              </div>
              <div className="w-full flex items-center gap-1">
                <div className="h-1.5 bg-[#111113] rounded-full overflow-hidden flex-1">
                  <div className={`h-full ${LANG_COLORS[lang.name] || 'bg-[#6366f1]'} rounded-full`} style={{ width: `${lang.percent}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">
          INCIDENT SUMMARY
        </h4>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {incidents.map((inc) => (
            <div
              key={inc.label}
              className={`border border-[#2a2a35] border-l-[3px] ${inc.borderColor} bg-[#2a2b32]/10 rounded-xl px-3 py-2 flex flex-col justify-center`}
            >
              <div className="text-[9px] font-bold text-gray-400 tracking-wider mb-1">
                {inc.label} <span className="text-gray-500/70">{inc.full}</span>
              </div>
              <span className="text-[18px] font-bold text-gray-100">{inc.value}</span>
            </div>
          ))}
        </div>

        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          RECENT RUNTIME LOG
        </h4>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
          {/* Added .slice(0, 2) here to limit the display to 2 items */}
          {recentIncidents.length > 0 ? recentIncidents.slice(0, 2).map((inc, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#2a2a35]/50 last:border-0 group">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[10px] ${inc.verdict === 'Wrong Answer' ? 'text-red-400' :
                    inc.verdict === 'Time Limit Exceeded' ? 'text-yellow-400' :
                      'text-indigo-400'
                  }`}>
                  {getIncidentIcon(inc.verdict)}
                </span>
                <span className="text-[12px] text-gray-300 truncate font-medium group-hover:text-white transition-colors">
                  {inc.title}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                {formatTimeAgo(inc.date)}
              </span>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <span className="text-[11px] text-gray-500 italic">No recent incidents detected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionIntelligence;