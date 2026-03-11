import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PROBLEMS } from '../data/problem';
import {
  Search, ChevronLeft, ChevronRight, LayoutList, CheckCircle2,
  Lock, Settings, Shuffle, ChevronDown, ArrowUpDown, SlidersHorizontal,
  Target, GraduationCap, User
} from 'lucide-react';

const COMPANIES = [
  { name: "Amazon", count: 1943 }, { name: "Uber", count: 372 },
  { name: "Google", count: 2229 }, { name: "Meta", count: 1388 },
  { name: "Bloomberg", count: 1176 }, { name: "Microsoft", count: 1356 },
  { name: "Apple", count: 346 }, { name: "LinkedIn", count: 180 },
  { name: "TikTok", count: 375 }, { name: "Oracle", count: 336 },
  { name: "Adobe", count: 196 }, { name: "Snap", count: 100 },
  { name: "Goldman Sachs", count: 283 }, { name: "Citadel", count: 95 },
  { name: "Salesforce", count: 193 }, { name: "tcs", count: 217 },
  { name: "Nvidia", count: 138 },
];

const CAL_DAYS = ['S','M','T','W','T','F','S'];

const calDays = [null, null, null, null, null, null, 1,
  2,3,4,5,6,7,8,9,10,11,12,13,14,15,
  16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

export default function LeetCodeClone() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState('All');

  const allProblems = Object.values(PROBLEMS);

  const dynamicTopics = useMemo(() => {
    const counts = allProblems.reduce((acc, prob) => {
      const cat = prob.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allProblems]);

  const counts = useMemo(() => ({
    Easy: allProblems.filter(p => p.difficulty === 'Easy').length,
    Medium: allProblems.filter(p => p.difficulty === 'Medium').length,
    Hard: allProblems.filter(p => p.difficulty === 'Hard').length,
  }), [allProblems]);

  const filteredProblems = useMemo(() => {
    return allProblems.filter((p) => {
      const matchesDiff = activeDifficulty === 'All' || p.difficulty === activeDifficulty;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [allProblems, activeDifficulty, searchQuery]);

  const diffColor = (d) =>
    d === 'Easy' ? '#00b8a3' : d === 'Medium' ? '#ffc01e' : d === 'Hard' ? '#ef4743' : '#9ca3af';

  const diffBg = (d) =>
    d === 'Easy' ? 'rgba(0,184,163,0.15)' : d === 'Medium' ? 'rgba(255,192,30,0.15)' : 'rgba(239,71,67,0.15)';

  const Bars = () => (
    <div style={{ display:'flex', alignItems:'flex-end', gap:2, height:14, opacity:0.55 }}>
      {[5,8,11,14].map((h,i) => (
        <div key={i} style={{ width:2, height:h, background:'#9ca3af', borderRadius:1 }}/>
      ))}
    </div>
  );

  const DIFF_TABS = [
    { id: 'All',    label: 'All Topics', count: allProblems.length },
    { id: 'Easy',   label: 'Easy',       count: counts.Easy },
    { id: 'Medium', label: 'Medium',     count: counts.Medium },
    { id: 'Hard',   label: 'Hard',       count: counts.Hard },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#1a1a1a', color:'#eff1f6', fontFamily:'"Segoe UI", system-ui, sans-serif', display:'flex', flexDirection:'column', fontSize:14 }}>

      {/* NAV */}
      <nav style={{ height:56, background:'#282828', borderBottom:'1px solid #3a3a3a', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', position:'sticky', top:0, zIndex:100, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginRight:20, cursor:'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
              <path d="M32 8L12 28l8 8 20-20-8-8z" fill="#ffa116"/>
              <path d="M20 36l-8-8-6 14 14-6z" fill="#ffa116"/>
            </svg>
            <span style={{ color:'#fff', fontWeight:700, fontSize:17, letterSpacing:'-0.2px' }}>Clyric</span>
          </div>
          {[
            { label:'Explore' },
            { label:'Problems', active:true },
            { label:'Contest' },
            { label:'Discuss' },
            { label:'Interview', caret:true },
            { label:'Store', caret:true, gold:true },
          ].map(({label, active, caret, gold}) => (
            <div key={label} style={{
              height:56, display:'flex', alignItems:'center', padding:'0 12px', cursor:'pointer',
              color: active ? '#fff' : gold ? '#ffa116' : '#9ca3af',
              borderBottom: active ? '2px solid #fff' : '2px solid transparent',
              fontSize:13.5, fontWeight: active ? 500 : 400, gap:4,
            }}>
              {label}{caret && <ChevronDown size={13}/>}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', background:'#3a3a3a', borderRadius:8, padding:'6px 12px', gap:8, width:200 }}>
            <Search size={14} color="#6b7280"/>
            <input placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', color:'#d1d5db', fontSize:13, width:'100%' }}/>
          </div>
          <span style={{ color:'#9ca3af', fontSize:13, cursor:'pointer' }}>Register</span>
          <span style={{ color:'#6b7280', fontSize:13 }}>or</span>
          <span style={{ color:'#9ca3af', fontSize:13, cursor:'pointer' }}>Log in</span>
          <button style={{ background:'#ffa116', color:'#000', border:'none', borderRadius:6, padding:'6px 14px', fontWeight:600, fontSize:13, cursor:'pointer' }}>
            Premium
          </button>
        </div>
      </nav>

      {/* BODY */}
      <div style={{ display:'flex', flex:1, maxWidth:1600, margin:'0 auto', width:'100%', overflow:'hidden' }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ width:200, borderRight:'1px solid #3a3a3a', padding:'16px 8px', display:'flex', flexDirection:'column', gap:2, flexShrink:0, overflowY:'auto' }}>
          {[
            { icon:<LayoutList size={16}/>, label:'Library', active:true },
            { icon:<Target size={16}/>, label:'Quest', badge:'New' },
            { icon:<GraduationCap size={16}/>, label:'Study Plan' },
          ].map(({icon, label, active, badge}) => (
            <button key={label} style={{
              display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:6,
              background: active ? '#3a3a3a' : 'transparent', border:'none', cursor:'pointer',
              color: active ? '#fff' : '#9ca3af', fontSize:13.5, fontWeight: active ? 500 : 400,
              justifyContent:'space-between', width:'100%'
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>{icon}{label}</div>
              {badge && <span style={{ background:'#2563eb', color:'#fff', fontSize:10, padding:'1px 6px', borderRadius:999, fontWeight:700 }}>{badge}</span>}
            </button>
          ))}
          <div style={{ marginTop:24, paddingTop:16, borderTop:'1px solid #3a3a3a', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <p style={{ color:'#6b7280', fontSize:12, textAlign:'center', lineHeight:1.5 }}>Sign in to view lists and track study progress.</p>
            <button style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', color:'#111', border:'none', borderRadius:999, padding:'7px 18px', fontWeight:600, fontSize:13, cursor:'pointer', width:'100%', justifyContent:'center' }}>
              <User size={15}/> Sign in
            </button>
          </div>
        </aside>

        {/* CENTER */}
        <main style={{ flex:1, padding:'20px 24px', overflowY:'auto', minWidth:0 }}>

          {/* Promo Banners */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
            {[
              'https://assets.leetcode.com/users/images/dba14729-0f89-4a5a-a181-b2a7ec1fb0ec_1772459043.341392.png',
              'https://assets.leetcode.com/users/images/942e9e91-7f81-4513-8544-c462980a5d3a_1738741032.3553998.png',
              'https://assets.leetcode.com/users/images/b0a08a5c-c575-48f6-9110-b6ae4e011e98_1655746322.579097.png',
              'https://assets.leetcode.com/users/images/49479bba-73b3-45d2-9272-99e773d784b2_1687290663.3168745.jpeg',
            ].map((src, i) => (
              <div key={i} style={{ height:110, borderRadius:12, overflow:'hidden', cursor:'pointer', transition:'transform 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              </div>
            ))}
          </div>

          {/* Topics row */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:18, fontSize:13, color:'#9ca3af' }}>
            {dynamicTopics.slice(0,8).map(t => (
              <span key={t.name} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                onMouseLeave={e=>e.currentTarget.style.color='#9ca3af'}>
                {t.name}
                <span style={{ background:'#282828', padding:'1px 7px', borderRadius:999, fontSize:11, color:'#6b7280' }}>{t.count}</span>
              </span>
            ))}
            {dynamicTopics.length > 8 && (
              <span style={{ color:'#6b7280', cursor:'pointer', display:'flex', alignItems:'center', gap:2 }}>
                Expand <ChevronDown size={13}/>
              </span>
            )}
          </div>

          {/* ── DIFFICULTY FILTER TABS ── */}
          <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
            {DIFF_TABS.map(tab => {
              const isAll = tab.id === 'All';
              const isActive = activeDifficulty === tab.id;
              const color = isAll ? null : diffColor(tab.id);
              const bg = isAll ? null : diffBg(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDifficulty(tab.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    padding:'7px 16px', borderRadius:999, cursor:'pointer',
                    fontSize:13, fontWeight: isActive ? 600 : 400,
                    transition:'all 0.15s',
                    border: isActive
                      ? (isAll ? 'none' : `1px solid ${color}`)
                      : '1px solid #3a3a3a',
                    background: isActive
                      ? (isAll ? '#fff' : bg)
                      : '#282828',
                    color: isActive
                      ? (isAll ? '#000' : color)
                      : (isAll ? '#d1d5db' : '#9ca3af'),
                  }}
                >
                  {!isAll && (
                    <span style={{
                      width:8, height:8, borderRadius:'50%',
                      background: isActive ? color : '#6b7280',
                      display:'inline-block', flexShrink:0,
                      transition:'background 0.15s'
                    }}/>
                  )}
                  {!isAll && <LayoutList size={14} style={{ display:'none' }}/>}
                  {isAll && <LayoutList size={14}/>}
                  {tab.label}
                  <span style={{
                    fontSize:11, padding:'1px 7px', borderRadius:999,
                    background: isActive ? (isAll ? '#00000015' : 'rgba(0,0,0,0.2)') : '#3a3a3a',
                    color: isActive ? (isAll ? '#000' : color) : '#6b7280',
                    fontWeight:600
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Controls */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                <Search size={14} color="#6b7280" style={{ position:'absolute', left:10 }}/>
                <input
                  placeholder="Search questions"
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  style={{ background:'#282828', border:'1px solid #3a3a3a', borderRadius:6, padding:'7px 10px 7px 32px', color:'#fff', fontSize:13, outline:'none', width:220 }}
                />
              </div>
              <button style={{ background:'#282828', border:'1px solid #3a3a3a', borderRadius:6, padding:'7px 10px', color:'#9ca3af', cursor:'pointer', display:'flex', alignItems:'center' }}>
                <ArrowUpDown size={15}/>
              </button>
              <button style={{ background:'#282828', border:'1px solid #3a3a3a', borderRadius:6, padding:'7px 10px', color:'#9ca3af', cursor:'pointer', display:'flex', alignItems:'center' }}>
                <SlidersHorizontal size={15}/>
              </button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:13, color:'#6b7280' }}>
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                <CheckCircle2 size={15} color="#3a3a3a"/> 0/{allProblems.length} Solved
              </span>
              <Shuffle size={15} color="#00b8a3" style={{ cursor:'pointer' }}/>
            </div>
          </div>

          {/* Problem List */}
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 70px 80px', padding:'8px 12px', fontSize:12, color:'#6b7280', borderBottom:'1px solid #3a3a3a', marginBottom:4 }}>
              <span>Title</span>
              <span style={{ textAlign:'right' }}>Acceptance</span>
              <span style={{ textAlign:'right' }}>Difficulty</span>
              <span style={{ textAlign:'right' }}>Frequency</span>
            </div>

            {filteredProblems.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'#6b7280' }}>No problems found.</div>
            ) : filteredProblems.map((problem, idx) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                style={{
                  display:'grid', gridTemplateColumns:'1fr 80px 70px 80px',
                  padding:'10px 12px', borderRadius:6, textDecoration:'none',
                  background: idx % 2 !== 0 ? '#232323' : 'transparent',
                  alignItems:'center', transition:'background 0.1s'
                }}
                onMouseEnter={e=>e.currentTarget.style.background='#2a2a2a'}
                onMouseLeave={e=>e.currentTarget.style.background=idx%2!==0?'#232323':'transparent'}
              >
                <span style={{ color:'#eff1f6', fontSize:13.5 }}>
                  {idx + 1}. {problem.title}
                </span>
                <span style={{ textAlign:'right', color:'#9ca3af', fontSize:13 }}>
                  {problem.acceptance || '57.0%'}
                </span>
                <span style={{ textAlign:'right', fontSize:13, fontWeight:500, color: diffColor(problem.difficulty) }}>
                  {problem.difficulty === 'Medium' ? 'Med.' : problem.difficulty}
                </span>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:10 }}>
                  <Bars/>
                  <Lock size={13} color="#6b7280"/>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={{ width:300, borderLeft:'1px solid #3a3a3a', padding:'16px', display:'flex', flexDirection:'column', gap:16, flexShrink:0, overflowY:'auto' }}>

          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <div style={{ background:'linear-gradient(135deg,#1f4d2a,#2d6a3f)', borderRadius:12, padding:'6px 12px', display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ color:'#4ade80', fontWeight:700, fontSize:13 }}>3</span>
              <span style={{ fontSize:12 }}>🔥</span>
            </div>
          </div>

          {/* Calendar */}
          <div style={{ background:'#282828', borderRadius:10, padding:16, border:'1px solid #3a3a3a' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontSize:13, color:'#d1d5db' }}>
                Day 10 <span style={{ color:'#6b7280', fontSize:11 }}>06:32:13 left</span>
              </span>
              <div style={{ display:'flex', gap:8 }}>
                <ChevronLeft size={15} color="#9ca3af" style={{ cursor:'pointer' }}/>
                <ChevronRight size={15} color="#9ca3af" style={{ cursor:'pointer' }}/>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:6 }}>
              {CAL_DAYS.map((d,i) => (
                <div key={i} style={{ textAlign:'center', fontSize:11, color:'#6b7280', fontWeight:500, padding:'2px 0' }}>{d}</div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
              {calDays.map((day, i) => (
                <div key={i} style={{
                  textAlign:'center', fontSize:12, borderRadius:999,
                  background: day === 10 ? '#00b8a3' : 'transparent',
                  color: day === 10 ? '#000' : day ? '#9ca3af' : 'transparent',
                  fontWeight: day === 10 ? 700 : 400,
                  cursor: day ? 'pointer' : 'default', lineHeight:'24px', height:24
                }}>{day}</div>
              ))}
            </div>
            <div style={{ marginTop:14, background:'#1e1e1e', border:'1px solid #3a2a0a', borderRadius:8, padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ color:'#ffa116', fontSize:12, fontWeight:600 }}>Weekly Premium</span>
                <Lock size={11} color="#ffa116"/>
              </div>
              <span style={{ color:'#6b7280', fontSize:11 }}>4 days left</span>
            </div>
            <div style={{ display:'flex', gap:6, marginTop:10 }}>
              {['W1','W2','W3','W4','W5'].map((w,i) => (
                <div key={w} style={{
                  flex:1, textAlign:'center', padding:'4px 0', borderRadius:6, fontSize:11,
                  background: i===1 ? '#ffa116' : '#3a3a3a',
                  color: i===1 ? '#000' : '#9ca3af', fontWeight: i===1 ? 700 : 400, cursor:'pointer'
                }}>{w}</div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, fontSize:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'#4ade80', fontSize:16 }}>⬡</span>
                <span style={{ color:'#fff', fontWeight:700 }}>0</span>
                <span style={{ color:'#3b82f6', fontSize:12, cursor:'pointer' }}>Redeem</span>
              </div>
              <span style={{ color:'#6b7280', fontSize:11, cursor:'pointer' }}>Rules</span>
            </div>
          </div>

          {/* Trending Companies */}
          <div style={{ background:'#282828', borderRadius:10, padding:16, border:'1px solid #3a3a3a' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span style={{ color:'#fff', fontWeight:600, fontSize:14 }}>Trending Companies</span>
              <div style={{ display:'flex', gap:6 }}>
                <ChevronLeft size={15} color="#9ca3af" style={{ cursor:'pointer' }}/>
                <ChevronRight size={15} color="#9ca3af" style={{ cursor:'pointer' }}/>
              </div>
            </div>
            <div style={{ position:'relative', marginBottom:12 }}>
              <Search size={13} color="#6b7280" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
              <input placeholder="Search for a company..." style={{
                background:'#3a3a3a', border:'none', borderRadius:6, padding:'7px 10px 7px 30px',
                color:'#d1d5db', fontSize:12, outline:'none', width:'100%'
              }}/>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {COMPANIES.map(c => (
                <div key={c.name} style={{
                  display:'flex', alignItems:'center', gap:6, background:'#3a3a3a',
                  borderRadius:999, padding:'5px 10px', cursor:'pointer', fontSize:12, transition:'background 0.15s'
                }}
                  onMouseEnter={e=>e.currentTarget.style.background='#4a4a4a'}
                  onMouseLeave={e=>e.currentTarget.style.background='#3a3a3a'}>
                  <span style={{ color:'#d1d5db' }}>{c.name}</span>
                  <span style={{ background:'#ffa116', color:'#000', fontSize:10, padding:'1px 6px', borderRadius:999, fontWeight:700 }}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}