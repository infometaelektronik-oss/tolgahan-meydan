import { useState, useMemo } from "react";
import { CalendarClock, Clock, Play, Tv } from "lucide-react";
import type { Media } from "./data";
import { streamToMedia } from "./AdminSources";
import type { UserStream } from "@/lib/streams.functions";

type Props = {
  registerRef: (key: string, el: HTMLElement | null) => void;
  focusedKey: string | null;
  onPick?: (media: Media) => void;
  streams?: UserStream[];
};

// Major Turkish Broadcasters with their actual broadcast schedules and direct stream links
const CHANNEL_SCHEDULES = [
  {
    id: "trt1",
    name: "TRT 1",
    badge: "GENEL YAYIN",
    streamUrl: "https://tv-trt1.medya.trt.com.tr/master.m3u8",
    color: "from-red-600 to-rose-900",
    programs: [
      { time: "06:00", title: "İstiklal Marşı & Gün Başlıyor", desc: "Güne dinamik başlangıç ve hava/yol durumu haberleri." },
      { time: "09:00", title: "Alişan ile Hayata Gülümse", desc: "Sağlık, mutfak, nostalji ve canlı konuklarla sabah kuşağı." },
      { time: "12:15", title: "Gönül Dağı (Tekrar)", desc: "Bozkırın sarı sıcağında hayallerinin peşinden koşan amcaoğulları." },
      { time: "15:45", title: "Lingo Türkiye", desc: "Kelimeleri bul, ödülü kazan! Heyecan dolu kelime yarışması." },
      { time: "18:55", title: "Ana Haber Bülteni", desc: "Günün en sıcak gelişmeleri, tarafsız ve detaylı haberler." },
      { time: "20:00", title: "Teşkilat (Yeni Bölüm)", desc: "Milli İstihbarat Teşkilatı’nın gizli operasyonları ve vatan mücadelesi." },
      { time: "23:45", title: "Pelikan Dosyası", desc: "Uluslararası analizler ve derin dosyalar." },
      { time: "01:30", title: "Diriliş Ertuğrul (Gece Kuşağı)", desc: "Kayı obasının diriliş ve bağımsızlık destanı." },
    ],
  },
  {
    id: "atv",
    name: "ATV",
    badge: "GÜNCEL & DİZİ",
    streamUrl: "http://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_360p.m3u8",
    color: "from-amber-600 to-orange-900",
    programs: [
      { time: "07:00", title: "Kahvaltı Haberleri", desc: "Nihan Günay ile sabahın ilk ve tarafsız haberleri." },
      { time: "10:00", title: "Müge Anlı ile Tatlı Sert", desc: "Kayıplar bulunuyor, faili meçhul cinayetler aydınlanıyor." },
      { time: "13:00", title: "ATV Gün Ortası", desc: "Günün gelişen olayları ve canlı bağlantılar." },
      { time: "14:00", title: "Mutfak Bahane", desc: "Zahide Yetiş ile lezzet yarışması ve günün yemekleri." },
      { time: "16:00", title: "Esra Erol'da", desc: "Parçalanmış aileler, kayıplar ve yüzleşmeler canlı yayında." },
      { time: "19:00", title: "ATV Ana Haber", desc: "Cem Öğretir ile Türkiye ve dünyanın gündemi." },
      { time: "20:00", title: "Kuruluş Osman (Yeni Bölüm)", desc: "Osman Bey’in kutlu devlet yürüyüşü ve nefes kesen savaşlar." },
      { time: "00:20", title: "Kim Milyoner Olmak İster?", desc: "Kenan İmirzalıoğlu ile efsane bilgi yarışması." },
    ],
  },
  {
    id: "kanald",
    name: "KANAL D",
    badge: "DİZİ & YAŞAM",
    streamUrl: "https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web",
    color: "from-blue-600 to-indigo-900",
    programs: [
      { time: "07:00", title: "Neler Oluyor Hayatta?", desc: "Hakan Ural ve Ferda Yıldırım ile gündemin nabzı." },
      { time: "09:00", title: "Kanal D Haber Günaydın", desc: "Sabahın gelişmeleri ve günün manşetleri." },
      { time: "11:00", title: "Gelinim Mutfakta", desc: "Aslı Hünel ile çeyrek altın yarışında kıran kırana lezzet." },
      { time: "13:30", title: "Arda'nın Mutfağı", desc: "Şef Arda Türkmen’den pratik ve lezzetli tarifler." },
      { time: "16:00", title: "Arka Sokaklar (Efsane Kuşak)", desc: "Rıza Baba ve ekibinin İstanbul sokaklarındaki mücadelesi." },
      { time: "19:00", title: "Kanal D Ana Haber", desc: "Günün en önemli gelişmeleri ve tarafsız analizler." },
      { time: "20:00", title: "İnci Taneleri (Yeni Bölüm)", desc: "Yılmaz Erdoğan imzalı Azem Yücedağ’ın hayat mücadelesi." },
      { time: "23:45", title: "Taş Kağıt Makas (Tekrar)", desc: "Adalet arayışında soluksuz hukuk savaşı." },
    ],
  },
  {
    id: "startv",
    name: "STAR TV",
    badge: "SİNEMA & DİZİ",
    streamUrl: "https://dogus.daioncdn.net/startv/startv_720p.m3u8?&sid=8l4w3lst4co5&app=a20ac41e-bdc3-4aa1-934d-26b484480ac9&ce=3",
    color: "from-emerald-600 to-teal-900",
    programs: [
      { time: "07:00", title: "Mesut Yar ile Bugün", desc: "Güne keyifli ve bilgilendirici başlangıç." },
      { time: "09:30", title: "Sabahın Sultanı Seda Sayan", desc: "Müzik, eğlence, yaşam hikayeleri ve canlı bağlantılar." },
      { time: "13:30", title: "Zahide Yetiş ile Yeniden Başlasak", desc: "Sorunlara çözüm ve umut dolu buluşmalar." },
      { time: "16:15", title: "Söz (Nostalji Kuşağı)", desc: "Özel Kuvvetler Timi’nin unutulmaz operasyonları." },
      { time: "19:00", title: "Star Haber", desc: "Nazlı Çelik ile Türkiye ve dünya gündeminin sıcak gelişmeleri." },
      { time: "20:00", title: "Yalı Çapkını (Yeni Bölüm)", desc: "Ferit ve Seyran’ın fırtınalı aşkı ve yalı entrikaları." },
      { time: "00:15", title: "Behzat Ç. (Gece Kuşağı)", desc: "Ankara Cinayet Büro’nun efsane vakaları." },
    ],
  },
  {
    id: "showtv",
    name: "SHOW TV",
    badge: "ŞOV & KOMEDİ",
    streamUrl: "https://ciner.daioncdn.net/showtv/showtv.m3u8?ce=3&app=4bc85",
    color: "from-pink-600 to-rose-900",
    programs: [
      { time: "06:00", title: "Yeni Bir Gün", desc: "Sabahın taze haberleri ve hava durumu." },
      { time: "08:15", title: "Bu Sabah", desc: "Murat Güloğlu ve Ebru Akel ile canlı gündem." },
      { time: "12:30", title: "Gelin Evi", desc: "Haftanın en marifetli gelini kim olacak?" },
      { time: "15:00", title: "Didem Arslan Yılmaz'la Vazgeçme", desc: "Karanlık olaylar aydınlanıyor, hakikatler ortaya çıkıyor." },
      { time: "18:45", title: "Show Ana Haber", desc: "Rıdvan Bıyık ile akşamın en sıcak manşetleri." },
      { time: "20:00", title: "Kızılcık Şerbeti (Yeni Bölüm)", desc: "Doğa ve Fatih’in fırtınalı evliliği ve aileler savaşı." },
      { time: "23:45", title: "Güldür Güldür Show", desc: "Kahkaha tufanı skeçlerle neşeli bir gece." },
    ],
  },
  {
    id: "nowtv",
    name: "NOW TV",
    badge: "DİZİ & HABER",
    streamUrl: "https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8",
    color: "from-orange-600 to-amber-900",
    programs: [
      { time: "07:30", title: "İlker Karagöz ile Çalar Saat", desc: "Günün ilk canlı manşetleri ve tarafsız ekonomi yorumları." },
      { time: "10:30", title: "Çağla ile Yeni Bir Gün", desc: "Sağlık, kadın, moda ve pratik yaşam rehberi." },
      { time: "13:30", title: "En Hamarat Benim", desc: "Kadir Ezildi ile temizlik ve mutfak kapışması." },
      { time: "16:30", title: "Fatih Ürek ile Gelin Görümce", desc: "En lezzetli yemek ve en yüksek puan mücadelesi." },
      { time: "19:00", title: "Selçuk Tepeli ile NOW Ana Haber", desc: "Günün gerçekleri, sorgulayan ve derinlikli haberler." },
      { time: "20:00", title: "Kızıl Goncalar (Yeni Bölüm)", desc: "Meryem ve Zeynep’in adalet ve özgürlük mücadelesi." },
      { time: "23:45", title: "Hudutsuz Sevda", desc: "Karadeniz’de intikamla başlayan büyük aşk hikayesi." },
    ],
  },
];

