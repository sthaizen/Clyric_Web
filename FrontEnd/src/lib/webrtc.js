/**
 * webrtc.js — WebRTC peer connection factory and helpers.
 *
 * Responsibilities:
 * - ICE server configuration (STUN + optional TURN)
 * - RTCPeerConnection creation with correct defaults
 * - Media stream acquisition (camera/mic + screen share)
 * - Track replacement helper for screen share toggle
 *
 * This module is intentionally minimal. All lifecycle management
 * (offer/answer, ICE relay, cleanup) lives in useWebRTCSession.js.
 */

/** STUN servers — sufficient for most networks (no cost).
 *  For users behind symmetric NAT you would add TURN credentials here.
 *  TURN credentials should come from your backend to avoid leaking secrets.
 */
export const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302"  },
    { urls: "stun:stun.l.google.com:5349"   },
    { urls: "stun:stun1.l.google.com:3478"  },
    { urls: "stun:stun1.l.google.com:5349"  },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:5349"  },
    { urls: "stun:stun3.l.google.com:3478"  },
    { urls: "stun:stun3.l.google.com:5349"  },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:5349"  },
  ],
};

/**
 * Create a new RTCPeerConnection with standard config.
 * @returns {RTCPeerConnection}
 */
export function createPeerConnection() {
  return new RTCPeerConnection(ICE_SERVERS);
}

/**
 * Get local camera + microphone stream.
 * Throws a typed error so callers can show the right message.
 * @returns {Promise<MediaStream>}
 */
export async function getLocalStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
      audio: true,
    });
  } catch (err) {
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      throw new Error("PERMISSION_DENIED");
    }
    if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      throw new Error("NO_DEVICE");
    }
    throw new Error("MEDIA_ERROR");
  }
}

/**
 * Get the user's screen as a MediaStream.
 * @returns {Promise<MediaStream>}
 */
export async function getScreenStream() {
  try {
    return await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false, // Screen audio capture is optional; skip for simplicity
    });
  } catch (err) {
    throw new Error("SCREEN_DENIED");
  }
}

/**
 * Replace the video track on a peer connection sender.
 * Used for toggling between camera and screen share without renegotiation.
 * @param {RTCPeerConnection} pc
 * @param {MediaStreamTrack} newTrack
 */
export async function replaceVideoTrack(pc, newTrack) {
  const sender = pc.getSenders().find((s) => s.track && s.track.kind === "video");
  if (sender) {
    await sender.replaceTrack(newTrack);
  }
}

/**
 * Stop all tracks on a MediaStream safely.
 * @param {MediaStream|null} stream
 */
export function stopStream(stream) {
  if (!stream) return;
  stream.getTracks().forEach((t) => t.stop());
}
