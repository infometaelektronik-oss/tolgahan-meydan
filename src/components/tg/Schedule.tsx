import { useState, useMemo, useEffect } from "react";
import { CalendarClock, Clock, Play, Lock } from "lucide-react";
import type { Media } from "./data";
import type { UserStream } from "@/lib/streams.functions";
import { getChannelLogo } from "@/lib/turkishChannelLogos";

type Props = {
  registerRef: (key: string, el: HTMLElement | null) => void;
  focusedKey: string | null;
  onPick?: (media: Media) => void;
  streams?: UserStream[];
};

type EPGProgram = {
  time: string;
  title: string;
  desc: string;
  isPrime?: boolean;
  isLive?: boolean;
};

type EPGChannel = {
  id: string;
  name: string;
  category: "local" | "foreign";
  badge: string;
  streamUrl: string;
  color: string;
  programs: EPGProgram[];
};

const ALL_EPG_CHANNELS: EPGChannel[] = [
  // === TÜRK ULUSAL & TEMATİK KANALLAR ===
  {
    id: "trt1",
    name: "TRT 1",
    category: "local",
    badge: "GENEL YAYIN",
    streamUrl: "https://tv-trt1.medya.trt.com.tr/master.m3u8",
    color: "from-red-600 to-rose-950",
    programs: [
      { time: "06:00", title: "İstiklal Marşı & Gün Başlıyor", desc: "Sabahın ilk taze gelişmeleri, hava ve yol durumu." },
      { time: "09:00", title: "Alişan ile Hayata Gülümse", desc: "Sağlık, mutfak lezzetleri ve samimi konuklarla sabah neşesi." },
      { time: "12:15", title: "Gönül Dağı (Tekrar)", desc: "Bozkırın sarı sıcağında hayallerinin peşinden koşan amcaoğulları." },
      { time: "15:45", title: "Lingo Türkiye", desc: "Kelimeleri bul, büyük ödülü kazan! Heyecan dolu yarışma." },
      { time: "18:55", title: "TRT Ana Haber", desc: "Doğru, tarafsız ve derinlemesine günün manşetleri.", isLive: true },
      { time: "20:00", title: "Teşkilat (Yeni Bölüm)", desc: "Milli İstihbarat Teşkilatı'nın gizli vatan mücadelesi.", isPrime: true },
      { time: "23:45", title: "Pelikan Dosyası", desc: "Uluslararası analizler ve derin strateji dosyaları." },
      { time: "01:30", title: "Diriliş Ertuğrul (Gece Kuşağı)", desc: "Kayı obasının diriliş ve bağımsızlık destanı." },
    ],
  },
  {
    id: "atv",
    name: "ATV",
    category: "local",
    badge: "DİZİ & GÜNCEL",
    streamUrl: "https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv.m3u8",
    color: "from-amber-600 to-orange-950",
    programs: [
      { time: "07:00", title: "Kahvaltı Haberleri", desc: "Nihan Günay ile sabahın ilk ve tarafsız haberleri." },
      { time: "10:00", title: "Müge Anlı ile Tatlı Sert", desc: "Kayıplar bulunuyor, faili meçhul dosyalar aydınlanıyor." },
      { time: "13:00", title: "ATV Gün Ortası", desc: "Günün gelişen olayları ve canlı bağlantılar." },
      { time: "14:00", title: "Mutfak Bahane", desc: "Zahide Yetiş ile lezzet yarışması ve günün yemekleri." },
      { time: "16:00", title: "Esra Erol'da", desc: "Parçalanmış aileler, kayıplar ve yüzleşmeler canlı yayında." },
      { time: "19:00", title: "ATV Ana Haber", desc: "Cem Öğretir ile Türkiye ve dünyanın gündemi.", isLive: true },
      { time: "20:00", title: "Kuruluş Osman (Yeni Bölüm)", desc: "Osman Bey'in kutlu devlet yürüyüşü ve nefes kesen savaşlar.", isPrime: true },
      { time: "00:20", title: "Kim Milyoner Olmak İster?", desc: "Kenan İmirzalıoğlu ile efsane bilgi yarışması." },
    ],
  },
  {
    id: "kanald",
    name: "KANAL D",
    category: "local",
    badge: "DİZİ & YAŞAM",
    streamUrl: "https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web",
    color: "from-blue-600 to-indigo-950",
    programs: [
      { time: "07:00", title: "Neler Oluyor Hayatta?", desc: "Hakan Ural ve Ferda Yıldırım ile gündemin nabzı." },
      { time: "09:00", title: "Kanal D Haber Günaydın", desc: "Sabahın gelişmeleri ve günün manşetleri." },
      { time: "11:00", title: "Gelinim Mutfakta", desc: "Aslı Hünel ile çeyrek altın yarışında kıran kırana lezzet." },
      { time: "13:30", title: "Arda'nın Mutfağı", desc: "Şef Arda Türkmen'den pratik ve lezzetli tarifler." },
      { time: "16:00", title: "Arka Sokaklar (Efsane Kuşak)", desc: "Rıza Baba ve ekibinin İstanbul sokaklarındaki mücadelesi." },
      { time: "19:00", title: "Kanal D Ana Haber", desc: "Günün en önemli gelişmeleri ve tarafsız analizler.", isLive: true },
      { time: "20:00", title: "İnci Taneleri (Yeni Bölüm)", desc: "Yılmaz Erdoğan imzalı Azem Yücedağ'ın hayat mücadelesi.", isPrime: true },
      { time: "23:45", title: "Taş Kağıt Makas (Tekrar)", desc: "Adalet arayışında soluksuz hukuk savaşı." },
    ],
  },
  {
    id: "startv",
    name: "STAR TV",
    category: "local",
    badge: "SİNEMA & DİZİ",
    streamUrl: "https://dogus.daioncdn.net/startv/startv_720p.m3u8?app=a20ac41e-bdc3-4aa1-934d-26b484480ac9&ce=3&sid=8l4w3lst4co5",
    color: "from-emerald-600 to-teal-950",
    programs: [
      { time: "07:00", title: "Mesut Yar ile Bugün", desc: "Güne keyifli ve bilgilendirici başlangıç." },
      { time: "09:30", title: "Sabahın Sultanı Seda Sayan", desc: "Müzik, eğlence, yaşam hikayeleri ve canlı bağlantılar." },
      { time: "13:30", title: "Zahide Yetiş ile Yeniden Başlasak", desc: "Sorunlara çözüm ve umut dolu buluşmalar." },
      { time: "16:15", title: "Söz (Nostalji Kuşağı)", desc: "Özel Kuvvetler Timi'nin unutulmaz operasyonları." },
      { time: "19:00", title: "Star Haber", desc: "Nazlı Çelik ile sıcak gelişmeler ve canlı bağlantılar.", isLive: true },
      { time: "20:00", title: "Yalı Çapkını (Yeni Bölüm)", desc: "Ferit ve Seyran'ın fırtınalı aşkı ve yalı entrikaları.", isPrime: true },
      { time: "00:15", title: "Behzat Ç. (Gece Kuşağı)", desc: "Ankara Cinayet Büro'nun efsane vakaları." },
    ],
  },
  {
    id: "showtv",
    name: "SHOW TV",
    category: "local",
    badge: "ŞOV & KOMEDİ",
    streamUrl: "https://ciner.daioncdn.net/showtv/showtv.m3u8?ce=3&app=4bc856ef-4c68-4a94-bc87-37dfaaa66558",
    color: "from-pink-600 to-rose-950",
    programs: [
      { time: "06:00", title: "Yeni Bir Gün", desc: "Sabahın taze haberleri ve hava durumu." },
      { time: "08:15", title: "Bu Sabah", desc: "Murat Güloğlu ve Ebru Akel ile canlı gündem." },
      { time: "12:30", title: "Gelin Evi", desc: "Haftanın en marifetli gelini kim olacak?" },
      { time: "15:00", title: "Didem Arslan Yılmaz'la Vazgeçme", desc: "Karanlık olaylar aydınlanıyor, hakikatler ortaya çıkıyor." },
      { time: "18:45", title: "Show Ana Haber", desc: "Rıdvan Bıyık ile akşamın en sıcak manşetleri.", isLive: true },
      { time: "20:00", title: "Kızılcık Şerbeti (Yeni Bölüm)", desc: "Doğa ve Fatih'in fırtınalı evliliği ve aileler savaşı.", isPrime: true },
      { time: "23:45", title: "Güldür Güldür Show", desc: "Kahkaha tufanı skeçlerle neşeli bir gece." },
    ],
  },
  {
    id: "beyaztv",
    name: "BEYAZ TV",
    category: "local",
    badge: "TARTIŞMA & SPOR",
    streamUrl: "https://beyaztv-live.daioncdn.net/beyaztv/beyaztv_1080p.m3u8",
    color: "from-slate-600 to-zinc-950",
    programs: [
      { time: "07:30", title: "Uyan Türkiyem", desc: "Günün ilk haberleri ve gazete manşetleri." },
      { time: "09:30", title: "Söylemezsem Olmaz", desc: "Magazin dünyasının en sıcak dedikoduları ve canlı yorumlar." },
      { time: "12:30", title: "Nur Viral'le Hayatta Her Şey Var", desc: "Astroloji, sağlık, maneviyat ve yaşam sırları." },
      { time: "18:30", title: "Beyaz Ana Haber", desc: "Günün öne çıkan gelişmeleri ve özel haberler.", isLive: true },
      { time: "20:00", title: "Yerli Sinema Kuşağı", desc: "Efsane Türk komedi ve aksiyon filmleri.", isPrime: true },
      { time: "23:30", title: "Beyaz Futbol", desc: "Sinan Engin, Ahmet Çakar ve Ertem Şener ile futbol masası." },
    ],
  },
  {
    id: "tv8",
    name: "TV8",
    category: "local",
    badge: "YARIŞMA & ŞOV",
    streamUrl: "https://tv8.daioncdn.net/tv8/tv8.m3u8?app=7ddc255a-ef47-4e81-ab14-c0e5f2949788&ce=3",
    color: "from-red-600 to-amber-950",
    programs: [
      { time: "07:15", title: "8'de Sağlık", desc: "Alanında uzman doktorlardan güncel sağlık tavsiyeleri." },
      { time: "08:30", title: "Müge ve Gülşen'le 2. Sayfa", desc: "Magazin dünyasından flaş haberler ve özel röportajlar." },
      { time: "11:15", title: "MasterChef Türkiye (Özet)", desc: "Mutfakta şeflerin kıyasıya lezzet mücadelesi." },
      { time: "16:00", title: "Zuhal Topal'la Yemekteyiz", desc: "Haftanın en lezzetli sofrası kimin olacak?" },
      { time: "20:00", title: "Survivor All Star (Yeni Bölüm)", desc: "Issız adada nefes kesen dokunulmazlık oyunu.", isPrime: true, isLive: true },
      { time: "00:15", title: "Survivor Ekstra", desc: "Ada konseyi ve yarışmacıların performans analizleri." },
    ],
  },
  {
    id: "nowtv",
    name: "NOW TV",
    category: "local",
    badge: "HABER & DİZİ",
    streamUrl: "https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8",
    color: "from-orange-600 to-amber-950",
    programs: [
      { time: "07:30", title: "İlker Karagöz ile Çalar Saat", desc: "Günün ilk canlı manşetleri ve tarafsız ekonomi yorumları." },
      { time: "10:30", title: "Çağla ile Yeni Bir Gün", desc: "Sağlık, kadın, moda ve pratik yaşam rehberi." },
      { time: "13:30", title: "En Hamarat Benim", desc: "Kadir Ezildi ile temizlik ve mutfak kapışması." },
      { time: "19:00", title: "Selçuk Tepeli ile NOW Ana Haber", desc: "Günün gerçekleri, sorgulayan ve derinlikli haberler.", isLive: true },
      { time: "20:00", title: "Kızıl Goncalar (Yeni Bölüm)", desc: "Meryem ve Zeynep'in adalet ve özgürlük mücadelesi.", isPrime: true },
      { time: "23:45", title: "Hudutsuz Sevda", desc: "Karadeniz'de intikamla başlayan büyük aşk hikayesi." },
    ],
  },
  {
    id: "kanal7",
    name: "KANAL 7",
    category: "local",
    badge: "AİLE & DİZİ",
    streamUrl: "https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8",
    color: "from-teal-600 to-emerald-950",
    programs: [
      { time: "06:30", title: "Kanal 7'de Sabah", desc: "Güne huzurlu başlangıç ve güncel haber bülteni." },
      { time: "09:00", title: "Cuma Sohbetleri / Dini Sohbet", desc: "Gönüllere ferahlık veren manevi sohbetler." },
      { time: "12:00", title: "Gelin (Günlük Dizi)", desc: "Aile bağları ve fedakarlıklarla dolu duygusal hikaye." },
      { time: "15:30", title: "Rüzgarlı Tepe", desc: "İntikam ve tutkulu aşkın kesiştiği kasaba serüveni." },
      { time: "18:00", title: "Kanal 7 Ana Haber", desc: "Tümer Doğru ile ilkeli ve tarafsız haber sunumu.", isLive: true },
      { time: "19:00", title: "Esaret (Yeni Bölüm)", desc: "Orhun ve Hira'nın fırtınalı aşk serüveni.", isPrime: true },
      { time: "21:30", title: "Kan Çiçekleri", desc: "Töre ve kan davasının ortasında filizlenen imkansız aşk." },
    ],
  },
  {
    id: "trthaber",
    name: "TRT HABER",
    category: "local",
    badge: "24 SAAT HABER",
    streamUrl: "https://tv-trthaber.medya.trt.com.tr/master.m3u8",
    color: "from-red-700 to-rose-950",
    programs: [
      { time: "07:00", title: "Haber 7", desc: "Güne başlarken Türkiye ve dünyadaki sıcak gelişmeler." },
      { time: "10:00", title: "Haber Masası", desc: "Uzman konuklarla ekonomiden dış politikaya derinlemesine analiz." },
      { time: "13:00", title: "Öğle Bülteni", desc: "Gelişen olaylar ve canlı yayın noktalarından bağlantılar." },
      { time: "18:00", title: "Akşam Haberleri", desc: "Günün öne çıkan tüm gelişmeleri tek ekranda.", isLive: true },
      { time: "20:00", title: "Birinci Boyut", desc: "Gündemin sıcak maddeleri masaya yatırılıyor.", isPrime: true },
      { time: "23:00", title: "Gece Bakışı", desc: "Günün kapanış bilançosu ve yarının gündemi." },
    ],
  },
  {
    id: "aspor",
    name: "A SPOR",
    category: "local",
    badge: "CANLI SPOR",
    streamUrl: "https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8",
    color: "from-emerald-700 to-teal-950",
    programs: [
      { time: "07:00", title: "Sabah Sporu", desc: "Günün ilk spor haberleri, gazete manşetleri ve transfer iddiaları." },
      { time: "11:00", title: "Spor Ajansı", desc: "Süper Lig kulüplerinden en sıcak idman haberleri ve gelişmeler." },
      { time: "14:00", title: "Gün Ortası Spor", desc: "Futbol, basketbol ve voleyboldan canlı bağlantılar." },
      { time: "18:00", title: "Ana Haber Spor", desc: "Maç öncesi son durumlar ve muhtemel 11'ler.", isLive: true },
      { time: "20:00", title: "90+1 / Takım Oyunu", desc: "Usta yorumcularla haftanın kritik maçlarının analizi.", isPrime: true },
      { time: "23:00", title: "Son Sayfa", desc: "Günün kapanış spor tartışması ve hakem kararları." },
    ],
  },

  // === YABANCI KANALLAR ===
  {
    id: "bbcnews",
    name: "BBC News",
    category: "foreign",
    badge: "GLOBAL NEWS",
    streamUrl: "https://vs-hls-push-uk-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8",
    color: "from-red-800 to-stone-950",
    programs: [
      { time: "07:00", title: "BBC News Today", desc: "International headlines, business updates and global weather." },
      { time: "10:00", title: "World Business Report", desc: "Markets opening, global economic indicators and tech insights." },
      { time: "14:00", title: "Global with Matthew Amroliwala", desc: "In-depth international news stories and diplomatic updates." },
      { time: "19:00", title: "BBC News at Six", desc: "Comprehensive global broadcast with live on-scene reporters.", isLive: true },
      { time: "21:00", title: "HARDtalk", desc: "Hard-hitting, in-depth interviews with prominent world leaders.", isPrime: true },
      { time: "23:00", title: "The Context with Christian Fraser", desc: "Analysis of the driving forces behind major global events." },
    ],
  },
  {
    id: "cnnint",
    name: "CNN International",
    category: "foreign",
    badge: "WORLD NEWS",
    streamUrl: "https://cnn-cnninternational-1-gb.samsung.wurl.com/manifest/playlist.m3u8",
    color: "from-red-700 to-neutral-950",
    programs: [
      { time: "08:00", title: "CNN Newsroom Live", desc: "Breaking news as it happens across America, Europe and Asia." },
      { time: "12:00", title: "One World with Zain Asher", desc: "Connecting the dots on major international headlines." },
      { time: "16:00", title: "Amanpour", desc: "Christiane Amanpour's flagship global affairs interview program." },
      { time: "19:00", title: "Connect the World with Becky Anderson", desc: "Middle East and global crossroads news.", isLive: true },
      { time: "21:00", title: "The Lead with Jake Tapper", desc: "Deep investigative reporting and political analysis.", isPrime: true },
      { time: "00:00", title: "State of the Race", desc: "Global election analysis and foreign policy impacts." },
    ],
  },
  {
    id: "euronews",
    name: "Euronews (Türkçe / EN)",
    category: "foreign",
    badge: "AVRUPA GÜNDEMİ",
    streamUrl: "https://euronews-euronews-turkish-1-tr.samsung.wurl.com/manifest/playlist.m3u8",
    color: "from-blue-700 to-slate-950",
    programs: [
      { time: "07:00", title: "Good Morning Europe", desc: "European political agenda, green transition and tech news." },
      { time: "11:00", title: "Euronews Now", desc: "Real-time coverage from Brussels, Strasbourg and global capitals." },
      { time: "15:00", title: "State of the Union", desc: "Weekly review of EU affairs, diplomacy and European policy." },
      { time: "19:00", title: "Europe Tonight", desc: "Comprehensive European evening broadcast.", isLive: true },
      { time: "20:30", title: "The Global Conversation", desc: "Exclusive interviews with European policymakers.", isPrime: true },
      { time: "23:00", title: "No Comment", desc: "Raw, unedited footage from the day's most striking world events." },
    ],
  },
  {
    id: "dw",
    name: "Deutsche Welle (DW)",
    category: "foreign",
    badge: "KÜLTÜR & BELGESEL",
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    color: "from-cyan-800 to-slate-950",
    programs: [
      { time: "08:00", title: "DW News Morning", desc: "Global perspective from the heart of Europe." },
      { time: "11:00", title: "Made in Germany", desc: "German innovation, engineering, business and economic reports." },
      { time: "14:00", title: "Global 3000", desc: "The globalization program examining social and environmental issues." },
      { time: "18:00", title: "DW News Live", desc: "Real-time updates on conflicts, diplomacy and human rights.", isLive: true },
      { time: "20:00", title: "DW Documentaries", desc: "Award-winning investigative science and history documentaries.", isPrime: true },
      { time: "22:00", title: "Conflict Zone", desc: "Confrontational political interview series." },
    ],
  },
];

