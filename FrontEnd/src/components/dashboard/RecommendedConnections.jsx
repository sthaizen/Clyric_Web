import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { socket } from "../../lib/socket";

const RecommendedConnections = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [peers, setPeers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPeers = async () => {
      try {
        const token = await getToken();
        const response = await axiosInstance.get("/dashboard/peers/recommended", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPeers(response.data.peers || []);
      } catch (error) {
        console.error("Error fetching recommended peers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeers();
    if (!socket.connected) socket.connect();
    socket.emit("user-connected", user.id);

    const interval = setInterval(fetchPeers, 30000);
    return () => clearInterval(interval);
  }, [user, getToken]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#16161a] rounded-2xl p-6 border border-white/[0.03] flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#16161a] rounded-2xl p-6 border border-white/[0.03] flex flex-col overflow-hidden">
      <h2 className="text-[18px] text-white font-semibold mb-6 tracking-tight shrink-0">
        Recommended Peer Connections
      </h2>

      {/* Container with hidden scrollbar */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
        {peers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-sm text-gray-400">No recent peers found.</p>
          </div>
        ) : (
          peers.map((peer) => (
            <div
              key={peer.id}
              className="flex items-center justify-between p-2 rounded-xl transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {peer.avatar ? (
                    <img
                      src={peer.avatar}
                      className="w-11 h-11 rounded-full object-cover border border-white/10"
                      alt=""
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
                      {peer.name[0]}
                    </div>
                  )}
                  {peer.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#16161a]"></div>
                  )}
                </div>

                {/* Name & Role Layout */}
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-[#e2e2e5] truncate">
                      {peer.name}
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded border w-fit ${peer.isOnline
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                    }`}>
                    <span className={`text-[10px] font-medium uppercase tracking-wide truncate block max-w-[140px] ${peer.isOnline ? 'text-green-400' : 'text-red-400'
                      }`}>
                      {peer.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button className="shrink-0 px-5 py-2 rounded-lg bg-[#232329]/50 hover:bg-[#2a2a32] transition-colors border border-white/[0.05] active:scale-95">
                <span className="text-[13px] text-white font-medium">
                  Chat
                </span>
              </button>
            </div>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default RecommendedConnections;