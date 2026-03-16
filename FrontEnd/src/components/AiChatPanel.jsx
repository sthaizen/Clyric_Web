import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, X, Plus, History, Play, ArrowUp, 
  Lightbulb, ChevronDown, User, Bot 
} from "lucide-react";

export default function AiChatPanel({ onClose, currentProblemId }) {
  // Start with empty messages to show the LeetCode-style welcome screen
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAgentOn, setIsAgentOn] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "ai", content: `Here is a hint for problem ${currentProblemId}: Have you considered optimizing the inner loop using a hash map to bring the time complexity down to O(N)?` }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1b1b1f] text-gray-300 font-sans relative">
      
      {/* TOP TAB BAR */}
      <div className="flex items-end justify-between px-3 pt-2 bg-[#1b1b1f] border-b border-[#3e3e42]">
        {/* Active Tab */}
        <div className="flex items-center gap-2 bg-[#3e3e42]/25 px-3 py-2 rounded-t-lg border-t border-x border-[#3e3e42] relative z-10 -mb-[1px]">
          <Sparkles className="w-[14px] h-[14px] text-purple-400" />
          <span className="text-[13px] font-medium text-gray-200">Clyric</span>
          <button 
            onClick={onClose} 
            className="ml-2 p-0.5 rounded-md text-gray-400 hover:text-white hover:bg-[#3e3e42]/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-3 pb-2 text-gray-400">
          <button className="hover:text-white transition-colors">
            <Plus className="w-[18px] h-[18px]" />
          </button>
          <button className="hover:text-white transition-colors">
            <History className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

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
           
          </div>
        ) : (
          // --- CHAT HISTORY ---
          <div className="p-4 space-y-5">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-[#2cbb5d]/20 text-[#2cbb5d]" : "bg-purple-500/20 text-purple-400"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-lg max-w-[85%] text-[13px] leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-[#3e3e42] text-white rounded-tr-none" 
                    : "bg-transparent text-gray-300"
                }`}>
                  {msg.content}
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
            placeholder="Shift+Enter to insert a line break."
            className="w-full bg-transparent px-4 py-3 text-gray-300 text-[13px] placeholder-gray-500 outline-none resize-none min-h-[75px] max-h-[200px]"
          />
          
          {/* Input Footer Toolbar */}
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            
            {/* Models Selectors */}
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

            {/* Agent Toggle & Send */}
            <div className="flex items-center gap-4">
              
              {/* Custom Toggle Switch */}
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

              {/* Send Button */}
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className={`p-1.5 rounded-full transition-colors ${
                  input.trim() 
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