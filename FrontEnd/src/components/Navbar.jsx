import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import assets from "../assets/assets";
import { SignInButton, SignedOut, SignedIn, SignOutButton, UserButton } from "@clerk/clerk-react";
const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const isLightMode = activeMenu || isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div 
                className={`fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition-all duration-300 ${
                    activeMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            />

            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
                activeMenu
                    ? 'bg-[#f0efee] shadow-sm py-4 text-gray-900' 
                    : isScrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 text-gray-900' 
                        : 'bg-transparent py-4 text-white border-b border-white/20'
            }`}>
                <nav className="max-w-[1560px] mx-auto px-6 md:px-5 flex items-center justify-between">
                    
                    <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
    <div className="flex flex-col gap-[3px]">
        <div className={`w-[21px] h-[6px] rounded-[2px] rounded-tl-md transition-colors duration-300 ${isLightMode ? 'bg-[#18181B]' : 'bg-[#F3F3EF]'}`}></div>
        <div className="flex gap-[3px]">
            <div className={`w-[6px] h-[6px] rounded-[2px] transition-colors duration-300 ${isLightMode ? 'bg-[#18181B]' : 'bg-[#F3F3EF]'}`}></div>
            <div className={`w-[16px] h-[6px] rounded-[2px] transition-colors duration-300 ${isLightMode ? 'bg-[#18181B]' : 'bg-[#F3F3EF]'}`}></div>
        </div>
        <div className="flex gap-[3px]">
            <div className="w-[13px] h-[6px] bg-transparent"></div>
            <div className={`w-[9px] h-[9px] rounded-[2px] rounded-br-md transition-colors duration-300 ${isLightMode ? 'bg-[#18181B]' : 'bg-[#F3F3EF]'}`}></div>
        </div>
    </div>

    <span className="font-semibold text-[22px] tracking-tight">
        CLYRIC
    </span>
