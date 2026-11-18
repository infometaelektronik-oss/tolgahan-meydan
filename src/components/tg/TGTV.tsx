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
  Lock,
} from "lucide-react";
import type { Media } from "./data";
import {
  getTGTVCurrent,
  getTGTVSchedule,
  generateTGTVSchedule,
  TG_CHANNELS,
  getTGTVLogo,
  getTGTVChannelAnimation,
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

  // Auto-refresh right at program/break transitions (and every 30s trailer step during breaks)
  useEffect(() => {
    if (!current?.item?.endAt) return;
    const nowMs = Date.now();
    const endMs = new Date(current.item.endAt).getTime();
    let delayMs = Math.max(500, endMs - nowMs + 300);

    if (current.item.isBreak && current.item.startAt) {
      const elapsedMs = Math.max(0, nowMs - new Date(current.item.startAt).getTime());
      const nextStepDelay = 30_000 - (elapsedMs % 30_000) + 250;
      delayMs = Math.min(delayMs, Math.max(500, nextStepDelay));
    }

    const t = setTimeout(() => {
      loadChannelData(activeChannelId);
    }, delayMs);
    return () => clearTimeout(t);
  }, [current, activeChannelId, loadChannelData]);

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
    const cutoffIso = new Date(Date.now() - 2 * 3600_000).toISOString();
    return schedule.filter((it) => it.endAt >= cutoffIso).slice(0, 18);
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
  const [showEpg, setShowEpg] = useState(false);

  const [lockNotice, setLockNotice] = useState<{ title: string; time: string; mode: "past" | "future" } | null>(null);

  const handlePlayChannel = async (ch: TGChannelInfo) => {
    setActiveChannelId(ch.id);
    const nowMs = Date.now();
    let broadcast = current && current.channel.id === ch.id ? current : null;
    if (!broadcast || !broadcast.item || new Date(broadcast.item.endAt).getTime() <= nowMs) {
      try {
        broadcast = await getCurrentFn({ data: { channelId: ch.id } });
        setCurrent(broadcast);
      } catch {
        /* fallback to channel default below */
      }
    }

    const activeItem = broadcast?.item;
    let activeTitle = activeItem?.title || ch.genre;
    let activeDesc = activeItem?.description || ch.description;
    let activeUrl = activeItem?.streamUrl || ch.fallbackStreamUrl;
    let activePoster = activeItem?.posterUrl || "/assets/aistudio/Media_item_1_1bba30da.jpg";
    let liveOffset = broadcast?.offsetSeconds || 0;
    let slotId = activeItem ? `${ch.id}-${activeItem.id}` : ch.id;

    if (activeItem?.startAt) {
      const elapsedSec = Math.max(0, Math.floor((nowMs - new Date(activeItem.startAt).getTime()) / 1000));
      if (activeItem.isBreak && Array.isArray(activeItem.breakTrailers) && activeItem.breakTrailers.length > 0) {
        const tIdx = Math.min(activeItem.breakTrailers.length - 1, Math.floor(elapsedSec / 30));
        const tr = activeItem.breakTrailers[tIdx];
        activeTitle = `Reklam & Fragman Kuşağı · ${tr.title}`;
        activeDesc = `[${tIdx + 1}/${activeItem.breakTrailers.length}] ${tr.title} — Sıradaki program az sonra yayında.`;
        activeUrl = tr.streamUrl;
        activePoster = tr.posterUrl || activePoster;
        liveOffset = elapsedSec % 30;
        slotId = `${ch.id}-${activeItem.id}-tr-${tIdx}`;
      } else {
        liveOffset = elapsedSec;
      }
    }

    if (onPick) {
      onPick({
        id: slotId,
        title: ch.name,
        seriesTitle: activeTitle,
        description: activeDesc,
        backdrop: activePoster,
        poster: getTGTVLogo(ch.id),
        genre: ch.genre,
        genres: [ch.genre],
        year: 2026,
        duration: "Canlı",
        rating: "9.8",
        video: activeUrl,
        backupUrls: activeItem?.backupUrl ? [activeItem.backupUrl, ch.fallbackStreamUrl] : [ch.fallbackStreamUrl],
        isLive: true,
        liveOffsetSeconds: liveOffset,
        channelId: ch.id,
        liveSlotStartAt: activeItem?.startAt,
        liveSlotEndAt: activeItem?.endAt,
        isBreak: Boolean(activeItem?.isBreak),
        breakTrailers: activeItem?.breakTrailers,
      });
    } else {
      setPlayingChannel(ch);
    }
  };

  const handlePlayItem = (item: TGTVItem) => {
    const ch = TG_CHANNELS.find((c) => c.id === item.channelId) || activeChannel;
    setActiveChannelId(ch.id);
    const nowMs = Date.now();
    const startMs = new Date(item.startAt).getTime();
    const endMs = new Date(item.endAt).getTime();
    const isPast = endMs <= nowMs;
    const isFuture = startMs > nowMs;

    // Natural linear TV broadcast lock:
    // Lock BOTH past and future slots so viewers cannot jump out of live broadcast order.
    if (isFuture || isPast) {
      const startTime = new Date(item.startAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      setLockNotice({ title: item.title, time: startTime, mode: isPast ? "past" : "future" });
      setTimeout(() => setLockNotice(null), 4000);
      return;
    }

    setShowEpg(false);
    void handlePlayChannel(ch);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* Linear TV Broadcast Protection Toast */}
      {lockNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-[70] flex max-w-md items-center gap-3 rounded-2xl border border-amber-500/50 bg-black/95 px-5 py-3.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] backdrop-blur-xl animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-amber-300">
              Doğal Canlı Yayın Koruması
            </div>
            <div className="text-xs font-bold text-white/90">
              {lockNotice.mode === "past" ? (
                <>
                  "{lockNotice.title}" ({lockNotice.time}) yayını sona erdi. Doğal yayın akışı gereği geçmiş yayınlara geri sarılamaz.
                </>
              ) : (
                <>
                  "{lockNotice.title}" saat <span className="text-amber-400">{lockNotice.time}</span>'de yayına girecektir. Gelecek yayınlara erken geçiş kilitlidir.
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIP Cyber TG TV Banner Bar (High legibility, large fonts, themed styling) */}
      <div className="rounded-3xl border border-fuchsia-500/30 bg-gradient-to-r from-purple-950/80 via-fuchsia-950/50 to-black p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_20px_rgba(217,70,239,0.7)] shrink-0 border border-fuchsia-300/40">
              <Zap className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase text-white sm:text-2xl md:text-3xl tracking-tight">
                TG TV PLATFORM YAYIN KANALLARI
              </h1>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Sinema, Yerli Sinema, Yeşilçam, Dizi, Spor, Eğlence, Çocuk, Belgesel ve 15 tematik kanal. Kanala tıklayarak doğrudan canlı yayına geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* TIKLANABİLİR EPG YAYIN AKIŞI REHBERİ BARI (Kullanıcı tıkladığında EPG açılır/kapanır) */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <button
            onClick={() => setShowEpg((prev) => !prev)}
            className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
              showEpg
                ? "border-fuchsia-400 bg-gradient-to-r from-fuchsia-950/80 via-purple-900/60 to-black shadow-[0_0_25px_rgba(217,70,239,0.5)] ring-2 ring-fuchsia-400/50"
                : "border-white/15 bg-white/5 hover:border-fuchsia-500/50 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-600 text-white shadow-md">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-black uppercase tracking-wider text-white">
                    TG TV 24 SAATLİK YAYIN AKIŞI (EPG) REHBERİ
                  </span>
                  <span className="rounded-full bg-fuchsia-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-fuchsia-200 border border-fuchsia-400/30">
                    {showEpg ? "AÇIK · GİZLEMEK İÇİN TIKLA" : "REHBERİ GÖRMEK İÇİN TIKLAYIN"}
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  {activeChannel.name} ve tüm 15 kanalın canlı yayın saatleri, program akışları ve içerik detayları
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-fuchsia-300">
                {showEpg ? "Akışı Gizle" : "Yayın Akışını Göster"}
              </span>
              <span className={`text-base font-black transition-transform duration-300 ${showEpg ? "rotate-180" : ""}`}>
                ▼
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 15 TG TV Channels Grid (Canlı TV Mantığı: Büyük 3D Neon Kartlar, Tıklayınca Oynatıcı Başlar) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-base font-black text-white tracking-wide">
            <Radio className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            <span>Kanal Seçin ve Yayına Geçin</span>
          </div>
          <span className="text-xs text-purple-300/80 font-bold">
            {activeChannel.name} seçili
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
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 rounded-t-3xl shadow-[0_0_12px_rgba(217,70,239,0.9)]" />
                )}

                {/* Original TG Channel Logo on Reference Chrome Stage with Per-Channel Animation */}
                <div className="tgtv-logo-stage relative flex aspect-video w-full items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-purple-950/30 via-black/80 to-black border border-white/10 shadow-inner">
                  <img
                    src={getTGTVLogo(ch.id)}
                    alt={ch.name}
                    className={`h-full w-full object-contain transition duration-300 group-hover:scale-105 ${getTGTVChannelAnimation(ch.id)}`}
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
                  <div className="mt-1 line-clamp-1 text-[11px] font-bold text-fuchsia-200/90">
                    {ch.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* EPG MODAL MENÜSÜ (Kullanıcı "Yayın Akışını Göster"e tıkladığında ayrı bir menü olarak açılır) */}
      {showEpg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-2xl p-3 sm:p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-fuchsia-500/40 bg-gradient-to-b from-purple-950/90 via-neutral-950 to-black shadow-[0_0_50px_rgba(217,70,239,0.4)]">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-black/40 p-5 md:p-6">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_20px_rgba(217,70,239,0.7)]">
                  <CalendarClock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight text-white">
                      TG TV 24 Saatlik Yayın Akışı Rehberi
                    </h2>
                    <span className="rounded-full bg-fuchsia-500/30 px-3 py-0.5 text-[10px] font-black uppercase text-fuchsia-200 border border-fuchsia-400/30">
                      Canlı EPG Menüsü
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-purple-200/70">
                    Kanalı seçin ve istediğiniz programın canlı akışına anında katılın
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowEpg(false);
                    handlePlayChannel(activeChannel);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(217,70,239,0.6)] transition hover:scale-105 active:scale-95"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Kanalı Canlı İzle</span>
                </button>
                <button
                  onClick={() => setShowEpg(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white hover:bg-white/20 transition"
                  title="Menüyü Kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 15 Channel Tabs Bar */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-black/60 p-3 scrollbar-thin">
              {TG_CHANNELS.map((c) => {
                const isActive = activeChannelId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectChannel(c.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.6)] ring-1 ring-white/30 scale-105"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    <img
                      src={getTGTVLogo(c.id)}
                      alt={c.name}
                      className="h-4 w-auto object-contain"
                    />
                    <span>{c.name.replace("TG TV ", "")}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Active Channel Banner & Programs Grid */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
              {/* Active Channel Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getTGTVLogo(activeChannel.id)}
                    alt={activeChannel.name}
                    className="h-10 w-auto object-contain drop-shadow"
                  />
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white">{activeChannel.name}</h3>
                    <p className="text-xs text-white/60">{activeChannel.description}</p>
                  </div>
                </div>
                <span className="rounded-full bg-purple-500/30 px-3 py-1 text-xs font-black uppercase text-purple-200">
                  {activeChannel.genre} · {activeChannel.badge}
                </span>
              </div>

              {/* Programs Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((it) => {
                  const nowMs = Date.now();
                  const startMs = new Date(it.startAt).getTime();
                  const endMs = new Date(it.endAt).getTime();
                  const isCurrent = nowMs >= startMs && nowMs < endMs;
                  const isPast = endMs <= nowMs;
                  const isFuture = startMs > nowMs;
                  const isLocked = !isCurrent;

                  const startTime = new Date(it.startAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const endTime = new Date(it.endAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <button
                      type="button"
                      key={it.id}
                      onClick={() => handlePlayItem(it)}
                      aria-label={`${it.title} (${startTime} - ${endTime}) ${isCurrent ? "Yayında" : isPast ? "Yayın Sona Erdi - Kilitli" : "Gelecek Yayın - Kilitli"}`}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        isCurrent
                          ? it.isBreak
                            ? "border-amber-400 bg-gradient-to-br from-amber-950/70 via-rose-950/50 to-black shadow-[0_0_20px_rgba(245,158,11,0.45)] ring-2 ring-amber-400"
                            : "border-fuchsia-500 bg-gradient-to-br from-fuchsia-950/70 to-purple-950/50 shadow-[0_0_20px_rgba(217,70,239,0.4)] ring-2 ring-fuchsia-400"
                          : it.isBreak
                            ? "border-amber-500/25 bg-gradient-to-br from-amber-950/20 to-black/60 opacity-85 hover:border-amber-400/50 hover:opacity-100"
                            : isPast
                              ? "border-white/5 bg-black/50 opacity-60 hover:border-amber-500/30 hover:opacity-85"
                              : "border-white/10 bg-black/40 hover:border-amber-500/40 hover:bg-white/5 opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="w-full">
                        {/* Top Bar of the Card: Logo + Time + Status */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            {/* Neon TG TV Channel Logo */}
                            <img
                              src={getTGTVLogo(activeChannel.id)}
                              alt={activeChannel.name}
                              className="h-6 w-auto max-w-[45px] object-contain drop-shadow"
                            />
                            <div className="flex items-center gap-1.5 text-purple-200">
                              <Clock className="h-3.5 w-3.5 text-purple-300" />
                              <span className="text-xs font-black">
                                {startTime} - {endTime}
                              </span>
                            </div>
                          </div>

                          {isCurrent ? (
                            <span className="rounded-full bg-fuchsia-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse">
                              ● Yayında
                            </span>
                          ) : isPast ? (
                            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white/70 border border-white/15">
                              <Lock className="h-2.5 w-2.5" />
                              <span>Bitti</span>
                            </span>
                          ) : isFuture || isLocked ? (
                            <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-300 border border-amber-500/30">
                              <Lock className="h-2.5 w-2.5" />
                              <span>{startTime}'de</span>
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          {it.isBreak && (
                            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/30">
                              2 DK ARA
                            </span>
                          )}
                          <span className="text-sm font-black text-white group-hover:text-fuchsia-200 transition">
                            {it.title}
                          </span>
                        </div>

                        {it.description && (
                          <div className="mt-1 line-clamp-2 text-xs text-white/60">
                            {it.description}
                          </div>
                        )}
                      </div>

                      {isCurrent && (
                        <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 transition-all duration-1000"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}

                {upcoming.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-white/15 p-8 text-center text-xs text-white/50">
                    <Clock className="mx-auto mb-2 h-6 w-6 text-white/30" />
                    <span>Yayın akışı otonom olarak senkronize ediliyor...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

            {/* Animated Direct Broadcast Logo Bug */}
            <div className="absolute right-20 top-5 z-30 pointer-events-none select-none flex items-center gap-2">
              <div className="relative tgtv-logo-stage rounded-xl px-2 py-1">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-fuchsia-500/45 via-purple-500/35 to-pink-500/45 blur-lg animate-pulse" />
                <img
                  src={getTGTVLogo(playingChannel.id)}
                  alt={playingChannel.name}
                  className={`relative h-14 w-auto object-contain ${getTGTVChannelAnimation(playingChannel.id)}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
