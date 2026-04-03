import React, { useState, useEffect, useRef } from "react";
import {
  Search, ChevronRight, ChevronDown, Menu, X, BookOpen,
  ArrowLeft, ArrowRight, ExternalLink, Info, AlertTriangle,
  Lightbulb, CheckCircle, Code2, Copy, Check, Hash,
  Home, Zap, User, LayoutDashboard, HelpCircle, CreditCard,
  Shield, Settings, Users, MessageSquare, Star, FileQuestion
} from "lucide-react";
import MonacoEditor from "@monaco-editor/react";

import { docsApi } from "../api/docsApi";

// ─── Step Component ────────────────────────────────────────────────────────────
const Step = ({ number, title, children }) => (
  <div className="flex gap-4 my-4">
    <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[12px] font-black flex items-center justify-center shrink-0 mt-0.5">
      {number}
    </div>
    <div className="flex-1 min-w-0">
      {title && <p className="text-[15px] font-bold text-slate-900 mb-1">{title}</p>}
      {children && <p className="docs-p" style={{ whiteSpace: "pre-wrap" }}>{children}</p>}
    </div>
  </div>
);

// ─── Callout Component ─────────────────────────────────────────────────────────
const CALLOUT_STYLES = {
  info:    { bg: "#eff6ff", border: "#bfdbfe", icon: Info,         color: "#1d4ed8", label: "Info" },
  warning: { bg: "#fffbeb", border: "#fcd34d", icon: AlertTriangle, color: "#b45309", label: "Warning" },
  tip:     { bg: "#f0fdf4", border: "#86efac", icon: Lightbulb,    color: "#15803d", label: "Tip" },
  success: { bg: "#f0fdf4", border: "#86efac", icon: CheckCircle,  color: "#15803d", label: "Success" },
};
const Callout = ({ type = "info", title, children }) => {
  const s = CALLOUT_STYLES[type] || CALLOUT_STYLES.info;
  const Icon = s.icon;
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 18px", margin: "20px 0", display: "flex", gap: 12 }}>
      <Icon style={{ color: s.color, width: 18, height: 18, flexShrink: 0, marginTop: 2 }} />
      <div>
        {title && <p style={{ fontWeight: 700, color: s.color, fontSize: 14, marginBottom: 4 }}>{title}</p>}
        <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{children}</p>
      </div>
    </div>
  );
};

