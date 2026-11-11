import { useMemo, useState } from "react";
import { streamToMedia } from "./AdminSources";
import type { Media } from "./data";
import type { UserStream } from "@/lib/streams.functions";
import { PosterCard } from "./PosterCard";
import { Clapperboard, Play, X, Clock, Calendar, CheckCircle2, Tv, Globe, Sparkles } from "lucide-react";
import { getEpisodesForSeries, type SeriesEpisode } from "@/data/seriesEpisodes";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onPick: (m: Media) => void;
  streams: UserStream[];
  getEnrichment?: (title: string) => { posterUrl?: string; backdropUrl?: string } | null | undefined;
  initialOrigin?: "all" | "local" | "foreign" | "platform";
};

type OriginFilter = "all" | "local" | "foreign" | "platform";

type ChannelFilter =
  | "Tümü"
  | "Kanal D"
  | "Show TV"
  | "Star TV"
  | "ATV"
  | "TRT 1"
  | "NOW"
  | "Efsaneler"
  | "Netflix"
  | "HBO"
  | "Tabii TV";

export function SeriesView({ focusedKey, registerRef, onPick, streams, getEnrichment, initialOrigin = "all" }: Props) {
  const [origin, setOrigin] = useState<OriginFilter>(initialOrigin);
  const [selectedSubFilter, setSelectedSubFilter] = useState<ChannelFilter>("Tümü");
  const [activeSeriesModal, setActiveSeriesModal] = useState<Media | null>(null);

  // Get all items in category === "Series"
  const seriesStreams = useMemo(() => {
    return streams.filter((s) => s.category === "Series");
  }, [streams]);

  // Filter by origin: all, local (Turkish), foreign, platform
  const originFiltered = useMemo(() => {
    return seriesStreams.filter((s) => {
      const isFor = s.isForeign || s.country === "ABD" || (s.country && s.country !== "Türkiye" && s.country !== "Turkey");
      const isPlat = /netflix|hbo|tabii/i.test(s.channelGroup || "") || /netflix|hbo|tabii/i.test(s.subCategory || "");

      if (origin === "local") return !isFor;
      if (origin === "foreign") return isFor;
      if (origin === "platform") return isPlat;
      return true;
    });
  }, [seriesStreams, origin]);

  // Sub-filter by specific channel / network
  const finalFiltered = useMemo(() => {
    if (selectedSubFilter === "Tümü") {
      return originFiltered.map(streamToMedia);
    }

    return originFiltered
      .filter((s) => {
        const grp = (s.channelGroup || "").toLowerCase();
        const sub = (s.subCategory || "").toLowerCase();
        const target = selectedSubFilter.toLowerCase();

        if (target === "now") {
          return grp.includes("now") || grp.includes("fox") || sub.includes("now") || sub.includes("fox");
        }
        if (target === "efsaneler") {
          return grp.includes("efsane") || sub.includes("efsane");
        }
        if (target === "netflix") {
          return grp.includes("netflix") || sub.includes("netflix");
        }
        if (target === "hbo") {
          return grp.includes("hbo") || sub.includes("hbo");
        }
        if (target === "tabii tv" || target === "tabii") {
          return grp.includes("tabii") || sub.includes("tabii");
        }
        return grp.includes(target) || sub.includes(target);
      })
      .map(streamToMedia);
  }, [originFiltered, selectedSubFilter]);

  // When a series card is clicked, open the episode selector modal
  const handleSeriesCardClick = (m: Media) => {
    setActiveSeriesModal(m);
  };

  const handlePlayEpisode = (series: Media, episode: SeriesEpisode) => {
    const episodeMedia: Media = {
      ...series,
      title: `${series.title} — ${episode.title}`,
      description: episode.description,
      video: episode.videoUrl,
      poster: episode.thumbnailUrl || series.poster,
      backdrop: episode.thumbnailUrl || series.backdrop,
      year: parseInt(episode.airDate || "2024", 10) || series.year,
      seriesTitle: series.title,
      episodeTitle: episode.title,
    };
    setActiveSeriesModal(null);
    onPick(episodeMedia);
  };

  if (seriesStreams.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center text-white/60">
        Henüz hiç dizi eklenmemiş.
      </div>
    );
  }

  // Sub-filter buttons based on active origin
  const subFilterOptions: ChannelFilter[] =
    origin === "local"
      ? ["Tümü", "Kanal D", "Show TV", "Star TV", "ATV", "TRT 1", "NOW", "Efsaneler"]
      : origin === "foreign"
        ? ["Tümü", "HBO", "Netflix"]
        : origin === "platform"
          ? ["Tümü", "Netflix", "HBO", "Tabii TV"]
          : ["Tümü", "Kanal D", "Show TV", "Star TV", "ATV", "TRT 1", "NOW", "Netflix", "HBO", "Tabii TV", "Efsaneler"];

  return (
    <div className="space-y-6 pb-12">
      {/* VIP Cyber Series Banner Bar (High legibility, large fonts, themed styling) */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-black p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-[0_0_20px_rgba(59,130,246,0.6)] shrink-0">
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-white sm:text-2xl md:text-3xl tracking-tight">
                  {origin === "local" ? "Yerli Türk Dizileri" : origin === "foreign" ? "Yabancı Kült Diziler" : origin === "platform" ? "Dijital Platform Orijinalleri" : "Tüm Dizi Arşivi"}
                </h1>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-300 border border-blue-500/40">
                  {finalFiltered.length} Yapım
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Kurtlar Vadisi, Ezel, Çukur, İçerde ve en popüler Türk & yabancı televizyon dizileri.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar (Aligned directly at top) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Origin Selector Pills: Tüm Diziler, Yerli Diziler, Yabancı Diziler, Paralı Platformlar */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all" as const, label: "Tüm Diziler", icon: Clapperboard, count: seriesStreams.length },
            { id: "local" as const, label: "Yerli Diziler", icon: Tv, count: seriesStreams.filter((s) => !s.isForeign).length },
            { id: "foreign" as const, label: "Yabancı Diziler", icon: Globe, count: seriesStreams.filter((s) => s.isForeign).length },
            { id: "platform" as const, label: "Platform Orijinal", icon: Sparkles, count: seriesStreams.filter((s) => /netflix|hbo|tabii/i.test(s.channelGroup || "")).length },
          ].map((item) => {
            const active = origin === item.id;
            const Icon = item.icon;
            const fk = `series-origin-${item.id}`;
            return (
              <button
                key={item.id}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => {
                  setOrigin(item.id);
                  setSelectedSubFilter("Tümü");
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider outline-none transition active:scale-95 ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    : focusedKey === fk
                      ? "neon-ring scale-105 bg-purple-600/30 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Network / Channel Secondary Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {subFilterOptions.map((opt, i) => {
          const active = selectedSubFilter === opt;
          const fk = `series-sub-${i}`;
          return (
            <button
              key={opt}
              ref={(el) => registerRef(fk, el)}
              data-focus-key={fk}
              tabIndex={-1}
              onClick={() => setSelectedSubFilter(opt)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold outline-none transition ${
                active
                  ? "bg-white text-black font-black shadow-md"
                  : focusedKey === fk
                    ? "neon-ring bg-white/20 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Series Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between text-xs font-bold text-white/60">
          <span>{finalFiltered.length} Dizi Listeleniyor</span>
          <span>Bölüm seçmek için diziye tıklayın</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {finalFiltered.map((media, idx) => {
            const fk = `series-card-${idx}`;
            const isFocused = focusedKey === fk;

            return (
              <div key={media.id} className="relative group">
                <PosterCard
                  media={media}
                  focused={isFocused}
                  registerRef={(el) => registerRef(fk, el)}
                  focusKey={fk}
                  onPick={() => handleSeriesCardClick(media)}
                />

                {/* Network / Platform Badge */}
                {media.genre && (
                  <div className="pointer-events-none absolute left-2 top-2 z-10">
                    <span className="rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-300 backdrop-blur border border-purple-500/30">
                      {media.genre}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {finalFiltered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center text-white/60">
            Bu filtreye uygun dizi bulunamadı.
          </div>
        )}
      </section>

      {/* EPISODE SELECTOR MODAL */}
      {activeSeriesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveSeriesModal(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#181124] to-[#0c0814] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeSeriesModal.poster}
                  alt={activeSeriesModal.title}
                  className="h-20 w-14 shrink-0 rounded-xl object-cover border border-purple-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white md:text-2xl">
                      {activeSeriesModal.title}
                    </h2>
                    {activeSeriesModal.rating && (
                      <span className="rounded-lg bg-yellow-500/20 px-2 py-0.5 text-xs font-black text-yellow-300 border border-yellow-500/30">
                        ★ {activeSeriesModal.rating}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-white/70 md:text-sm">
                    {activeSeriesModal.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSeriesModal(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white/80 hover:bg-white/20 transition"
                title="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Episode List */}
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-purple-300">
                <span>BÖLÜMLER</span>
                <span>İzlemek istediğiniz bölüme tıklayın</span>
              </div>

              <div className="max-h-[50vh] space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
                {getEpisodesForSeries(
                  activeSeriesModal.id,
                  activeSeriesModal.title,
                  activeSeriesModal.video
                ).map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => handlePlayEpisode(activeSeriesModal, ep)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-purple-500/50 hover:bg-purple-950/30 active:scale-[0.99]"
                  >
                    <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10">
                      <img
                        src={ep.thumbnailUrl || activeSeriesModal.poster}
                        alt={ep.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-purple-900/40 transition">
                        <Play className="h-6 w-6 fill-white text-white drop-shadow-md" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white group-hover:text-purple-200 transition">
                          {ep.title}
                        </span>
                        {ep.airDate && (
                          <span className="text-[10px] text-white/40">({ep.airDate})</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-white/60">
                        {ep.description}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-[10px] font-bold text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {ep.durationMinutes} dk
                        </span>
                        <span className="flex items-center gap-1 text-purple-400">
                          <CheckCircle2 className="h-3 w-3" /> Full HD
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
