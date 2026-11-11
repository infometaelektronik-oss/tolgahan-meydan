import {
  Sparkles,
  Tv2,
  RadioTower,
  Clock4,
  Clapperboard,
  Film,
  Zap,
  Compass,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import { forwardRef, useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  navIndex: number;
  href?: string;
  neonColor: string;
};

const ALL_ITEMS: Item[] = [
  { id: "home", label: "Ana Sayfa", icon: Sparkles, navIndex: 0, neonColor: "text-purple-400 group-hover:text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" },
  { id: "live", label: "Canlı TV", icon: Tv2, navIndex: 1, neonColor: "text-rose-400 group-hover:text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" },
  { id: "radio", label: "Radyo", icon: RadioTower, navIndex: 2, neonColor: "text-amber-400 group-hover:text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" },
  { id: "schedule", label: "Yayın Akışı", icon: Clock4, navIndex: 3, neonColor: "text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" },
  { id: "series", label: "Diziler", icon: Clapperboard, navIndex: 4, neonColor: "text-blue-400 group-hover:text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" },
  { id: "movies", label: "Filmler", icon: Film, navIndex: 5, neonColor: "text-amber-500 group-hover:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" },
  { id: "tgtv", label: "TG TV", icon: Zap, navIndex: 6, neonColor: "text-fuchsia-400 group-hover:text-fuchsia-300 drop-shadow-[0_0_12px_rgba(217,70,239,0.9)]" },
  { id: "search", label: "Ara", icon: Compass, navIndex: 7, neonColor: "text-emerald-400 group-hover:text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" },
  { id: "settings", label: "Ayarlar", icon: Sliders, navIndex: 8, neonColor: "text-indigo-400 group-hover:text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" },
  { id: "admin", label: "Yönetim", icon: ShieldAlert, navIndex: 9, href: "/tgdizifilm-admin-paneli", neonColor: "text-red-500 group-hover:text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" },
];

type Props = {
  activeIndex: number;
  focused: boolean;
  focusIndex: number;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onSelect: (idx: number) => void;
  isAdmin?: boolean;
};

export const Sidebar = forwardRef<HTMLElement, Props>(function Sidebar(
  { activeIndex, focused, focusIndex, registerRef, onSelect, isAdmin = false },
  _ref,
) {
  // Admin sekmesi her zaman görünür — tıklanınca giriş ekranı açılır, yetkisiz hesap engellenir.
  void isAdmin;
  const items = useMemo(() => ALL_ITEMS, []);
  const [desktopNav, setDesktopNav] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktopNav(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <>
      {/* Desktop / TV sidebar */}
      <aside
        className={`relative z-20 hidden h-screen flex-col justify-between border-r border-white/5 bg-[#0a0a0a] py-8 transition-all duration-300 md:flex ${
          focused ? "w-64" : "w-20"
        }`}
      >
        <div>
          <div className={`mb-10 px-6 ${focused ? "" : "px-3"}`}>
            {focused ? (
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/Media_item_1_1bba30da.jpg"
                  alt="TG Dizi Film Logo"
                  className="h-10 w-10 shrink-0 rounded-xl object-cover border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                />
                <div className="leading-none">
                  <div className="neon-text text-xl font-black tracking-tight">TG.</div>
                  <div className="neon-text mt-1 text-xs font-semibold tracking-[0.25em]">
                    DİZİ FİLM
                  </div>
                </div>
              </div>
            ) : (
              <img
                src="/assets/aistudio/Media_item_1_1bba30da.jpg"
                alt="TG Logo"
                className="h-10 w-10 mx-auto rounded-xl object-cover border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              />
            )}
          </div>

          <nav className="flex flex-col gap-2 px-3">
            {items.map((it) => {
              const idx = it.navIndex;
              const isFocused = focused && focusIndex === idx;
              const isActive = activeIndex === idx;
              const Icon = it.icon;
              return (
                <button
                  key={it.id}
                  ref={(el) => {
                    if (desktopNav) registerRef(`nav-${idx}`, el);
                  }}
                  data-focus-key={`nav-${idx}`}
                  tabIndex={-1}
                  onClick={() => {
                    if (it.href) window.location.assign(it.href);
                    else onSelect(idx);
                  }}
                  className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-left outline-none transition-all duration-200 ${
                    isFocused
                      ? "neon-ring scale-105 bg-purple-600/20 text-white"
                      : isActive
                        ? "bg-white/10 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-6 w-6 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? it.neonColor : "text-white/60 group-hover:text-white"}`} />
                  {focused && (
                    <span className="truncate text-base font-semibold">{it.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile / tablet top brand bar */}
      <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-white/5 bg-black/80 px-4 py-2.5 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <img
            src="/assets/aistudio/Media_item_1_1bba30da.jpg"
            alt="TG Logo"
            className="h-7 w-7 rounded-lg object-cover border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
          />
          <div className="neon-text text-base font-black tracking-wider">TG. DİZİ FİLM</div>
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-300/80">
          {ALL_ITEMS.find((i) => i.navIndex === activeIndex)?.label ?? ""}
        </div>
      </div>

      {/* Mobile / tablet bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-white/10 bg-black/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
        {items.map((it) => {
          const idx = it.navIndex;
          const Icon = it.icon;
          const isActive = activeIndex === idx;
          return (
            <button
              key={it.id}
              ref={(el) => {
                if (!desktopNav) registerRef(`nav-${idx}`, el);
              }}
              data-focus-key={`nav-${idx}`}
              tabIndex={-1}
              onClick={() => {
                if (it.href) window.location.assign(it.href);
                else onSelect(idx);
              }}
              className={`flex min-w-[48px] flex-col items-center gap-0.5 rounded-xl px-2 py-2 outline-none transition active:scale-95 ${
                focused && focusIndex === idx
                  ? "neon-ring scale-105 text-purple-200"
                  : isActive
                  ? "text-purple-300"
                  : "text-white/60"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? it.neonColor : ""}`}
              />
              <span className="text-[10px] font-semibold">{it.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
});
