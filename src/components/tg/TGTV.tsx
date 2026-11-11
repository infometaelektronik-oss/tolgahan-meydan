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
  Play,
  X,
  Radio,
  Zap,
} from "lucide-react";
import type { Media } from "./data";
import {
  getTGTVCurrent,
  getTGTVSchedule,
  generateTGTVSchedule,
  TG_CHANNELS,
  getTGTVLogo,
  type TGChannelId,
  type TGChannelInfo,
  type TGTVItem,
  type CurrentBroadcast,
} from "@/lib/tg-tv.functions";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onPick?: (media: Media) => void;
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

export function TGTVView({ focusedKey, registerRef, onPick }: Props) {
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

  const [playingChannel, setPlayingChannel] = useState<TGChannelInfo | null>(null);

  const handlePlayChannel = (ch: TGChannelInfo) => {
    setActiveChannelId(ch.id);
    if (onPick) {
      onPick({
        id: ch.id,
        title: ch.name,
        seriesTitle: current?.item?.title || ch.genre,
        description: current?.item?.description || ch.description,
        backdrop: current?.item?.posterUrl || "/assets/aistudio/Media_item_1_1bba30da.jpg",
        poster: getTGTVLogo(ch.id),
        genre: ch.genre,
        genres: [ch.genre],
        year: 2026,
        duration: "Canlı",
        rating: "9.8",
        video: streamUrl,
        isLive: true,
      });
    } else {
      setPlayingChannel(ch);
    }
  };

  return (
    <div className="space-y-8 pb-14">
      {/* VIP Cyber TG TV Banner Bar (High legibility, large fonts, themed styling) */}
      <div className="rounded-3xl border border-fuchsia-500/30 bg-gradient-to-r from-purple-950/80 via-fuchsia-950/40 to-black p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_20px_rgba(217,70,239,0.7)] shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-white sm:text-2xl md:text-3xl tracking-tight">
                  TG TV Özel Canlı Yayın Kanalları
                </h1>
                <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-fuchsia-300 border border-fuchsia-500/40">
                  15 Özel Kategori & Otonom EPG
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Sinema, Yeşilçam, Dizi, Spor, Eğlence, Çocuk, Belgesel ve daha fazlası. İstediğiniz kanala tıklayarak anında canlı yayını başlatın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 15 TG TV Channels Grid (Canlı TV Mantığı: Büyük Neon Kartlar, Tıklayınca Oynatıcı Başlar) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-base font-black text-white tracking-wide">
            <Radio className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            <span>Kanal Seçin ve Yayına Geçin</span>
          </div>
          <span className="text-xs text-purple-300/70 font-semibold">
            {activeChannel.name} seçili (Aktif EPG aşağıda)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
          {TG_CHANNELS.map((ch) => {
            const isSelected = ch.id === activeChannelId;
            const fk = `tgtv-card-${ch.id}`;
            const isFocus = focusedKey === fk;
            return (
              <button
                key={ch.id}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => {
                  setActiveChannelId(ch.id);
                  handlePlayChannel(ch);
                }}
                className={`group relative flex flex-col items-center justify-between rounded-3xl border p-4 text-center outline-none transition-all duration-300 ${
                  isSelected
                    ? "border-fuchsia-400 bg-gradient-to-b from-purple-900/60 via-fuchsia-950/40 to-black shadow-[0_0_30px_rgba(217,70,239,0.5)] scale-[1.03] ring-2 ring-fuchsia-400/80"
                    : isFocus
                      ? "neon-ring border-white/60 bg-white/10 scale-105"
                      : "border-white/10 bg-black/50 hover:border-fuchsia-500/50 hover:bg-white/5 hover:scale-[1.02]"
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isSelected && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 rounded-t-3xl" />
                )}

                {/* Big Neon Channel Logo */}
                <div className="relative flex aspect-video w-full items-center justify-center p-2">
                  <img
                    src={getTGTVLogo(ch.id)}
                    alt={ch.name}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                  />
                  {/* Play Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 backdrop-blur-xs transition group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.9)]">
                      <Play className="ml-1 h-6 w-6 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Channel Meta info */}
                <div className="mt-3 w-full border-t border-white/10 pt-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {ch.genre}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-1 text-[11px] font-bold text-fuchsia-200/80">
                    {ch.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* DEDICATED 24-HOUR EPG SCHEDULE FOR SELECTED CHANNEL */}
      <section className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-neutral-900/60 to-black/80 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3.5">
            <img
              src={getTGTVLogo(activeChannel.id)}
              alt={activeChannel.name}
              className="h-10 w-auto object-contain drop-shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{activeChannel.name} 24 Saatlik Yayın Akışı</h2>
                <span className="rounded-full bg-purple-500/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-200">
                  {activeChannel.genre}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/60">
                Otonom yapay zeka tarafından 7/24 kesintisiz planlanan yayın listesi
              </p>
            </div>
          </div>

          <button
            onClick={() => handlePlayChannel(activeChannel)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(217,70,239,0.6)] transition hover:scale-105 active:scale-95"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Yayını Başlat</span>
          </button>
        </div>

        {/* EPG Timeline Slots */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.slice(0, 12).map((it) => {
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
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition ${
                  isCurrent
                    ? "border-fuchsia-500 bg-gradient-to-br from-fuchsia-950/60 to-purple-950/40 shadow-[0_0_20px_rgba(217,70,239,0.3)] ring-1 ring-fuchsia-400"
                    : "border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-purple-300" />
                      <span className="text-xs font-black text-purple-200">
                        {startTime} - {endTime}
                      </span>
                    </div>

                    {isCurrent ? (
                      <span className="rounded-full bg-fuchsia-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse">
                        ● Yayında
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-white/40">Sırada</span>
                    )}
                  </div>

                  <div className="mt-2.5 text-sm font-black text-white">
                    {it.title}
                  </div>

                  {it.description && (
                    <div className="mt-1 line-clamp-2 text-xs text-white/60">
                      {it.description}
                    </div>
                  )}
                </div>

                {isCurrent && (
                  <div className="mt-3 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-400 to-purple-400 transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {upcoming.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/15 p-8 text-center text-xs text-white/50">
              <Clock className="mx-auto mb-2 h-6 w-6 text-white/30" />
              <span>Yayın akışı otonom olarak senkronize ediliyor...</span>
            </div>
          )}
        </div>
      </section>

      {/* Internal Modal Video Player */}
      {playingChannel && !onPick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-fuchsia-500/40 bg-black shadow-2xl">
            <button
              onClick={() => setPlayingChannel(null)}
              className="absolute right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/20 transition"
            >
              <X className="h-6 w-6" />
            </button>

            {isYouTube && ytVideoId ? (
              <div className="absolute inset-0 h-full w-full z-0 bg-black flex items-center justify-center overflow-hidden">
                <div
                  ref={ytMountRef}
                  className="pointer-events-none w-full h-full absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:inset-0"
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                playsInline
                muted={muted}
                autoPlay
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
            )}

            {/* Direct Broadcast Logo Bug */}
            <div className="absolute right-6 top-6 z-30 pointer-events-none select-none">
              <img
                src={getTGTVLogo(playingChannel.id)}
                alt={playingChannel.name}
                className="h-14 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
