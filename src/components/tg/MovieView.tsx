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
  "Dram & Suç",
  "Macera",
] as const;

export function MovieView({ focusedKey, registerRef, onPick, streams, getEnrichment }: Props) {
  const [mainCat, setMainCat] = useState<(typeof MAIN_CATEGORIES)[number]>("Tüm Filmler");
  const [foreignSubCat, setForeignSubCat] = useState<(typeof FOREIGN_SUBCATEGORIES)[number]>("Tümü");

  // Filter movies: strictly movies (category === "Movies", no TV live streams, no Indian news)
  const movies = useMemo(() => {
    return streams
      .filter((s) => {
        if (s.category !== "Movies") return false;
        if (s.streamType === "HLS") return false;
        if (s.sourceUrl?.includes(".m3u8")) return false;
        return true;
      })
      .map(streamToMedia);
  }, [streams]);

  const filteredMovies = useMemo(() => {
    if (mainCat === "Tüm Filmler") return movies;

    if (mainCat === "Yeşilçam Klasikleri") {
      return movies.filter((m) => {
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
          /hababam|tosun|süt|şaban|kibar|çöpçü|neşeli|şekerpare|selvi boylum|kapıcılar/i.test(titleLower) ||
          (m.year && m.year < 1990 && !m.isForeign)
        );
      });
    }

    if (mainCat === "Yerli Sinema") {
      return movies.filter((m) => {
        if (m.isForeign) return false;
        const sub = (m.subCategory || "").toLowerCase();
        if (sub.includes("yabancı")) return false;
        const titleLower = m.title.toLowerCase();
        const isYesilcam =
          /hababam|tosun|süt|şaban|kibar|çöpçü|neşeli|şekerpare|selvi boylum|kapıcılar/i.test(titleLower) ||
          (m.year && m.year < 1990);
        return !isYesilcam;
      });
    }

    if (mainCat === "Yabancı Sinema") {
      const foreignList = movies.filter((m) => {
        if (m.isForeign) return true;
        const sub = (m.subCategory || "").toLowerCase();
        if (sub.includes("yabancı")) return true;
        // Check Hollywood classics by title
        return /interstellar|inception|dark knight|gladiator|matrix|shawshank|godfather|pulp fiction|fight club/i.test(m.title);
      });

      if (foreignSubCat === "Tümü") return foreignList;

      return foreignList.filter((m) => {
        const text = [m.title, m.genre || "", ...(m.genres || []), m.description || ""].join(" ").toLowerCase();
        if (foreignSubCat === "Aksiyon") return /aksiyon|action|knight|matrix|gladiator/i.test(text);
        if (foreignSubCat === "Bilim Kurgu") return /bilim|kurgu|sci-fi|uzay|interstellar|inception|matrix/i.test(text);
        if (foreignSubCat === "Dram & Suç") return /dram|suç|crime|drama|shawshank|godfather/i.test(text);
        if (foreignSubCat === "Macera") return /macera|adventure|yolculuk|gladiator/i.test(text);
        return true;
      });
    }

    return movies;
  }, [movies, mainCat, foreignSubCat]);

  let cardCounter = 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Main Categories */}
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-neutral-900/60 to-black/80 p-5 md:p-7 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-900/40">
              <Film className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white md:text-3xl">Filmler</h1>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300 border border-amber-500/30">
                  {filteredMovies.length} Yerli Sinema Yapımı
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 md:text-sm">
                Seçkin yerli sinema yapımları ve 4K restore edilmiş Yeşilçam klasikleri.
              </p>
            </div>
          </div>
        </div>

        {/* Main Category Chips */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {MAIN_CATEGORIES.map((cat) => {
            const active = mainCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setMainCat(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition md:text-sm ${
                  active
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black shadow-lg shadow-amber-900/40 ring-2 ring-white/20 scale-105"
                    : "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Foreign Cinema Subcategories */}
        {mainCat === "Yabancı Sinema" && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            <span className="text-xs font-semibold text-white/50 mr-1">Türler:</span>
            {FOREIGN_SUBCATEGORIES.map((sub) => {
              const active = foreignSubCat === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setForeignSubCat(sub)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-900/40"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
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
