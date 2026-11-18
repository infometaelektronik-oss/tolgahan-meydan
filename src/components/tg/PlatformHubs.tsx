import { Play, Sparkles } from "lucide-react";

export type PlatformId = "netflix" | "hbo" | "tabii" | "blutv" | "disney" | "gain";

interface PlatformInfo {
  id: PlatformId;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  highlights: string[];
  logoText: string;
  logoColor: string;
}

const PLATFORMS: PlatformInfo[] = [
  {
    id: "netflix",
    name: "NETFLIX",
    tagline: "Özel Dizi, Film & Küresel Yapımlar",
    badge: "4K ULTRA HD",
    badgeColor: "bg-red-600/30 text-red-300 border-red-500/40",
    bgGradient: "from-red-950/60 via-black to-neutral-950",
    borderColor: "border-red-600/40 hover:border-red-500",
    glowColor: "shadow-[0_0_30px_rgba(220,38,38,0.3)]",
    highlights: ["Kulüp", "Bir Başkadır", "Stranger Things", "Narcos", "Terzi"],
    logoText: "N",
    logoColor: "text-red-500",
  },
  {
    id: "hbo",
    name: "HBO MAX",
    tagline: "Ödüllü Yapımlar & Max Serileri",
    badge: "PREMIUM",
    badgeColor: "bg-purple-600/30 text-purple-200 border-purple-500/40",
    bgGradient: "from-purple-950/60 via-black to-neutral-950",
    borderColor: "border-purple-600/40 hover:border-purple-500",
    glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    highlights: ["Game of Thrones", "House of the Dragon", "Chernobyl", "The Last of Us"],
    logoText: "HBO",
    logoColor: "text-purple-400 font-serif",
  },
  {
    id: "tabii",
    name: "TABİİ TV",
    tagline: "TRT Dijital Platformu — Yerli Yapımlar",
    badge: "YERLİ PLATFORM",
    badgeColor: "bg-emerald-600/30 text-emerald-200 border-emerald-500/40",
    bgGradient: "from-emerald-950/60 via-black to-neutral-950",
    borderColor: "border-emerald-600/40 hover:border-emerald-500",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    highlights: ["Bozkır Arslanı", "Mevlânâ", "Adalet", "Şebeke"],
    logoText: "tabii",
    logoColor: "text-emerald-400 font-sans tracking-tighter",
  },
  {
    id: "blutv",
    name: "BLUTV",
    tagline: "Türkiye'nin Dijital Televizyonu & Özel Yapımlar",
    badge: "BLU ÖZEL",
    badgeColor: "bg-cyan-600/30 text-cyan-200 border-cyan-500/40",
    bgGradient: "from-cyan-950/60 via-black to-neutral-950",
    borderColor: "border-cyan-600/40 hover:border-cyan-500",
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    highlights: ["Magarsus", "Behzat Ç. Çekiç ve Gül", "Prens", "İlk ve Son"],
    logoText: "blu",
    logoColor: "text-cyan-400 font-sans lowercase",
  },
  {
    id: "disney",
    name: "DİSNEY+",
    tagline: "Disney, Marvel, Star & Seçkin Yerli Diziler",
    badge: "DİSNEY+",
    badgeColor: "bg-blue-600/30 text-blue-200 border-blue-500/40",
    bgGradient: "from-blue-950/65 via-slate-950 to-black",
    borderColor: "border-blue-500/40 hover:border-blue-400",
    glowColor: "shadow-[0_0_30px_rgba(59,130,246,0.35)]",
    highlights: ["Aktris", "Kaçış", "Arayış", "Shōgun", "The Bear"],
    logoText: "Disney+",
    logoColor: "text-blue-400 font-sans tracking-tight",
  },
  {
    id: "gain",
    name: "GAİN",
    tagline: "Özgün Komedi, Drama & Modern Türk Dizileri",
    badge: "GAİN",
    badgeColor: "bg-rose-600/30 text-rose-200 border-rose-500/40",
    bgGradient: "from-rose-950/60 via-black to-neutral-950",
    borderColor: "border-rose-500/40 hover:border-rose-400",
    glowColor: "shadow-[0_0_30px_rgba(244,63,94,0.35)]",
    highlights: ["Ayak İşleri", "10 Bin Adım", "Doğu", "Şahsiyet", "Ru"],
    logoText: "GAİN",
    logoColor: "text-rose-400 font-sans tracking-wider",
  },
];

type Props = {
  focusedKey: string;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onSelectPlatform: (platformId: PlatformId) => void;
};

export function PlatformHubs({ focusedKey, registerRef, onSelectPlatform }: Props) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white md:text-xl">
              Dijital Platformlar
            </h2>
            <p className="text-xs text-white/60">
              Netflix, HBO Max, Tabii TV, BluTV, Disney+ ve Gain kataloglarına tek dokunuşla ulaşın.
            </p>
          </div>
        </div>
        <span className="hidden rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-[11px] font-bold text-purple-300 sm:inline-block">
          {PLATFORMS.length} Platform
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {PLATFORMS.map((p, idx) => {
          const fk = `platform-hub-${idx}`;
          const isFocused = focusedKey === fk;

          return (
            <button
              key={p.id}
              ref={(el) => registerRef(fk, el)}
              data-focus-key={fk}
              data-platform-id={p.id}
              tabIndex={-1}
              onClick={() => onSelectPlatform(p.id)}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-br p-5 text-left transition-all duration-300 active:scale-95 ${
                p.bgGradient
              } ${p.borderColor} ${
                isFocused ? `neon-ring scale-[1.03] ${p.glowColor}` : "hover:scale-[1.02]"
              }`}
            >
              {/* Subtle platform background glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-colors" />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className={`text-xl font-black tracking-wider ${p.logoColor}`}>
                    {p.logoText}
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${p.badgeColor}`}
                  >
                    {p.badge}
                  </span>
                </div>

                <div className="mt-4 text-base font-black text-white group-hover:text-purple-200 transition">
                  {p.name}
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-white/60 leading-relaxed">
                  {p.tagline}
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Öne Çıkanlar:
                </div>
                <div className="mt-1 line-clamp-1 text-[11px] font-medium text-white/80">
                  {p.highlights.join(" • ")}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:text-white transition">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Kataloğu Aç</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
