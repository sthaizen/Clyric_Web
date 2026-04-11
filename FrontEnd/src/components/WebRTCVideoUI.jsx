import { useRef, useEffect } from "react";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  MonitorIcon,
  MonitorOffIcon,
  PhoneOffIcon,
  Loader2Icon,
  WifiOffIcon,
  AlertTriangleIcon,
  CameraOffIcon,
  UserPlusIcon
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Audio Visualizer ────────────────────────────────────────────────────────

function AudioVisualizer({ stream }) {
  const barsRef = useRef([]);
  const animationRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
       // Reset bars to minimum
       if (barsRef.current) {
         barsRef.current.forEach(bar => { if (bar) bar.style.height = '3px'; });
       }
       return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      
      // Browsers often suspend audio contexts until user interaction or explicit resume
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256; 
      analyser.smoothingTimeConstant = 0.4;

      const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
      const source = audioCtx.createMediaStreamSource(audioStream);

      // --- CHROME BUG FIX ---
      // Web Audio API stops receiving data if the physical `<video>` tag is muted.
      // We force the audio context to keep the stream alive by routing it through 
      // a 0-volume GainNode straight to the speakers. 
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0;
      source.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        // Check entire spectrum just to be safe
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        
        // Boost sensitivity (average speaking volume is usually ~10-20 here)
        const normalized = Math.min(1, (average / 255) * 4.0);

        if (barsRef.current) {
          barsRef.current.forEach((bar, index) => {
            if (!bar) return;
            const factor = index === 1 ? 1 : 0.7;
            const targetHeight = Math.max(3, normalized * factor * 14); 
            bar.style.height = `${targetHeight}px`;
          });
        }
        animationRef.current = requestAnimationFrame(update);
      };
      
      update();
    } catch (err) {
      console.warn("Audio Context failed to initialize:", err);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stream]);

  return (
    <div className="flex items-center gap-[2px] h-[14px] w-[14px] justify-center mx-0.5">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          ref={el => barsRef.current[i] = el}
          className="w-[2.5px] bg-green-500 rounded-full"
          style={{ height: '3px', transition: 'height 50ms ease-out' }}
        />
      ))}
    </div>
  );
}

// ─── Video Tile ──────────────────────────────────────────────────────────────

function VideoTile({ 
  stream, 
  label, 
  isMirrored = false, 
  isCameraOff = false, 
  isRemote = false,
  isMuted = false,
  imageUrl = null,
  connectionState = "connected"
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && stream && !isCameraOff) {
      ref.current.srcObject = stream;
    } else if (ref.current) {
      ref.current.srcObject = null;
    }
  }, [stream, isCameraOff]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#18181b] rounded-xl overflow-hidden border border-[#27272a]">
      {stream && !isCameraOff ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={!isRemote}          /* Never echo local audio */
          className={`w-full h-full object-cover ${isMirrored ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#18181b]">
          {imageUrl ? (
            <img src={imageUrl} alt={label} className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-[#2a2a2e]" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="w-16 h-16 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
                 <CameraOffIcon className="w-7 h-7 text-gray-500" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Label and Mic Status Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="px-2 py-1 bg-black/70 backdrop-blur-md rounded-md flex items-center gap-2">
          {isMuted ? <MicOffIcon className="w-3.5 h-3.5 text-red-500" /> : <AudioVisualizer stream={stream} />}
          <span className="text-xs text-gray-200 font-medium tracking-wide">
             {label}
          </span>
        </div>
      </div>

      {connectionState !== "connected" && connectionState !== "waiting" && isRemote && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-10">
           <Loader2Icon className="w-6 h-6 text-indigo-400 animate-spin mb-2" />
           <span className="text-xs text-gray-300 font-medium">Connecting...</span>
        </div>
      )}
    </div>
  );
}

// ─── Control Button ───────────────────────────────────────────────────────────

function ControlBtn({ onClick, active, danger, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border
        ${danger
          ? "bg-red-500 hover:bg-red-600 border-red-600 text-white"
          : active
            ? "bg-[#3f3f46] border-[#52525b] text-white hover:bg-[#52525b]"
            : "bg-[#27272a] border-[#3f3f46] text-gray-400 hover:bg-[#3f3f46] hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}


// ─── Main Component ────────────────────────────────────────────────────────────

function WebRTCVideoUI({
  localStream,
  remoteStream,
  connectionState,
  isMuted,
  isCameraOff,
  remoteIsMuted,
  remoteIsCameraOff,
  isSharingScreen,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onLeave,
  localLabel = "You",
  remoteLabel = "Participant",
  localImageUrl,
  remoteImageUrl
}) {
  const hasRemote = !!remoteStream || connectionState === "connecting";

  return (
    <div className="h-full flex flex-col gap-3 bg-[#09090b] rounded-xl overflow-hidden relative p-3">

      {/* ── Video Column Layout ───────────────────────────────────────── */}
      <div className="flex-1 relative min-h-0 w-full flex flex-col gap-3 pb-2">
            
            {/* Local Video Tile */}
            <div className="flex-1 min-h-0 w-full rounded-xl overflow-hidden">
                <VideoTile
                  stream={localStream}
                  label={localLabel}
                  isMirrored={!isSharingScreen}
                  isCameraOff={isCameraOff && !isSharingScreen}
                  isMuted={isMuted}
                  imageUrl={localImageUrl}
                  isRemote={false}
                />
            </div>

            {/* Remote Video Tile or Empty State */}
            <div className="flex-1 min-h-0 w-full rounded-xl overflow-hidden">
                {hasRemote && connectionState !== "waiting" ? (
                  <VideoTile 
                    stream={remoteStream} 
                    label={remoteLabel} 
                    isRemote={true}
                    isCameraOff={remoteIsCameraOff}
                    isMuted={remoteIsMuted}
                    imageUrl={remoteImageUrl}
                    connectionState={connectionState}
                  />
                ) : (
                  <div className="w-full h-full bg-[#18181b] border border-[#27272a] rounded-xl flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                        <UserPlusIcon className="w-10 h-10" />
                      </div>
                    </div>
                    <h3 className="text-gray-200 font-semibold mb-2">No one else is here yet</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-[250px]">Invite people to join you in this session!</p>
                  </div>
                )}
            </div>
      </div>

      {/* ── Controls bar ───────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-center gap-4 py-2 bg-transparent">

        <ControlBtn
          onClick={onToggleMute}
          active={!isMuted}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted
            ? <MicOffIcon className="w-5 h-5 text-red-500" />
            : <MicIcon className="w-5 h-5" />
          }
        </ControlBtn>

        <ControlBtn
          onClick={onToggleCamera}
          active={!isCameraOff}
          title={isCameraOff ? "Turn camera on" : "Turn camera off"}
        >
          {isCameraOff
             ? <VideoOffIcon className="w-5 h-5 text-red-500" />
            : <VideoIcon className="w-5 h-5" />
          }
        </ControlBtn>

        <ControlBtn
          onClick={onToggleScreenShare}
          active={isSharingScreen}
          title={isSharingScreen ? "Stop sharing screen" : "Share screen"}
        >
          {isSharingScreen
            ? <MonitorOffIcon className="w-5 h-5 text-indigo-400" />
            : <MonitorIcon className="w-5 h-5" />
          }
        </ControlBtn>

        <ControlBtn onClick={onLeave} danger title="Leave call">
          <PhoneOffIcon className="w-5 h-5" />
        </ControlBtn>
      </div>

    </div>
  );
}

export default WebRTCVideoUI;
