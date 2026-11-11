import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { Grid2X2, Maximize2, Radio, Tv } from "lucide-react";
import type { Media } from "./data";
import { streamToMedia } from "./AdminSources";
import type { UserStream } from "@/lib/streams.functions";
import { proxiedStreamUrl } from "./v2-helpers";
import { getChannelLogo } from "@/lib/turkishChannelLogos";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onPick: (m: Media) => void;
  streams: UserStream[];
};

const SUB_CATEGORIES = ["Tümü", "Ulusal", "Haber", "Sinema", "Belgesel", "Spor", "Çocuk", "Müzik"] as const;
type SubCat = (typeof SUB_CATEGORIES)[number];

// Strict National Channel Order requested by user:
// 1. TRT 1, 2. ATV, 3. Kanal D, 4. Star TV, 5. Show TV, 6. Beyaz TV, 7. TV8, 8. NOW TV, 9. Kanal 7
function getNationalRank(title: string): number {
  const t = title.toLowerCase().trim();
  if (/^trt\s*1\b/i.test(t)) return 1;
  if (/^atv\b/i.test(t) && !t.includes("avrupa") && !t.includes("alanya")) return 2;
  if (/^kanal\s*d\b/i.test(t) && !t.includes("euro") && !t.includes("drama")) return 3;
  if (/^star(\s*tv)?\b/i.test(t) && !t.includes("family") && !t.includes("international") && !t.includes("sinema")) return 4;
  if (/^show(\s*tv)?\b/i.test(t) && !t.includes("türk")) return 5;
  if (/^beyaz(\s*tv)?\b/i.test(t)) return 6;
  if (/^tv8(\s*hd)?$/i.test(t) || /^tv\s*8$/i.test(t)) return 7;
  if (/^(now|fox)(\s*tv)?\b/i.test(t)) return 8;
  if (/^kanal\s*7\b/i.test(t) && !t.includes("avrupa")) return 9;
  if (/^trt\s*2\b/i.test(t)) return 10;
  if (/^teve2\b/i.test(t)) return 11;
  if (/^(tv\s*)?360\b/i.test(t)) return 12;
  if (/^trt\s*haber\b/i.test(t)) return 13;
  if (/^ntv(\s*hd)?$/i.test(t)) return 14;
  if (/^haber\s*türk\b/i.test(t)) return 15;
  if (/^sözcü\b/i.test(t)) return 16;
  if (/^halk\s*tv\b/i.test(t)) return 17;
  if (/^tele1\b/i.test(t)) return 18;
  return 100;
}

// Clean channel display name (removes technical clutter like "NOW şimdi", "(1080p)", etc.)
function formatCleanChannelTitle(rawTitle: string): string {
  let t = rawTitle.trim();
  // NOW TV specific: clean "NOW şimdi" or "FOX (NOW)" to "NOW TV"
  if (/^(now|fox)\b/i.test(t)) {
    return "NOW TV";
  }
  // Remove technical suffixes
  t = t.replace(/\s*\(?(1080p|720p|360p|4k|fhd|hd|geo-blocked|not 24\/7|Ⓨ|Ⓢ)\)?/gi, "").trim();
  return t;
}

function isTurkishStream(s: UserStream): boolean {
  if (s.isForeign) return false;

  const t = (s.title || "").toLowerCase().trim();
  const url = (s.sourceUrl || "").toLowerCase();

  // Exclude bad external stream server
  if (url.includes("c3921155.edmonst.net") || url.includes("dvhp2vb5qxl7uc")) {
    return false;
  }

  // Strictly reject foreign channels masquerading as Turkish
  if (
    /star\s*(international|cinema|sinema|world|plus|gold|action|movies|channel|101|sports|trek|maa|kentrikis|central|family)|pluto|cinemax|fox\s*(life|live\s*now|sports|news|weather)|tvs\s*drive|ntv\s*(kenya|telugu|series)|abp\s*majha|first\s*india|mh\s*1|almahriah|mekameleen|rselvatv|360tunebox|kn\s*music|rock\s*now|now\s*(70s|80s|90s|tv\s*102)|atv\+\s*noticias|tlc\s*finland|elsharq|madinah|al-zahra|spacetoon/i.test(
      t
    )
  ) {
    return false;
  }

  const country = (s.country || "").toLowerCase();
  if (country === "türkiye" || country === "turkey" || country === "tr") {
    return true;
  }

  return /trt\s*(1|2|haber|spor|çocuk|belgesel|türk|avaz|diyanet|müzik)|atv|kanal\s*d|star(\s*tv)?$|show(\s*tv)?$|beyaz(\s*tv)?|kanal\s*7|tv8(\s*hd)?|now(\s*tv)?$|teve2|360|tlc|dmax|a\s*haber|haber\s*türk|ntv|cnn\s*türk|sözcü|halk\s*tv|tele1|tv100|tgrt|tivibu|a\s*spor|minika|powertürk|kral/i.test(
    t
  );
}

