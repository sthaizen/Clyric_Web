import React from "react";

const RecommendedConnections = () => {
  const peers = [
    {
      id: 1,
      name: "Yathartha Stha",
      role: "Python Mentor",
      avatar: "https://i.pravatar.cc/150?img=11",
      isOnline: true,
    },
    {
      id: 2,
      name: "us.",
      statusText: "online",
      role: "Algorithms Pro",
      avatar: "https://i.pravatar.cc/150?img=12",
      isOnline: true,
    },
    {
      id: 3,
      name: "Yathartha Stha",
      role: "Interview Prep Partner",
      avatar: "https://i.pravatar.cc/150?img=13",
      isOnline: true,
    },
  ];

  return (
    // Changed h-fit back to h-full here
    <div className="w-full h-full bg-[#16161a] rounded-2xl p-6 border border-white/[0.03] flex flex-col">
      <h2 className="text-[18px] text-white font-semibold mb-4 tracking-tight">
        Recommended Peer Connections
      </h2>

      <div className="flex flex-col gap-4">
        {peers.map((peer) => (
          <div
            key={peer.id}
            className="flex items-center justify-between transition-all rounded-xl hover:bg-white/[0.01] -mx-2 p-2"
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-[42px] h-[42px] rounded-full object-cover"
                />
                {peer.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#16161a]"></div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="text-[15px] font-medium leading-none tracking-wide">
                  <span className="text-[#e2e2e5]">{peer.name}</span>
                  {peer.statusText && (
                    <span className="text-[#4ade80] ml-1">{peer.statusText}</span>
                  )}
                </div>
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#182821] w-fit">
                  <span className="text-[11px] text-[#8ab6a1] font-medium leading-none">
                    {peer.role}
                  </span>
                </div>
              </div>
            </div>

            <button className="shrink-0 px-4 py-1.5 rounded-lg bg-[#232329] hover:bg-[#322b3a] transition-colors border border-white/[0.04]">
              <span className="text-[13px] text-[#d6d0db] font-medium">
                Connect
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedConnections;