import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1b1b1f] text-white">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-green-500 mb-4" />
          <p className="text-lg text-[#e5e7eb]">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video bg-[#1b1b1f] text-white p-3">
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-2border border-[#2a2a2a] p-3 rounded-xl shadow-sm text-white">
          <div className="flex items-center gap-2 min-w-0">
            <UsersIcon className="w-5 h-5 text-[#a78bfa] shrink-0" />
            <span className="font-semibold text-[#f5f5f5]">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>

          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isChatOpen
                  ? "bg-[#3e3e42]/50 text-white border border-[#3a3d45]"
                  : "bg-[#3e3e42]/50 text-[#d1d5db] border border-[#333333] hover:bg-[#3e3e42]/50 hover:text-white"
              }`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <span className="flex items-center gap-2">
                <MessageSquareIcon className="size-4" />
                Chat
              </span>
            </button>
          )}
        </div>

        <div className="flex-1 bg-[#111113] rounded-xl overflow-hidden relative min-h-0">
          <SpeakerLayout />
        </div>

        <div className=" p-3 rounded-xl shadow-sm flex justify-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-xl shadow-sm overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#181818] p-3 border-b border-[#2a2a2a] flex items-center justify-between">
                <h3 className="font-semibold text-[#f5f5f5]">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden bg-[#1a1a1a] text-white stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;