import { useState, useEffect, useCallback, useRef } from "react";
import { fetchLeaderboard, fetchMyRank } from "../lib/api/leaderboard";
import { socket } from "../lib/socket";

export function useLeaderboard(page = 1, limit = 50, search = "") {
  const [data, setData] = useState(null);
  const [myRank, setMyRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchLeaderboard(page, limit, search);
      if (result?.success) {
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search]);

  // Initial fetch
  useEffect(() => {
    load();
  }, [load]);

  // Socket.IO real-time subscription
  useEffect(() => {
    const handleUpdate = () => {
      // Re-fetch leaderboard data on update
      load();
    };

    const handleConnect = () => {
      setIsLive(true);
    };

    const handleDisconnect = () => {
      setIsLive(false);
    };

    // Join leaderboard room
    if (socket.connected) {
      socket.emit("join-leaderboard");
      setIsLive(true);
    }

    socket.on("connect", () => {
      socket.emit("join-leaderboard");
      handleConnect();
    });

    socket.on("disconnect", handleDisconnect);
    socket.on("leaderboard-update", handleUpdate);

    return () => {
      socket.emit("leave-leaderboard");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("leaderboard-update", handleUpdate);
    };
  }, [load]);

  return { data, myRank, isLoading, error, isLive, refresh: load };
}