function parseProgramMinutes(programs: EPGProgram[]): number[] {
  const mins: number[] = [];
  for (let i = 0; i < programs.length; i++) {
    const [hh, mm] = programs[i].time.split(":").map((n) => parseInt(n, 10) || 0);
    let m = hh * 60 + mm;
    if (i > 0 && m < mins[i - 1]) {
      m += 24 * 60; // next day rollover (e.g. 00:15, 01:30)
    }
    mins.push(m);
  }
  return mins;
}

function getLiveProgramIndex(programs: EPGProgram[], nowDate: Date): number {
  if (programs.length === 0) return 0;
  const starts = parseProgramMinutes(programs);
  const firstStart = starts[0];
  let nowM = nowDate.getHours() * 60 + nowDate.getMinutes();
  if (nowM < firstStart) {
    nowM += 24 * 60;
  }
  let liveIdx = programs.length - 1;
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const nextStart = i + 1 < starts.length ? starts[i + 1] : firstStart + 24 * 60;
    if (nowM >= start && nowM < nextStart) {
      liveIdx = i;
      break;
    }
  }
  return liveIdx;
}

export function ScheduleView({ registerRef, focusedKey, onPick }: Props) {
  const [categoryTab, setCategoryTab] = useState<"local" | "foreign">("local");
  const [searchQuery, setSearchQuery] = useState("");
  const [nowTick, setNowTick] = useState<Date>(() => new Date());
  const [lockNotice, setLockNotice] = useState<{ channel: string; title: string; time: string; liveTitle: string } | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNowTick(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const filteredChannels = useMemo(() => {
    return ALL_EPG_CHANNELS.filter((ch) => {
      if (ch.category !== categoryTab) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = ch.name.toLowerCase().includes(q);
      const matchProg = ch.programs.some(
        (p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );
      return matchName || matchProg;
    });
  }, [categoryTab, searchQuery]);

  const handlePlayChannel = (ch: EPGChannel, clickedProg?: EPGProgram, isClickedLive = true) => {
    const liveIdx = getLiveProgramIndex(ch.programs, nowTick);
    const liveProg = ch.programs[liveIdx] || ch.programs[0];

    if (clickedProg && !isClickedLive) {
      setLockNotice({
        channel: ch.name,
        title: clickedProg.title,
        time: clickedProg.time,
        liveTitle: liveProg.title,
      });
      setTimeout(() => setLockNotice(null), 4000);
      return;
    }

    if (!onPick) return;
    const resolvedLogo = getChannelLogo(ch.name);
    const activeProg = liveProg;
    const streamMedia: Media = {
      id: `live-${ch.id}`,
      title: `${ch.name} Canlı Yayın`,
      genre: "Canlı TV",
      genres: ["Canlı TV", ch.badge],
      year: new Date().getFullYear(),
      duration: "Canlı",
      rating: "9.8",
      poster: resolvedLogo || "/assets/aistudio/Media_item_1_1bba30da.jpg",
      backdrop: resolvedLogo || "/assets/aistudio/Media_item_1_1bba30da.jpg",
      description: `${activeProg.time} - ${activeProg.title}: ${activeProg.desc}`,
      video: ch.streamUrl,
      isLive: true,
    };
    onPick(streamMedia);
  };

  return (
    <div className="space-y-6 pb-16">
      {lockNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-[70] flex max-w-md items-center gap-3 rounded-2xl border border-amber-500/50 bg-black/95 px-5 py-3.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] backdrop-blur-xl animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-amber-300">
              Doğal Canlı Yayın Koruması ({lockNotice.channel})
            </div>
            <div className="text-xs font-bold text-white/90">
              "{lockNotice.title}" ({lockNotice.time}) zaman dilimi kilitlidir. Şu an yalnızca canlı yayındaki "{lockNotice.liveTitle}" izlenebilir.
            </div>
          </div>
        </div>
      )}
      {/* 1. VIP Cyber EPG Banner Bar (Top Header) */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-black p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-[0_0_25px_rgba(6,182,212,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)] shrink-0 border border-white/20">
              <CalendarClock className="h-7 w-7 text-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight drop-shadow-md">
                  YAYIN AKIŞI & CANLI EPG REHBERİ
                </h1>
                <span className="rounded-full bg-cyan-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  {filteredChannels.length} Kanal Yayında
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Kanallara göre 24 saatlik resmi yayın akışları. Tıklayarak doğrudan yayını izleyebilirsiniz.
              </p>
            </div>
          </div>

          {/* Yerli vs Yabancı EPG Bar Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "local", label: "Yerli Kanallar EPG" },
              { id: "foreign", label: "Yabancı Kanallar EPG" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setCategoryTab(t.id as any)}
                className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider outline-none transition active:scale-95 border ${
                  categoryTab === t.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border-cyan-300/50"
                    : "bg-white/10 text-white/70 hover:bg-white/15 border-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* EPG Program Arama Kutusu */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Yayın akışında dizi, program, haber veya kanal ara... (örn: Teşkilat, Müge Anlı, Survivor, Haber)"
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-5 py-3 text-sm font-semibold text-white placeholder-white/40 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition"
          />
        </div>
      </div>

      {/* 2. Kanalların Alt Alta Sıralanmış Kapsamlı EPG Listesi */}
      <div className="space-y-6">
        {filteredChannels.map((ch) => {
          const logo = getChannelLogo(ch.name);
          const liveIdx = getLiveProgramIndex(ch.programs, nowTick);
          const currentProgram = ch.programs[liveIdx] || ch.programs[0];
          const fk = `epg-ch-${ch.id}`;
          const isFocus = focusedKey === fk;

          return (
            <div
              key={ch.id}
              className={`rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 shadow-xl backdrop-blur-md ${
                isFocus
                  ? "border-cyan-400 bg-gradient-to-r from-cyan-950/50 via-slate-900/80 to-black shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                  : "border-white/10 bg-gradient-to-r from-white/[0.04] via-black/60 to-black hover:border-cyan-500/40"
              }`}
            >
              {/* Kanal Başlık Barı (Logo, İsim, Rozet, Yayını İzle Butonu) */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  {/* 3D Kanal Logosu */}
                  <div className="relative flex h-14 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-white/15 to-black/60 p-2 border border-white/20 shadow-[0_6px_15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] shrink-0">
                    <div className="text-base font-black text-white">{ch.name.slice(0, 2).toUpperCase()}</div>
                    {logo && (
                      <img
                        src={logo}
                        alt={ch.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 m-auto max-h-10 max-w-[85%] rounded-lg bg-black/75 p-0.5 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-black text-white tracking-tight sm:text-2xl">{ch.name}</h2>
                      <span className="rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300 border border-white/15">
                        {ch.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                      <span className="text-xs font-bold text-white/80">
                        Şu An: <span className="text-white font-black">{currentProgram.title}</span> ({currentProgram.time})
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  ref={(el) => registerRef(fk, el)}
                  data-focus-key={fk}
                  tabIndex={-1}
                  onClick={() => handlePlayChannel(ch, currentProgram, true)}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] transition hover:scale-105 active:scale-95 border border-cyan-300/40"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Kanalı Canlı İzle</span>
                </button>
              </div>

              {/* Gün Boyunca Yayın Akışı Program Kartları (Yatay Akış & Grid) */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                {ch.programs.map((prog, pIdx) => {
                  const pFk = `epg-prog-${ch.id}-${pIdx}`;
                  const isLiveNow = pIdx === liveIdx;
                  const isPast = pIdx < liveIdx;
                  const isLocked = !isLiveNow;
                  return (
                    <button
                      key={pIdx}
                      ref={(el) => registerRef(pFk, el)}
                      data-focus-key={pFk}
                      tabIndex={-1}
                      onClick={() => handlePlayChannel(ch, prog, isLiveNow)}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-3 text-left transition duration-200 outline-none ${
                        isLiveNow
                          ? "border-emerald-400/60 bg-gradient-to-b from-emerald-950/60 via-slate-900 to-black shadow-[0_0_20px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400"
                          : isPast
                            ? "border-white/5 bg-black/50 opacity-60 hover:opacity-85 hover:border-white/20"
                            : prog.isPrime
                              ? "border-amber-400/40 bg-gradient-to-b from-amber-950/30 via-slate-900 to-black opacity-85 hover:opacity-100 hover:border-amber-300"
                              : "border-white/10 bg-white/[0.03] opacity-85 hover:opacity-100 hover:border-amber-400/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="flex items-center gap-1 font-mono text-xs font-black text-cyan-300">
                            <Clock className="h-3 w-3" />
                            {prog.time}
                          </span>
                          {isLiveNow ? (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-400/40 animate-pulse">
                              Yayında
                            </span>
                          ) : isLocked ? (
                            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-300 border border-amber-500/30">
                              <Lock className="h-2.5 w-2.5" />
                              <span>{isPast ? "Bitti" : prog.time}</span>
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-2 line-clamp-2 text-xs font-black text-white group-hover:text-cyan-200 transition">
                          {prog.title}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-[10px] text-white/60">
                          {prog.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-white/40">
                        <span>{ch.name}</span>
                        {isLiveNow ? (
                          <Play className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Lock className="h-3 w-3 text-amber-400/70" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredChannels.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center text-white/60">
            Arama kriterine uygun yayın akışı programı bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