export function LiveTV({ focusedKey, registerRef, onPick, streams }: Props) {
  const allUserLive = useMemo(
    () => streams.filter((s) => s.category === "Live TV"),
    [streams]
  );

  const [sub, setSub] = useState<SubCat>("Tümü");
  const [origin, setOrigin] = useState<"local" | "foreign">("local");
  const [country, setCountry] = useState<string>("Tümü");
  const [shown, setShown] = useState(120);

  const foreignCountries = useMemo(() => {
    const counts = new Map<string, number>();
    allUserLive.forEach((s) => {
      if (s.isForeign && s.country) counts.set(s.country, (counts.get(s.country) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [allUserLive]);

  const userLive = useMemo(() => {
    return allUserLive.filter((s) => {
      // 1. Origin filter: Local (Strictly Turkish) vs Foreign
      if (origin === "local") {
        if (!isTurkishStream(s)) return false;
      } else {
        if (isTurkishStream(s)) return false;
        if (country !== "Tümü" && s.country !== country) return false;
      }

      // 2. Subcategory filter
      if (sub !== "Tümü") {
        const itemSub = (s.subCategory || "").toLowerCase();
        const itemGrp = (s.channelGroup || "").toLowerCase();
        const itemTitle = (s.title || "").toLowerCase();
        const target = sub.toLowerCase();

        if (target === "ulusal") {
          const isUlusal =
            itemSub === "ulusal" ||
            itemGrp === "ulusal" ||
            getNationalRank(s.title) < 100 ||
            /trt|atv|kanal\s*d|star|show|beyaz|kanal\s*7|tv8|now|fox|teve2|360/i.test(itemTitle);
          if (!isUlusal) return false;
        } else if (target === "haber") {
          const isHaber =
            itemSub === "haber" ||
            itemGrp === "haber" ||
            /haber|ntv|cnn|sözcü|halk|tele1|tv100|tgrt|bloomberg/i.test(itemTitle);
          if (!isHaber) return false;
        } else if (target === "sinema") {
          const isSinema =
            itemSub === "sinema" ||
            itemGrp === "sinema" ||
            /sinema|film|movie|cinema/i.test(itemTitle);
          if (!isSinema) return false;
        } else if (target === "belgesel") {
          const isBelgesel =
            itemSub === "belgesel" ||
            itemGrp === "belgesel" ||
            /belgesel|tlc|dmax|habitat|yaban|documentary|nat\s*geo|discovery/i.test(itemTitle);
          if (!isBelgesel) return false;
        } else if (target === "spor") {
          const isSpor =
            itemSub === "spor" ||
            itemGrp === "spor" ||
            /spor|sport|futbol|basket|tivibu/i.test(itemTitle);
          if (!isSpor) return false;
        } else if (target === "çocuk") {
          const isCocuk =
            itemSub === "çocuk" ||
            itemSub === "cocuk" ||
            /çocuk|cocuk|minika|disney|cartoon|kid/i.test(itemTitle);
          if (!isCocuk) return false;
        } else if (target === "müzik") {
          const isMuzik =
            itemSub === "müzik" ||
            itemSub === "muzik" ||
            /müzik|muzik|power|kral|dream|music|mtv/i.test(itemTitle);
          if (!isMuzik) return false;
        } else {
          if (itemSub !== target) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Strict sorting for Turkish channels
      if (origin === "local") {
        const rankA = getNationalRank(a.title);
        const rankB = getNationalRank(b.title);
        if (rankA !== rankB) return rankA - rankB;
      }
      return (a.sortOrder || 999) - (b.sortOrder || 999);
    });
  }, [allUserLive, sub, origin, country]);

  useEffect(() => setShown(120), [sub, origin, country]);
  const liveMedia = useMemo(() => userLive.slice(0, 4).map(streamToMedia), [userLive]);
  const [mosaic, setMosaic] = useState(false);

  return (
    <div className="space-y-6 pb-10">
      {/* 1. VIP Cyber Category Title Banner Bar at the VERY TOP */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-neutral-900/90 to-black p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-fuchsia-600 to-purple-700 shadow-[0_0_25px_rgba(244,63,94,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)] shrink-0 border border-white/20">
              <Tv className="h-7 w-7 text-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight drop-shadow-md">
                  {origin === "local"
                    ? sub === "Tümü"
                      ? "Türk TV Kanalları"
                      : `Türk TV ${sub} Kanalları`
                    : country === "Tümü"
                      ? "Yabancı TV Kanalları"
                      : `${country} TV Kanalları`}
                </h1>
                <span className="rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                  {userLive.length} Kanal
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                {origin === "local"
                  ? "Ulusal ana akım yayınlar, haber, spor ve tematik Türk televizyon kanalları."
                  : "Dünya genelinden ulusal televizyon kanalları ve global canlı yayın akışları."}
              </p>
            </div>
          </div>

          {/* Top Controls: Origin Selector (Türk Kanalları vs Yabancı Kanallar) & Mozaik */}
          <div className="flex flex-wrap items-center gap-2">
            {(["local", "foreign"] as const).map((o) => (
              <button
                key={o}
                ref={(el) => registerRef(`live-origin-${o}`, el)}
                data-focus-key={`live-origin-${o}`}
                tabIndex={-1}
                onClick={() => {
                  setOrigin(o);
                  setCountry("Tümü");
                }}
                className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider outline-none transition active:scale-95 border ${
                  origin === o
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border-fuchsia-400/50"
                    : focusedKey === `live-origin-${o}`
                      ? "neon-ring bg-white/20 text-white border-white/30"
                      : "bg-white/10 text-white/70 hover:bg-white/15 border-white/10"
                }`}
              >
                {o === "local" ? "Türk Kanalları" : "Yabancı Kanallar"}
              </button>
            ))}

            {origin === "foreign" && (
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-full border border-white/20 bg-black/80 px-4 py-2.5 text-xs font-bold text-white outline-none shadow-lg"
              >
                <option value="Tümü">Tüm ülkeler</option>
                {foreignCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            <button
              ref={(el) => registerRef("live-mosaic", el)}
              data-focus-key="live-mosaic"
              tabIndex={-1}
              onClick={() => setMosaic((value) => !value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black outline-none transition active:scale-95 border ${
                focusedKey === "live-mosaic" ? "neon-ring scale-105 bg-purple-600 text-white border-purple-400" : "bg-white/10 text-white hover:bg-white/15 border-white/15"
              }`}
            >
              <Grid2X2 className="h-4 w-4" /> Mozaik
            </button>
          </div>
        </div>
      </div>

      {/* Subcategories (Ulusal, Haber, Sinema, Belgesel, Spor, Çocuk, Müzik) */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {SUB_CATEGORIES.map((s, i) => {
          const active = sub === s;
          const fk = `live-sub-${i}`;
          return (
            <button
              key={s}
              ref={(el) => registerRef(fk, el)}
              data-focus-key={fk}
              tabIndex={-1}
              onClick={() => setSub(s)}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest outline-none transition ${
                active
                  ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-black shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/30"
                  : focusedKey === fk
                    ? "neon-ring scale-105 bg-purple-600/40 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/5"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {mosaic && <MosaicView items={liveMedia.slice(0, 4)} onPick={onPick} />}

      {/* Channels Grid with 3D Embossed Glass Badge Cards */}
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:gap-5">
          {userLive.slice(0, shown).map((s, i) => {
            const fk = `live-mine-${i}`;
            const isFocus = focusedKey === fk;
            const logo = getChannelLogo(s.title, s.posterUrl);
            return (
              <button
                key={s.id}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => {
                  const media = streamToMedia(s);
                  if (logo) media.poster = logo;
                  onPick(media);
                }}
                className={`group relative flex aspect-[4/3.4] flex-col items-center justify-between rounded-2xl border-2 p-4 outline-none transition-all duration-300 active:scale-95 ${
                  isFocus
                    ? "neon-ring scale-105 border-fuchsia-400 bg-gradient-to-b from-purple-900/60 via-purple-950/80 to-black shadow-[0_15px_30px_rgba(168,85,247,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                    : "border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-black/60 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:border-purple-400/60 hover:bg-gradient-to-b hover:from-white/15 hover:via-purple-950/30 hover:to-black"
                }`}
              >
                {/* 3D Diagonal light sheen reflection */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent opacity-80" />

                {/* 3D Embossed Logo Chamber */}
                <div className="relative flex h-20 w-full items-center justify-center rounded-xl bg-gradient-to-b from-black/40 to-black/20 p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  {logo ? (
                    <img
                      src={logo}
                      alt={s.title}
                      loading="lazy"
                      className="max-h-16 max-w-[85%] object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-rose-600 border border-white/30 text-xl font-black text-white shadow-[0_4px_15px_rgba(168,85,247,0.5),inset_0_1px_2px_rgba(255,255,255,0.5)]">
                      {s.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="w-full text-center mt-2">
                  <div className="line-clamp-1 text-xs font-black text-white tracking-wide drop-shadow group-hover:text-fuchsia-300 transition">
                    {formatCleanChannelTitle(s.title)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {userLive.length > shown && (
          <button
            ref={(el) => registerRef("live-more", el)}
            data-focus-key="live-more"
            tabIndex={-1}
            onClick={() => setShown((n) => n + 120)}
            className={`mt-6 w-full rounded-2xl px-5 py-4 text-sm font-black outline-none ${
              focusedKey === "live-more" ? "neon-ring bg-purple-600 text-white" : "bg-white/10 text-white"
            }`}
          >
            Daha fazla göster ({userLive.length - shown} kanal daha)
          </button>
        )}

        {userLive.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
            Bu kategoride kanal bulunamadı.
          </div>
        )}
      </section>
    </div>
  );
}

function MosaicView({ items, onPick }: { items: Media[]; onPick: (media: Media) => void }) {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
          <MiniLive media={item} />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-white">{item.title}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-purple-200">Canlı Mozaik</div>
            </div>
            <button onClick={() => onPick(item)} className="rounded-full bg-white/15 p-2 text-white transition hover:bg-purple-600">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

function MiniLive({ media }: { media: Media }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const raw = media.video || "";
    if (!video || !raw) return;
    const source = proxiedStreamUrl(raw, media.referer);
    let hls: Hls | null = null;
    if (/\.m3u8(?:\?|$)/i.test(raw) && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
    video.muted = true;
    video.play().catch(() => {});
    return () => hls?.destroy();
  }, [media.video, media.referer]);

  return <video ref={ref} poster={media.backdrop} muted playsInline className="h-full w-full object-cover opacity-90" />;
}
