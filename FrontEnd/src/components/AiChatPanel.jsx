import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles, X, Plus, History, ArrowUp,
  Lightbulb, ChevronDown, User
} from "lucide-react";
import { getChatbotReply } from "../prompts/geminiHelper";

export default function AiChatPanel({ onClose, currentProblemId }) {
  // --- STATE ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAgentOn, setIsAgentOn] = useState(false);

  // History & Session State
  const [sessions, setSessions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // NEW: Tab Management State
  const initialTabId = Date.now().toString();
  const [activeSessionId, setActiveSessionId] = useState(initialTabId);
  const [openTabs, setOpenTabs] = useState([
    { id: initialTabId, title: "Clyric" }
  ]);

  const messagesEndRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    const savedSessions = localStorage.getItem("clyric_chat_history");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clyric_chat_history", JSON.stringify(sessions));
  }, [sessions]);

  // Keep the chat scrolled to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);


  // --- TAB MANAGERS ---
  const handleNewChat = () => {
    const newId = Date.now().toString();
    // Add a new tab to the top bar
    setOpenTabs([...openTabs, { id: newId, title: "New Chat" }]);
    setActiveSessionId(newId);
    setMessages([]); // Clear chat window for the new tab
    setShowHistory(false);
    setInput("");
  };

  const handleTabClick = (tabId) => {
    setActiveSessionId(tabId);
    // Find the messages for this tab from our history sessions
    const session = sessions.find(s => s.id === tabId);
    setMessages(session ? session.messages : []);
    setInput(""); // Clear input when switching tabs
  };

  const closeTab = (e, tabId) => {
    e.stopPropagation(); // Prevents the tab click event from firing

    const newTabs = openTabs.filter(t => t.id !== tabId);

    if (newTabs.length === 0) {
      // If we close the last tab, create a fresh empty one so the UI doesn't break
      const newId = Date.now().toString();
      setOpenTabs([{ id: newId, title: "New Chat" }]);
      setActiveSessionId(newId);
      setMessages([]);
    } else {
      setOpenTabs(newTabs);
      // If we closed the active tab, switch to the right-most available tab
      if (activeSessionId === tabId) {
        const nextTab = newTabs[newTabs.length - 1];
        setActiveSessionId(nextTab.id);
        const session = sessions.find(s => s.id === nextTab.id);
        setMessages(session ? session.messages : []);
      }
    }
  };

  const loadSession = (session) => {
    // If the session isn't already open in a tab, add it
    if (!openTabs.find(t => t.id === session.id)) {
      setOpenTabs([...openTabs, { id: session.id, title: session.title }]);
    }
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };


  // --- SEND MESSAGE ---
  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input };
    const currentChat = [...messages, userMsg];

    setMessages(currentChat);
    setInput("");
    setIsTyping(true);

    const aiResponseText = await getChatbotReply(currentChat, currentProblemId);

    const finalChat = [...currentChat, { role: "ai", content: aiResponseText }];
    setMessages(finalChat);
    setIsTyping(false);

    // Generate a short title from the first message
    const generatedTitle = finalChat[0].content.slice(0, 15) + (finalChat[0].content.length > 15 ? "..." : "");

    // Update the Tab Title
    setOpenTabs(prev => prev.map(tab =>
      tab.id === activeSessionId && tab.title === "New Chat"
        ? { ...tab, title: generatedTitle }
        : tab
    ));

    // Save to History
    setSessions(prev => {
      const existingSessionIndex = prev.findIndex(s => s.id === activeSessionId);
      if (existingSessionIndex >= 0) {
        const updated = [...prev];
        updated[existingSessionIndex] = { ...updated[existingSessionIndex], messages: finalChat };
        return updated;
      } else {
        return [{ id: activeSessionId, title: generatedTitle, timestamp: Date.now(), messages: finalChat }, ...prev];
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  // --- RENDER ---
  return (
    // Added overflow-hidden here to strictly contain the scrolling
    <div className="flex flex-col h-full bg-[#1b1b1f] text-gray-300 font-sans relative overflow-hidden">

      {/* TOP TAB BAR */}
      <div className="flex items-end justify-between px-2 pt-2 bg-[#1b1b1f] border-b border-[#3e3e42]">

        {/* Dynamic Tabs Area */}
        <div className="flex items-end  max-w-[75%]">
          {openTabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg border-t border-x cursor-pointer transition-colors max-w-[140px] shrink-0 relative z-10 -mb-[1px] ${activeSessionId === tab.id
                ? "bg-[#3e3e42]/25 border-[#3e3e42]"
                : "bg-transparent border-transparent hover:bg-[#3e3e42]/10"
                }`}
            >
              <Sparkles className={`w-[14px] h-[14px] shrink-0 ${activeSessionId === tab.id ? "text-purple-400" : "text-gray-500"}`} />
              <span className={`text-[13px] font-medium truncate ${activeSessionId === tab.id ? "text-gray-200" : "text-gray-500"}`}>
                {tab.title}
              </span>
              <button
                onClick={(e) => closeTab(e, tab.id)}
                className="ml-1 p-0.5 rounded-md text-gray-400 hover:text-white hover:bg-[#3e3e42]/50 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 pb-2 pr-2 text-gray-400 shrink-0">
          <button onClick={handleNewChat} className="hover:text-white transition-colors" title="New Tab">
            <Plus className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`hover:text-white transition-colors ${showHistory ? "text-white" : ""}`}
            title="History"
          >
            <History className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* HISTORY PANEL MODAL */}
      {showHistory && (
        <div className="absolute top-11 left-0 w-full h-[calc(100%-44px)] bg-[#1b1b1f]/35 backdrop-blur-sm z-20 p-4 overflow-y-auto border-t border-[#3e3e42]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-200 font-medium flex items-center gap-2">
              <History className="w-4 h-4" /> Previous Conversations
            </h3>
            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {sessions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">No chat history found.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => loadSession(s)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${activeSessionId === s.id
                    ? "bg-[#3e3e42]/60 border-[#5a5a60]"
                    : "bg-[#3e3e42]/20 border-transparent hover:bg-[#3e3e42]/40"
                    }`}
                >
                  <p className="text-sm text-gray-200 truncate">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(s.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CHAT AREA / EMPTY STATE */}
      <div className="flex-1 overflow-y-auto flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#3e3e42] [&::-webkit-scrollbar-thumb]:rounded-full">

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 mt-10">
            <div className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-5 h-5 text-neutral-300" />
            </div>
            <p className="text-[#a8a8a8] text-[15px] mb-2 text-center">
              Stuck? Clyric guides you through every line.
            </p>
            {currentProblemId && (
              <p className="text-xs text-gray-500 bg-[#3e3e42]/30 px-3 py-1 rounded-full mt-2">
                Context: Problem {currentProblemId}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-5">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-[#2cbb5d]/20 text-[#2cbb5d]" : "bg-purple-500/20 text-purple-400"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className={`p-3 rounded-lg max-w-[85%] text-[13px] leading-relaxed ${msg.role === "user"
                  ? "bg-[#3e3e42] text-white rounded-tr-none whitespace-pre-wrap"
                  : "bg-transparent text-gray-300"
                  }`}>
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-100" {...props} />,
                        code: ({ node, inline, ...props }) =>
                          inline
                            ? <code className="bg-[#3e3e42] px-1 py-0.5 rounded text-purple-300 font-mono text-[12px]" {...props} />
                            : <code className="block bg-[#1b1b1f] p-2 rounded border border-[#3e3e42] my-2 text-[#2cbb5d] font-mono text-[12px] overflow-x-auto" {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* BOTTOM INPUT AREA */}
      <div className="p-4 bg-[#1b1b1f]">
        <div className="bg-[#3e3e42]/15 border border-[#3e3e42] rounded-xl flex flex-col focus-within:border-[#5a5a60] transition-colors relative shadow-sm">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="Shift+Enter to insert a line break."
            className="w-full bg-transparent px-4 py-3 text-gray-300 text-[13px] placeholder-gray-500 outline-none resize-none min-h-[75px] max-h-[200px]"
          />

          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <div className="flex items-center gap-4 text-[12px] font-medium text-gray-400">
              <button className="flex items-center gap-1.5 hover:text-gray-200 transition-colors">
                <Sparkles className="w-[14px] h-[14px] text-purple-400" />
                <span>Clyric</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-gray-200 transition-colors">
                <Lightbulb className="w-[14px] h-[14px] text-blue-400" />
                <span>Clyric-Plus</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAgentOn(!isAgentOn)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className={`w-8 h-[18px] rounded-full relative transition-colors duration-200 ${isAgentOn ? 'bg-[#2cbb5d]' : 'bg-[#4e4e52]'}`}>
                  <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full transition-all duration-200 ${isAgentOn ? 'left-[16px]' : 'left-[2px]'}`}></div>
                </div>
                <span className={`text-[13px] font-medium transition-colors ${isAgentOn ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  Agent
                </span>
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className={`p-1.5 rounded-full transition-colors ${input.trim() && !isTyping
                  ? 'bg-gray-200 text-black hover:bg-white'
                  : 'bg-[#3e3e42] text-gray-500 cursor-not-allowed'
                  }`}
              >
                <ArrowUp className="w-[15px] h-[15px]" strokeWidth={2.5} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}