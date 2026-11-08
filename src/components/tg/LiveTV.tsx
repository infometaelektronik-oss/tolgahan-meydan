import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { Grid2X2, Maximize2, Radio, Tv } from "lucide-react";
import type { Media } from "./data";
import { streamToMedia } from "./AdminSources";
import type { UserStream } from "@/lib/streams.functions";
import { proxiedStreamUrl } from "./v2-helpers";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onPick: (m: Media) => void;
  streams: UserStream[];
};

const SUB_CATEGORIES = ["Tümü", "Ulusal", "Haber", "Sinema", "Belgesel", "Spor", "Çocuk", "Müzik"] as const;
type SubCat = (typeof SUB_CATEGORIES)[number];

// Strict National Channel Order requested by user:
// 1. TRT 1, 2. ATV, 3. Kanal D, 4. Star, 5. Show, 6. Beyaz TV, 7. Kanal 7, 8. TV8, 9. NOW (Fox)
function getNationalRank(title: string): number {
  const t = title.toLowerCase().trim();
  if (/^trt\s*1\b/i.test(t)) return 1;
  if (/^atv\b/i.test(t) && !t.includes("avrupa")) return 2;
  if (/^kanal\s*d\b/i.test(t)) return 3;
  if (/^star(\s*tv)?\b/i.test(t)) return 4;
  if (/^show(\s*tv)?\b/i.test(t)) return 5;
  if (/^beyaz(\s*tv)?\b/i.test(t)) return 6;
  if (/^kanal\s*7\b/i.test(t)) return 7;
  if (/^tv8(\s*hd)?\b/i.test(t)) return 8;
  if (/^(now|fox)(\s*tv)?\b/i.test(t)) return 9;
  if (/^trt\s*2\b/i.test(t)) return 10;
  if (/^teve2\b/i.test(t)) return 11;
  if (/^(tv\s*)?360\b/i.test(t)) return 12;
  if (/^tlc\b/i.test(t)) return 13;
  if (/^dmax\b/i.test(t)) return 14;
  return 100;
}

function isTurkishStream(s: UserStream): boolean {
  if (s.isForeign) return false;
  const country = (s.country || "").toLowerCase();
  if (country === "türkiye" || country === "turkey" || country === "tr") return true;

  const t = (s.title || "").toLowerCase();
  return /trt|atv|kanal\s*d|star\s*tv|show\s*tv|beyaz\s*tv|kanal\s*7|tv8|now\s*tv|fox|a\s*haber|haber\s*türk|ntv|cnn\s*türk|sözcü|halk\s*tv|tele1|tv100|tgrt|tivibu|a\s*spor|sinema\s*1|tlc|dmax|minika|powertürk|kral/i.test(t);
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
    <div className="space-y-8 pb-10">
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-600/20 via-fuchsia-600/10 to-transparent p-6">
        <div className="flex items-center gap-3">
          <Tv className="h-6 w-6 text-purple-200" />
          <h2 className="text-2xl font-black">Canlı TV Kanalları</h2>
          <button
            ref={(el) => registerRef("live-mosaic", el)}
            data-focus-key="live-mosaic"
            tabIndex={-1}
            onClick={() => setMosaic((value) => !value)}
            className={`ml-auto flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black outline-none transition active:scale-95 ${
              focusedKey === "live-mosaic" ? "neon-ring scale-105 bg-purple-600 text-white" : "bg-white/10 text-white"
            }`}
          >
            <Grid2X2 className="h-4 w-4" /> Mozaik
          </button>
        </div>
        <p className="mt-2 text-sm text-white/70">
          Ulusal ve tematik canlı yayınlar: TRT 1, ATV, Kanal D, Star, Show, Beyaz TV, Kanal 7, TV8, NOW ve haber/spor kanalları.
        </p>

        {/* Origin Switcher: Türk Kanalları vs Yabancı Kanallar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest outline-none transition ${
                origin === o
                  ? "bg-white text-black font-black shadow-lg"
                  : focusedKey === `live-origin-${o}`
                    ? "neon-ring bg-white/20 text-white"
                    : "bg-white/10 text-white/70"
              }`}
            >
              {o === "local" ? "Türk Kanalları" : "Yabancı Kanallar"}
            </button>
          ))}

          {origin === "foreign" && (
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-bold text-white"
            >
              <option value="Tümü">Tüm ülkeler</option>
              {foreignCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>

        {/* Subcategories (Ulusal, Haber, Sinema, Belgesel, Spor, Çocuk, Müzik) */}
        <div className="mt-3 flex flex-wrap gap-2">
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
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    : focusedKey === fk
                      ? "neon-ring scale-105 bg-purple-600/40 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {mosaic && <MosaicView items={liveMedia.slice(0, 4)} onPick={onPick} />}

      {/* Channels Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-purple-300" />
            <h3 className="text-lg font-black tracking-tight">
              {origin === "local" ? "Türk TV Kanalları" : "Yabancı TV Kanalları"}
            </h3>
            <span className="text-xs text-white/50">({userLive.length} Kanal)</span>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
          {userLive.slice(0, shown).map((s, i) => {
            const fk = `live-mine-${i}`;
            const isFocus = focusedKey === fk;
            return (
              <button
                key={s.id}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => onPick(streamToMedia(s))}
                className={`group flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 outline-none transition active:scale-95 ${
                  isFocus ? "neon-ring scale-105 bg-purple-600/20" : "hover:bg-white/10 hover:border-purple-500/40"
                }`}
              >
                {s.posterUrl ? (
                  <img src={s.posterUrl} alt={s.title} className="h-16 w-16 rounded-xl object-contain" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 text-2xl font-black text-white">
                    {s.title.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="line-clamp-1 text-sm font-black text-white text-center">{s.title}</div>
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
