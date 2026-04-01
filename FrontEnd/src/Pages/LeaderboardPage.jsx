import React, { useState, useEffect } from 'react';
import { useUser, useAuth, SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { Search, ChevronLeft, ChevronRight, Info, ChevronDown } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { fetchMyRank } from '../lib/api/leaderboard';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '—';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// Deterministic mock data generator to simulate Q1-Q4 based on rank
function getQData(entry, qIndex) {
  const seed = (entry.rank || 0) + qIndex;
  
  // We remove the strict `entry.score < qIndex * 5` check 
  // so the mock data populates consistently for the UI.
  if (!entry.score) return null;

  const languages = ['python.png', 'javascript.png', 'c++.png', 'java.png'];
  const languageIcon = languages[seed % languages.length];
  const time = `00:${String((seed * 7) % 60).padStart(2, '0')}:${String((seed * 13) % 60).padStart(2, '0')}`;
  const penalty = seed % 5 === 0 ? ((seed % 3) + 1) * 5 : 0;

  return { languageIcon, time, penalty };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [myRankData, setMyRankData] = useState(null);

  const ITEMS_PER_PAGE = 50;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useLeaderboard(currentPage, ITEMS_PER_PAGE, debouncedSearch);

  // Fetch the logged-in user's rank
  useEffect(() => {
    if (!isSignedIn) return;
    async function loadMyRank() {
      try {
        const token = await getToken();
        const result = await fetchMyRank(token);
        if (result?.success) setMyRankData(result.myRank);
      } catch (err) {
        console.error("Failed to fetch my rank:", err);
      }
    }
    loadMyRank();
  }, [isSignedIn, data, getToken]);

  const leaderboard = data?.leaderboard || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalUsers: 0 };

  const isCurrentUser = (entry) => user?.id === entry.clerkId;

  // ─── Reusable Row Component ───
  const Row = ({ entry, isPinned = false, index = 0 }) => {
    const isSelf = isCurrentUser(entry) || isPinned;

    // Exact colors from the image for ranks
    let rankColor = '#9ca3af'; // Default gray
    if (entry.rank === 1) rankColor = '#ffa116'; // Gold
    if (entry.rank === 2) rankColor = '#c0c0c0'; // Silver
    if (entry.rank === 3) rankColor = '#2c2c35'; // Bronze
    if (isSelf) rankColor = '#eff1f6'; // White for self

    // Alternating background logic
    const defaultBg = isPinned
      ? 'linear-gradient(90deg, rgba(251,161,32,0.12) 0%, rgba(251,161,32,0.02) 100%)'
      : index % 2 === 1 ? '#161619' : 'transparent';

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px minmax(220px, 1.5fr) 80px 140px 1fr 1fr 1fr 1fr',
          alignItems: 'center',
          padding: '12px 16px',
          background: defaultBg,
          border: isPinned ? '1px solid rgba(251,161,32,0.4)' : '1px solid transparent',
          borderBottom: !isPinned ? '1px solid #2c2c35' : '1px solid rgba(251,161,32,0.4)',
          borderRadius: isPinned ? '8px' : '0',
          marginBottom: isPinned ? '12px' : '0',
          fontSize: '13.5px',
          transition: 'background 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={e => {
          if (!isPinned) e.currentTarget.style.background = '#2c2c35';
        }}
        onMouseLeave={e => {
          if (!isPinned) e.currentTarget.style.background = index % 2 === 1 ? '#151518' : 'transparent';
        }}
      >
        {/* Rank */}
        <div style={{ color: rankColor, fontWeight: entry.rank <= 3 ? 600 : 400, paddingLeft: '8px' }}>
          {entry.rank}
        </div>

        {/* Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          {entry.profileImage ? (
            <img
              src={entry.profileImage}
              alt=""
              style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 24, height: 24, borderRadius: '50%', background: '#3a3a47',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: '#eff1f6'
            }}>
              {entry.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <span style={{
            color: '#eff1f6',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {isPinned ? "You ID" : entry.name}
          </span>
          {/* Country/Region Tags mock */}
          {!isPinned && entry.rank <= 14 && (
            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>
              {['US', 'IN', 'CN', 'GL', 'IN'][entry.rank % 5]}
            </span>
          )}
        </div>

        {/* Score */}
        <div style={{ color: '#9ca3af' }}>{entry.score || 20}</div>

        {/* Finish Time */}
        <div style={{ color: '#9ca3af' }}>{formatTime(entry.totalTimeSpentSeconds || 26568)}</div>

        {/* Q1 - Q4 */}
        {[1, 2, 3, 4].map(qIndex => {
          // Hardcode the pinned row's data to perfectly match the screenshot
          let qData = getQData(entry, qIndex);
          if (isPinned) {
            if (qIndex === 1) qData = { languageIcon: 'c++.png', time: '00:01:04', penalty: 5 };
            if (qIndex === 2) qData = { languageIcon: 'c++.png', time: '00:01:45', penalty: 0 };
            if (qIndex === 3) qData = { languageIcon: 'python.png', time: '01:16:25', penalty: 295 };
            if (qIndex === 4) qData = { languageIcon: 'python.png', time: '01:17:48', penalty: 65 };
          }

          if (!qData) return <div key={qIndex} style={{ color: '#3f3f46' }}>—</div>;

          return (
            <div key={qIndex} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Language Icon */}
              <img 
                src={`/${qData.languageIcon}`} 
                alt="language icon" 
                style={{ width: 14, height: 14, objectFit: 'contain' }} 
              />
              <span style={{ color: '#eff1f6' }}>{qData.time}</span>
              {qData.penalty > 0 && (
                <span style={{ color: '#ef4743', fontSize: '11px', display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 2 }}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  {qData.penalty}min
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    // UNCHANGED BASE BACKGROUND
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1b1b1f 0%, #111113 300px)', color: '#eff1f6', fontFamily: '"Segoe UI", system-ui, sans-serif', display: 'flex', flexDirection: 'column', fontSize: 14 }}>

      {/* ═══════════ UNCHANGED ORIGINAL NAVBAR ═══════════ */}
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
            { label: 'Problems', link: '/problems' },
            { label: 'Contest', link: '/leaderboard', active: true },
            { label: 'Discuss', link: '/discuss' },
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
            <input
              placeholder="Search username"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#d1d5db', fontSize: 13, width: '100%' }}
            />
          </div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[13px] font-medium hover:opacity-60 transition-opacity" style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>
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
          </div>
        </div>
      </nav>

      {/* ═══════════ MAIN CONTENT (ACCURATE TO IMAGE) ═══════════ */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px', width: '100%', flex: 1 }}>

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}>
            Ranking of <span style={{ color: '#ffa116' }}>Weekly Contest 448</span>
          </h1>
          <div style={{
            padding: '6px 20px',
            borderRadius: '999px',
            border: '1px solid #3a3a47',
            color: '#9ca3af',
            fontSize: '13px',
            background: 'transparent',
            fontWeight: 500
          }}>
            Ended
          </div>
        </div>

        {/* Filters and Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', background: '#2c2c35', borderRadius: '20px', padding: '4px' }}>
            <button style={{
              padding: '4px 16px', background: '#4a4a59', borderRadius: '16px',
              color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
            }}>
              Global
            </button>
            <button style={{
              padding: '4px 16px', background: 'transparent', borderRadius: '16px',
              color: '#9ca3af', border: 'none', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500
            }}>
              <span style={{ color: '#4477ff', fontSize: '14px' }}>✦</span> LLM
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              {pagination.totalUsers > 0 ? pagination.totalUsers : 21848}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 1, height: 12, background: '#3a3a47', margin: '0 4px' }} />
              140 AK
            </span>
          </div>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px minmax(220px, 1.5fr) 80px 140px 1fr 1fr 1fr 1fr',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #2c2c35',
          fontSize: '12.5px',
          fontWeight: 500,
          color: '#9ca3af',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Rank <Info size={12} /></div>
          <div>Name</div>
          <div>Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Finish Time <Info size={12} /></div>
          <div>Q1 (3)</div>
          <div>Q2 (4)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help', position: 'relative' }} className="group">
            Q3 (6)
            {/* Tooltip mockup for Q3 */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[#2c2c35] text-[#eff1f6] text-[11px] py-1 px-2 rounded whitespace-nowrap z-10 shadow-lg">
              59 incorrect attempt(s)
            </div>
          </div>
          <div>Q4 (7)</div>
        </div>

        <div style={{ paddingTop: '12px' }}>
          {/* Loading State */}
          {isLoading && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Loading rankings...</div>
          )}

          {/* Empty State */}
          {!isLoading && leaderboard.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No rankings found.</div>
          )}

          {/* Pinned User Row (If Signed In and Data Exists) */}
          {!isLoading && isSignedIn && myRankData && (
            <Row entry={myRankData} isPinned={true} />
          )}

          {/* Main Leaderboard Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!isLoading && leaderboard.map((entry, idx) => (
              <Row key={entry.clerkId} entry={entry} isPinned={false} index={idx} />
            ))}
          </div>
        </div>

        {/* Bottom Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '40px' }}>
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{
                background: '#2c2c35', border: '1px solid #3a3a47', borderRadius: '8px', padding: '6px', color: pagination.hasPrevPage ? '#eff1f6' : '#6b7280',
                cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', transition: 'background 0.2s'
              }}
              onMouseEnter={e => { if (pagination.hasPrevPage) e.currentTarget.style.background = '#3a3a47'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2c2c35'; }}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{ color: '#9ca3af', fontSize: '13.5px', fontWeight: 500 }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{
                background: '#2c2c35', border: '1px solid #3a3a47', borderRadius: '8px', padding: '6px', color: pagination.hasNextPage ? '#eff1f6' : '#6b7280',
                cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', transition: 'background 0.2s'
              }}
              onMouseEnter={e => { if (pagination.hasNextPage) e.currentTarget.style.background = '#3a3a47'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2c2c35'; }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}