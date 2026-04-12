/**
 * useWebRTCSession.js — v3
 *
 * Key fixes in this version:
 * 1. ICE candidate buffering: candidates that arrive before setRemoteDescription
 *    are queued and flushed once the remote description is set.
 * 2. iceConnectionState used as the primary "connected" signal (more reliable
 *    than connectionState across browsers).
 * 3. makingOfferRef checked at the top of onnegotiationneeded to prevent
 *    concurrent offer creation.
 * 4. Cleaner rollback path before re-offering.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "../lib/socket";
import {
  createPeerConnection,
  getLocalStream,
  stopStream,
  replaceVideoTrack,
  getScreenStream,
} from "../lib/webrtc";
import toast from "react-hot-toast";

function useWebRTCSession(session, loadingSession, isHost, isParticipant) {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const pcRef             = useRef(null);
  const localStreamRef    = useRef(null);
  const screenStreamRef   = useRef(null);
  const roomIdRef         = useRef(null);
  const isHostRef         = useRef(false);
  const peerJoinedRef     = useRef(false);   // True after remote peer emits join-video-room
  const makingOfferRef    = useRef(false);   // True while host is mid-offer
  /** ICE candidates that arrived before setRemoteDescription was called */
  const pendingIceRef     = useRef([]);
  /** True once setRemoteDescription has been called (safe to addIceCandidate) */
  const remoteDescSetRef  = useRef(false);

  // ── State ─────────────────────────────────────────────────────────────────
  const [localStream,       setLocalStream]       = useState(null);
  const [remoteStream,      setRemoteStream]      = useState(null);
  const [connectionState,   setConnectionState]   = useState("idle");
  const [isInitializingCall,setIsInitializingCall]= useState(true);
  const [isMuted,           setIsMuted]           = useState(false);
  const [isCameraOff,       setIsCameraOff]       = useState(false);
  const [isSharingScreen,   setIsSharingScreen]   = useState(false);
  
  const [remoteIsMuted,     setRemoteIsMuted]     = useState(false);
  const [remoteIsCameraOff, setRemoteIsCameraOff] = useState(false);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    const roomId = roomIdRef.current;
    if (roomId && socket.connected) {
      socket.emit("webrtc-leave", roomId);
    }
    if (pcRef.current) {
      pcRef.current.ontrack                   = null;
      pcRef.current.onicecandidate            = null;
      pcRef.current.onnegotiationneeded       = null;
      pcRef.current.oniceconnectionstatechange = null;
      pcRef.current.onconnectionstatechange   = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    stopStream(localStreamRef.current);
    stopStream(screenStreamRef.current);
    localStreamRef.current  = null;
    screenStreamRef.current = null;
    roomIdRef.current       = null;
    peerJoinedRef.current   = false;
    makingOfferRef.current  = false;
    pendingIceRef.current   = [];
    remoteDescSetRef.current = false;
    setLocalStream(null);
    setRemoteStream(null);
    setIsSharingScreen(false);
    setRemoteIsMuted(false);
    setRemoteIsCameraOff(false);
  }, []);

  // ── Set remote description + flush buffered ICE candidates ─────────────────
  const setRemoteDescAndFlush = useCallback(async (pc, desc) => {
    await pc.setRemoteDescription(new RTCSessionDescription(desc));
    remoteDescSetRef.current = true;
    console.log(`[WebRTC] Remote description set. Flushing ${pendingIceRef.current.length} buffered ICE candidates.`);
    for (const candidate of pendingIceRef.current) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.warn("[WebRTC] Buffered addIceCandidate error:", err.message);
      }
    }
    pendingIceRef.current = [];
  }, []);

  // ── Create and send offer (host only) ─────────────────────────────────────
  const sendOffer = useCallback(async (pc, roomId) => {
    if (!pc || pc.connectionState === "closed") return;
    if (makingOfferRef.current) {
      console.log("[WebRTC] sendOffer skipped — already making an offer");
      return;
    }
    try {
      makingOfferRef.current = true;
      const offer = await pc.createOffer();
      if (pc.signalingState !== "stable") {
        console.log("[WebRTC] sendOffer aborted — signalingState no longer stable:", pc.signalingState);
        return;
      }
      await pc.setLocalDescription(offer);
      socket.emit("webrtc-offer", { roomId, offer: pc.localDescription });
      console.log("[WebRTC] Offer sent");
    } catch (err) {
      console.error("[WebRTC] sendOffer error:", err);
    } finally {
      makingOfferRef.current = false;
    }
  }, []);

  // ── Build RTCPeerConnection ───────────────────────────────────────────────
  const buildPeerConnection = useCallback((stream, roomId) => {
    const pc = createPeerConnection();
    pcRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = ({ streams: [remote] }) => {
      console.log("[WebRTC] Remote track received ✅");
      setRemoteStream(remote);
    };

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("webrtc-ice-candidate", { roomId, candidate });
      }
    };

    // iceConnectionState is the most reliable signal across browsers
    pc.oniceconnectionstatechange = () => {
      const s = pc.iceConnectionState;
      console.log("[WebRTC] ICE connection state:", s);
      if (s === "connected" || s === "completed") {
        setConnectionState("connected");
      } else if (s === "failed") {
        setConnectionState("failed");
        toast.error("Video connection failed. Please refresh.", { id: "webrtc-fail" });
      } else if (s === "disconnected") {
        setConnectionState("disconnected");
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("[WebRTC] Connection state:", pc.connectionState);
    };

    // Guard: only fire if peer is present AND we're not already making an offer
    pc.onnegotiationneeded = async () => {
      console.log("[WebRTC] onnegotiationneeded — isHost:", isHostRef.current, "peerJoined:", peerJoinedRef.current, "making:", makingOfferRef.current);
      if (!isHostRef.current) return;
      if (!peerJoinedRef.current) return;  // Wait for remote peer
      if (makingOfferRef.current) return;  // Already in progress
      await sendOffer(pc, roomId);
    };

    return pc;
  }, [sendOffer]);

  // ── Main effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (loadingSession || !session?.callId) return;
    if (!isHost && !isParticipant) return;
    if (session.status === "completed") return;

    const roomId = session.callId;
    roomIdRef.current      = roomId;
    isHostRef.current      = isHost;
    peerJoinedRef.current  = false;
    pendingIceRef.current  = [];
    remoteDescSetRef.current = false;

    let mounted = true;

    const initCall = async () => {
      setIsInitializingCall(true);
      setConnectionState("initializing");

      try {
        const stream = await getLocalStream();
        if (!mounted) { stopStream(stream); return; }

        localStreamRef.current = stream;
        setLocalStream(stream);
        buildPeerConnection(stream, roomId);

        // Ensure socket is connected before announcing our presence.
        // CodeEditorPanel calls socket.connect() but may not have mounted yet.
        const emitJoinVideoRoom = () => {
          socket.emit("join-video-room", roomId);
          console.log("[WebRTC] Emitted join-video-room:", roomId);
          setConnectionState(isHost ? "waiting" : "connecting");
          // Emit initial states
          socket.emit("webrtc-media-state", { roomId, type: "audio", isOff: isMuted });
          socket.emit("webrtc-media-state", { roomId, type: "video", isOff: isCameraOff });
        };

        if (socket.connected) {
          emitJoinVideoRoom();
        } else {
          socket.connect();
          socket.once("connect", emitJoinVideoRoom);
        }
      } catch (err) {
        if (!mounted) return;
        if (err.message === "PERMISSION_DENIED") {
          setConnectionState("permission_denied");
          toast.error("Camera or microphone access denied.", { id: "media-perm" });
        } else if (err.message === "NO_DEVICE") {
          setConnectionState("no_device");
          toast.error("No camera or microphone found.", { id: "media-device" });
        } else {
          setConnectionState("failed");
          console.error("[WebRTC] initCall error:", err);
        }
      } finally {
        if (mounted) setIsInitializingCall(false);
      }
    };

    initCall();

    // ── Signaling handlers ────────────────────────────────────────────────

    const onPeerJoined = async () => {
      console.log("[WebRTC] webrtc-peer-joined received. isHost:", isHostRef.current);
      peerJoinedRef.current = true;

      if (!isHostRef.current || !pcRef.current) return;

      setConnectionState("connecting");

      if (pcRef.current.signalingState === "have-local-offer") {
        try { await pcRef.current.setLocalDescription({ type: "rollback" }); } catch {}
      }

      await sendOffer(pcRef.current, roomId);
      // Let the peer know our current media state
      socket.emit("webrtc-media-state", { roomId, type: "audio", isOff: isMuted });
      socket.emit("webrtc-media-state", { roomId, type: "video", isOff: isCameraOff });
    };

    /**
     * Host joined the room AFTER the participant was already there.
     * The server tells us how many peers are present — host must create the offer.
     */
    const onPeersPresent = async ({ count }) => {
      console.log(`[WebRTC] webrtc-peers-present: ${count} peer(s) already in room. isHost:`, isHostRef.current);
      if (count > 0) {
        peerJoinedRef.current = true;
        if (isHostRef.current && pcRef.current) {
          setConnectionState("connecting");
          await sendOffer(pcRef.current, roomId);
        }
      }
    };

    const onOffer = async ({ offer }) => {
      const pc = pcRef.current;
      if (!pc) return;
      console.log("[WebRTC] Offer received. signalingState:", pc.signalingState);

      try {
        await setRemoteDescAndFlush(pc, offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc-answer", { roomId, answer: pc.localDescription });
        console.log("[WebRTC] Answer sent");
        setConnectionState("connecting");
      } catch (err) {
        console.error("[WebRTC] onOffer error:", err);
      }
    };

    const onAnswer = async ({ answer }) => {
      const pc = pcRef.current;
      if (!pc) return;
      console.log("[WebRTC] Answer received. signalingState:", pc.signalingState);
      if (pc.signalingState !== "have-local-offer") {
        console.warn("[WebRTC] onAnswer: unexpected signalingState, skipping.");
        return;
      }
      try {
        await setRemoteDescAndFlush(pc, answer);
      } catch (err) {
        console.error("[WebRTC] onAnswer error:", err);
      }
    };

    /** Buffer ICE candidates if remote description isn't set yet */
    const onIceCandidate = async ({ candidate }) => {
      if (!pcRef.current || !candidate) return;
      const iceCandidate = new RTCIceCandidate(candidate);
      if (!remoteDescSetRef.current) {
        console.log("[WebRTC] Buffering ICE candidate (remote desc not set yet)");
        pendingIceRef.current.push(iceCandidate);
        return;
      }
      try {
        await pcRef.current.addIceCandidate(iceCandidate);
      } catch (err) {
        console.warn("[WebRTC] addIceCandidate error:", err.message);
      }
    };

    const onPeerLeft = () => {
      setRemoteStream(null);
      peerJoinedRef.current    = false;
      remoteDescSetRef.current = false;
      setConnectionState("disconnected");
      toast("The other participant left the call.", { id: "peer-left" });
    };

    socket.on("webrtc-peer-joined",   onPeerJoined);
    socket.on("webrtc-peers-present",  onPeersPresent);
    socket.on("webrtc-offer",         onOffer);
    socket.on("webrtc-answer",        onAnswer);
    socket.on("webrtc-ice-candidate", onIceCandidate);
    socket.on("webrtc-peer-left",     onPeerLeft);

    const onMediaState = ({ type, isOff }) => {
      if (type === "audio") setRemoteIsMuted(isOff);
      if (type === "video") setRemoteIsCameraOff(isOff);
    };
    socket.on("webrtc-media-state", onMediaState);

    return () => {
      mounted = false;
      socket.off("webrtc-peer-joined",   onPeerJoined);
      socket.off("webrtc-peers-present",  onPeersPresent);
      socket.off("webrtc-offer",         onOffer);
      socket.off("webrtc-answer",        onAnswer);
      socket.off("webrtc-ice-candidate", onIceCandidate);
      socket.off("webrtc-peer-left",     onPeerLeft);
      socket.off("webrtc-media-state",   onMediaState);
      cleanup();
    };
  }, [session?.callId, session?.status, loadingSession, isHost, isParticipant, buildPeerConnection, sendOffer, setRemoteDescAndFlush, cleanup]);

  // ── Media controls ────────────────────────────────────────────────────────

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const isNowMuted = !isMuted;
    stream.getAudioTracks().forEach((t) => { t.enabled = !isNowMuted; });
    setIsMuted(isNowMuted);
    if (socket.connected && roomIdRef.current) {
       socket.emit("webrtc-media-state", { roomId: roomIdRef.current, type: "audio", isOff: isNowMuted });
    }
  }, [isMuted]);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const isNowCameraOff = !isCameraOff;
    stream.getVideoTracks().forEach((t) => { t.enabled = !isNowCameraOff; });
    setIsCameraOff(isNowCameraOff);
    if (socket.connected && roomIdRef.current) {
       socket.emit("webrtc-media-state", { roomId: roomIdRef.current, type: "video", isOff: isNowCameraOff });
    }
  }, [isCameraOff]);

  const toggleScreenShare = useCallback(async () => {
    if (!pcRef.current || !localStreamRef.current) return;
    if (isSharingScreen) {
      const cameraTrack = localStreamRef.current.getVideoTracks()[0];
      if (cameraTrack) {
        await replaceVideoTrack(pcRef.current, cameraTrack);
        setLocalStream(localStreamRef.current);
      }
      stopStream(screenStreamRef.current);
      screenStreamRef.current = null;
      setIsSharingScreen(false);
    } else {
      try {
        const screenStream = await getScreenStream();
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];
        await replaceVideoTrack(pcRef.current, screenTrack);
        screenTrack.onended = () => {
          const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
          if (cameraTrack && pcRef.current) {
            replaceVideoTrack(pcRef.current, cameraTrack).catch(console.error);
            setLocalStream(localStreamRef.current);
          }
          stopStream(screenStreamRef.current);
          screenStreamRef.current = null;
          setIsSharingScreen(false);
        };
        setLocalStream(screenStream);
        setIsSharingScreen(true);
      } catch {
        // User cancelled screen picker
      }
    }
  }, [isSharingScreen]);

  const leaveCall = useCallback(() => {
    cleanup();
    setConnectionState("idle");
  }, [cleanup]);

  return {
    localStream,
    remoteStream,
    connectionState,
    isInitializingCall,
    isMuted,
    isCameraOff,
    isSharingScreen,
    remoteIsMuted,      // Exported to parent
    remoteIsCameraOff,  // Exported to parent
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    leaveCall,
  };
}

export default useWebRTCSession;