</Link>

                    <div className="hidden md:flex items-center gap-8 ml-12">
                        
                        <div 
                            className="h-full flex items-center py-6 -my-6"
                            onMouseEnter={() => setActiveMenu('products')}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <Link to="/problem" className="text-[13px] font-medium hover:opacity-60 transition-opacity">
                                Products
                            </Link>
                            
                            <div 
                                className={`absolute top-full left-0 w-full bg-[#f0efee] text-gray-900 border-t border-black/5 shadow-xl transition-all duration-300 origin-top ${
                                    activeMenu === 'products' ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
                                }`}
                                style={{ cursor: 'default' }}
                            >
                                <div className="max-w-[1580px] mx-auto py-8 px-6 flex gap-6">
                                    <div className="w-1/3 flex flex-col gap-2">
                                        <div className="bg-[#fcfcfc] p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer">
                                            <div className="flex items-center gap-3 mb-2">
                                                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                                                </svg>
                                                <span className="font-medium text-[17px]">Practice Hub</span>
                                            </div>
                                            <p className="text-[13px] text-gray-500 leading-relaxed ml-8">One platform for problems, live sessions, and collaborative coding.</p>
                                        </div>
                                        <div className="p-6 rounded-2xl hover:bg-white/60 transition-colors cursor-pointer opacity-70 hover:opacity-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                                <span className="font-medium text-[17px]">Progress Insights</span>
                                            </div>
                                            <p className="text-[13px] text-gray-500 leading-relaxed ml-8">Track accuracy, time, and weak spots — and see improvement clearly.</p>
                                        </div>
                                    </div>

                                    <div className="w-1/3 flex flex-col gap-2.5">
                                        {['Live Mock Sessions', 'Timed Practice', 'Problem Bank', 'Collaborative Coding', 'Progress Tracking'].map((item) => (
                                            <div key={item} className="bg-[#fcfcfc] px-5 py-7 rounded-xl flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-[#d2d0d0] cursor-pointer transition-all group">
                                                <span className="text-[17px] font-medium text-gray-800">{item}</span>
                                                <div className="w-7 h-7 bg-[#e9e9e9] rounded-full flex items-center justify-center group-hover:bg-[#222222]/30 transition-colors">
                                                    <svg className="w-3.5 h-3.5 text-black " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-1/3 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
                                        <div className="h-84 w-full bg-gray-200 overflow-hidden">
                                            <img 
                                            src={assets.cc}
                                             alt="Team meeting" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-6 flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="font-medium text-[16px] text-gray-900 leading-snug mb-2">How Cyric helps candidates get interview-ready</h3>
                                                <p className="text-[13px] text-gray-500 leading-relaxed">Problems, mock sessions, and progress tracking: users stay consistent and improve faster — without the tab chaos.</p>
                                            </div>
                                            <div className="mt-4">
                                                <button className="bg-[#18181B] text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-black transition-colors">
                                                    Read the Story
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="h-full flex items-center py-6 -my-6"
                            onMouseEnter={() => setActiveMenu('integrations')}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <Link to="/integrations" className="text-[13px] font-medium hover:opacity-60 transition-opacity">
                                Documentation
                            </Link>

                            <div 
                                className={`absolute top-full left-0 w-full bg-[#f0efee] text-gray-900 border-t border-black/5 shadow-xl transition-all duration-300 origin-top ${
                                    activeMenu === 'integrations' ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
                                }`}
                                style={{ cursor: 'default' }}
                            >
                                <div className="max-w-[1580px] mx-auto py-8 px-6 flex gap-6">
                                    <div className="w-[30%] bg-[#fcfcfc] p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-center items-start">
                                        <svg className="w-7 h-7 text-gray-800 mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                                        </svg>
                                        <h3 className="font-medium text-[22px] text-gray-900 mb-2">Discover all features</h3>
                                        <p className="text-[17px] text-gray-500 leading-relaxed mb-6">Make your interview prep faster and smoother with one clean workflow — problems, mock sessions, and progress tracking.</p>
                                        <button className="bg-[#18181B] text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-black transition-colors">
                                            See all
                                        </button>
                                    </div>

                                    <div className="w-[70%] bg-[#ffffff] p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] grid grid-cols-3 gap-8">
                                        <div>
                                            <h4 className="text-[15px] text-gray-500 border-b border-gray-100 pb-3 mb-4 font-medium">Problem practice</h4>
                                            <div className="flex flex-col gap-2.5">
                                                {['Topic-wise Problems', 'Difficulty Levels', 'Timed Mode'].map((item) => (
                                                    <div key={item} className="bg-[#f9fafb] px-4 py-3.5 rounded-xl flex justify-between items-center hover:bg-gray-100 cursor-pointer transition-colors group">
                                                        <span className="text-[17px] font-medium text-gray-800">{item}</span>
                                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors shadow-sm">
                                                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[15px] text-gray-500 border-b border-gray-100 pb-3 mb-4 font-medium">Live sessions</h4>
                                            <div className="flex flex-col gap-2.5">
                                                {['Mock Interviews', 'Screen Share', 'Collaborative Editor'].map((item) => (
                                                    <div key={item} className="bg-[#f8f9fa] px-4 py-3.5 rounded-xl flex justify-between items-center hover:bg-gray-100 cursor-pointer transition-colors group">
                                                        <span className="text-[17px] font-medium text-gray-800">{item}</span>
                                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors shadow-sm">
                                                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[15px] text-gray-500 border-b border-gray-100 pb-3 mb-4 font-medium">Progress & profile</h4>
                                            <div className="flex flex-col gap-2.5">
                                                {['Session Reviews', 'Skill Insights', 'Leaderboard'].map((item) => (
                                                    <div key={item} className="bg-[#f8f9fa] px-4 py-3.5 rounded-xl flex justify-between items-center hover:bg-gray-100 cursor-pointer transition-colors group">
                                                        <span className="text-[17px] font-medium text-gray-800">{item}</span>
                                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors shadow-sm">
                                                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to="/customers" className="text-[13px] font-medium hover:opacity-60 transition-opacity">
                            Customers
                        </Link>
                        <Link to="/price" className="text-[13px] font-medium hover:opacity-60 transition-opacity">
                            Pricing
                        </Link>
                        <Link to="/resources" className="text-[13px] font-medium hover:opacity-60 transition-opacity">
                            Interview Simulator
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-7 ml-auto">
                        <button className="flex items-center gap-1.5 hover:opacity-60 transition-opacity">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12H22" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" />
                            </svg>
                            <span className="text-[13px] font-medium">en</span>
                        </button>
                                                        
                       <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-[13px] font-medium hover:opacity-60 transition-opacity">
                            Login
                            </button>
                        </SignInButton>
                        </SignedOut>

                        <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <Link 
                            to="/coding" 
                            className={`text-[14px] font-medium px-8 py-2 rounded-full transition-colors duration-300 ${
                                isLightMode
                                    ? 'bg-[#18181B] text-white hover:bg-black' 
                                    : 'bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-[#18181B]/60'
                            }`}
                        >
                            Book a demo
                        </Link>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-1 hover:opacity-70 transition-opacity"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </nav>
            </header>

            <div className={`
                fixed top-0 right-0 bottom-0 h-full bg-black/80 backdrop-blur-2xl z-[60]
                transition-all duration-300 ease-in-out border-l border-white/10
                ${sidebarOpen ? 'w-64 p-6' : 'w-0 p-0 overflow-hidden'}
                flex flex-col gap-6 shadow-2xl
            `}>
                <div className="flex justify-end">
                    <button onClick={() => setSidebarOpen(false)} className="p-1 hover:opacity-70 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-6 text-white/90 mt-8 text-[15px] font-medium">
                    <Link onClick={() => setSidebarOpen(false)} to="/products" className="hover:text-white transition-colors">Products</Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/integrations" className="hover:text-white transition-colors">Integrations</Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/customers" className="hover:text-white transition-colors">Customers</Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/price" className="hover:text-white transition-colors">Pricing</Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/resources" className="hover:text-white transition-colors">Resources</Link>
                    
                    <hr className="border-white/10 my-2" />
                    
                    <Link onClick={() => setSidebarOpen(false)} to="/login" className="hover:text-white transition-colors">Login</Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/demo" className="bg-white text-black text-center px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
                        Book a demo
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;