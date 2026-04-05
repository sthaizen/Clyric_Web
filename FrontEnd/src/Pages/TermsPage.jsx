import React, { useState, useEffect } from "react";
import { ChevronRight, Layers, FileText, BookOpen, ShieldAlert, CreditCard, Users, Scale, AlertTriangle, XOctagon, Power, Gavel } from "lucide-react";

import Navbar from "../components/Navbar";
import { TermsContent } from "../components/Terms/TermsContent";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sections for the Terms & Conditions page
  const termsSections = [
    { id: "acceptance", label: "Acceptance of Terms", icon: FileText },
    { id: "definitions", label: "Definitions", icon: BookOpen },
    { id: "account", label: "Account Registration & Security", icon: ShieldAlert },
    { id: "subscriptions", label: "Subscriptions & Payments", icon: CreditCard },
    { id: "conduct", label: "Code of Conduct & Acceptable Use", icon: Users },
    { id: "intellectual-property", label: "Intellectual Property Rights", icon: Scale },
    { id: "disclaimer", label: "Disclaimers & Warranties", icon: AlertTriangle },
    { id: "liability", label: "Limitation of Liability", icon: XOctagon },
    { id: "termination", label: "Termination of Services", icon: Power },
    { id: "governing-law", label: "Governing Law", icon: Gavel },
  ];

  // Set up intersection observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    termsSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // React expects us to tell it all external dependencies, but termsSections is a constant outside the component logic, effectively.
    // So we can move termsSections inside useEffect, but since we map it in the render, we'll just disable the lint warning for clarity, as termsSections will not change between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      setSidebarOpen(false); // Close mobile sidebar on click
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-zinc-100 font-sans selection:bg-zinc-800">
      <Navbar forceLight={false} />

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[49] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN LAYOUT WRAPPER ── */}
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
        transition-transform duration-500 ease-in-out transform-gpu
        
        /* 5. The Dynamic Offset */
        pt-20 lg:pt-12 px-4 pb-16
        
        /* 6. Toggle State */
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>



          <div className="flex flex-col gap-1.5 mb-10 shrink-0">
            {termsSections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className={`
                  group flex items-center w-full gap-3 px-4 py-2.5 rounded-xl text-[14px] font-semibold
                  transition-all duration-200 ease-out active:scale-[0.98]
                  ${activeSection === item.id
                    ? "bg-white text-[#0b0b0c] shadow-lg shadow-white/5"
                    : "text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06]"}
                `}
              >
                <item.icon className={`w-4 h-4 shrink-0 transition-colors ${activeSection === item.id ? "text-[#0b0b0c]" : "text-zinc-500 group-hover:text-zinc-200"}`} />
                <span className="text-left leading-snug break-words">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 flex justify-center px-4 sm:px-8 w-full min-w-0 overflow-hidden">
          <div className="w-full max-w-[840px] pt-15 pb-32 min-w-0">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-[14px] font-bold text-zinc-500 mb-2 tracking-wide uppercase">Legal Information</p>
              <h1 className="text-4xl sm:text-[40px] font-extrabold text-zinc-100 tracking-tight leading-tight mb-4">
                Terms and Conditions
              </h1>
              <p className="text-[19px] text-zinc-400 leading-relaxed font-medium mb-12 border-b border-white/5 pb-10">
                These Terms and Conditions govern your use of the Clyric platform and its services. By using our services, you agree to these legal obligations.
              </p>

              <TermsContent />

            </div>
          </div>

          {/* ── RIGHT TOC ── */}
          <aside className="hidden xl:block w-[340px] shrink-0 pl-20 pb-12 self-start sticky top-[80px] max-h-[calc(100vh-80px)] overflow-y-auto ml-8 scrollbar-none">
            <div className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> On this page
            </div>
            <div className="space-y-1">
              {termsSections.map((item) => (
                <a
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(item.id);
                  }}
                  href={`#${item.id}`}
                  className={`flex items-center gap-2.5 text-[13px] font-medium py-1.5 cursor-pointer transition-colors border-l-2 pl-4 -ml-px ${activeSection === item.id ? "text-zinc-100 font-bold border-zinc-100" : "text-zinc-500 border-transparent hover:text-zinc-200"}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
