import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarClock,
  Clapperboard,
  Film,
  Laugh,
  Loader2,
  Maximize2,
  Sparkles,
  Trophy,
  Tv,
  Volume2,
  VolumeX,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import {
  getTGTVCurrent,
  getTGTVSchedule,
  generateTGTVSchedule,
  TG_CHANNELS,
  type TGChannelId,
  type TGChannelInfo,
  type TGTVItem,
  type CurrentBroadcast,
} from "@/lib/tg-tv.functions";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
};

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const QUALITY_OPTIONS = [
  { id: "auto", label: "Otomatik (Uyumlu Hız)", hlsLevel: -1, ytQuality: "default" },
  { id: "1080p", label: "1080p Full HD", hlsLevel: 3, ytQuality: "hd1080" },
  { id: "720p", label: "720p HD", hlsLevel: 2, ytQuality: "hd720" },
  { id: "480p", label: "480p SD (Yavaş İnternet)", hlsLevel: 1, ytQuality: "large" },
  { id: "360p", label: "360p Tasarruf Modu", hlsLevel: 0, ytQuality: "medium" },
] as const;

export function TGTVView({ focusedKey, registerRef }: Props) {
  const getCurrentFn = useServerFn(getTGTVCurrent);
  const getScheduleFn = useServerFn(getTGTVSchedule);
  const regenFn = useServerFn(generateTGTVSchedule);

  const [activeChannelId, setActiveChannelId] = useState<TGChannelId>("tgtv-hd");
  const [current, setCurrent] = useState<CurrentBroadcast>(null);
  const [schedule, setSchedule] = useState<TGTVItem[]>([]);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyRegen, setBusyRegen] = useState(false);
  const [hasStreamError, setHasStreamError] = useState(false);

  // Controls auto-hide state & Quality state
  const [uiVisible, setUiVisible] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>("auto");
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeChannel = useMemo(
    () => TG_CHANNELS.find((c) => c.id === activeChannelId) || TG_CHANNELS[0],
    [activeChannelId]
  );

  const streamUrl = useMemo(() => {
    if (!current?.item) return activeChannel.fallbackStreamUrl;
    if (hasStreamError) {
      if (current.item.backupUrl && current.item.backupUrl !== current.item.streamUrl) {
        return current.item.backupUrl;
      }
      return activeChannel.fallbackStreamUrl;
    }
    return current.item.streamUrl || activeChannel.fallbackStreamUrl;
  }, [current, hasStreamError, activeChannel]);

  const ytVideoId = useMemo(() => getYouTubeId(streamUrl), [streamUrl]);
  const isYouTube = Boolean(ytVideoId);

  // Ping UI visibility: keeps controls visible on interaction, then auto-hides after 3.5s
  const pingUI = useCallback(() => {
    setUiVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      // Don't hide if user has quality menu open
      setShowQualityMenu((isOpen) => {
        if (!isOpen) setUiVisible(false);
        return isOpen;
      });
    }, 3500);
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  // Change resolution / stream quality
  const handleSelectQuality = (opt: (typeof QUALITY_OPTIONS)[number]) => {
    setSelectedQuality(opt.id);
    setShowQualityMenu(false);
    pingUI();

    // Apply to HLS
    if (hlsRef.current) {
      if (opt.hlsLevel === -1) {
        hlsRef.current.currentLevel = -1; // Auto
      } else {
        const levels = hlsRef.current.levels;
        if (levels && levels.length > 0) {
          const targetLevel = Math.min(opt.hlsLevel, levels.length - 1);
          hlsRef.current.currentLevel = targetLevel;
        }
      }
    }

    // Apply to YouTube
    if (ytPlayerRef.current?.setPlaybackQuality) {
      try {
        ytPlayerRef.current.setPlaybackQuality(opt.ytQuality);
      } catch {}
    }
  };

  // Fetch current broadcast and 24h EPG for the selected channel
  const loadChannelData = useCallback(
    async (chId: TGChannelId) => {
      try {
        setLoading(true);
        setHasStreamError(false);
        const [c, s] = await Promise.all([
          getCurrentFn({ data: { channelId: chId } }),
          getScheduleFn({ data: { channelId: chId } }),
        ]);
        setCurrent(c);
        setSchedule(s);
      } catch (e) {
        console.warn("TG TV load error:", e);
      } finally {
        setLoading(false);
      }
    },
    [getCurrentFn, getScheduleFn]
  );

  const selectChannel = (chId: TGChannelId) => {
    if (chId === activeChannelId) return;
    setActiveChannelId(chId);
  };

  useEffect(() => {
    loadChannelData(activeChannelId);
    const interval = setInterval(() => {
      loadChannelData(activeChannelId);
    }, 45_000);
    return () => clearInterval(interval);
  }, [activeChannelId, loadChannelData]);

  // Dual-Engine Playback Setup: HLS / HTML5 Video
  useEffect(() => {
    if (isYouTube) return;
    const v = videoRef.current;
    if (!v || !streamUrl) return;

    let hls: Hls | null = null;
    const isM3u8 = /\.m3u8(?:\?|$)/i.test(streamUrl);
    const proxyUrl = streamUrl.startsWith("http")
      ? `/api/public/stream-proxy?url=${encodeURIComponent(streamUrl)}`
      : streamUrl;

    const playVideo = () => {
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    };

    if (isM3u8 && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        fragLoadingMaxRetry: 8,
        manifestLoadingMaxRetry: 8,
        levelLoadingMaxRetry: 8,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;

      hls.loadSource(proxyUrl);
      hls.attachMedia(v);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (current?.offsetSeconds && current.offsetSeconds > 0) {
          try {
            if (v.duration && v.duration > current.offsetSeconds) {
              v.currentTime = current.offsetSeconds;
            }
          } catch {}
        }
        playVideo();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn("HLS Fatal Error, triggering failover:", data);
          setHasStreamError(true);
        }
      });
    } else {
      v.src = proxyUrl;
      v.addEventListener("loadedmetadata", () => {
        if (current?.offsetSeconds && current.offsetSeconds > 0) {
          try {
            if (v.duration && v.duration > current.offsetSeconds) {
              v.currentTime = current.offsetSeconds;
            }
          } catch {}
        }
        playVideo();
      });
      v.addEventListener("error", () => {
        setHasStreamError(true);
      });
    }

    return () => {
      hls?.destroy();
      hlsRef.current = null;
    };
  }, [streamUrl, isYouTube, current?.offsetSeconds]);

  // Dual-Engine Playback Setup: YouTube API Bridge
  const ytMountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isYouTube || !ytVideoId) return;
    let destroyed = false;

    const setupYT = () => {
      if (destroyed) return;
      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      const mountEl = ytMountRef.current;
      if (!mountEl) return;

      if (ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }

      mountEl.innerHTML = "";
      const targetDiv = document.createElement("div");
      targetDiv.id = `tgtv-yt-player-target-${Date.now()}`;
      mountEl.appendChild(targetDiv);

      try {
        const startSec = Math.floor(current?.offsetSeconds || 0);
        ytPlayerRef.current = new YT.Player(targetDiv, {
          videoId: ytVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            enablejsapi: 1,
            start: startSec > 0 ? startSec : undefined,
          },
          events: {
            onReady: (e: any) => {
              if (destroyed) return;
              try {
                if (muted) e.target.mute();
                else e.target.unMute();
                e.target.playVideo();
              } catch {}
            },
            onError: (e: any) => {
              if (destroyed) return;
              console.warn("TG TV YouTube error:", e.data);
              setHasStreamError(true);
            },
          },
        });
      } catch (err) {
        console.warn("TG TV YT setup error:", err);
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      setupYT();
    } else {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        setupYT();
      };
      if (!document.getElementById("yt-iframe-api-tag")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api-tag";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }

    return () => {
      destroyed = true;
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {}
      ytPlayerRef.current = null;
      if (ytMountRef.current) {
        ytMountRef.current.innerHTML = "";
      }
    };
  }, [isYouTube, ytVideoId, current?.offsetSeconds, muted]);

  // Calculate live progress percentage
  const progressPercent = useMemo(() => {
    if (!current?.item) return 0;
    const start = new Date(current.item.startAt).getTime();
    const end = new Date(current.item.endAt).getTime();
    const now = Date.now();
    const total = end - start;
    if (total <= 0) return 0;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }, [current]);

  const upcoming = useMemo(() => {
    const nowIso = new Date().toISOString();
    return schedule.filter((it) => it.endAt >= nowIso).slice(0, 15);
  }, [schedule]);

  const forceRegen = async () => {
    setBusyRegen(true);
    try {
      await regenFn({ data: { channelId: activeChannelId } });
      await loadChannelData(activeChannelId);
    } catch {
      /* ignore */
    } finally {
      setBusyRegen(false);
    }
  };

  const getChannelIcon = (id: TGChannelId) => {
    switch (id) {
      case "tgtv-sinema":
        return <Film className="h-5 w-5" />;
      case "tgtv-sinema2":
        return <Clapperboard className="h-5 w-5" />;
      case "tgtv-yerli":
        return <Sparkles className="h-5 w-5" />;
      case "tgtv-spor":
        return <Trophy className="h-5 w-5" />;
      case "tgtv-eglence":
        return <Laugh className="h-5 w-5" />;
      default:
        return <Tv className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* DIGITURK-STYLE CHANNEL SELECTOR BAR */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-900/40 via-purple-950/20 to-black/40 p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/Media_item_1_1bba30da.jpg"
              alt="TG Dizi Film Logo"
              className="h-12 w-12 rounded-2xl object-cover border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.7)] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight sm:text-2xl">
                  TG TV Platformu
                </h2>
              </div>
              <p className="text-xs text-purple-200/70">
                Otonom akış: Sinema, Yabancı Sinema, Türk dizileri, maç özetleri ve TV programları
              </p>
            </div>
          </div>

          <button
            onClick={forceRegen}
            disabled={busyRegen}
            className="flex items-center gap-2 rounded-2xl border border-purple-400/30 bg-purple-600/30 px-3.5 py-2 text-xs font-bold text-purple-200 transition hover:bg-purple-600 hover:text-white active:scale-95 disabled:opacity-50"
            title="Akışı Yenile"
          >
            {busyRegen ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
            <span>Yayın Akışını Yenile</span>
          </button>
        </div>

        {/* 6 Digiturk-Style Channels Tabs */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
          {TG_CHANNELS.map((ch) => {
            const isActive = ch.id === activeChannelId;
            const fk = `tgtv-ch-${ch.id}`;
            return (
              <button
                key={ch.id}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => selectChannel(ch.id)}
                className={`group relative flex flex-col items-start rounded-2xl border p-3 text-left transition duration-300 outline-none ${
                  isActive
                    ? `border-purple-400 bg-gradient-to-br ${ch.color} shadow-[0_0_25px_rgba(168,85,247,0.6)] scale-[1.02]`
                    : focusedKey === fk
                      ? "neon-ring border-white/60 bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-white/10"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[11px] font-black uppercase tracking-wider ${
                      isActive ? "bg-black/40 text-white" : "bg-white/10 text-purple-300"
                    }`}
                  >
                    {ch.name}
                  </span>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-xl transition ${
                      isActive ? "bg-white/20 text-white" : "text-white/60 group-hover:text-purple-300"
                    }`}
                  >
                    {getChannelIcon(ch.id)}
                  </div>
                </div>

                <div className="mt-2 text-sm font-black text-white leading-tight">{ch.name}</div>
                <div
                  className={`mt-0.5 line-clamp-1 text-[11px] ${
                    isActive ? "text-white/90 font-semibold" : "text-white/50"
                  }`}
                >
                  {ch.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* BROADCAST MAIN PLAYER & 24H EPG SCHEDULE */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: TV Broadcast Player Container */}
        <div className="space-y-4">
          <div
            ref={containerRef}
            onMouseMove={pingUI}
            onTouchStart={pingUI}
            onClick={pingUI}
            className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-purple-500/30 bg-black shadow-[0_0_35px_rgba(0,0,0,0.8)] cursor-pointer"
          >
            {/* YouTube Embed Player */}
            {isYouTube && ytVideoId ? (
              <div className="absolute inset-0 h-full w-full z-0 bg-black flex items-center justify-center overflow-hidden">
                <div
                  ref={ytMountRef}
                  className="pointer-events-none w-full h-full relative"
                  style={{
                    width: "106%",
                    height: "116%",
                    position: "absolute",
                    top: "-8%",
                    left: "-3%",
                  }}
                />
              </div>
            ) : (
              /* Native HLS / MP4 Video Player */
              <video
                ref={videoRef}
                playsInline
                muted={muted}
                autoPlay
                crossOrigin="anonymous"
                poster={current?.item.posterUrl || "/assets/aistudio/Media_item_1_1bba30da.jpg"}
                className="h-full w-full object-cover transition-opacity duration-300"
                onClick={toggleFullscreen}
              />
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 text-purple-300">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Yayın Hazırlanıyor...
                  </span>
                </div>
              </div>
            )}

            {/* TG TV Logo Watermark (Top-Right) */}
            <div className="absolute right-4 top-4 z-20 pointer-events-none select-none">
              <div className="flex items-center gap-2 rounded-xl bg-black/70 px-2.5 py-1.5 backdrop-blur-md border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                <img
                  src="/assets/aistudio/Media_item_1_1bba30da.jpg"
                  alt="TG TV Logo"
                  className="h-6 w-6 rounded-lg object-cover"
                />
                <div className="text-[11px] font-black uppercase tracking-widest text-purple-200">
                  {activeChannel.name}
                </div>
              </div>
            </div>

            {/* Auto-Hiding Controls & Info Bar (Bottom) */}
            <div
              className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-5 transition-opacity duration-500 ${
                uiVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <span>Yayında</span>
                    <span>•</span>
                    <span>{activeChannel.name}</span>
                  </div>
                  <h3 className="mt-1 truncate text-xl font-black text-white sm:text-2xl drop-shadow-md">
                    {current?.item.title || `${activeChannel.name} Yayını`}
                  </h3>
                  {current?.item.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-white/70 max-w-xl">
                      {current.item.description}
                    </p>
                  )}

                  {/* Broadcast Time Elapsed Bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-[11px] font-bold text-purple-200">
                      %{progressPercent}
                    </span>
                  </div>
                </div>

                {/* Player Quick Controls */}
                <div className="relative flex items-center gap-2 shrink-0">
                  {/* Resolution / Quality Selector */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQualityMenu((v) => !v);
                        pingUI();
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-black text-white backdrop-blur hover:bg-purple-600 transition active:scale-95"
                      title="Çözünürlük Kalitesi"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="uppercase">{selectedQuality}</span>
                    </button>

                    {/* Quality Dropdown Popup */}
                    {showQualityMenu && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-12 right-0 z-50 w-56 rounded-2xl border border-purple-500/40 bg-black/90 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="mb-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-purple-300 border-b border-white/10">
                          Yayın Kalitesi
                        </div>
                        {QUALITY_OPTIONS.map((opt) => {
                          const isCur = selectedQuality === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectQuality(opt)}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                                isCur
                                  ? "bg-purple-600 text-white"
                                  : "text-white/80 hover:bg-white/10"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isCur && <Check className="h-3.5 w-3.5 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextMute = !muted;
                      setMuted(nextMute);
                      if (videoRef.current) videoRef.current.muted = nextMute;
                      if (ytPlayerRef.current) {
                        if (nextMute) ytPlayerRef.current.mute?.();
                        else ytPlayerRef.current.unMute?.();
                      }
                      pingUI();
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur hover:bg-purple-600 transition active:scale-95"
                    title={muted ? "Sesi Aç" : "Sesi Kapat"}
                  >
                    {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                      pingUI();
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur hover:bg-purple-600 transition active:scale-95"
                    title="Tam Ekran"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Program Detailed Info Banner */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30 shrink-0">
                {getChannelIcon(activeChannel.id)}
              </div>
              <div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  Aktif Kanal
                </div>
                <div className="text-base font-black text-white">
                  {activeChannel.name} — {activeChannel.badge}
                </div>
                <div className="text-xs text-white/70">{activeChannel.description}</div>
              </div>
            </div>

            {current?.next && (
              <div className="rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-purple-300">
                  Sonraki Program (
                  {new Date(current.next.startAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  )
                </div>
                <div className="text-xs font-black text-white line-clamp-1 max-w-xs">
                  {current.next.title}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: 24-Hour EPG Schedule (Yayın Akışı) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-200">
              <CalendarClock className="h-4 w-4 text-purple-400" />
              <span>{activeChannel.name} Yayın Akışı</span>
            </div>
            <span className="text-[10px] font-bold text-white/50">24 Saatlik Akış</span>
          </div>

          <div className="max-h-[580px] space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
            {upcoming.map((it, i) => {
              const fk = `epg-${activeChannel.id}-${i}`;
              const isCurrent = current?.item.id === it.id;
              const startTime = new Date(it.startAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const endTime = new Date(it.endAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={it.id}
                  ref={(el) => registerRef(fk, el)}
                  data-focus-key={fk}
                  tabIndex={-1}
                  className={`group relative flex flex-col rounded-2xl border p-3.5 transition duration-200 ${
                    isCurrent
                      ? "border-purple-500 bg-gradient-to-r from-purple-900/40 to-purple-950/30 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      : focusedKey === fk
                        ? "neon-ring border-purple-400/60 bg-white/10"
                        : "border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-purple-300" />
                      <span className="text-xs font-black text-purple-200">
                        {startTime} - {endTime}
                      </span>
                    </div>

                    {isCurrent ? (
                      <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_10px_rgba(168,85,247,0.7)]">
                        Şu An
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-white/40">Sırada</span>
                    )}
                  </div>

                  <div className="mt-2 text-sm font-black text-white group-hover:text-purple-200 transition">
                    {it.title}
                  </div>

                  {it.description && (
                    <div className="mt-1 line-clamp-2 text-xs text-white/60">
                      {it.description}
                    </div>
                  )}

                  {isCurrent && (
                    <div className="mt-3 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-purple-400 transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {upcoming.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-xs text-white/50">
                <Clock className="mx-auto mb-2 h-6 w-6 text-white/30" />
                <span>Yayın akışı yükleniyor...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
