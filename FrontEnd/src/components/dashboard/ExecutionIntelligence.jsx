import React from 'react';

const ExecutionIntelligence = () => {
  const languages = [
    { name: 'JavaScript', percent: 42, color: 'bg-[#facc15]' }, 
    { name: 'Python', percent: 35, color: 'bg-[#6366f1]' },     
    { name: 'C++', percent: 15, color: 'bg-[#4338ca]' },        
  ];

  const incidents = [
    { label: 'WA', full: '(WRONG ANSWER)', value: '212', borderColor: 'border-l-[#f87171]' }, 
    { label: 'TLE', full: '(TIME LIMIT)', value: '84', borderColor: 'border-l-[#facc15]' },   
    { label: 'RE', full: '(RUNTIME ERROR)', value: '45', borderColor: 'border-l-[#818cf8]' }, 
    { label: 'CE', full: '(COMPILATION)', value: '18', borderColor: 'border-l-[#9ca3af]' },   
  ];

  return (
    <div className="bg-[#1b1b1f] rounded-2xl p-6 flex flex-col h-full border border-[#2a2a35] shadow-sm">
      <h3 className="text-[17px] font-bold text-gray-100 mb-8">Execution Intelligence</h3>
      
      <div className="mb-10">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">
          LANGUAGE USAGE
        </h4>
        <div className="flex flex-col gap-4">
          {languages.map(lang => (
            <div key={lang.name} className="flex flex-col gap-2">
              <div className="flex justify-between text-[12px] font-medium text-gray-300">
                <span>{lang.name}</span>
                <span>{lang.percent}%</span>
              </div>
              <div className="w-full flex items-center gap-1">
                <div className="h-1.5 bg-[#111113] rounded-full overflow-hidden flex-1">
                  <div className={`h-full ${lang.color} rounded-full`} style={{ width: `${lang.percent}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">
          RUNTIME INCIDENT LOG
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {incidents.map((inc) => (
            <div 
              key={inc.label} 
              className={`border border-[#2a2a35] border-l-[3px] ${inc.borderColor} bg-[#2a2b32]/10 rounded-xl p-4 flex flex-col justify-center`}
            >
              <div className="text-[10px] font-bold text-gray-300 tracking-wider mb-2">
                {inc.label} <span className="text-gray-500">{inc.full}</span>
              </div>
              <span className="text-[22px] font-bold text-gray-100">{inc.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionIntelligence;