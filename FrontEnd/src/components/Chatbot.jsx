import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import gsap from "gsap";

// Securely grab the API key from your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  
  // States for functionality
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null); 
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [messages, setMessages] = useState([
     {
      role: "model",
      text: "Hello! I'm an AI assistant that can help get you get instant answers to your questions.\n\nPlease let me know if my answers are helpful or not. If they aren't, I can connect you with the support team immediately.",
    },
    {
      role: "model",
      text: "How can I help you today?\n\nTo help me provide the best answer to your question, please share as much detail as possible.",
    },
  ]);

  // Initialize Gemini
  useEffect(() => {
    if (!API_KEY || API_KEY === "undefined") {
      setMessages((prev) => [
        ...prev,
        { 
          role: "model", 
          text: "⚠️ SYSTEM ERROR: VITE_GEMINI_API_KEY is missing. \n\nEnsure your .env file is in the root folder and you restarted your server." 
        },
      ]);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const session = model.startChat({ history: [] });
      setChatSession(session);
    } catch (error) {
      console.error("Error initializing Gemini API:", error);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => prev + (prev ? " " : "") + transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // GSAP Animate In
  useEffect(() => {
    if (isOpen && chatWindowRef.current) {
      gsap.fromTo(
        chatWindowRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (chatWindowRef.current) {
      gsap.to(chatWindowRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(false);
    }
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Create preview URLs for visual display
  const processFiles = (files) => {
    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    const newAttachments = validFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file), // Generates local URL to display image
      type: file.type
    }));
    setAttachedFiles(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = ""; 
  };

  const handlePaste = (e) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      processFiles(Array.from(e.clipboardData.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && attachedFiles.length === 0) || !chatSession) return;

    const userMsg = inputText.trim();
    const currentAttachments = [...attachedFiles];
    
    setInputText("");
    setAttachedFiles([]); 
    
    setMessages((prev) => [
      ...prev, 
      { 
        role: "user", 
        text: userMsg, 
        attachments: currentAttachments.map(att => ({ url: att.previewUrl, type: att.type })) 
      }
    ]);
    
    setIsLoading(true);

    try {
      let messagePayload = [];
      if (userMsg) messagePayload.push({ text: userMsg });
      
      if (currentAttachments.length > 0) {
        const fileParts = await Promise.all(currentAttachments.map(a => fileToGenerativePart(a.file)));
        messagePayload = [...messagePayload, ...fileParts];
      }

      const result = await chatSession.sendMessage(messagePayload);
      const responseText = result.response.text();
      setMessages((prev) => [...prev, { role: "model", text: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: `❌ ERROR: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      <input 
        type="file" 
        multiple 
        accept="image/*,video/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="w-[420px] h-[750px] max-h-[88vh] bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden mb-5 border border-gray-100 origin-bottom-right"
        >
          
          <div className="flex items-center justify-between p-5 border-b border-gray-100 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center text-black">
                <img
                src="https://static.intercomassets.eu/assets/default-avatars/fin/128-54fc5d574557a63aff253d55fc5850d34ede7cd1f055f7e88514fa5b612976de.png"
                alt="Bot Profile"
                className="w-10 h-10 "
              />
              </div>
              
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-[16px] leading-tight">Bot</span>
                <span className="text-[13px] text-gray-500 font-medium mt-0.5">The team can also help</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-gray-400">
              <button onClick={handleClose} className="hover:text-gray-800 transition-colors cursor-pointer"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
            </div>
          </div>

          {/* FIX APPLIED HERE: Added overscroll-contain and min-h-0 */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-5 bg-white scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex flex-col w-full gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className={`flex flex-wrap gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} max-w-[85%]`}>
                      {msg.attachments.map((att, i) => (
                        att.type.startsWith('image/') ? (
                          <img key={i} src={att.url} alt="attachment" className="max-w-full h-auto rounded-2xl object-cover max-h-56 shadow-sm border border-gray-100" />
                        ) : (
                          <video key={i} src={att.url} controls className="max-w-full h-auto rounded-2xl max-h-56 shadow-sm border border-gray-100" />
                        )
                      ))}
                    </div>
                  )}

                  {msg.text && (
                    <div 
                      className={`p-4 text-[15px] whitespace-pre-wrap leading-relaxed shadow-sm max-w-[85%]
                        ${msg.role === "user" 
                          ? "bg-[#111] text-white rounded-[20px] rounded-tr-md rounded-br-sm" 
                          : "bg-[#f4f4f5] text-[#111] rounded-[20px] rounded-tl-md rounded-bl-sm"}`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {msg.role === "model" && index === messages.length - 1 && !isLoading && (
                     <span className="text-[12px] text-gray-400 font-medium mt-1 ml-1">Bot • AI Agent • Just now</span>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="self-start max-w-[85%] bg-[#f4f4f5] text-gray-800 rounded-[20px] rounded-bl-sm p-4 text-[15px]">
                  <span className="animate-pulse">Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-50 pb-5 shrink-0">
            
            <div 
              className="border border-gray-200 rounded-[24px] p-2 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-400 transition-all shadow-sm"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              
              {attachedFiles.length > 0 && (
                <div className="flex gap-2 px-2 pt-2 pb-1 overflow-x-auto">
                  {attachedFiles.map((att, index) => (
                    <div key={index} className="relative w-14 h-14 shrink-0 group">
                      {att.type.startsWith('image/') ? (
                        <img src={att.previewUrl} alt="preview" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                      ) : (
                        <video src={att.previewUrl} className="w-full h-full object-cover rounded-xl border border-gray-200" />
                      )}
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Message... (Drop or paste files)"
                className="w-full resize-none outline-none max-h-32 text-[15px] p-2 bg-transparent placeholder-gray-400"
                rows="1"
              />
              <div className="flex items-center justify-between px-2 pb-1 mt-1">
                <div className="flex items-center gap-3.5 text-gray-400">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </button>
                  <button 
                    onClick={toggleVoice} 
                    className={`transition-colors cursor-pointer ${isRecording ? "text-red-500 animate-pulse" : "hover:text-gray-800"}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  </button>
                </div>

                <button 
                  onClick={handleSendMessage}
                  disabled={(!inputText.trim() && attachedFiles.length === 0) || isLoading}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim() || attachedFiles.length > 0 ? "bg-[#111] text-white shadow-md cursor-pointer" : "bg-[#f4f4f5] text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button 
        onClick={() => isOpen ? handleClose() : setIsOpen(true)}
        className="relative w-14 h-14 bg-[#111] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform text-white border-none p-0 overflow-hidden cursor-pointer"
      >
        <div 
          className={`absolute inset-0 bg-[#151111] flex items-center justify-center transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
          }`}
        >
          <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        <img 
          src="https://wezp.nl/wp-content/uploads/support-button-symbool.png" 
          alt="Open Chat" 
          className={`absolute inset-0 w-full h-full object-cover rounded-full transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          }`}
        />
      </button>
    </div>
  );
}