import { useMemo, useState } from "react";
import { streamToMedia } from "./AdminSources";
import type { Media } from "./data";
import type { UserStream } from "@/lib/streams.functions";
import { PosterCard } from "./PosterCard";
import { Clapperboard, Play, X, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { getEpisodesForSeries, type SeriesEpisode } from "@/data/seriesEpisodes";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onPick: (m: Media) => void;
  streams: UserStream[];
  getEnrichment?: (title: string) => { posterUrl?: string; backdropUrl?: string } | null | undefined;
};

type ChannelFilter =
  | "Tümü"
  | "Kanal D"
  | "Show TV"
  | "Star TV"
  | "ATV"
  | "TRT 1"
  | "NOW"
  | "Efsaneler"
  | "Yabancı Dizi";

const CHANNELS: { id: ChannelFilter; label: string; badgeColor: string; bgGradient: string }[] = [
  { id: "Tümü", label: "Tüm Diziler", badgeColor: "bg-white/20 text-white", bgGradient: "from-purple-600 to-fuchsia-600" },
  { id: "Kanal D", label: "Kanal D Dizileri", badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30", bgGradient: "from-blue-600 to-indigo-700" },
  { id: "Show TV", label: "Show TV Dizileri", badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30", bgGradient: "from-fuchsia-600 to-pink-700" },
  { id: "Star TV", label: "Star TV Dizileri", badgeColor: "bg-red-500/20 text-red-300 border border-red-500/30", bgGradient: "from-red-600 to-rose-700" },
  { id: "ATV", label: "ATV Dizileri", badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30", bgGradient: "from-amber-600 to-orange-700" },
  { id: "TRT 1", label: "TRT 1 Dizileri", badgeColor: "bg-red-700/20 text-red-200 border border-red-700/30", bgGradient: "from-red-800 to-neutral-900" },
  { id: "NOW", label: "NOW (FOX) Dizileri", badgeColor: "bg-orange-500/20 text-orange-300 border border-orange-500/30", bgGradient: "from-orange-600 to-amber-700" },
  { id: "Efsaneler", label: "Efsane Türk Dizileri", badgeColor: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30", bgGradient: "from-yellow-600 to-amber-700" },
  { id: "Yabancı Dizi", label: "Yabancı Diziler", badgeColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30", bgGradient: "from-cyan-600 to-blue-700" },
];

export function SeriesView({ focusedKey, registerRef, onPick, streams, getEnrichment }: Props) {
  const [selectedChannel, setSelectedChannel] = useState<ChannelFilter>("Tümü");
  const [activeSeriesModal, setActiveSeriesModal] = useState<Media | null>(null);

  // Get all items in category === "Series"
  const seriesStreams = useMemo(() => {
    return streams.filter((s) => s.category === "Series");
  }, [streams]);

  // Group series by network / channel_group
  const groupedByChannel = useMemo(() => {
    const groups: Record<string, Media[]> = {};

    CHANNELS.filter((c) => c.id !== "Tümü").forEach((c) => {
      groups[c.id] = [];
    });

    seriesStreams.forEach((s) => {
      const media = streamToMedia(s);
      const grp = s.channelGroup || "";
      const sub = s.subCategory || "";

      let targetChannel = "Efsaneler";
      if (/kanal\s*d/i.test(grp) || /kanal\s*d/i.test(sub)) targetChannel = "Kanal D";
      else if (/show/i.test(grp) || /show/i.test(sub)) targetChannel = "Show TV";
      else if (/star/i.test(grp) || /star/i.test(sub)) targetChannel = "Star TV";
      else if (/atv/i.test(grp) || /atv/i.test(sub)) targetChannel = "ATV";
      else if (/trt/i.test(grp) || /trt/i.test(sub)) targetChannel = "TRT 1";
      else if (/now|fox/i.test(grp) || /now|fox/i.test(sub)) targetChannel = "NOW";
      else if (/yabancı/i.test(grp) || /yabancı/i.test(sub) || s.isForeign) targetChannel = "Yabancı Dizi";
      else if (/efsane/i.test(grp) || /efsane/i.test(sub)) targetChannel = "Efsaneler";
      else targetChannel = "Efsaneler";

      if (!groups[targetChannel]) groups[targetChannel] = [];
      groups[targetChannel].push(media);
    });

    return groups;
  }, [seriesStreams]);

  const activeSeriesList = useMemo(() => {
    if (selectedChannel === "Tümü") {
      return seriesStreams.map(streamToMedia);
    }
    return groupedByChannel[selectedChannel] || [];
  }, [selectedChannel, seriesStreams, groupedByChannel]);

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

  let cardCounter = 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Filter Bar */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/20 to-black/60 p-5 md:p-7 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-900/50">
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white md:text-3xl">Diziler</h1>
                <span className="rounded-full bg-purple-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-200">
                  {seriesStreams.length} Dizi Arşivi
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 md:text-sm">
                Bölüm bölüm dizi arşivi: Tıklayarak dilediğiniz bölümü seçip izleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Channel Filter Chips */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {CHANNELS.map((ch) => {
            const active = selectedChannel === ch.id;
            const count =
              ch.id === "Tümü"
                ? seriesStreams.length
                : (groupedByChannel[ch.id] || []).length;

            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition md:text-sm ${
                  active
                    ? `bg-gradient-to-r ${ch.bgGradient} text-white shadow-lg shadow-purple-900/40 ring-2 ring-white/30 scale-105`
                    : "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white border border-white/10"
                }`}
              >
                <span>{ch.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                    active ? "bg-black/30 text-white" : "bg-white/10 text-white/50"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View when a single channel is selected */}
      {selectedChannel !== "Tümü" && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-1 rounded-full bg-purple-500" />
              <h2 className="text-xl font-black text-white">{selectedChannel} Dizileri</h2>
              <span className="text-xs text-white/50 font-medium">
                ({activeSeriesList.length} yapım)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {activeSeriesList.map((m) => {
              const fk = `series-card-${cardCounter++}`;
              const en = getEnrichment ? getEnrichment(m.title) : null;
              return (
                <div key={m.id} onClick={() => handleSeriesCardClick(m)} className="cursor-pointer">
                  <PosterCard
                    media={m}
                    focused={focusedKey === fk}
                    registerRef={(el) => registerRef(fk, el)}
                    focusKey={fk}
                    onPick={() => handleSeriesCardClick(m)}
                    posterOverride={en?.posterUrl}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* View when "Tümü" is selected */}
      {selectedChannel === "Tümü" && (
        <div className="space-y-10">
          {CHANNELS.filter((c) => c.id !== "Tümü").map((ch) => {
            const items = groupedByChannel[ch.id] || [];
            if (items.length === 0) return null;

            return (
              <section key={ch.id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-7 w-1.5 rounded-full bg-gradient-to-b ${ch.bgGradient}`} />
                    <h2 className="text-xl font-black tracking-tight text-white">{ch.label}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${ch.badgeColor}`}>
                      {items.length} Dizi
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedChannel(ch.id)}
                    className="text-xs font-bold text-purple-300 hover:text-white transition"
                  >
                    Tümünü Gör →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                  {items.map((m) => {
                    const fk = `series-grid-${cardCounter++}`;
                    const en = getEnrichment ? getEnrichment(m.title) : null;
                    return (
                      <div key={m.id} onClick={() => handleSeriesCardClick(m)} className="cursor-pointer">
                        <PosterCard
                          media={m}
                          focused={focusedKey === fk}
                          registerRef={(el) => registerRef(fk, el)}
                          focusKey={fk}
                          onPick={() => handleSeriesCardClick(m)}
                          posterOverride={en?.posterUrl}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* DEDICATED EPISODE SELECTOR MODAL */}
      {activeSeriesModal && (
        <div
          onClick={() => setActiveSeriesModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-6 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex gap-4">
                <img
                  src={activeSeriesModal.poster}
                  alt={activeSeriesModal.title}
                  className="h-28 w-20 rounded-xl object-cover shadow-lg border border-white/10 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-purple-600/30 border border-purple-500/40 px-2 py-0.5 text-[10px] font-black uppercase text-purple-300">
                      {activeSeriesModal.channelGroup || "Dizi"}
                    </span>
                    <span className="text-xs font-bold text-white/50">{activeSeriesModal.year}</span>
                    <span className="text-xs font-bold text-amber-400">⭐ {activeSeriesModal.rating}</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-white">{activeSeriesModal.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-white/70 max-w-xl">
                    {activeSeriesModal.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveSeriesModal(null)}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition active:scale-95 shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Episodes List Header */}
            <div className="my-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-purple-200">
                <Clapperboard className="h-4 w-4" />
                <span>Bölüm Listesi</span>
              </div>
              <span className="text-xs text-white/50">
                {getEpisodesForSeries(activeSeriesModal.id, activeSeriesModal.title, activeSeriesModal.video).length} Bölüm Mevcut
              </span>
            </div>

            {/* Scrollable Episodes List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-hide">
              {getEpisodesForSeries(activeSeriesModal.id, activeSeriesModal.title, activeSeriesModal.video).map((ep) => {
                return (
                  <div
                    key={ep.id}
                    onClick={() => handlePlayEpisode(activeSeriesModal, ep)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-purple-500/50 hover:bg-purple-950/20 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-16 w-28 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                        <img
                          src={ep.thumbnailUrl}
                          alt={ep.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-purple-600/40 transition">
                          <Play className="h-6 w-6 text-white drop-shadow" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white group-hover:text-purple-200 transition">
                            {ep.title}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-white/60">
                          {ep.description}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-white/40">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {ep.durationMinutes} dk
                          </span>
                          {ep.airDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {ep.airDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayEpisode(activeSeriesModal, ep);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-black text-white hover:bg-purple-500 transition shadow-lg active:scale-95 shrink-0"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>İzle</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
