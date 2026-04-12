import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProblems, getTopicMetadata, getSolvedStatus } from '../lib/api/problems';
import assets from "../assets/assets";
import { useUser, useAuth, SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import {
  Search, ChevronLeft, ChevronRight, LayoutList, CheckCircle2, Circle,
  Lock, LockOpen, Settings, Shuffle, ChevronDown, ChevronUp, ArrowUpDown, SlidersHorizontal,
  Target, GraduationCap, User
} from 'lucide-react';
import QuestWidget from '../components/quests/QuestWidget';
import QuestDashboardView from '../components/quests/QuestDashboardView';
import QuestLockedView from '../components/quests/QuestLockedView';
import { useSubscription } from '../hooks/useSubscription';
import ProblemsTableSkeleton from '../components/skeletons/ProblemsTableSkeleton';

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

const CAL_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Helper: format seconds → e.g. "4m 32s", "1h 5m", "45s"
function formatSolveTime(seconds) {
  if (!seconds || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function LeetCodeClone() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { permissions, tierLabel, getRequiredTierLabel, showUpgradeToast, canAccess } = useSubscription();
  const { getToken, isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeMainView, setActiveMainView] = useState('library'); // 'library', 'quest', 'study_plan'
  const [solvedMap, setSolvedMap] = useState({}); // { [problemSlug]: { solved, totalTimeSpentSeconds } }

  // --- RIGHT SIDEBAR STATES ---
  const [viewDate, setViewDate] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [activeWeek, setActiveWeek] = useState(1); // W1 = 0, W2 = 1, etc.
  const [companySearch, setCompanySearch] = useState('');
  const [companyPage, setCompanyPage] = useState(0);

  const today = new Date();

  // --- TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;

      const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

      setTimeLeft(`${h}:${m}:${s} left`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- CALENDAR LOGIC ---
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const calendarGrid = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const isToday = (day) => {
    return day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear();
  };

  // --- COMPANIES PAGINATION & SEARCH LOGIC ---
  const COMPANIES_PER_PAGE = 10;

  const filteredCompanies = useMemo(() => {
    return COMPANIES.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));
  }, [companySearch]);

  const totalCompanyPages = Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE);

  const visibleCompanies = useMemo(() => {
    return filteredCompanies.slice(
      companyPage * COMPANIES_PER_PAGE,
      (companyPage + 1) * COMPANIES_PER_PAGE
    );
  }, [filteredCompanies, companyPage]);

  // Reset pagination if search changes
  useEffect(() => setCompanyPage(0), [companySearch]);

  const handlePrevCompanyPage = () => setCompanyPage(p => Math.max(0, p - 1));
  const handleNextCompanyPage = () => setCompanyPage(p => Math.min(totalCompanyPages - 1, p + 1));

  // --- PROBLEM LIST LOGIC ---
  const [allProblems, setAllProblems] = useState([]);
  const [dynamicTopics, setDynamicTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [probRes, metaRes] = await Promise.all([
          getProblems({ limit: 1000 }),
          getTopicMetadata()
        ]);
        setAllProblems(probRes.problems || []);
        setDynamicTopics(metaRes.topics || []);
      } catch (err) {
        console.error("Failed to load problems:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleProblemClick = (e, problem) => {
    e.preventDefault();
    const diff = problem.difficulty.toLowerCase();
    
    // Check if the current tier has permission for this difficulty
    if (permissions && !permissions.allowedDifficulties.includes(diff)) {
      const requiredTier = diff === "medium" ? "code-rooms" : "interview-studio";
      showUpgradeToast(
        `The ${problem.difficulty} level is locked. Upgrade to ${getRequiredTierLabel(requiredTier)} to unlock.`
      );
      return;
    }
    
    navigate(`/problem/${problem.id}`);
  };

  // --- FETCH SOLVED STATUS (only when signed in) ---
  useEffect(() => {
    if (!isSignedIn) return;
    async function loadSolvedStatus() {
      try {
        const token = await getToken();
        const res = await getSolvedStatus(token);
        if (res.success) setSolvedMap(res.solvedMap || {});
      } catch (err) {
        console.error("Failed to load solved status:", err);
      }
    }
    loadSolvedStatus();
  }, [isSignedIn]);

  const counts = useMemo(() => ({
    Easy: allProblems.filter(p => p.difficulty === 'Easy').length,
    Medium: allProblems.filter(p => p.difficulty === 'Medium').length,
    Hard: allProblems.filter(p => p.difficulty === 'Hard').length,
  }), [allProblems]);

  const filteredProblems = useMemo(() => {
    let filtered = allProblems.filter((p) => {
      const matchesDiff = activeDifficulty === 'All' || p.difficulty === activeDifficulty;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === null || p.category === activeCategory;
      return matchesDiff && matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortOrder === 'asc') return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

    return filtered;
  }, [allProblems, activeDifficulty, searchQuery, activeCategory, sortOrder]);

  const diffColor = (d) => d === 'Easy' ? '#00b8a3' : d === 'Medium' ? '#ffc01e' : d === 'Hard' ? '#ef4743' : '#9ca3af';
  const diffBg = (d) => d === 'Easy' ? 'rgba(0,184,163,0.15)' : d === 'Medium' ? 'rgba(255,192,30,0.15)' : 'rgba(239,71,67,0.15)';



  const DIFF_TABS = [
    { id: 'All', label: 'All Topics', count: allProblems.length },
    { id: 'Easy', label: 'Easy', count: counts.Easy },
    { id: 'Medium', label: 'Medium', count: counts.Medium },
    { id: 'Hard', label: 'Hard', count: counts.Hard },
  ];

  const visibleTopics = isExpanded ? dynamicTopics : dynamicTopics.slice(0, 8);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1b1b1f 0%, #111113 300px)', color: '#eff1f6', fontFamily: '"Segoe UI", system-ui, sans-serif', display: 'flex', flexDirection: 'column', fontSize: 14 }}>

      {/* NAV */}
      <nav style={{ height: 56, background: '#1b1b1f', borderBottom: '1px solid #2c2c35', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Wrapped logo in an anchor tag pointing to "/" */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, cursor: 'pointer', textDecoration: 'none' }}>
            {/* Logo */}
            <div className="flex flex-col gap-[2px]">
              <div className="w-[16px] h-[4px] rounded-[2px] rounded-tl-sm bg-[#F3F3EF]"></div>
              <div className="flex gap-[2px]">
                <div className="w-[4px] h-[4px] rounded-[2px] bg-[#F3F3EF]"></div>
                <div className="w-[12px] h-[4px] rounded-[2px] bg-[#fba120]"></div>
              </div>
              <div className="flex gap-[2px]">
                <div className="w-[10px] h-[4px] bg-transparent"></div>
                <div className="w-[6px] h-[6px] rounded-[2px] rounded-br-sm bg-[#F3F3EF]"></div>
              </div>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: '-0.2px' }}>Clyric</span>
          </a>

          {[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Problems', link: '/problems', active: true },
            { label: 'Contest', link: '/leaderboard' },

            { label: 'Pricing', link: '/priceoverview', gold: true },
          ].map(({ label, link, active, caret, gold }) => (
            <a
              key={label}
              href={link}
              style={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                cursor: 'pointer',
                color: active ? '#fff' : gold ? '#fba120' : '#9ca3af',
                borderBottom: active ? '2px solid #8a6bfe' : '2px solid transparent',
                fontSize: 13.5,
                fontWeight: active ? 500 : 400,
                gap: 4,
                textDecoration: 'none',
              }}
            >
              {label}{caret && <ChevronDown size={13} />}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#2c2c35', borderRadius: 8, padding: '6px 12px', gap: 8, width: 200 }}>
            <Search size={14} color="#6b7280" />
            <input placeholder="Search" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#d1d5db', fontSize: 13, width: '100%' }} />
          </div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[13px] font-medium hover:opacity-60 transition-opacity">
                Register or Login
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <div className="relative group flex items-center">
            <button
              onClick={() => window.location.href = '/priceoverview'}
              style={{
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 24px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                textTransform: 'capitalize',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#000';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#1a1a1a';
              }}
            >
              {user?.publicMetadata?.subscriptionTier && user.publicMetadata.subscriptionTier !== 'free' ?
                (user.publicMetadata.subscriptionTier.replace(/-/g, ' ')) :
                'Free'}
            </button>

            {/* Subscription Status Dropdown */}
            {user?.publicMetadata?.isPro && user?.publicMetadata?.subscriptionExpiry && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#1b1b1f] border border-[#2c2c35] rounded-xl shadow-2xl p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[200] transform scale-95 group-hover:scale-100 origin-top-right">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#3b3350]/20">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Subscription Status</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[13px] text-gray-400">Time remaining</span>
                    <span className="text-[15px] font-semibold text-white">
                      {(() => {
                        const expiry = new Date(user.publicMetadata.subscriptionExpiry);
                        const now = new Date();
                        const diff = expiry - now;
                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                        return days > 0 ? `${days} days left` : 'Expiring today';
                      })()}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-[#111113] rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.max(5, Math.min(100, (() => {
                          const expiry = new Date(user.publicMetadata.subscriptionExpiry);
                          const now = new Date();
                          const diff = expiry - now;
                          const totalDays = 30; // Assuming 30 days for progress calculation
                          return (diff / (totalDays * 1000 * 60 * 60 * 24)) * 100;
                        })()))}%`
                      }}
                    ></div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-500">Tier: <span className="text-gray-300 font-medium capitalize">{user.publicMetadata.subscriptionTier?.replace(/-/g, ' ')}</span></span>
                    </div>
                    <p className="text-[11px] text-gray-500 italic leading-tight">
                      Renews manually after expiration
                    </p>
                  </div>

                  <button
                    onClick={() => window.location.href = '/priceoverview'}
                    className="mt-2 w-full py-2 bg-[#2c2c35] hover:bg-[#3b3350]/30 text-white text-[12px] font-medium rounded-lg border border-[#3b3350]/20 transition-colors"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, maxWidth: 1700, margin: '0 auto', width: '100%', overflow: 'hidden' }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ width: 200, borderRight: '1px solid #2c2c35', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0, overflowY: 'auto' }}>
          {[
            { icon: <LayoutList size={16} />, label: 'Library', active: activeMainView === 'library', action: () => setActiveMainView('library') },
            { 
              icon: <Target size={16} />, 
              label: 'Quest', 
              badge: 'New', 
              active: activeMainView === 'quest', 
              action: () => setActiveMainView('quest'),
              locked: !canAccess("canUseQuests")
            },
            { icon: <GraduationCap size={16} />, label: 'Study Plan', active: activeMainView === 'study_plan', action: () => setActiveMainView('study_plan') },
          ].map(({ icon, label, active, badge, action, locked }) => (
            <button key={label} onClick={action} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6,
              background: active ? '#2c2c35' : 'transparent', border: 'none', cursor: 'pointer',
              color: active ? '#fff' : '#9ca3af', fontSize: 13.5, fontWeight: active ? 500 : 400,
              justifyContent: 'space-between', width: '100%',
              opacity: locked && !active ? 0.7 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {icon}
                {label}
                {locked && <Lock size={12} className="text-gray-500 ml-1" />}
              </div>
              {badge && <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>{badge}</span>}
            </button>
          ))}
          <SignedOut>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #2c2c35', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <p style={{ color: '#6b7280', fontSize: 12, textAlign: 'center', lineHeight: 1.5 }}>Sign in to view lists and track study progress.</p>
              <SignInButton mode="modal">
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#8a6bfe', color: '#fff', border: 'none', borderRadius: 999, padding: '7px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                  <User size={15} /> Sign in
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        </aside>

        {/* CENTER */}
        <main style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {activeMainView === 'quest' && (
            canAccess("canUseQuests") ? (
              <QuestDashboardView onNavigateToLibrary={() => setActiveMainView('library')} />
            ) : (
              <QuestLockedView onBack={() => setActiveMainView('library')} />
            )
          )}

          {activeMainView === 'study_plan' && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 h-full">
              <GraduationCap className="w-16 h-16 opacity-20 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400">Study Plan</h3>
              <p className="mt-2 text-sm">Coming soon in a future update.</p>
            </div>
          )}

          {activeMainView === 'library' && (
            <>
              {/* Promo Banners */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  'https://assets.leetcode.com/users/images/dba14729-0f89-4a5a-a181-b2a7ec1fb0ec_1772459043.341392.png',
                  'https://assets.leetcode.com/users/images/942e9e91-7f81-4513-8544-c462980a5d3a_1738741032.3553998.png',
                  'https://assets.leetcode.com/users/images/b0a08a5c-c575-48f6-9110-b6ae4e011e98_1655746322.579097.png',
                  assets.img,
                ].map((src, i) => (
                  <div key={i} style={{ height: 110, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>

              {/* Topics row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 18, fontSize: 13, color: '#9ca3af', alignItems: 'center' }}>
                {visibleTopics.map(t => {
                  const isActive = activeCategory === t.name;
                  return (
                    <span key={t.name} onClick={() => setActiveCategory(isActive ? null : t.name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        color: isActive ? '#fff' : '#9ca3af', background: isActive ? '#3a3a47' : 'transparent',
                        padding: isActive ? '4px 10px' : '4px 2px', borderRadius: 999, transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af' }}>
                      {t.name}
                      <span style={{ background: isActive ? '#4a4a59' : '#2c2c35', padding: '1px 7px', borderRadius: 999, fontSize: 11, color: isActive ? '#fff' : '#6b7280' }}>
                        {t.count}
                      </span>
                    </span>
                  );
                })}
                {dynamicTopics.length > 8 && (
                  <span onClick={() => setIsExpanded(!isExpanded)}
                    style={{ color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: '4px 2px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                    {isExpanded ? 'Show Less' : 'Expand'} {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </span>
                )}
              </div>

              {/* DIFFICULTY FILTER TABS */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {DIFF_TABS.map(tab => {
                  const isAll = tab.id === 'All';
                  const isActive = activeDifficulty === tab.id;
                  const color = isAll ? null : diffColor(tab.id);
                  const bg = isAll ? null : diffBg(tab.id);
                  return (
                    <button key={tab.id} onClick={() => setActiveDifficulty(tab.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, cursor: 'pointer',
                        fontSize: 13, fontWeight: isActive ? 600 : 400, transition: 'all 0.15s',
                        border: isActive ? (isAll ? 'none' : `1px solid ${color}`) : '1px solid #2c2c35',
                        background: isActive ? (isAll ? '#fff' : bg) : '#1b1b1f',
                        color: isActive ? (isAll ? '#000' : color) : (isAll ? '#d1d5db' : '#9ca3af'),
                      }}>
                      {!isAll && (
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? color : '#6b7280', display: 'inline-block', flexShrink: 0, transition: 'background 0.15s' }} />
                      )}
                      {isAll && <LayoutList size={14} />}
                      {tab.label}
                      <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 999, background: isActive ? (isAll ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.15)') : '#2c2c35', color: isActive ? (isAll ? '#000' : color) : '#6b7280', fontWeight: 600 }}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search + Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} color="#6b7280" style={{ position: 'absolute', left: 10 }} />
                    <input
                      placeholder="Search questions" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      style={{ background: '#111113', border: '1px solid #2c2c35', borderRadius: 6, padding: '7px 10px 7px 32px', color: '#fff', fontSize: 13, outline: 'none', width: 220 }}
                    />
                  </div>

                  <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    style={{ background: sortOrder === 'desc' ? '#3a3a47' : '#1b1b1f', border: '1px solid #2c2c35', borderRadius: 6, padding: '7px 10px', color: sortOrder === 'desc' ? '#fff' : '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                    title={sortOrder === 'asc' ? "Sort Descending" : "Sort Ascending"}>
                    <ArrowUpDown size={15} />
                  </button>

                  <button style={{ background: '#1b1b1f', border: '1px solid #2c2c35', borderRadius: 6, padding: '7px 10px', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <SlidersHorizontal size={15} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={15} color="#2c2c35" /> 0/{allProblems.length} Solved
                  </span>
                  <Shuffle size={15} color="#00b8a3" style={{ cursor: 'pointer' }} />
                </div>
              </div>

              {/* Problem List */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px 80px', padding: '8px 12px', fontSize: 12, color: '#6b7280', borderBottom: '1px solid #2c2c35', marginBottom: 4 }}>
                  <span>Title</span>
                  <span style={{ textAlign: 'right' }}>Status</span>
                  <span style={{ textAlign: 'right' }}>Time</span>
                  <span style={{ textAlign: 'right' }}>Difficulty</span>
                  <span style={{ textAlign: 'right' }}>Access</span>
                </div>

                {isLoading ? (
                  <ProblemsTableSkeleton rows={15} />
                ) : filteredProblems.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>No problems found matching your filters.</div>
                ) : filteredProblems.map((problem, idx) => {
                  // Backend maps slug → id in getProblems response
                  const slug = problem.id;
                  const solveData = solvedMap[slug];
                  const isSolved = !!solveData;
                  const solveTime = isSolved ? formatSolveTime(solveData.totalTimeSpentSeconds) : null;
                  return (
                    <div key={problem.id} 
                      onClick={(e) => handleProblemClick(e, problem)}
                      className="cursor-pointer"
                      style={{
                        display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px 80px', padding: '10px 12px', borderRadius: 6,
                        background: idx % 2 !== 0 ? '#16161a' : 'transparent', alignItems: 'center', transition: 'background 0.1s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1f1f24'}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 !== 0 ? '#16161a' : 'transparent'}>
                      {/* Title */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#eff1f6', fontSize: 13.5 }}>
                          {idx + 1}. {problem.title}
                        </span>
                      </div>
                      {/* Status column */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {isSolved ? (
                          <span style={{ color: '#02bc68', fontSize: 12, fontWeight: 600 }}>Solved</span>
                        ) : (
                          <span style={{ color: '#3f3f46', fontSize: 12 }}>Unsolved</span>
                        )}
                      </div>
                      {/* Time column */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {isSolved && solveTime ? (
                          <span style={{ color: '#646770', fontSize: 12 }}>{solveTime}</span>
                        ) : (
                          <span style={{ color: '#3f3f46', fontSize: 13 }}>—</span>
                        )}
                      </div>
                      {/* Difficulty */}
                      <span style={{ textAlign: 'right', fontSize: 13, fontWeight: 500, color: diffColor(problem.difficulty) }}>
                        {problem.difficulty === 'Medium' ? 'Med.' : problem.difficulty}
                      </span>
                      {/* Access / Lock State */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {permissions && permissions.allowedDifficulties.includes(problem.difficulty.toLowerCase()) ? (
                          <LockOpen size={14} color="#00b8a3" style={{ opacity: 0.8 }} title="Accessible" />
                        ) : (
                          <Lock size={14} color="#ef4743" style={{ opacity: 0.8 }} title="Locked (Upgrade required)" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>

        {/* --- RIGHT SIDEBAR (NOW FULLY FUNCTIONAL) --- */}

        <aside style={{ width: 300, borderLeft: '1px solid #2c2c35', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0, overflowY: 'auto' }}>

          {/* New Quest Widget */}
          <QuestWidget onClick={() => {
            if (!canAccess("canUseQuests")) {
              showUpgradeToast("code-rooms", "to access Quests");
              return;
            }
            setActiveMainView('quest');
          }} />

          {/* Calendar Section */}
          <div style={{ background: '#16161a', borderRadius: 10, padding: 16, border: '1px solid #2c2c35' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#fcfdff', display: 'flex', alignItems: 'center', gap: 6 }}>
                Day {today.getDate()} <span style={{ color: '#d1d5db', fontSize: 11 }}>{timeLeft}</span>
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <ChevronLeft onClick={handlePrevMonth} size={15} color="#9ca3af" style={{ cursor: 'pointer' }} />
                <ChevronRight onClick={handleNextMonth} size={15} color="#9ca3af" style={{ cursor: 'pointer' }} />
              </div>
            </div>

            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 6 }}>
              {CAL_DAYS.map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 11, color: '#6b7280', fontWeight: 500, padding: '2px 0' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
              {calendarGrid.map((day, i) => (
                <div key={i} style={{
                  textAlign: 'center', fontSize: 12, borderRadius: 999,
                  background: isToday(day) ? '#eb5a56' : 'transparent',
                  color: isToday(day) ? '#fff' : day ? '#9ca3af' : 'transparent', // Changed from #000 to #fff
                  fontWeight: isToday(day) ? 700 : 400,
                  cursor: day ? 'pointer' : 'default', lineHeight: '24px', height: 24
                }}>{day}</div>
              ))}
            </div>

            <div style={{ marginTop: 14, background: '#3e3427', border: '1px solid #2c2c35', borderRadius: 8, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {/* Changed text and lock icon from #ffa116 to #fff */}
                <span style={{ color: '#ffa116', fontSize: 12, fontWeight: 600 }}>Weekly Premium</span>
                <Lock size={11} color="#ffa116" />
              </div>
              <span style={{ color: '#6b7280', fontSize: 11 }}>4 days left</span>
            </div>


            {/* Week Selector */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {['W1', 'W2', 'W3', 'W4', 'W5'].map((w, i) => (
                <div key={w} onClick={() => setActiveWeek(i)} style={{
                  flex: 1, textAlign: 'center', padding: '4px 0', borderRadius: 6, fontSize: 11,
                  background: activeWeek === i ? '#ef5a55' : '#2c2c35',
                  color: activeWeek === i ? '#fff' : '#9ca3af', // Changed from #000 to #fff
                  fontWeight: activeWeek === i ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>{w}</div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#4ade80', fontSize: 16 }}>⬡</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>0</span>
              </div>
              <span style={{ color: '#6b7280', fontSize: 11, cursor: 'pointer' }}>Rules</span>
            </div>
          </div>

          {/* Trending Companies Section */}
          <div style={{ background: '#16161a', borderRadius: 10, padding: 16, border: '1px solid #2c2c35' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Trending Companies</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <ChevronLeft onClick={handlePrevCompanyPage} size={15} color={companyPage > 0 ? "#fff" : "#6b7280"} style={{ cursor: companyPage > 0 ? 'pointer' : 'default' }} />
                <ChevronRight onClick={handleNextCompanyPage} size={15} color={companyPage < totalCompanyPages - 1 ? "#fff" : "#6b7280"} style={{ cursor: companyPage < totalCompanyPages - 1 ? 'pointer' : 'default' }} />
              </div>
            </div>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={13} color="#6b7280" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                placeholder="Search for a company..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                style={{
                  background: '#2c2c35', border: 'none', borderRadius: 6, padding: '7px 10px 7px 30px',
                  color: '#d1d5db', fontSize: 12, outline: 'none', width: '100%'
                }}
              />
            </div>

            {visibleCompanies.length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: 12, textAlign: 'center', padding: '10px 0' }}>No companies found.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 90, alignContent: 'flex-start' }}>
                {visibleCompanies.map(c => (
                  <div key={c.name} style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: '#2c2c35',
                    borderRadius: 999, padding: '5px 10px', cursor: 'pointer', fontSize: 12, transition: 'background 0.15s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#3a3a47'}
                    onMouseLeave={e => e.currentTarget.style.background = '#2c2c35'}>
                    <span style={{ color: '#d1d5db' }}>{c.name}</span>
                    <span style={{ background: '#ffa116', color: '#000', fontSize: 10, padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
}