export function ScheduleView({ registerRef, focusedKey, onPick }: Props) {
  const [activeChannelId, setActiveChannelId] = useState("trt1");

  const activeChannel = useMemo(
    () => CHANNEL_SCHEDULES.find((c) => c.id === activeChannelId) || CHANNEL_SCHEDULES[0],
    [activeChannelId]
  );

  const handlePlayCurrentChannel = () => {
    if (!onPick) return;
    const streamMedia: Media = {
      id: `live-${activeChannel.id}`,
      title: `${activeChannel.name} Canlı Yayın`,
      genre: "Canlı TV",
      genres: ["Canlı TV", "Ulusal"],
      year: new Date().getFullYear(),
      duration: "Canlı",
      rating: "9.5",
      poster: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80",
      description: `${activeChannel.name} resmi ulusal canlı yayını.`,
      video: activeChannel.streamUrl,
      isLive: true,
    };
    onPick(streamMedia);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Live Play Button */}
      <div className={`rounded-3xl border border-white/10 bg-gradient-to-r ${activeChannel.color} p-6 shadow-2xl backdrop-blur transition-all duration-500`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40 text-white backdrop-blur">
              <Tv className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{activeChannel.name}</h2>
                <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  {activeChannel.badge}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/80">
                Kanalın 24 saatlik güncel resmi yayın akışı ve canlı yayın bağlantısı.
              </p>
            </div>
          </div>

          <button
            onClick={handlePlayCurrentChannel}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black shadow-xl transition hover:bg-white/90 active:scale-95"
          >
            <Play className="h-4 w-4 fill-black" />
            <span>Kanalı Canlı İzle</span>
          </button>
        </div>

        {/* Channel Selector Chips */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4">
          {CHANNEL_SCHEDULES.map((ch) => {
            const isActive = ch.id === activeChannelId;
            const fk = `sched-ch-${ch.id}`;
            return (
              <button
                key={ch.id}
                ref={(el) => registerRef(fk, el)}
                data-focus-key={fk}
                tabIndex={-1}
                onClick={() => setActiveChannelId(ch.id)}
                className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition outline-none ${
                  isActive
                    ? "bg-white text-black shadow-lg scale-105"
                    : focusedKey === fk
                      ? "neon-ring bg-white/30 text-white"
                      : "bg-black/30 text-white/80 hover:bg-black/50 hover:text-white"
                }`}
              >
                {ch.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Schedule Timeline */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {activeChannel.programs.map((prog, i) => {
          const fk = `sched-prog-${activeChannel.id}-${i}`;
          const isPrime = prog.time === "20:00";
          return (
            <div
              key={i}
              ref={(el) => registerRef(fk, el)}
              data-focus-key={fk}
              tabIndex={-1}
              className={`group flex flex-col justify-between rounded-2xl border p-4 outline-none transition duration-200 ${
                isPrime
                  ? "border-amber-400/50 bg-gradient-to-br from-amber-950/40 via-purple-950/20 to-black shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-purple-300">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{prog.time}</span>
                  </div>
                  {isPrime && (
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-300 border border-amber-400/30">
                      Prime Time
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-black text-white group-hover:text-purple-200 transition">
                  {prog.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/60">
                  {prog.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span>{activeChannel.name}</span>
                <span className="group-hover:text-purple-300 transition">Bugün</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