// ─── CodeBlock Component (Monaco read-only) ────────────────────────────────────
const CodeBlock = ({ language = "bash", children }) => {
  const [copied, setCopied] = useState(false);
  const code = (children || "").trim();
  const lineCount = code.split("\n").length;
  const height = Math.max(56, Math.min(lineCount * 19 + 24, 480));

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ margin: "20px 0", borderRadius: 14, overflow: "hidden", border: "1px solid #1e293b" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f172a", padding: "8px 14px" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{language}</span>
        <button
          onClick={handleCopy}
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: copied ? "#34d399" : "#64748b", background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 6, transition: "color 0.15s" }}
        >
          {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <MonacoEditor
        height={height}
        language={language === "bash" ? "shell" : language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: "on",
          renderLineHighlight: "none",
          folding: false,
          contextmenu: false,
          scrollbar: { vertical: "hidden", horizontal: "auto" },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
};

// ─── Dynamic Article Renderer ───────────────────────────────────────────────────
const DynamicSection = ({ section }) => {
  if (section.heading) {
    return (
      <>
        <h2 id={section.id} className="docs-h2">{section.heading}</h2>
        <SectionContent section={section} />
      </>
    );
  }
  return <SectionContent section={section} />;
};

const SectionContent = ({ section }) => {
  switch (section.type) {
    case "text":
      return <p className="docs-p" style={{ whiteSpace: "pre-wrap" }}>{section.content}</p>;
    
    case "steps":
      return (
        <>
          {section.steps?.map((s, i) => (
            <Step key={s.id} number={i + 1} title={s.title}>
              {s.content}
            </Step>
          ))}
        </>
      );
      
    case "callout":
      return (
        <Callout type={section.calloutType || "info"} title={section.title}>
          {section.content}
        </Callout>
      );

    case "code":
      return (
        <CodeBlock language={section.language}>
          {section.code || ""}
        </CodeBlock>
      );

    case "image":
      return (
        <div className="docs-screenshot-container">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-center justify-center overflow-hidden">
            {section.imageUrl ? (
              <img src={section.imageUrl} alt={section.altText || section.caption} className="max-w-full rounded-xl" />
            ) : (
              <div className="py-12 text-slate-300">Image missing</div>
            )}
          </div>
          {section.caption && <p className="docs-caption">{section.caption}</p>}
        </div>
      );

    case "faq":
      return (
        <div className="space-y-4 my-6">
          {section.faqs?.map((f) => (
            <div key={f.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <p className="text-[15px] font-bold text-slate-900 mb-2">{f.question}</p>
              <p className="docs-p mb-0">{f.answer}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

const ArticleBody = ({ page }) => {
  if (!page) return <div className="py-12 text-slate-400">Page not found.</div>;
  if (!page.sections || page.sections.length === 0) {
    return <div className="py-12 text-slate-400">This page has no content yet.</div>;
  }
  return (
    <div className="docs-article-body">
      {page.sections.map(sec => <DynamicSection key={sec.id} section={sec} />)}
    </div>
  );
};

// ─── Main Public Docs Page ─────────────────────────────────────────────────
export default function DocsPage() {
  // Load mock DB from localStorage
  const [dbCategories, setDbCategories] = useState([]);
  const [dbPages, setDbPages] = useState([]);
  const [loading, setLoading] = useState(true);

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
            icon: FileQuestion,
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
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Determine active page
  const [activeSlug, setActiveSlug] = useState("");
  useEffect(() => {
    if (!activeSlug && dbCategories.length > 0 && dbCategories[0].pages.length > 0) {
      setActiveSlug(dbCategories[0].pages[0].slug);
    }
  }, [dbCategories, activeSlug]);

  const activePageData = dbPages.find(p => p.slug === activeSlug);

  const [expandedCategories, setExpandedCategories] = useState([]);
  useEffect(() => {
    if (expandedCategories.length === 0 && dbCategories.length > 0) {
      setExpandedCategories(dbCategories.map(c => c.id));
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

  const navigateTo = (slug) => {
    setActiveSlug(slug);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter search
  const filteredCategories = dbCategories.map(cat => ({
    ...cat,
    pages: cat.pages.filter(p =>
      searchQuery ? p.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
  })).filter(cat => cat.pages.length > 0);

  // Compute Prev / Next
  let prevPage = null;
  let nextPage = null;
  let allPagesFlat = [];
  dbCategories.forEach(c => {
    c.pages.forEach(p => { allPagesFlat.push(p); });
  });
  
  const currentIndex = allPagesFlat.findIndex(p => p.slug === activeSlug);
  if (currentIndex > 0) prevPage = allPagesFlat[currentIndex - 1];
  if (currentIndex !== -1 && currentIndex < allPagesFlat.length - 1) nextPage = allPagesFlat[currentIndex + 1];

  // Dynamic TOC
  const articleToc = activePageData?.sections
    ?.filter(s => s.heading)
    ?.map(s => ({ id: s.id, label: s.heading })) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a2e]"></div>
      </div>
    );
  }

  return (
    <div className="docs-root">
      <style>{`
        .docs-root {
          font-family: 'Manrope', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          color: #1a1a2e;
        }

        /* ── TOP HEADER ── */
        .docs-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 60px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #f1f1f4;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 16px;
          z-index: 100;
        }
        .docs-header-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: inherit;
          flex-shrink: 0;
        }
        .docs-header-logo-mark {
          display: flex; flex-direction: column; gap: 2px;
        }
        .docs-divider { width: 1px; height: 20px; background: #e5e7eb; flex-shrink: 0; }
        .docs-badge {
          font-size: 11px; font-weight: 800; color: #64748b;
          background: #f1f5f9; padding: 2px 8px; border-radius: 6px;
          border: 1px solid #e2e8f0; letter-spacing: 0.05em; text-transform: uppercase;
          flex-shrink: 0;
        }
        .docs-search-bar {
          flex: 1; max-width: 440px; position: relative; display: flex; align-items: center;
        }
        .docs-search-input {
          width: 100%; padding: 8px 14px 8px 36px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 10px; font-size: 13px; font-weight: 600;
          color: #1e293b; outline: none; transition: all 0.15s;
          font-family: inherit;
        }
        .docs-search-input:focus {
          background: white; border-color: #cbd5e1;
          box-shadow: 0 0 0 3px rgba(100,116,139,0.08);
        }
        .docs-search-icon {
          position: absolute; left: 10px; color: #94a3b8;
          display: flex; align-items: center;
        }
        .docs-search-kbd {
          position: absolute; right: 10px;
          display: flex; align-items: center; gap: 1px;
          font-size: 10px; font-weight: 800; color: #94a3b8;
        }
        .docs-header-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .docs-hamburger {
          display: none; padding: 8px; border-radius: 8px; cursor: pointer;
          background: none; border: none; color: #64748b;
        }

        /* ── LAYOUT ── */
        .docs-layout {
          display: flex; padding-top: 60px; min-height: 100vh;
        }

        /* ── LEFT SIDEBAR ── */
        .docs-sidebar {
          width: 260px; flex-shrink: 0; position: fixed;
          top: 60px; left: 0; bottom: 0;
          overflow-y: auto; padding: 24px 12px 40px;
          border-right: 1px solid #f1f5f9;
          background: #fafbfc;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.1) transparent;
          z-index: 50;
          transition: transform 0.25s ease;
        }
        .docs-sidebar::-webkit-scrollbar { width: 4px; }
        .docs-sidebar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 99px; }

        .docs-sidebar-section { margin-bottom: 8px; }
        .docs-sidebar-section-header {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 12px; border-radius: 8px; cursor: pointer;
          font-size: 12px; font-weight: 800; color: #64748b;
          text-transform: uppercase; letter-spacing: 0.08em;
          border: none; background: none; width: 100%;
          transition: all 0.1s; user-select: none;
        }
        .docs-sidebar-section-header:hover { background: #f1f5f9; color: #1e293b; }
        .docs-sidebar-pages { padding-left: 8px; margin-top: 2px; }
        .docs-sidebar-link {
          display: flex; align-items: center; gap-8px;
          padding: 6px 12px; border-radius: 8px; cursor: pointer;
          font-size: 13px; font-weight: 600; color: #64748b;
          border: none; background: none; width: 100%;
          text-align: left; transition: all 0.12s;
          margin-bottom: 1px; position: relative;
        }
        .docs-sidebar-link:hover { background: #f1f5f9; color: #1e293b; }
        .docs-sidebar-link.active {
          background: #fff; color: #1e293b; font-weight: 700;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px #e2e8f0;
        }
        .docs-sidebar-link.active::before {
          content: ''; position: absolute; left: 0; top: 6px; bottom: 6px;
          width: 3px; background: #f97316; border-radius: 0 2px 2px 0;
        }

        /* ── MAIN CONTENT ── */
        .docs-main {
          flex: 1; margin-left: 260px;
          display: flex; justify-content: center;
          padding: 0 24px;
        }
        .docs-content-wrapper {
          width: 100%; max-width: 720px;
          padding: 40px 0 80px;
        }

        /* Breadcrumb */
        .docs-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #94a3b8; font-weight: 600;
          margin-bottom: 20px;
        }
        .docs-breadcrumb span { cursor: pointer; }
        .docs-breadcrumb span:hover { color: #1e293b; }

        /* Article Header */
        .docs-article-header { margin-bottom: 40px; }
        .docs-article-title {
          font-size: 30px; font-weight: 800; color: #0f172a;
          letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 12px;
        }
        .docs-article-desc {
          font-size: 16px; color: #64748b; line-height: 1.7;
          font-weight: 500; border-bottom: 1px solid #f1f5f9; padding-bottom: 32px;
        }

        /* Article Body Typography */
        .docs-article-body { font-size: 15px; line-height: 1.8; color: #374151; }
        .docs-h2 {
          font-size: 20px; font-weight: 800; color: #0f172a;
          margin-top: 40px; margin-bottom: 12px; letter-spacing: -0.01em;
          scroll-margin-top: 80px; padding-top: 4px;
        }
        .docs-p { margin-bottom: 16px; color: #4b5563; line-height: 1.8; }
        .docs-list { margin-bottom: 16px; padding-left: 20px; }
        .docs-list li { margin-bottom: 10px; color: #4b5563; line-height: 1.7; }
        .docs-list li strong { color: #1e293b; }
        .docs-inline-code {
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 5px; padding: 2px 6px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 12px; color: #e11d48;
        }

        /* Screenshot placeholder */
        .docs-screenshot-container { margin: 28px 0; }
        .docs-screenshot-placeholder {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 48px 24px; text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 200px;
        }
        .docs-caption {
          font-size: 12px; color: #94a3b8; text-align: center;
          margin-top: 10px; font-weight: 600; font-style: italic;
        }

        /* Feature Cards */
        .docs-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
        .docs-feature-card {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 16px;
        }

        /* Nav Footer */
        .docs-nav-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 64px; padding-top: 24px; border-top: 1px solid #f1f5f9;
          gap: 16px;
        }
        .docs-nav-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 20px; border: 1px solid #e2e8f0;
          border-radius: 12px; cursor: pointer; background: white;
          text-align: left; transition: all 0.15s; text-decoration: none; flex: 1;
          max-width: 260px;
        }
        .docs-nav-btn:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .docs-nav-btn.next { margin-left: auto; text-align: right; flex-direction: row-reverse; }
        .docs-nav-label { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
        .docs-nav-title { font-size: 14px; font-weight: 700; color: #1e293b; }

        /* RIGHT TOC */
        .docs-toc {
          width: 220px; flex-shrink: 0; position: sticky; top: 80px;
          padding: 0 0 40px; align-self: flex-start;
          display: none;
        }
        .docs-toc-title {
          font-size: 11px; font-weight: 800; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .docs-toc-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; color: #94a3b8;
          padding: 5px 0; cursor: pointer; transition: color 0.1s;
          text-decoration: none;
        }
        .docs-toc-link:hover, .docs-toc-link.active { color: #1e293b; }
        .docs-toc-link.active { font-weight: 700; }
        .docs-toc-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #e2e8f0; flex-shrink: 0; transition: background 0.1s;
        }
        .docs-toc-link.active .docs-toc-dot { background: #f97316; }

        /* Mobile overlay */
        .docs-sidebar-overlay {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 49;
        }

        @media (min-width: 1200px) {
          .docs-toc { display: block; }
          .docs-main { padding: 0 24px 0 0; }
          .docs-content-wrapper { max-width: 680px; }
        }

        @media (max-width: 768px) {
          .docs-sidebar { transform: translateX(-100%); }
          .docs-sidebar.open { transform: translateX(0); }
          .docs-sidebar-overlay.open { display: block; }
          .docs-hamburger { display: flex; }
          .docs-main { margin-left: 0; }
          .docs-article-title { font-size: 24px; }
          .docs-cards-grid { grid-template-columns: 1fr; }
          .docs-search-bar { max-width: 260px; }
          .docs-badge { display: none; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header className="docs-header">
        <button className="docs-hamburger" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>

        <a href="/" className="docs-header-brand">
          <div className="docs-header-logo-mark">
            <div style={{ width: 21, height: 6, background: "#0f172a", borderRadius: 2 }}></div>
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ width: 6, height: 6, background: "#0f172a", borderRadius: 2 }}></div>
              <div style={{ width: 16, height: 6, background: "#f97316", borderRadius: 2 }}></div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ width: 13, height: 6 }}></div>
              <div style={{ width: 9, height: 9, background: "#0f172a", borderRadius: "2px 2px 4px 2px" }}></div>
            </div>
          </div>
          <span style={{ fontWeight: 900, fontSize: 15, color: "#0f172a", letterSpacing: "-0.02em" }}>CLYRIC</span>
        </a>

        <div className="docs-divider"></div>
        <span className="docs-badge">Docs</span>

        <div className="docs-search-bar">
          <span className="docs-search-icon">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="docs-search-input"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <span className="docs-search-kbd">
            <span>⌘</span><span>K</span>
          </span>
        </div>

        <div className="docs-header-actions">
          <a
            href="/"
            style={{
              fontSize: 13, fontWeight: 700, color: "#64748b",
              textDecoration: "none", padding: "6px 12px",
              borderRadius: 8, transition: "all 0.1s"
            }}
            onMouseEnter={e => e.target.style.color = "#1e293b"}
            onMouseLeave={e => e.target.style.color = "#64748b"}
          >
            Sign In
          </a>
          <a
            href="/"
            style={{
              fontSize: 13, fontWeight: 700, color: "white",
              background: "#0f172a", padding: "7px 16px",
              borderRadius: 9, textDecoration: "none"
            }}
          >
            Get Started →
          </a>
        </div>
      </header>

      {/* ── SIDEBAR MOBILE OVERLAY ── */}
      <div
        className={`docs-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="docs-layout">
        {/* ── LEFT SIDEBAR ── */}
        <nav className={`docs-sidebar ${sidebarOpen ? "open" : ""}`}>
          {/* Home link */}
          <a
            href="/"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 12px", borderRadius: 8, marginBottom: 16,
              fontSize: 13, fontWeight: 700, color: "#64748b",
              textDecoration: "none", transition: "all 0.1s"
            }}
          >
            <Home className="w-4 h-4" />
            Home
          </a>

          {filteredCategories.map(category => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategories.includes(category.id);
            return (
              <div key={category.id} className="docs-sidebar-section">
                <button
                  className="docs-sidebar-section-header"
                  onClick={() => toggleCategory(category.id)}
                >
                  <CategoryIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span style={{ flex: 1, textAlign: "left" }}>{category.label}</span>
                  {isExpanded
                    ? <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    : <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  }
                </button>

                {isExpanded && (
                  <div className="docs-sidebar-pages">
                    {category.pages.map(page => (
                      <button
                        key={page.id}
                        className={`docs-sidebar-link ${activeSlug === page.slug ? "active" : ""}`}
                        onClick={() => navigateTo(page.slug)}
                      >
                        {page.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main className="docs-main">
          <div className="docs-content-wrapper">
            {/* Breadcrumb */}
            <div className="docs-breadcrumb">
              <span onClick={() => {}}>Docs</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <span>{activePageData?.category || "Documentation"}</span>
              {activePageData?.title && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  <span>{activePageData.title}</span>
                </>
              )}
            </div>

            {/* Article Header */}
            <header className="docs-article-header">
              <h1 className="docs-article-title">{activePageData?.title || "Welcome to Docs"}</h1>
              <p className="docs-article-desc">{activePageData?.shortDesc || "Select an article from the sidebar to begin reading."}</p>
            </header>

            {/* Article Body */}
            <ArticleBody page={activePageData} />

            {/* Prev / Next Navigation */}
            <div className="docs-nav-footer">
              {prevPage ? (
                <button
                  className="docs-nav-btn"
                  onClick={() => navigateTo(prevPage.slug)}
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="docs-nav-label">Previous</p>
                    <p className="docs-nav-title">{prevPage.label}</p>
                  </div>
                </button>
              ) : <div />}

              {nextPage && (
                <button
                  className="docs-nav-btn next"
                  onClick={() => navigateTo(nextPage.slug)}
                >
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="docs-nav-label">Next</p>
                    <p className="docs-nav-title">{nextPage.label}</p>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT TOC ── */}
          <aside className="docs-toc">
            <p className="docs-toc-title">On this page</p>
            {articleToc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`docs-toc-link ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="docs-toc-dot"></span>
                {item.label}
              </a>
            ))}

            <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Resources</p>
              <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#64748b", textDecoration: "none", padding: "4px 0" }}>
                <ExternalLink className="w-3.5 h-3.5" /> Changelog
              </a>
              <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#64748b", textDecoration: "none", padding: "4px 0" }}>
                <ExternalLink className="w-3.5 h-3.5" /> Community
              </a>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
