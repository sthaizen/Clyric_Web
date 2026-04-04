import React, { useState, useEffect, useRef } from "react";
import {
  Search, ChevronRight, ChevronDown, Menu, X, BookOpen,
  ArrowLeft, ArrowRight, ExternalLink, Info, AlertTriangle,
  Lightbulb, CheckCircle, Code2, Copy, Check, Hash,
  Home, Zap, User, LayoutDashboard, HelpCircle, CreditCard,
  Shield, Settings, Users, MessageSquare, Star, FileQuestion,
  Terminal, Layers, Monitor, PlayCircle, Globe, Cpu, Github,
  Box, MousePointer2, Lock, Activity, Sparkles
} from "lucide-react";
import MonacoEditor from "@monaco-editor/react";

import { docsApi } from "../api/docsApi";
import Navbar from "../components/Navbar";

// Extracted Components
import { Step, Callout, CodeBlock } from "../components/Docs/DocsComponents";
import { DocsFeatureContent } from "../components/Docs/DocsFeatureContent";

// ─── Dynamic Article Renderer ───────────────────────────────────────────────────
const DynamicSection = ({ section }) => {
  if (section.heading) {
    return (
      <div className="w-full">
        <h2 id={section.id} className="text-[26px] font-bold text-zinc-100 mt-15 mb-5 tracking-tight scroll-mt-24 after:content-[''] after:block after:w-10 after:h-[3px] after:bg-zinc-100 after:mt-3 after:rounded-full after:opacity-20">
          {section.heading}
        </h2>
        <SectionContent section={section} />
      </div>
    );
  }
  return <SectionContent section={section} />;
};

