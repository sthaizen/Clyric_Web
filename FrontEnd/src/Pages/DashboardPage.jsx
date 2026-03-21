import { useNavigate } from "react-router";
import { useUser, SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions.js";
import { useAnalytics } from "../hooks/useAnalytics.js";
import { useDashboard } from "../hooks/useDashboard.js";
import { CodeIcon, ActivityIcon, ChevronDown, Search, X, Camera, BarChart3 } from "lucide-react";

// Existing Components
import WelcomeSection from "../components/WelcomeSection";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import DashboardContributionGraph from "../components/dashboard/DashboardContributionGraph";
import StatsCards from "../components/StatsCards.jsx";

// New Analytics Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCardsContainer from "../components/dashboard/StatsCardsContainer";
import DifficultyDistribution from "../components/dashboard/DifficultyDistribution";
import TopicMastery from "../components/dashboard/TopicMastery";
import RecentTransmissions from "../components/dashboard/RecentTransmissions";
import ExecutionIntelligence from "../components/dashboard/ExecutionIntelligence";
import GrowthTrajectory from "../components/dashboard/GrowthTrajectory";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  // --- Profile State ---
  const [profileData, setProfileData] = useState({
    name: user?.fullName || user?.firstName || "Developer",
    nickname: "",
    description: "Let others know about You",
    profilePic: user?.publicMetadata?.profileImage || user?.imageUrl || ""
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftData, setDraftData] = useState(profileData);
  const [isExpanded, setIsExpanded] = useState(false);

  const createSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();
  const { data: analyticsData, isLoading: loadingAnalytics } = useAnalytics(user?.id, selectedYear);
  const { data: dashboardData, isLoading: loadingDashboard } = useDashboard(user?.id, selectedYear, dashboardRefreshKey);

  useEffect(() => {
    if (isEditModalOpen) {
      setDraftData(profileData);
    }
  }, [isEditModalOpen, profileData]);

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const handleSaveProfile = async () => {
    // TODO: Add your API call here
    setProfileData(draftData);
    setIsEditModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraftData({ ...draftData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  const userInitials = profileData.name ? profileData.name.charAt(0).toUpperCase() : "U";

  const MAX_DESC_LENGTH = 80;
  const shouldTruncate = profileData.description.length > MAX_DESC_LENGTH;
  const displayDescription = isExpanded
    ? profileData.description
    : profileData.description.slice(0, MAX_DESC_LENGTH) + (shouldTruncate ? "..." : "");

  return (
    <>
      <div className="min-h-screen bg-[#111113] text-gray-200 font-sans selection:bg-indigo-500/30">

        {/* INLINE NAVBAR */}
        <nav style={{ height: 56, background: '#1b1b1f', borderBottom: '1px solid #2c2c35', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, cursor: 'pointer', textDecoration: 'none' }}>
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
              { label: 'Dashboard', link: '/dashboard', active: true },
              { label: 'Problems', link: '/problems' },
              { label: 'Contest', link: '/contest' },
              { label: 'Discuss', link: '/discuss' },
              { label: 'Interview', link: '/interview', caret: true },
              { label: 'Store', link: '/store', caret: true, gold: true },
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
                  color: active ? '#fff' : gold ? '#ffa116' : '#9ca3af',
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
            <button
              onClick={() => {
                const next = !showAnalytics;
                setShowAnalytics(next);
                if (next) setDashboardRefreshKey(k => k + 1);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: showAnalytics ? '#3b2d6b' : '#2a2538',
                color: showAnalytics ? '#a78bfa' : '#a5b4fc',
                border: '1px solid',
                borderColor: showAnalytics ? '#5b4a9e' : '#3b3350',
                borderRadius: 8, padding: '6px 14px',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={14} />
              {showAnalytics ? 'Dashboard' : 'View Analytics'}
            </button>
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
            <button
              onClick={() => window.location.href = '/premium'}
              style={{ background: '#524026', color: '#fba121', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              Premium
            </button>
          </div>
        </nav>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-5 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* LEFT COLUMN: Profile & Stats — ALWAYS VISIBLE */}
            <div className="xl:col-span-3 flex flex-col gap-5">

              <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-2xl p-5 w-full shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative shrink-0">
                    {profileData.profilePic ? (
                      <img
                        src={profileData.profilePic}
                        alt="Profile"
                        className="w-20 h-20 rounded-xl object-cover" 
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                        {userInitials}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-[#1b1b1f] rounded-full"></div>
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <h2 className="text-lg font-semibold text-white truncate">{profileData.name}</h2>
                    {profileData.nickname && (
                      <p className="text-sm text-gray-400 truncate">@{profileData.nickname}</p>
                    )}
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-2 mb-5 bg-[#2a2538] hover:bg-[#342e45] text-indigo-300 font-medium rounded-lg border border-[#3b3350] transition-colors text-sm"
                >
                  Edit Profile
                </button>

                <div className="w-full mb-6 text-sm text-gray-400">
                  {profileData.description ? (
                    <div>
                      <p className="text-left break-words">{displayDescription}</p>
                      {shouldTruncate && (
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-indigo-400 hover:text-indigo-300 mt-1 text-xs float-left"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="opacity-80">Let others know about You</span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">Status: <span className="text-gray-300">Ready to practice</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CodeIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">Platform: <span className="text-gray-300">Active Member</span></span>
                  </div>
                </div>
              </div>

              <StatsCards />
            </div>

            {/* RIGHT COLUMN: Toggles between Sessions and Analytics */}
            <div className="xl:col-span-9 flex flex-col gap-6">

              {/* ===== DEFAULT DASHBOARD CONTENT ===== */}
              {!showAnalytics && (
                <>
                  {/* Kept outside the wrapper here for your default view if desired, or you can wrap it */}
                  <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-2xl p-6">
                    <DashboardContributionGraph data={analyticsData} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
                  </div>
                  <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />
                  <ActiveSessions sessions={activeSessions} isLoading={loadingActiveSessions} isUserInSession={isUserInSession} />
                  <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
                </>
              )}

              {/* ===== NEW ANALYTICS CONTENT ===== */}
              {showAnalytics && (
                <>
                  {loadingDashboard ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-400 text-sm">Synchronizing telemetry...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full">
                      
                      {/* 1. Header Area */}
                      <DashboardHeader currentStreak={dashboardData?.overview?.currentStreak} />
                      
                      {/* 2. Top Level: 4 Stats (Left 66%) + Difficulty (Right 33%) */}
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-8">
                          <StatsCardsContainer overview={dashboardData?.overview} />
                        </div>
                        <div className="xl:col-span-4">
                          <DifficultyDistribution difficulty={dashboardData?.difficulty} totalSolved={dashboardData?.overview?.totalSolved} />
                        </div>
                      </div>

                      {/* 3. Activity Pulse (100% Width) */}
                      
                       
                        <div className="w-full overflow-x-auto">
                           <DashboardContributionGraph 
                             data={dashboardData} 
                             selectedYear={selectedYear} 
                             setSelectedYear={setSelectedYear} 
                           />
                        </div>
                      

                      {/* 4. Mid Level: Topics (Approx 40%) & Transmissions (Approx 60%) */}
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-5 h-full">
                          <TopicMastery topics={dashboardData?.topics} />
                        </div>
                        <div className="xl:col-span-7 h-full">
                          <RecentTransmissions recentSubmissions={dashboardData?.recentSubmissions} />
                        </div>
                      </div>

                      {/* 5. Lower Level: Execution (Approx 33%) & Growth (Approx 66%) */}
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-4 h-full">
                          <ExecutionIntelligence 
                            languages={dashboardData?.languages} 
                            errors={dashboardData?.errors} 
                            recentIncidents={dashboardData?.recentIncidents}
                          />
                        </div>
                        <div className="xl:col-span-8 h-full flex flex-col">
                          <GrowthTrajectory growth={dashboardData?.growth} />
                        </div>
                      </div>
                      
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>

      <CreateSessionModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} roomConfig={roomConfig} setRoomConfig={setRoomConfig} onCreateRoom={handleCreateRoom} isCreating={createSessionMutation.isPending} />

      {/* --- Edit Profile Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1b1b1f] border border-[#231c2f] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#231c2f] flex justify-between items-center bg-[#151518]">
              <h2 className="text-lg font-bold text-white">Edit Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                  {draftData.profilePic ? (
                    <img src={draftData.profilePic} alt="Draft Profile" className="w-24 h-24 rounded-full border-2 border-[#3a3a45] object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-2 border-[#3a3a45] bg-[#111113] flex items-center justify-center text-2xl font-bold text-white">
                      {userInitials}
                    </div>
                  )}
                  <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <label htmlFor="profileImageUpload" className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg border-2 border-[#1b1b1f]" title="Upload new picture">
                    <Camera size={14} />
                  </label>
                </div>
                <span className="text-xs text-gray-500">Allowed: JPG, PNG, GIF</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-300">Name</label>
                  <input type="text" value={draftData.name} onChange={(e) => setDraftData({ ...draftData, name: e.target.value })} className="w-full bg-[#111113] border border-[#3a3a45] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-300">Nickname</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                    <input type="text" value={draftData.nickname} onChange={(e) => setDraftData({ ...draftData, nickname: e.target.value })} className="w-full bg-[#111113] border border-[#3a3a45] rounded-lg pl-7 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-300">Description</label>
                <textarea value={draftData.description} onChange={(e) => setDraftData({ ...draftData, description: e.target.value })} rows={4} placeholder="Write something about yourself..." className="w-full bg-[#111113] border border-[#3a3a45] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#231c2f] flex justify-end gap-3 bg-[#151518]">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSaveProfile} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default DashboardPage;