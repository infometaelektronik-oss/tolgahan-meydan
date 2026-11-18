import { useMemo, useState } from "react";
import { streamToMedia } from "./AdminSources";
import type { Media } from "./data";
import type { UserStream } from "@/lib/streams.functions";
import { PosterCard } from "./PosterCard";
import { Film } from "lucide-react";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onPick: (m: Media) => void;
  streams: UserStream[];
  getEnrichment?: (title: string) => { posterUrl?: string; backdropUrl?: string } | null | undefined;
};

const MAIN_CATEGORIES = [
  "Tüm Filmler",
  "Yerli Sinema",
  "Yeşilçam Klasikleri",
  "Yabancı Sinema",
] as const;

const FOREIGN_SUBCATEGORIES = [
  "Tümü",
  "Aksiyon",
  "Bilim Kurgu",
  "Dram",
  "Suç",
  "Macera",
  "Gerilim",
  "Komedi",
  "Korku",
  "Fantastik",
  "Animasyon",
  "Tarih & Savaş",
  "Gizem",
] as const;

const YERLI_SUBCATEGORIES = [
  "Tümü",
  "Komedi",
  "Dram",
  "Aksiyon",
  "Romantik",
  "Macera",
  "Tarih",
  "Polisiye",
  "Bilim Kurgu",
] as const;

export function MovieView({ focusedKey, registerRef, onPick, streams, getEnrichment }: Props) {
  const [mainCat, setMainCat] = useState<(typeof MAIN_CATEGORIES)[number]>("Tüm Filmler");
  const [yerliSubCat, setYerliSubCat] = useState<(typeof YERLI_SUBCATEGORIES)[number]>("Tümü");
  const [foreignSubCat, setForeignSubCat] = useState<(typeof FOREIGN_SUBCATEGORIES)[number]>("Tümü");

  // Filter movies: strictly movies (category === "Movies", no trailers/snippets, no TG TV channel)
  const movies = useMemo(() => {
    const snippetRe = /fragman|trailer|teaser|\bkesit\b|\bklip\b/i;
    return streams
      .filter((s) => {
        if (s.category !== "Movies") return false;
        if (s.id === "tgtv-official-channel") return false;
        if (snippetRe.test(s.title)) return false;
        return true;
      })
      .map(streamToMedia);
  }, [streams]);

  const filteredMovies = useMemo(() => {
    if (mainCat === "Tüm Filmler") return movies;

    if (mainCat === "Yeşilçam Klasikleri") {
      const list = movies.filter((m) => {
        const titleLower = m.title.toLowerCase();
        const hay = [
          m.subCategory || "",
          m.genre || "",
          ...(m.genres || []),
          m.description || "",
        ].join(" ").toLowerCase();

        return (
          hay.includes("yeşilçam") ||
          hay.includes("yesilcam") ||
          /hababam|tosun|süt|şaban|kibar|çöpçü|neşeli|şekerpare|selvi boylum|kapıcılar|davaro|dokunmayın|züğürt|dütdüt/i.test(titleLower) ||
          (m.year && m.year < 1990 && !m.isForeign)
        );
      });
      // Sort Yeşilçam classics strictly by production year (yapım yılına göre sıralı)
      return list.sort((a, b) => (a.year || 1975) - (b.year || 1975));
    }

    if (mainCat === "Yerli Sinema") {
      const yerliList = movies.filter((m) => {
        if (m.isForeign) return false;
        const sub = (m.subCategory || "").toLowerCase();
        if (sub.includes("yabancı")) return false;
        const titleLower = m.title.toLowerCase();
        const isYesilcam =
          /hababam|tosun|süt|şaban|kibar|çöpçü|neşeli|şekerpare|selvi boylum|kapıcılar/i.test(titleLower) ||
          (m.year && m.year < 1990);
        return !isYesilcam;
      });

      if (yerliSubCat === "Tümü") return yerliList;

      return yerliList.filter((m) => {
        const text = [m.title, m.genre || "", ...(m.genres || []), m.subCategory || "", m.description || ""].join(" ").toLowerCase();
        if (yerliSubCat === "Komedi") return /komedi|güldürü|kolpaçino|gora|arog|yahşi|düğün|çalgı|vizontele|hokkabaz/i.test(text);
        if (yerliSubCat === "Dram") return /dram|drama|ağlatan|babam|kış uykusu|kelebeğin|masumiyet|ayla/i.test(text);
        if (yerliSubCat === "Aksiyon") return /aksiyon|action|vadi|dağ|nefes|av|panzehir|börü/i.test(text);
        if (yerliSubCat === "Romantik") return /romantik|aşk|sevgi|incir|ıssız/i.test(text);
        if (yerliSubCat === "Macera") return /macera|yolculuk|hazine|av/i.test(text);
        if (yerliSubCat === "Tarih") return /tarih|osmanlı|fetih|çanakkale|1453|cumhuriyet/i.test(text);
        if (yerliSubCat === "Polisiye") return /polisiye|cinayet|behzat|suç|komiser/i.test(text);
        if (yerliSubCat === "Bilim Kurgu") return /bilim|kurgu|uzay|gora|arog/i.test(text);
        return true;
      });
    }

    if (mainCat === "Yabancı Sinema") {
      const foreignList = movies.filter((m) => {
        if (m.isForeign) return true;
        const sub = (m.subCategory || "").toLowerCase();
        if (sub.includes("yabancı")) return true;
        return /interstellar|inception|dark knight|gladiator|matrix|shawshank|godfather|pulp fiction|fight club|general|nosferatu|sherlock|stranger|detour|carnival|scarlet|cyrano|bunny|sintel|metropolis|night of the living dead|charade/i.test(m.title);
      });

      if (foreignSubCat === "Tümü") return foreignList;

      return foreignList.filter((m) => {
        const text = [m.title, m.genre || "", ...(m.genres || []), m.subCategory || "", m.description || ""].join(" ").toLowerCase();
        if (foreignSubCat === "Aksiyon") return /aksiyon|action|knight|matrix|gladiator|general|tears of steel|macera/i.test(text);
        if (foreignSubCat === "Bilim Kurgu") return /bilim|kurgu|sci-fi|uzay|interstellar|inception|matrix|metropolis|plan 9|last man on earth/i.test(text);
        if (foreignSubCat === "Dram") return /dram|drama|shawshank|cyrano|scarlet/i.test(text);
        if (foreignSubCat === "Suç") return /suç|crime|noir|detour|scarlet|godfather|stranger|doa/i.test(text);
        if (foreignSubCat === "Macera") return /macera|adventure|yolculuk|gladiator|general|sindbad/i.test(text);
        if (foreignSubCat === "Gerilim") return /gerilim|thriller|stranger|39 steps|charade|gizem/i.test(text);
        if (foreignSubCat === "Komedi") return /komedi|comedy|his girl friday|general|my man godfrey|little shop/i.test(text);
        if (foreignSubCat === "Korku") return /korku|horror|nosferatu|carnival|haunted hill|living dead|dementia/i.test(text);
        if (foreignSubCat === "Fantastik") return /fantastik|fantasy|sintel|phantom/i.test(text);
        if (foreignSubCat === "Animasyon") return /animasyon|animation|big buck bunny|sintel|gulliver|popeye/i.test(text);
        if (foreignSubCat === "Tarih & Savaş") return /tarih|savaş|war|history|gladiator|cyrano|general/i.test(text);
        if (foreignSubCat === "Gizem") return /gizem|mystery|sherlock|39 steps|charade|stranger/i.test(text);
        return true;
      });
    }

    return movies;
  }, [movies, mainCat, yerliSubCat, foreignSubCat]);

  let cardCounter = 0;

  return (
    <div className="space-y-6 pb-12">
      {/* 3D VIP Header & Main Categories Bar */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-neutral-900/80 to-black p-5 md:p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-900/40 border border-amber-300/40">
              <Film className="h-6 w-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                  FİLMLER & SİNEMA ARŞİVİ
                </h1>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300 border border-amber-500/30">
                  {filteredMovies.length} Film
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 md:text-sm">
                Seçkin yerli sinema yapımları, yapım yılına göre Yeşilçam klasikleri ve yabancı başyapıtlar.
              </p>
            </div>
          </div>
        </div>

        {/* Main Category 3D Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {MAIN_CATEGORIES.map((cat) => {
            const active = mainCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setMainCat(cat)}
                className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all md:text-sm tracking-wide ${
                  active
                    ? "bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black shadow-[0_4px_20px_rgba(245,158,11,0.5)] ring-2 ring-white/30 scale-105"
                    : "bg-white/5 text-white/80 hover:bg-white/15 hover:text-white border border-white/10 hover:border-amber-500/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Yerli Sinema Subcategories */}
        {mainCat === "Yerli Sinema" && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            <span className="text-xs font-bold text-amber-400/90 mr-1 uppercase tracking-wider">Yerli Türler:</span>
            {YERLI_SUBCATEGORIES.map((sub) => {
              const active = yerliSubCat === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setYerliSubCat(sub)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? "bg-amber-500 text-black shadow-md shadow-amber-900/40"
                      : "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white border border-white/10"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* Foreign Cinema Subcategories */}
        {mainCat === "Yabancı Sinema" && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            <span className="text-xs font-bold text-rose-400/90 mr-1 uppercase tracking-wider">Yabancı Türler:</span>
            {FOREIGN_SUBCATEGORIES.map((sub) => {
              const active = foreignSubCat === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setForeignSubCat(sub)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? "bg-rose-600 text-white shadow-md shadow-rose-900/40"
                      : "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white border border-white/10"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center text-white/60">
          Bu kategoride henüz film bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {filteredMovies.map((m) => {
            const fk = `movie-card-${cardCounter++}`;
            const en = getEnrichment ? getEnrichment(m.title) : null;
            return (
              <div key={m.id} onClick={() => onPick(m)} className="cursor-pointer">
                <PosterCard
                  media={m}
                  focused={focusedKey === fk}
                  registerRef={(el) => registerRef(fk, el)}
                  focusKey={fk}
                  onPick={onPick}
                  posterOverride={en?.posterUrl}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