const SectionContent = ({ section }) => {
  switch (section.type) {
    case "text":
      return (
        <div
          className="mb-5 text-zinc-400 leading-relaxed text-[16px] docs-rich-content break-words overflow-wrap-anywhere min-w-0"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      );

    case "steps":
      return (
        <div className="my-8 w-full">
          {section.steps?.map((s, i) => (
            <Step key={s.id} number={i + 1} title={s.title}>
              {s.content}
            </Step>
          ))}
        </div>
      );

    case "callout":
      return (
        <div className="w-full">
          <Callout type={section.calloutType || "info"} title={section.title}>
            {section.content}
          </Callout>
        </div>
      );

    case "code":
      return (
        <div className="w-full overflow-hidden rounded-2xl my-6">
          <CodeBlock language={section.language}>
            {section.code || ""}
          </CodeBlock>
        </div>
      );

    case "image":
      return (
        <div className="my-8 group w-full">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-3 flex items-center justify-center overflow-hidden transition-all group-hover:border-white/20">
            {section.imageUrl ? (
              <img src={section.imageUrl} alt={section.altText || section.caption} className="max-w-full h-auto rounded-2xl shadow-sm object-contain" />
            ) : (
              <div className="py-20 text-zinc-600 italic flex flex-col items-center gap-3">
                <Monitor className="w-10 h-10 opacity-20" />
                Image missing
              </div>
            )}
          </div>
          {section.caption && <p className="text-center text-sm text-zinc-500 mt-3">{section.caption}</p>}
        </div>
      );

    case "faq":
      return (
        <div className="space-y-4 my-8 w-full">
          {section.faqs?.map((f) => (
            <div key={f.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
              <p className="text-[16px] font-bold text-zinc-100 mb-3">{f.question}</p>
              <p className="text-[15px] text-zinc-400 mb-0 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

const ArticleBody = ({ page }) => {
  if (!page) return <div className="py-20 text-zinc-600 text-center flex flex-col items-center gap-3"><HelpCircle className="w-10 h-10 opacity-20" />Page not found.</div>;
  if (!page.sections || page.sections.length === 0) {
    if (page.shortDesc && page.shortDesc.trim() !== "" && page.shortDesc !== "<p><br></p>") return null;
    return <div className="py-20 text-zinc-600 text-center italic">This page has no content yet.</div>;
  }
  return (
    <div className="text-zinc-300 w-full">
      {page.sections.map(sec => <DynamicSection key={sec.id} section={sec} />)}
    </div>
  );
};

// ─── Main Public DocsPage Redesign ─────────────────────────────────────────────────
export default function DocsPage() {
  const [dbCategories, setDbCategories] = useState([]);
  const [dbPages, setDbPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const [cats, pgs] = await Promise.all([
          docsApi.getCategories(),
          docsApi.getPages("Published")
        ]);

        const structuredCats = cats
          .filter(c => c.visible !== false)
          .sort((a, b) => (Number(a.sortOrder) || 999) - (Number(b.sortOrder) || 999))
          .map(c => ({
            id: c.slug || c.name,
            label: c.name,
            icon: c.name.toLowerCase().includes("getting started") ? Zap :
              c.name.toLowerCase().includes("ui") ? Box :
                c.name.toLowerCase().includes("sdks") ? Terminal :
                  c.name.toLowerCase().includes("solving problems") ? Code2 :
                    c.name.toLowerCase().includes("study plans") ? BookOpen :
                      c.name.toLowerCase().includes("quests") ? Sparkles :
                        c.name.toLowerCase().includes("collaboration") ? Users :
                          c.name.toLowerCase().includes("profile") ? User :
                            c.name.toLowerCase().includes("admin") ? Shield :
                              c.name.toLowerCase().includes("payment") ? CreditCard : FileQuestion,
            pages: pgs
              .filter(p => p.category?.toLowerCase() === c.name?.toLowerCase())
              .sort((a, b) => (Number(a.sortOrder) || 999) - (Number(b.sortOrder) || 999))
              .map(p => ({
                id: p._id || p.id,
                label: p.title,
                slug: p.slug,
                fullData: p
              }))
          }));

        setDbCategories(structuredCats);
        setDbPages(pgs);

        const path = window.location.pathname;
        const slugMatch = path.match(/\/docs\/(.+)/);
        if (slugMatch) {
          setActiveSlug(slugMatch[1]);
          setIsHome(false);
        }
      } catch (err) {
        console.error("Failed to load documents", err);
      }
    };
    fetchDocs();
  }, []);

  const activePageData = dbPages.find(p => p.slug === activeSlug);

  const [expandedCategories, setExpandedCategories] = useState([]);
  useEffect(() => {
    if (expandedCategories.length === 0 && dbCategories.length > 0) {
      // Initially, only expand the "Getting Started" category
      const initialExpanded = dbCategories
        .filter(c => c.label.toLowerCase().includes("getting started"))
        .map(c => c.id);

      setExpandedCategories(initialExpanded);
    }
  }, [dbCategories]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");

  const toggleCategory = (id) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigateTo = (slug, targetId = null) => {
    if (slug === "" || slug === "home") {
      setIsHome(true);
      setActiveSlug("");
      setSidebarOpen(false);
      setActiveSection(targetId || "");
      if (targetId) {
        setTimeout(() => scrollToId(targetId), 100);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    setActiveSlug(slug);
    setIsHome(false);
    setSidebarOpen(false);
    setActiveSection("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredCategories = dbCategories.map(cat => ({
    ...cat,
    pages: cat.pages.filter(p =>
      searchQuery ? p.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
  })).filter(cat => cat.pages.length > 0);

  let prevPage = null;
  let nextPage = null;
  let allPagesFlat = [];
  dbCategories.forEach(c => {
    c.pages.forEach(p => { allPagesFlat.push(p); });
  });

  const currentIndex = allPagesFlat.findIndex(p => p.slug === activeSlug);
  if (currentIndex > 0) prevPage = allPagesFlat[currentIndex - 1];
  if (currentIndex !== -1 && currentIndex < allPagesFlat.length - 1) nextPage = allPagesFlat[currentIndex + 1];

  const articleToc = activePageData?.sections
    ?.filter(s => s.heading)
    ?.map(s => ({ id: s.id, label: s.heading })) || [];



  return (
    <div className="min-h-screen bg-[#0b0b0c] text-zinc-100 font-sans selection:bg-zinc-800">
      <Navbar forceLight={false} />

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[49] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN LAYOUT WRAPPER ── */}
      {/* CRITICAL FIX: Removed overflow-x-hidden from parents to allow child stickiness to work */}
      <div className="flex pt-20 min-h-screen w-full">

        {/* ── SIDEBAR ── */}
        <aside className={`
         /* 1. Positioning & Sticky Logic */
        fixed lg:sticky top-10 left-0 z-50
        
        /* 2. Dimensions & Clipping */
        w-[280px] h-[calc(100vh-5rem)] shrink-0 
        
        /* 3. Smooth Scrolling Logic */
        overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
        hover:scrollbar-thumb-white/20
        
        /* 4. Visuals & Performance */
        bg-[#0b0b0c] border-r border-white/5 
        /* 'transform-gpu' ensures the transition is handled by the graphics card for 60fps smoothness */
        transition-transform duration-500 ease-in-out transform-gpu
        
        /* 5. The Dynamic Offset */
        /* Starts with a large top padding to simulate being "below" the header.
          As the page scrolls, the sticky container moves up smoothly. */
        pt-20 lg:pt-12 px-4 pb-16
        
        /* 6. Toggle State */
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          {/* TOP NAVIGATION SECTION */}
          <div className="flex flex-col gap-1.5 mb-10 shrink-0">
            {[
              { label: "Overview", icon: Home, slug: "", active: isHome && activeSection === "" },
              { label: "Practice Problems", icon: Code2, slug: "problem-library", active: isHome && activeSection === "problem-library" },
              { label: "Collaboration", icon: Users, slug: "collaborative-ide", active: isHome && activeSection === "collaborative-ide" },
              { label: "Performance", icon: Activity, slug: "skill-analytics", active: isHome && activeSection === "skill-analytics" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigateTo("", item.slug)}
                className={`
                  group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-semibold
                  transition-all duration-200 ease-out active:scale-[0.98]
                  ${item.active
                    ? "bg-white text-[#0b0b0c] shadow-lg shadow-white/5"
                    : "text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06]"}
                `}
              >
                <item.icon className={`w-4 h-4 transition-colors ${item.active ? "text-[#0b0b0c]" : "text-zinc-500 group-hover:text-zinc-200"}`} />
                {item.label}
              </button>
            ))}
          </div>

          {/* DYNAMIC CATEGORIES SECTION */}
          <div className="space-y-2">
            {filteredCategories.map(category => {
              const Icon = category.icon;
              const isEx = expandedCategories.includes(category.id);
              return (
                <div key={category.id} className="group/cat">
                  <button
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[11px] font-bold text-zinc-500 uppercase tracking-[0.1em] w-full hover:text-zinc-200 transition-colors select-none"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-600 group-hover/cat:text-zinc-400 transition-colors" />
                    <span className="flex-1 text-left">{category.label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 ${isEx ? "rotate-90 opacity-100 text-zinc-300" : "opacity-30"}`} />
                  </button>

                  <div className={`
                    grid transition-all duration-300 ease-in-out
                    ${isEx ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 pointer-events-none"}
                  `}>
                    <div className="overflow-hidden pl-3 border-l border-white/5 ml-4.5 space-y-1">
                      {category.pages.map(p => (
                        <button
                          key={p.id}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium w-full text-left 
                            transition-all duration-200 active:scale-[0.97]
                            ${activeSlug === p.slug
                              ? "text-white bg-white/10"
                              : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}
                          `}
                          onClick={() => navigateTo(p.slug)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 flex justify-center px-4 sm:px-8 w-full min-w-0 overflow-hidden">
          <div className="w-full max-w-[1040px] pt-15 pb-22 min-w-0">
            {isHome ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-[14px] font-bold text-zinc-500 mb-2 tracking-wide uppercase">Introduction</p>
                <h1 className="text-4xl sm:text-[40px] font-extrabold text-zinc-100 tracking-tight leading-tight mb-4">
                  Master coding interviews with Clyric
                </h1>
                <p className="text-[19px] text-zinc-400 leading-relaxed font-medium mb-8">
                  Practice real interview-style problems, track your progress, follow structured study plans, and improve with collaborative coding sessions built for serious preparation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-15">
                  <div
                    className="group bg-[#0b0b0c] border border-white/5 rounded-3xl p-8 transition-all duration-300 ease-in-out flex flex-col gap-4 shadow-sm hover:border-zinc-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
                    onClick={() => navigateTo(dbPages[0]?.slug)}
                  >
                    <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-100 transition-colors group-hover:bg-zinc-100 group-hover:text-[#0b0b0c]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <p className="text-[19px] font-bold text-zinc-100">Problems & Practice</p>
                    <p className="text-[15px] text-zinc-500 leading-relaxed">
                      Solve carefully curated coding problems across topics and difficulty levels to strengthen your problem-solving skills.
                    </p>
                  </div>

                  <div className="group bg-[#0b0b0c] border border-white/5 rounded-3xl p-8 transition-all duration-300 ease-in-out flex flex-col gap-4 shadow-sm hover:border-zinc-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer">
                    <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-100 transition-colors group-hover:bg-zinc-100 group-hover:text-[#0b0b0c]">
                      <Box className="w-5 h-5" />
                    </div>
                    <p className="text-[19px] font-bold text-zinc-100">Study Plans</p>
                    <p className="text-[15px] text-zinc-500 leading-relaxed">
                      Follow guided learning paths designed to help you prepare consistently for placements, interviews, and contests.
                    </p>
                  </div>

                  <div
                    onClick={() => scrollToId("skill-analytics")}
                    className="group bg-[#0b0b0c] border border-white/5 rounded-3xl p-8 transition-all duration-300 ease-in-out flex flex-col gap-4 shadow-sm hover:border-zinc-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-100 transition-colors group-hover:bg-zinc-100 group-hover:text-[#0b0b0c]">
                      <Activity className="w-5 h-5" />
                    </div>
                    <p className="text-[19px] font-bold text-zinc-100">Progress Analytics</p>
                    <p className="text-[15px] text-zinc-500 leading-relaxed">
                      Track solved problems, streaks, weak topics, and performance insights to stay consistent and improve faster.
                    </p>
                  </div>

                  <div
                    onClick={() => scrollToId("collaborative-ide")}
                    className="group bg-[#0b0b0c] border border-white/5 rounded-3xl p-8 transition-all duration-300 ease-in-out flex flex-col gap-4 shadow-sm hover:border-zinc-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-100 transition-colors group-hover:bg-zinc-100 group-hover:text-[#0b0b0c]">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-[19px] font-bold text-zinc-100">Collaborative Coding</p>
                    <p className="text-[15px] text-zinc-500 leading-relaxed">
                      Practice together with friends or peers in live coding sessions, share ideas, and prepare for real interview environments.
                    </p>
                  </div>
                </div>

                <DocsFeatureContent />

                {/* Home Footer Navigation */}
                <div className="flex justify-end items-center mt-12 pt-8 border-t border-white/10">
                  {(() => {
                    const homeSections = [
                      { id: "", label: "Overview", next: { id: "problem-library", label: "Practice Problems" } },
                      { id: "problem-library", label: "Practice Problems", next: { id: "collaborative-ide", label: "Collaboration" } },
                      { id: "collaborative-ide", label: "Collaboration", next: { id: "skill-analytics", label: "Performance" } },
                      { id: "skill-analytics", label: "Performance", next: allPagesFlat[0] ? { slug: allPagesFlat[0].slug, label: allPagesFlat[0].label } : null }
                    ];
                    const current = homeSections.find(s => s.id === activeSection);
                    const next = current?.next;

                    if (!next) return null;

                    return (
                      <button
                        onClick={() => navigateTo(next.slug || "", next.id)}
                        className="group flex flex-col items-end gap-2 text-right bg-transparent border-none p-0 cursor-pointer max-w-[300px]"
                      >
                        <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">Next</span>
                        <div className="flex items-center gap-3 text-[16px] font-bold text-zinc-100 group-hover:translate-x-1 transition-transform">
                          <span className="truncate">{next.label}</span> <ArrowRight className="w-4 h-4 shrink-0" />
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </div>
            ) : (
              /* Standard Article Layout */
              <div className="animate-in fade-in duration-300 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-zinc-500 mb-8">
                  <span>Docs</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  <span className="text-zinc-400">{activePageData?.category}</span>
                  {activePageData?.title && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      <span className="text-zinc-100 font-bold">{activePageData.title}</span>
                    </>
                  )}
                </div>

                <header className="mb-10 min-w-0">
                  <h1 className="text-4xl sm:text-[40px] font-extrabold text-zinc-100 tracking-tight leading-tight mb-6 break-words">
                    {activePageData?.title || "Documentation"}
                  </h1>
                  <div
                    className="text-[18px] text-zinc-400 leading-relaxed font-medium mb-12 docs-rich-content border-b border-white/5 pb-10 break-words min-w-0"
                    dangerouslySetInnerHTML={{ __html: activePageData?.shortDesc || "Detailed technical documentation and guides." }}
                  />
                </header>

                <ArticleBody page={activePageData} />

                {/* Footer Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mt-16 pt-8 border-t border-white/10">
                  {prevPage ? (
                    <button onClick={() => navigateTo(prevPage.slug)} className="group flex flex-col items-start gap-2 text-left bg-transparent border-none p-0 cursor-pointer max-w-[200px]">
                      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">Previous</span>
                      <div className="flex items-center gap-3 text-[16px] font-bold text-zinc-100 group-hover:-translate-x-1 transition-transform">
                        <ArrowLeft className="w-4 h-4 shrink-0" /> <span className="truncate">{prevPage.label}</span>
                      </div>
                    </button>
                  ) : <div />}

                  {nextPage && (
                    <button onClick={() => navigateTo(nextPage.slug)} className="group flex flex-col items-end gap-2 text-right bg-transparent border-none p-0 cursor-pointer max-w-[200px]">
                      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">Next</span>
                      <div className="flex items-center gap-3 text-[16px] font-bold text-zinc-100 group-hover:translate-x-1 transition-transform">
                        <span className="truncate">{nextPage.label}</span> <ArrowRight className="w-4 h-4 shrink-0" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT TOC ── */}
          {/* Ensure the TOC is also sticky and doesn't get cut off! */}
          {!isHome && articleToc.length > 0 && (
            <aside className="hidden xl:block w-[240px] shrink-0 pt-14 pb-12 self-start sticky top-[80px] max-h-[calc(100vh-80px)] overflow-y-auto ml-8 scrollbar-none">
              <div className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-[0.12em] mb-5 flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> On this page</div>
              <div className="space-y-1">
                {articleToc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`flex items-center gap-2.5 text-[13px] font-medium py-1.5 cursor-pointer transition-colors border-l-2 pl-4 -ml-px ${activeSection === item.id ? "text-zinc-100 font-bold border-zinc-100" : "text-zinc-500 border-transparent hover:text-zinc-200"}`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}