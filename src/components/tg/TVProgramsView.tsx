import { useMemo, useState } from "react";
import { streamToMedia } from "./AdminSources";
import type { Media } from "./data";
import type { UserStream } from "@/lib/streams.functions";
import { Tv2, Play, X, Clock, CheckCircle2 } from "lucide-react";
import { getEpisodesForTVProgram, type TVProgramEpisode } from "@/data/tvProgramEpisodes";

type Props = {
  focusedKey: string | null;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onPick: (m: Media) => void;
  streams: UserStream[];
};

const PROGRAM_CATEGORIES = [
  "Tümü",
  "Yarışma",
  "Gündüz Kuşağı",
  "Komedi & Show",
] as const;

// Guard against any scripted TV drama series slipping into TV Programs
const SERIES_EXCLUSION_RE =
  /çukur|kurtlar vadisi|ezel|arka sokaklar|yargı|bahar|yalı çapkını|kızılcık şerbeti|kuruluş osman|teşkilat|gönül dağı|inci taneleri|aşk-ı memnu|kuzey güney|muhteşem yüzyıl|behzat ç/i;

export function TVProgramsView({ focusedKey, registerRef, onPick, streams }: Props) {
  const [selectedCat, setSelectedCat] = useState<(typeof PROGRAM_CATEGORIES)[number]>("Tümü");
  const [activeProgram, setActiveProgram] = useState<{ media: Media; channelLabel: string } | null>(null);

  const programs = useMemo(() => {
    return streams
      .filter((s) => {
        if (s.category !== "TV Programs") return false;
        if (SERIES_EXCLUSION_RE.test(s.title)) return false;
        return true;
      })
      .map((s) => ({
        stream: s,
        media: streamToMedia(s),
        subLabel: s.subCategory || "TV Programı",
        channelLabel: s.channelGroup || "TV",
      }));
  }, [streams]);

  const filteredPrograms = useMemo(() => {
    if (selectedCat === "Tümü") return programs;
    return programs.filter((p) => {
      const hay = `${p.subLabel} ${p.stream.description || ""}`.toLowerCase();
      if (selectedCat === "Yarışma") return hay.includes("yarışma");
      if (selectedCat === "Gündüz Kuşağı") return hay.includes("gündüz");
      if (selectedCat === "Komedi & Show") return hay.includes("komedi") || hay.includes("show") || hay.includes("skeç");
      return true;
    });
  }, [programs, selectedCat]);

  const handlePlayEpisode = (program: Media, episode: TVProgramEpisode) => {
    const episodeMedia: Media = {
      ...program,
      title: `${program.title} — ${episode.title}`,
      description: episode.description,
      video: episode.videoUrl,
      poster: episode.thumbnailUrl || program.poster,
      backdrop: episode.thumbnailUrl || program.backdrop,
      year: parseInt(episode.airDate || "2024", 10) || program.year,
      seriesTitle: program.title,
      episodeTitle: episode.title,
    };
    setActiveProgram(null);
    onPick(episodeMedia);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Program Category Filters */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-black p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 shadow-[0_0_25px_rgba(16,185,129,0.55)]">
              <Tv2 className="h-7 w-7 text-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  TV Programları
                </h1>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                  {filteredPrograms.length} Program
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Yarışma, gündüz kuşağı ve komedi programları. İstediğiniz programı seçip bölümünü tek tek açabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-4">
          {PROGRAM_CATEGORIES.map((cat, idx) => {
            const active = selectedCat === cat;
            const fk = `tvprog-cat-${idx}`;
            return (
              <button
                key={cat}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => setSelectedCat(cat)}
                className={`rounded-xl border px-4 py-2 text-xs font-black tracking-wide outline-none transition-all duration-200 ${
                  active
                    ? "scale-105 border-emerald-300 bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_4px_15px_rgba(16,185,129,0.5)]"
                    : focusedKey === fk
                      ? "neon-ring border-white/30 bg-white/20 text-white"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Cards Grid (Single-box cards, clear titles & episode count) */}
      {filteredPrograms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center text-white/60">
          Bu kategoride henüz TV programı bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPrograms.map(({ media, subLabel, channelLabel }, idx) => {
            const fk = `tvprog-${idx}`;
            const isFocus = focusedKey === fk;
            const episodes = getEpisodesForTVProgram(
              media.id,
              media.title,
              media.video || "",
              media.poster || "/assets/channel-logos/tv8.png",
            );
            return (
              <button
                key={media.id}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => setActiveProgram({ media, channelLabel })}
                className={`group flex flex-col justify-between rounded-3xl border-2 p-5 text-left outline-none transition-all duration-300 ${
                  isFocus
                    ? "neon-ring scale-[1.03] border-emerald-400 bg-gradient-to-b from-emerald-950/60 to-black"
                    : "border-white/15 bg-gradient-to-b from-white/[0.06] via-neutral-950 to-black hover:border-emerald-400/60 hover:scale-[1.02]"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <img
                    src={media.poster || "/assets/channel-logos/tv8.png"}
                    alt={channelLabel}
                    className="h-14 w-24 object-contain"
                  />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    {episodes.length} Bölüm
                  </span>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                    {channelLabel} · {subLabel}
                  </div>
                  <h2 className="mt-1 text-lg font-black text-white group-hover:text-emerald-300 transition">
                    {media.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-xs text-white/65">
                    {media.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-xs font-bold text-emerald-300">
                  <Play className="h-4 w-4 fill-current" />
                  <span>Bölümleri Seç ve İzle</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Episode Selector Modal (Program bazlı tek tek bölüm seçimi) */}
      {activeProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setActiveProgram(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0b1f1a] to-[#080c0b] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeProgram.media.poster || "/assets/channel-logos/tv8.png"}
                  alt={activeProgram.channelLabel}
                  className="h-16 w-24 shrink-0 object-contain"
                />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {activeProgram.channelLabel}
                  </div>
                  <h2 className="text-xl font-black text-white md:text-2xl">
                    {activeProgram.media.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs text-white/70 md:text-sm">
                    {activeProgram.media.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveProgram(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white/80 hover:bg-white/20 transition"
                title="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-emerald-300">
                <span>PROGRAM BÖLÜMLERİ</span>
                <span>İzlemek istediğiniz bölümü seçin</span>
              </div>

              <div className="max-h-[55vh] space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
                {getEpisodesForTVProgram(
                  activeProgram.media.id,
                  activeProgram.media.title,
                  activeProgram.media.video || "",
                  activeProgram.media.poster || "/assets/channel-logos/tv8.png",
                ).map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => handlePlayEpisode(activeProgram.media, ep)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left transition hover:border-emerald-400/50 hover:bg-emerald-950/30 active:scale-[0.99]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/25 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-black transition">
                      <Play className="h-5 w-5 fill-current" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white group-hover:text-emerald-200 transition">
                          {ep.title}
                        </span>
                        {ep.airDate && (
                          <span className="text-[10px] text-white/45">({ep.airDate})</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-white/60">
                        {ep.description}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-[10px] font-bold text-white/45">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {ep.durationMinutes} dk
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Seç İzle
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
