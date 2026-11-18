import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type TGChannelId =
  | "tgtv-hd"
  | "tgtv-sinema"
  | "tgtv-sinema2"
  | "tgtv-yesilcam"
  | "tgtv-yerli"
  | "tgtv-spor"
  | "tgtv-eglence"
  | "tgtv-cocuk"
  | "tgtv-belgesel"
  | "tgtv-muzik"
  | "tgtv-haber"
  | "tgtv-dini"
  | "tgtv-yasam"
  | "tgtv-yemek"
  | "tgtv-oyun";

export interface TGChannelInfo {
  id: TGChannelId;
  name: string;
  badge: string;
  number: number;
  description: string;
  genre: string;
  color: string;
  fallbackStreamUrl: string;
  logoUrl: string;
}

export function getTGTVLogo(channelId?: string | null): string {
  if (!channelId) return "/assets/tgtv-logos/tgtv-genel-orig.png";
  const id = channelId.toLowerCase();
  if (id.includes("sinema2") || id.includes("yerli-sinema")) return "/assets/tgtv-logos/tgtv-yerli-sinema-orig.png";
  if (id.includes("yesilcam") || id.includes("yeşilçam")) return "/assets/tgtv-logos/tgtv-yesilcam-orig.png";
  if (id.includes("sinema")) return "/assets/tgtv-logos/tgtv-sinema-orig.png";
  if (id.includes("yerli") || id.includes("dizi")) return "/assets/tgtv-logos/tgtv-dizi-orig.png";
  if (id.includes("spor")) return "/assets/tgtv-logos/tgtv-spor-orig.png";
  if (id.includes("eglence") || id.includes("eğlence")) return "/assets/tgtv-logos/tgtv-eglence-orig.png";
  if (id.includes("cocuk") || id.includes("çocuk")) return "/assets/tgtv-logos/tgtv-cocuk-orig.png";
  if (id.includes("belgesel")) return "/assets/tgtv-logos/tgtv-belgesel-orig.png";
  if (id.includes("muzik") || id.includes("müzik")) return "/assets/tgtv-logos/tgtv-muzik-orig.png";
  if (id.includes("haber")) return "/assets/tgtv-logos/tgtv-haber-orig.png";
  if (id.includes("dini")) return "/assets/tgtv-logos/tgtv-dini-orig.png";
  if (id.includes("yasam") || id.includes("yaşam")) return "/assets/tgtv-logos/tgtv-yasam-orig.png";
  if (id.includes("yemek")) return "/assets/tgtv-logos/tgtv-yemek-orig.png";
  if (id.includes("oyun")) return "/assets/tgtv-logos/tgtv-oyun-orig.png";
  return "/assets/tgtv-logos/tgtv-genel-orig.png";
}

export const TG_CHANNEL_ANIMATIONS: Record<TGChannelId, string> = {
  "tgtv-hd": "tgtv-anim-hd",
  "tgtv-sinema": "tgtv-anim-sinema",
  "tgtv-sinema2": "tgtv-anim-yerli",
  "tgtv-yesilcam": "tgtv-anim-yesilcam",
  "tgtv-yerli": "tgtv-anim-dizi",
  "tgtv-spor": "tgtv-anim-spor",
  "tgtv-eglence": "tgtv-anim-eglence",
  "tgtv-cocuk": "tgtv-anim-cocuk",
  "tgtv-belgesel": "tgtv-anim-belgesel",
  "tgtv-muzik": "tgtv-anim-muzik",
  "tgtv-haber": "tgtv-anim-haber",
  "tgtv-dini": "tgtv-anim-dini",
  "tgtv-yasam": "tgtv-anim-yasam",
  "tgtv-yemek": "tgtv-anim-yemek",
  "tgtv-oyun": "tgtv-anim-oyun",
};

export function getTGTVChannelAnimation(channelId?: string | null): string {
  if (!channelId) return "tgtv-anim-hd";
  const key = channelId.toLowerCase() as TGChannelId;
  if (TG_CHANNEL_ANIMATIONS[key]) return TG_CHANNEL_ANIMATIONS[key];
  if (key.includes("sinema2") || key.includes("yerli-sinema")) return "tgtv-anim-yerli";
  if (key.includes("yesilcam") || key.includes("yeşilçam")) return "tgtv-anim-yesilcam";
  if (key.includes("sinema")) return "tgtv-anim-sinema";
  if (key.includes("yerli") || key.includes("dizi")) return "tgtv-anim-dizi";
  if (key.includes("spor")) return "tgtv-anim-spor";
  if (key.includes("eglence") || key.includes("eğlence")) return "tgtv-anim-eglence";
  if (key.includes("cocuk") || key.includes("çocuk")) return "tgtv-anim-cocuk";
  if (key.includes("belgesel")) return "tgtv-anim-belgesel";
  if (key.includes("muzik") || key.includes("müzik")) return "tgtv-anim-muzik";
  if (key.includes("haber")) return "tgtv-anim-haber";
  if (key.includes("dini")) return "tgtv-anim-dini";
  if (key.includes("yasam") || key.includes("yaşam")) return "tgtv-anim-yasam";
  if (key.includes("yemek")) return "tgtv-anim-yemek";
  if (key.includes("oyun")) return "tgtv-anim-oyun";
  return "tgtv-anim-hd";
}

export type BreakTrailer = {
  title: string;
  streamUrl: string;
  posterUrl?: string;
  durationSeconds: number;
};

export const BREAK_DURATION_MS = 120_000; // 2 dakikalık Reklam & Fragman Kuşağı

export const TRAILER_BREAK_POOL: BreakTrailer[] = [
  {
    title: "Interstellar — Sinema Tanıtımı",
    streamUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    posterUrl: "/assets/posters/movie-interstellar.jpg",
    durationSeconds: 30,
  },
  {
    title: "İnci Taneleri — Özel Dizi Tanıtımı",
    streamUrl: "https://www.youtube.com/watch?v=_WnhZhZGPLE",
    posterUrl: "/assets/posters/tr-dizi-inci-taneleri.jpg",
    durationSeconds: 30,
  },
  {
    title: "G.O.R.A. — Kültür Sinema Tanıtımı",
    streamUrl: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
    posterUrl: "/assets/posters/tr-film-gora.jpg",
    durationSeconds: 30,
  },
  {
    title: "The Dark Knight — Prime Time Fragmanı",
    streamUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    posterUrl: "/assets/posters/movie-the-dark-knight.jpg",
    durationSeconds: 30,
  },
  {
    title: "Inception — Haftanın Filmi Tanıtımı",
    streamUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    posterUrl: "/assets/posters/movie-inception.jpg",
    durationSeconds: 30,
  },
  {
    title: "Kızılcık Şerbeti — Dizi Kuşağı Tanıtımı",
    streamUrl: "https://www.youtube.com/watch?v=X_yBRarj8lE",
    posterUrl: "/assets/posters/tr-dizi-kizilcik-serbeti.jpg",
    durationSeconds: 30,
  },
  {
    title: "Gladiator — Epik Sinema Kuşağı",
    streamUrl: "https://www.youtube.com/watch?v=owK1qxDselE",
    posterUrl: "/assets/posters/movie-gladiator.jpg",
    durationSeconds: 30,
  },
  {
    title: "Ayla — Özel Gösterim Tanıtımı",
    streamUrl: "https://www.youtube.com/watch?v=0Fl6TAyNJNQ",
    posterUrl: "/assets/posters/tr-film-ayla.jpg",
    durationSeconds: 30,
  },
];

export const KIDS_BREAK_POOL: BreakTrailer[] = [
  {
    title: "Rafadan Tayfa — Çocuk Kuşağı",
    streamUrl: "https://www.youtube.com/watch?v=s97iHdJKId8",
    posterUrl: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
    durationSeconds: 30,
  },
  {
    title: "Niloya — Neşeli Masallar",
    streamUrl: "https://www.youtube.com/watch?v=SXyoCF8HxwE",
    posterUrl: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
    durationSeconds: 30,
  },
  {
    title: "Pepee — Eğitici Şarkılar",
    streamUrl: "https://www.youtube.com/watch?v=QNcuxXA4x-U",
    posterUrl: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
    durationSeconds: 30,
  },
  {
    title: "İbi — Macera Zamanı",
    streamUrl: "https://www.youtube.com/watch?v=RRQD7rUu4f4",
    posterUrl: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
    durationSeconds: 30,
  },
];

export const TG_CHANNELS: TGChannelInfo[] = [
  {
    id: "tgtv-hd",
    name: "TG TV HD",
    badge: "GENEL KUŞAK",
    number: 101,
    description: "TG TV HD Ana Kanal: En popüler Türk filmleri, güncel diziler ve eğlence programları.",
    genre: "Genel",
    color: "from-purple-600 to-indigo-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
    logoUrl: "/assets/tgtv-logos/tgtv-genel-orig.png",
  },
  {
    id: "tgtv-sinema",
    name: "TG TV SİNEMA",
    badge: "DÜNYA & KLASİK SİNEMA",
    number: 102,
    description: "7/24 Kesintisiz Dünya sineması başyapıtları ve restore edilmiş uzun metrajlı filmler.",
    genre: "Sinema",
    color: "from-amber-600 to-red-600",
    fallbackStreamUrl: "https://archive.org/download/TheGeneral1926/The_General_1926_720p_512kb.mp4",
    logoUrl: "/assets/tgtv-logos/tgtv-sinema-orig.png",
  },
  {
    id: "tgtv-sinema2",
    name: "TG TV YERLİ SİNEMA",
    badge: "TÜRK SİNEMASI",
    number: 103,
    description: "7/24 Seçkin Türk Sineması yapımları, ödüllü yerli filmler ve Türk gişe komedileri.",
    genre: "Yerli Sinema",
    color: "from-rose-600 to-red-800",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=UdFhgigP-Kg",
    logoUrl: "/assets/tgtv-logos/tgtv-yerli-sinema-orig.png",
  },
  {
    id: "tgtv-yesilcam",
    name: "TG TV YEŞİLÇAM",
    badge: "YEŞİLÇAM KLASİKLERİ",
    number: 104,
    description: "Kemal Sunal, Şener Şen, Münir Özkul ve Adile Naşit ile efsane nostalji Yeşilçam sineması.",
    genre: "Yeşilçam Klasikleri",
    color: "from-emerald-600 to-green-700",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=KRy20M7uQM4",
    logoUrl: "/assets/tgtv-logos/tgtv-yesilcam-orig.png",
  },
  {
    id: "tgtv-yerli",
    name: "TG TV DİZİ",
    badge: "GÜNCEL & EFSANE DİZİLER",
    number: 105,
    description: "Yalı Çapkını, Kızılcık Şerbeti, Bahar, Kurtlar Vadisi, Ezel ve Çukur kuşağı.",
    genre: "Yerli Dizi",
    color: "from-blue-600 to-cyan-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
    logoUrl: "/assets/tgtv-logos/tgtv-dizi-orig.png",
  },
  {
    id: "tgtv-spor",
    name: "TG TV SPOR",
    badge: "SPOR & EFSANE MAÇLAR",
    number: 106,
    description: "Canlı spor kanalları, Süper Lig derbi özetleri, kulüp TV yayınları ve yarış analizleri.",
    genre: "Spor",
    color: "from-amber-500 to-yellow-600",
    fallbackStreamUrl: "https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-spor-orig.png",
  },
  {
    id: "tgtv-eglence",
    name: "TG TV EĞLENCE",
    badge: "TELEVİZYON PROGRAMLARI",
    number: 107,
    description: "Müge Anlı, Esra Erol, MasterChef, Güldür Güldür Show, Survivor ve popüler televizyon programları.",
    genre: "Eğlence",
    color: "from-fuchsia-600 to-pink-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=5BSG-5VmSqM",
    logoUrl: "/assets/tgtv-logos/tgtv-eglence-orig.png",
  },
  {
    id: "tgtv-cocuk",
    name: "TG TV ÇOCUK",
    badge: "ÇİZGİ DİZİ & ANİMASYON",
    number: 108,
    description: "TRT Diyanet Çocuk, Rafadan Tayfa, Niloya, Pepee ve çocuklar için özel eğitici animasyon akışı.",
    genre: "Çocuk",
    color: "from-orange-500 to-amber-600",
    fallbackStreamUrl: "https://tv-trtdiyanetcocuk.medya.trt.com.tr/master.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
  },
  {
    id: "tgtv-belgesel",
    name: "TG TV BELGESEL",
    badge: "DOĞA & TARİH & BİLİM",
    number: 109,
    description: "TRT Belgesel, doğa, kültür-sanat, Osmanlı tarihi ve uzay keşifleri belgesel akışı.",
    genre: "Belgesel",
    color: "from-teal-600 to-emerald-700",
    fallbackStreamUrl: "https://tv-trtbelgesel-dai.medya.trt.com.tr/master.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-belgesel-orig.png",
  },
  {
    id: "tgtv-muzik",
    name: "TG TV MÜZİK",
    badge: "TOP HİTLER & KLİPLER",
    number: 110,
    description: "PowerTürk, Dream Türk, Türkçe pop, rock ve 7/24 kesintisiz canlı müzik yayını.",
    genre: "Müzik",
    color: "from-pink-600 to-rose-600",
    fallbackStreamUrl: "https://livetv.powerapp.com.tr/powerturkTV/powerturkhd.smil/playlists.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-muzik-orig.png",
  },
  {
    id: "tgtv-haber",
    name: "TG TV HABER",
    badge: "GÜNCEL & ANALİZ",
    number: 111,
    description: "TRT Haber, Halk TV, Tele 1 ve Bloomberg HT ile 24 saat Türkiye ve ekonomi gündemi.",
    genre: "Haber",
    color: "from-sky-600 to-blue-700",
    fallbackStreamUrl: "https://tv-trthaber.medya.trt.com.tr/master.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-haber-orig.png",
  },
  {
    id: "tgtv-dini",
    name: "TG TV DİNİ",
    badge: "MANEVİYAT & SOHBET",
    number: 112,
    description: "Diyanet TV, Semerkand TV ve Dost TV ile Kur'an tilavetleri, cuma sohbetleri ve maneviyat.",
    genre: "Dini",
    color: "from-cyan-600 to-teal-700",
    fallbackStreamUrl: "https://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3bf95a47e07.smil/playlist.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-dini-orig.png",
  },
  {
    id: "tgtv-yasam",
    name: "TG TV YAŞAM",
    badge: "SAĞLIK & GEZİ",
    number: 113,
    description: "Kültür, seyahat, gezi rehberleri, belgesel-yaşam ve iyi yaşam programları.",
    genre: "Yaşam",
    color: "from-fuchsia-500 to-purple-600",
    fallbackStreamUrl: "https://tv-trtavaz.medya.trt.com.tr/master.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-yasam-orig.png",
  },
  {
    id: "tgtv-yemek",
    name: "TG TV YEMEK",
    badge: "GASTRONOMİ & TARİFLER",
    number: 114,
    description: "Geleneksel Türk mutfağı, gündüz kuşağı lezzet tarifleri ve Anadolu sofraları.",
    genre: "Yemek",
    color: "from-amber-600 to-orange-700",
    fallbackStreamUrl: "https://livetv.radyotvonline.net/kanal7live/kanal7avr/playlist.m3u8",
    logoUrl: "/assets/tgtv-logos/tgtv-yemek-orig.png",
  },
  {
    id: "tgtv-oyun",
    name: "TG TV OYUN",
    badge: "ESPOR & BİLİM KURGU",
    number: 115,
    description: "Bilim kurgu, oyun dünyası, siber evrenler ve fantastik aksiyon maratonu.",
    genre: "Oyun",
    color: "from-blue-600 to-indigo-700",
    fallbackStreamUrl: "https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4",
    logoUrl: "/assets/tgtv-logos/tgtv-oyun-orig.png",
  },
];

export type TGTVItem = {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  streamUrl: string;
  backupUrl?: string;
  posterUrl?: string;
  startAt: string;
  endAt: string;
  category?: string;
  isBreak?: boolean;
  breakTrailers?: BreakTrailer[];
};

export type CurrentBroadcast = {
  channel: TGChannelInfo;
  item: TGTVItem;
  offsetSeconds: number;
  next?: TGTVItem;
} | null;

export type ChannelPoolEntry = {
  title: string;
  description: string;
  stream_url: string;
  backup_url?: string;
  poster_url: string;
  durationHours: number;
};

export function getChannelPool(channelId: TGChannelId): ChannelPoolEntry[] {
  const officialLogo = "/assets/aistudio/Media_item_1_1bba30da.jpg";

  if (channelId === "tgtv-sinema") {
    return [
      {
        title: "The General (1926) — Restorasyonlu Full HD",
        description: "Buster Keaton'ın sinema tarihine damga vuran efsanevi aksiyon ve komedi klasiği.",
        stream_url: "https://archive.org/download/TheGeneral1926/The_General_1926_720p_512kb.mp4",
        poster_url: "/assets/posters/movie-the-general.jpg",
        durationHours: 1.5,
      },
      {
        title: "The Stranger (1946) — Orson Welles",
        description: "Orson Welles başrolde: Savaş sonrası bir kasabada nefes kesen gerilim ve gizem.",
        stream_url: "https://archive.org/download/the_stranger_1946/the_stranger_1946.mp4",
        poster_url: "/assets/posters/movie-the-stranger.jpg",
        durationHours: 1.75,
      },
      {
        title: "The 39 Steps (1935) — Alfred Hitchcock",
        description: "Alfred Hitchcock'un gerilim ve casusluk sinemasının başyapıtlarından biri.",
        stream_url: "https://archive.org/download/the_39_steps_1935/the_39_steps_1935.mp4",
        poster_url: "/assets/posters/movie-39-steps.jpg",
        durationHours: 1.5,
      },
      {
        title: "His Girl Friday (1940) — Howard Hawks",
        description: "Cary Grant ve Rosalind Russell ile gazetecilik dünyasından hızlı tempolu klasik komedi.",
        stream_url: "https://archive.org/download/HisGirlFriday1940/seqhisgirlfridayfull1d_512kb.mp4",
        poster_url: "/assets/posters/movie-his-girl-friday.jpg",
        durationHours: 1.75,
      },
      {
        title: "Cyrano de Bergerac (1950) — Oscar Ödüllü",
        description: "José Ferrer'e Oscar kazandıran unutulmaz klasik aşk ve onur draması.",
        stream_url: "https://archive.org/download/CyranoDeBergerac1950/Cyrano%20de%20Bergerac%20(1950).mp4",
        poster_url: "/assets/posters/movie-cyrano.jpg",
        durationHours: 2,
      },
      {
        title: "Sherlock Holmes and the Secret Weapon",
        description: "Basil Rathbone başrolde: Ünlü dedektifin II. Dünya Savaşı gizemini çözme mücadelesi.",
        stream_url: "https://archive.org/download/SherlockHolmesAndTheSecretWeapon/SherlockHolmesAndTheSecretWeapon1943.mp4",
        poster_url: "/assets/posters/movie-sherlock-holmes.jpg",
        durationHours: 1.5,
      },
    ];
  }

  if (channelId === "tgtv-sinema2") {
    return [
      {
        title: "G.O.R.A. (Bilim Kurgu Komedi)",
        description: "Cem Yılmaz klasiği: Halı tüccarı Arif'in uzaydaki komik ve macera dolu mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
        poster_url: "/assets/posters/tr-film-gora.jpg",
        durationHours: 2,
      },
      {
        title: "Hokkabaz (Cem Yılmaz — BKM)",
        description: "İskender ve Maradona'nın çıktığı turne yolculuğunda yaşanan komik ve duygusal olaylar.",
        stream_url: "https://www.youtube.com/watch?v=d5N_tbdMNCQ",
        poster_url: "/assets/posters/tr-film-hokkabaz.svg",
        durationHours: 2,
      },
      {
        title: "Organize İşler (BKM — Full HD)",
        description: "Asım Noyan ve ekibinin İstanbul sokaklarındaki dolandırıcılık ve aksiyon dolu serüveni.",
        stream_url: "https://www.youtube.com/watch?v=RdKMrwIh5PY",
        poster_url: "/assets/posters/tr-film-organize-isler.jpg",
        durationHours: 2,
      },
      {
        title: "Ölümlü Dünya (Yerli Aksiyon Komedi)",
        description: "Nesillerdir kiralık katillik yapan Mermer Ailesi'nin örgütle olan nefes kesen komedisi.",
        stream_url: "https://www.youtube.com/watch?v=XFaL90oIN5o",
        poster_url: "/assets/posters/tr-film-olumlu-dunya.jpg",
        durationHours: 2,
      },
      {
        title: "Babam ve Oğlum (Yerli Dram Başyapıtı)",
        description: "Çağan Irmak'ın yönettiği, üç kuşağın acı ve sevgi dolu buluşma hikayesi.",
        stream_url: "https://www.youtube.com/watch?v=_hBUgycpATk",
        poster_url: "/assets/posters/tr-film-babam-ve-oglum.jpg",
        durationHours: 2.25,
      },
      {
        title: "Vizontele (Yerli Sinema Klasiği)",
        description: "Yılmaz Erdoğan ve Demet Akbağ ile televizyonun bir Anadolu kasabasına gelişi.",
        stream_url: "https://www.youtube.com/watch?v=UdFhgigP-Kg",
        poster_url: "/assets/posters/tr-film-vizontele.jpg",
        durationHours: 2,
      },
      {
        title: "Ayla (Tarihi Yerli Sinema)",
        description: "Kore Savaşı'nda Süleyman Astsubay ile küçük Ayla'nın dünyayı ağlatan gerçek hikayesi.",
        stream_url: "https://www.youtube.com/watch?v=0Fl6TAyNJNQ",
        poster_url: "/assets/posters/tr-film-ayla.jpg",
        durationHours: 2,
      },
      {
        title: "Nefes: Vatan Sağolsun",
        description: "Sınır karakolundaki askerlerin zorlu coğrafyadaki vatan savunması.",
        stream_url: "https://www.youtube.com/watch?v=nIhe80yqbm8",
        poster_url: "/assets/posters/tr-film-nefes.jpg",
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-yesilcam") {
    return [
      {
        title: "Yeşilçam Klasikleri: Hababam Sınıfı",
        description: "Münir Özkul, Adile Naşit ve Kemal Sunal ile Özel Çamlıca Lisesi efsanesi.",
        stream_url: "https://www.youtube.com/watch?v=hf2-8MRPGu8",
        poster_url: "/assets/posters/tr-film-hababam-sinifi.jpg",
        durationHours: 1.75,
      },
      {
        title: "Yeşilçam Klasikleri: Tosun Paşa",
        description: "Tellioğulları ve Seferoğulları'nın Yeşil Vadi uğruna komedi dolu mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=ZvXzoYwm-GU",
        poster_url: "/assets/posters/tr-film-tosun-pasa.jpg",
        durationHours: 1.75,
      },
      {
        title: "Yeşilçam Klasikleri: Süt Kardeşler",
        description: "Şaban ve Ramazan'ın Gulyabani macerası ve unutulmaz komedi.",
        stream_url: "https://www.youtube.com/watch?v=KRy20M7uQM4",
        poster_url: "/assets/posters/tr-film-sut-kardesler.jpg",
        durationHours: 1.75,
      },
      {
        title: "Yeşilçam Klasikleri: Şabanoğlu Şaban",
        description: "Nazar Boncuğu hırsızının peşindeki sakar dedektifler.",
        stream_url: "https://www.youtube.com/watch?v=ZDoLID8feBU",
        poster_url: "/assets/posters/tr-film-sabano-saban.jpg",
        durationHours: 1.75,
      },
      {
        title: "Yeşilçam Klasikleri: Neşeli Günler",
        description: "Turşunun sirkeyle mi yoksa limonla mı yapıldığı kavgası.",
        stream_url: "https://www.youtube.com/watch?v=lxeKZU0VsyY",
        poster_url: "/assets/posters/tr-film-neseli-gunler.jpg",
        durationHours: 1.75,
      },
      {
        title: "Yeşilçam Klasikleri: Kibar Feyzo",
        description: "Maho Ağa ve Feyzo'nun hak ve adalet arayışı.",
        stream_url: "https://www.youtube.com/watch?v=stOXnCPxOws",
        poster_url: "/assets/posters/tr-film-kibar-feyzo.jpg",
        durationHours: 1.75,
      },
      {
        title: "Yeşilçam Klasikleri: Çöpçüler Kralı",
        description: "Apti Şakrak, Zabıta Şakir ve Hacer'in unutulmaz mahalle hikayesi.",
        stream_url: "https://www.youtube.com/watch?v=xs9XUjHvZsM",
        poster_url: "/assets/posters/tr-film-copculer-krali.jpg",
        durationHours: 1.75,
      },
      {
        title: "Yeşilçam Klasikleri: Şekerpare",
        description: "Ziver Bey ve Komiser Şener Şen ile İstanbul komedisi.",
        stream_url: "https://www.youtube.com/watch?v=Z36c3fDqvJY",
        poster_url: "/assets/posters/tr-film-sekerpare.jpg",
        durationHours: 1.75,
      },
    ];
  }

  if (channelId === "tgtv-yerli") {
    return [
      {
        title: "Kızılcık Şerbeti: Güncel Kuşak",
        description: "İki farklı kültürden gelen ailenin çocuklarının evliliğiyle başlayan fırtınalı olaylar.",
        stream_url: "https://www.youtube.com/watch?v=X_yBRarj8lE",
        poster_url: "/assets/posters/tr-dizi-kizilcik-serbeti.jpg",
        durationHours: 2.25,
      },
      {
        title: "Bahar: Uyanmaya Hazır Mısın?",
        description: "Ölümle burun buruna geldiğinde hayatını yeniden kurmaya karar veren Bahar'ın hikayesi.",
        stream_url: "https://www.youtube.com/watch?v=RYzd3cGAsMU",
        poster_url: "/assets/posters/tr-dizi-bahar.jpg",
        durationHours: 2.25,
      },
      {
        title: "Yalı Çapkını: Özel Kuşak",
        description: "Antep'ten İstanbul'a uzanan Korhan Ailesi ve Ferit ile Seyran'ın fırtınalı aşkı.",
        stream_url: "https://www.youtube.com/watch?v=VIBJ4yExWrM",
        poster_url: "/assets/posters/tr-dizi-yali-capkini.jpg",
        durationHours: 2.25,
      },
      {
        title: "İnci Taneleri: Azem Yücedağ",
        description: "Yılmaz Erdoğan kaleminden Azem Yücedağ ve Dilber'in duygu yüklü hikayesi.",
        stream_url: "https://www.youtube.com/watch?v=_WnhZhZGPLE",
        poster_url: "/assets/posters/tr-dizi-inci-taneleri.jpg",
        durationHours: 2.25,
      },
      {
        title: "Kurtlar Vadisi: Efsane Kuşak",
        description: "Polat Alemdar ve Süleyman Çakır'ın Vadi'deki büyük savaşı.",
        stream_url: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
        poster_url: "/assets/posters/tr-dizi-kurtlar-vadisi.jpg",
        durationHours: 2,
      },
      {
        title: "Ezel: İntikam Başlıyor",
        description: "Her ihanet sevgiyle başlar. Ezel Bayraktar ve Ramiz Dayı efsanesi.",
        stream_url: "https://www.youtube.com/watch?v=FSo8aRocl9w",
        poster_url: "/assets/posters/tr-dizi-ezel.jpg",
        durationHours: 2,
      },
      {
        title: "Çukur: Koçovalı Hanedanı",
        description: "Çukur evimiz, İdris babamız. Yamaç ve Vartolu'nun mahalleyi koruma mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=dQIT3XjiOI4",
        poster_url: "/assets/posters/tr-dizi-cukur.jpg",
        durationHours: 2,
      },
      {
        title: "İçerde: Kardeşlerin Mücadelesi",
        description: "Sarp ve Mert'in Kebapçı Celal'in gölgesindeki nefes kesen mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=g9ye2PbZzaQ",
        poster_url: "/assets/posters/tr-dizi-icerde.jpg",
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-spor") {
    return [
      {
        title: "A Spor Canlı Yayın & Transfer Gündemi",
        description: "Süper Lig kulüplerinden sıcak haberler, canlı yayın bağlantıları ve spor analizi.",
        stream_url: "https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "HTSpor Canlı Analiz & Maç Öncesi",
        description: "Günün öne çıkan karşılaşmaları, taktik tahtası ve canlı yorumlar.",
        stream_url: "https://ciner.daioncdn.net/ht-spor/ht-spor.m3u8?app=web",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "TV 8.5 Avrupa Futbolu & Yarış Kuşağı",
        description: "Uluslararası spor organizasyonları, futbol özetleri ve özel röportajlar.",
        stream_url: "https://tv8.daioncdn.net/tv8bucuk/tv8bucuk_1080p.m3u8?app=tv8bucuk_web&ce=3",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "GS TV & FB TV Derbi Özel Arşivi",
        description: "Kulüp televizyonlarından klasik maç özetleri ve efsane goller.",
        stream_url: "https://mumt05.tangotv.in/87NeALx2GSTV/index.m3u8",
        backup_url: "https://1hskrdto.rocketcdn.com/fenerbahcetv.smil/playlist.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-eglence") {
    return [
      {
        title: "Güldür Güldür Show — Özel Skeçler",
        description: "Ali Sunal ve dev komedi kadrosuyla kahkaha garantili televizyon programı.",
        stream_url: "https://www.youtube.com/watch?v=5BSG-5VmSqM",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 2,
      },
      {
        title: "Çok Güzel Hareketler 2 — Tek Parça",
        description: "Yılmaz Erdoğan yönetimindeki BKM Mutfak ekibinin en sevilen sahne skeçleri.",
        stream_url: "https://www.youtube.com/watch?v=-WTqOUCSBVA",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 2,
      },
      {
        title: "MasterChef Türkiye — Büyük Şeflerin Yarışı",
        description: "Heyecan dolu dokunulmazlık oyunları ve lezzet düelloları.",
        stream_url: "https://www.youtube.com/watch?v=Zkh0yGCTlug",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 2.25,
      },
      {
        title: "Kim Milyoner Olmak İster? — Yarışma Kuşağı",
        description: "Türkiye'nin en sevilen bilgi ve kültür yarışmasından özel bölümler.",
        stream_url: "https://www.youtube.com/watch?v=oXeU118-ros",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 1.5,
      },
      {
        title: "Müge Anlı ile Tatlı Sert — Özel Dosyalar",
        description: "Türkiye'nin en çok izlenen gündüz kuşağı araştırma ve sosyal sorumluluk programı.",
        stream_url: "https://www.youtube.com/watch?v=Q64pqDKsnDg",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 2.5,
      },
      {
        title: "Esra Erol'da — Gündüz Kuşağı",
        description: "Ailelerin buluşma ve yüzleşme noktası, canlı yayın kuşağı.",
        stream_url: "https://www.youtube.com/watch?v=LJLHHzRhF1c",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 2,
      },
      {
        title: "Zuhal Topal'la Yemekteyiz — Haftanın Finali",
        description: "Beş iddialı yarışmacının mutfaktaki hünerleri ve puanlama heyecanı.",
        stream_url: "https://www.youtube.com/watch?v=oIlR9kdh4iA",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 2,
      },
      {
        title: "Survivor Türkiye — Ada Konseyi & Parkur",
        description: "Zorlu ada mücadelesi, ödül oyunları ve nefes kesen eleme geceleri.",
        stream_url: "https://www.youtube.com/watch?v=TKrPYPfNjI4",
        poster_url: "/assets/tgtv-logos/tgtv-eglence-orig.png",
        durationHours: 2.5,
      },
    ];
  }

  if (channelId === "tgtv-cocuk") {
    return [
      {
        title: "TRT Diyanet Çocuk: Eğitici Çizgi Film Kuşağı",
        description: "Çocuklar için değerler eğitimi, neşeli masallar ve yerli animasyonlar.",
        stream_url: "https://tv-trtdiyanetcocuk.medya.trt.com.tr/master.m3u8",
        poster_url: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
        durationHours: 2,
      },
      {
        title: "Rafadan Tayfa: Mahalle Maceraları",
        description: "Akın, Hayri, Mert ve Kamil'in neşeli ve eğitici çocuk çizgi dizi kuşağı.",
        stream_url: "https://www.youtube.com/watch?v=s97iHdJKId8",
        poster_url: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
        durationHours: 1.5,
      },
      {
        title: "Niloya: Masal & Doğa Saati",
        description: "Okul öncesi çocuklar için müzikli ve öğretici Niloya bölümleri.",
        stream_url: "https://www.youtube.com/watch?v=SXyoCF8HxwE",
        poster_url: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
        durationHours: 1.5,
      },
      {
        title: "Pepee: Eğitici Şarkılar ve Oyunlar",
        description: "Sevilen yerli çizgi karakter Pepee ile renkler, sayılar ve aile sevgisi.",
        stream_url: "https://www.youtube.com/watch?v=QNcuxXA4x-U",
        poster_url: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
        durationHours: 1.5,
      },
      {
        title: "İbi: Bilim ve Macera Dünyası",
        description: "Matematik ve mantık bulmacalarıyla dolu TRT Çocuk klasiği.",
        stream_url: "https://www.youtube.com/watch?v=RRQD7rUu4f4",
        poster_url: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
        durationHours: 1.5,
      },
      {
        title: "Zarok TV: Renkli Çocuk Dünyası",
        description: "Neşeli çocuk şarkıları ve eğitici çizgi film bölümleri.",
        stream_url: "https://zindikurmanci.zaroktv.com.tr/hls/stream.m3u8",
        poster_url: "/assets/tgtv-logos/tgtv-cocuk-orig.png",
        durationHours: 2,
      },
      {
        title: "Big Buck Bunny: 3D Animasyon Kuşağı",
        description: "Çocuklar ve aileler için sevimli orman dostlarının 3D animasyon filmi.",
        stream_url: "https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4",
        poster_url: "/assets/posters/movie-big-buck-bunny.jpg",
        durationHours: 1,
      },
    ];
  }

  if (channelId === "tgtv-belgesel") {
    return [
      {
        title: "TRT Belgesel: Yaban Hayatı & Doğanın Sırları",
        description: "Türkiye'nin vahşi doğası, belgesel serileri ve bilim keşifleri.",
        stream_url: "https://tv-trtbelgesel-dai.medya.trt.com.tr/master.m3u8",
        poster_url: "/assets/tgtv-logos/tgtv-belgesel-orig.png",
        durationHours: 2,
      },
      {
        title: "Our Planet: Coastal Seas (Doğa Belgeseli)",
        description: "Dünya denizlerinin ve mercan resiflerinin büyüleyici belgesel bölümü.",
        stream_url: "https://www.youtube.com/watch?v=r9PeYPHdpNo",
        poster_url: "/assets/posters/series-netflix-our-planet.svg",
        durationHours: 1.5,
      },
      {
        title: "TRT 2: Kültür, Tarih ve Sanat Belgeselleri",
        description: "Medeniyetler tarihi, mimari başyapıtlar ve seçkin sanat söyleşileri.",
        stream_url: "https://tv-trt2.medya.trt.com.tr/master.m3u8",
        poster_url: "/assets/tgtv-logos/tgtv-belgesel-orig.png",
        durationHours: 2,
      },
      {
        title: "Mevlânâ Celâleddîn-i Rûmî: Tarihi Belgesel Drama",
        description: "Tasavvuf tarihinin ve Anadolu irfanının derin belgesel sunumu.",
        stream_url: "https://www.youtube.com/watch?v=GufMHO6xbec",
        poster_url: "/assets/posters/series-tabii-mevlana.jpg",
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-muzik") {
    return [
      {
        title: "PowerTürk TV: En Yeni Türkçe Pop Klipleri",
        description: "Zirvedeki Türkçe pop parçaları ve 24 saat kesintisiz HD klip yayını.",
        stream_url: "https://livetv.powerapp.com.tr/powerturkTV/powerturkhd.smil/playlists.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Dream Türk: Hit Şarkılar & Akustik Sahne",
        description: "Türkçe rock, pop ve akustik canlı performanslar.",
        stream_url: "https://live.duhnet.tv/S2/HLS_LIVE/dreamturknp/playlist.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "PowerTürk Taptaze: Günün Çıkış Yapanları",
        description: "Haftanın en taze müzik listeleri ve özel sanatçı konserleri.",
        stream_url: "https://livetv.powerapp.com.tr/pturktaptaze/taptaze.smil/playlist.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Power Dance: Elektronik & Ritim Kuşağı",
        description: "Yüksek tempolu dans müzikleri ve gece DJ setleri.",
        stream_url: "https://livetv.powerapp.com.tr/dance/dance.smil/playlist.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-haber") {
    return [
      {
        title: "TRT Haber: 24 Saat Gündem & Ana Haber",
        description: "Türkiye ve dünya gündeminden sıcak gelişmeler ve canlı bağlantılar.",
        stream_url: "https://tv-trthaber.medya.trt.com.tr/master.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Halk TV: Gündem Özel & Siyaset Masası",
        description: "Canlı stüdyo tartışmaları ve son dakika gelişmeleri.",
        stream_url: "https://halktv.daioncdn.net/halktv/halktv_1080p.m3u8?app=c86957d3-74a7-44da-9ad2-dc358c769609",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "NTV: Gündem, Ekonomi ve Akşam Bülteni",
        description: "Günün öne çıkan başlıkları, canlı bağlantılar ve uzman analizleri.",
        stream_url: "https://dogus.daioncdn.net/ntv/ntv_1080p.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Bloomberg HT: Ekonomi & Piyasalar",
        description: "Borsa, döviz, finans dünyası ve iş dünyasından haberler.",
        stream_url: "https://mumbai-edge.smartplaytv.in/BloombergHT/index.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-dini") {
    return [
      {
        title: "Diyanet TV: Kur'an-ı Kerim Tilaveti ve İslam Ahlakı",
        description: "Gönüllere huzur veren Kur'an tilavetleri, tefsir ve aile sohbetleri.",
        stream_url: "https://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3bf95a47e07.smil/playlist.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Semerkand TV: İrfan Meclisi & Tasavvuf",
        description: "İslam tarihi, siyer-i nebi programları ve ilahiler.",
        stream_url: "https://b01c02nl.mediatriple.net/videoonlylive/mtisvwurbfcyslive/broadcast_58d915bd40efc.smil/playlist.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Dost TV: Cuma Sohbetleri & Maneviyat",
        description: "Ramazan ve maneviyat programları, hadis ve fıkıh sohbetleri.",
        stream_url: "https://dost.stream.emsal.im/tv/live.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "TRT Diyanet Çocuk: Değerler Eğitimi",
        description: "Çocuklar ve aileler için sevgi, saygı ve ahlak programları.",
        stream_url: "https://tv-trtdiyanetcocuk.medya.trt.com.tr/master.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-yasam") {
    return [
      {
        title: "TRT Avaz: Kültür, Gezi ve Yaşam Rehberi",
        description: "Anadolu ve Orta Asya coğrafyasından renkli seyahat ve yaşam hikayeleri.",
        stream_url: "https://tv-trtavaz.medya.trt.com.tr/master.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "CNBC-e: Kültür, Finans & İyi Yaşam",
        description: "Popüler yaşam tarzı, finans, sanat ve kültür programları.",
        stream_url: "https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "TRT 2: Edebiyat, Sanat ve Yaşam Söyleşileri",
        description: "Mimari, felsefe, kitaplar ve iyi yaşam kültürü.",
        stream_url: "https://tv-trt2.medya.trt.com.tr/master.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "TRT Türk: Yurt Dışı Yaşam & Belgesel",
        description: "Dünya şehirlerinden gezi ve kültür yaşam portreleri.",
        stream_url: "https://tv-trtturk.medya.trt.com.tr/master.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-yemek") {
    return [
      {
        title: "Kanal 7: Anadolu Mutfağı & Gündüz Sofraları",
        description: "Geleneksel ev yemekleri, hamur işleri ve yöresel tatlar.",
        stream_url: "https://livetv.radyotvonline.net/kanal7live/kanal7avr/playlist.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "MasterChef Türkiye: Şeflerin Mutfağı",
        description: "Türkiye'nin önde gelen şeflerinden imza yemekler ve lezzet yarışları.",
        stream_url: "https://www.youtube.com/watch?v=Zkh0yGCTlug",
        poster_url: "/assets/tgtv-logos/tgtv-yemek-orig.png",
        durationHours: 2,
      },
      {
        title: "Zuhal Topal'la Yemekteyiz: Sofra Düellosu",
        description: "Anadolu ve dünya mutfağından enfes menüler.",
        stream_url: "https://www.youtube.com/watch?v=oIlR9kdh4iA",
        poster_url: "/assets/tgtv-logos/tgtv-yemek-orig.png",
        durationHours: 2,
      },
      {
        title: "TRT Türk: Yöresel Gastronomi & Şehir Lezzetleri",
        description: "Gaziantep, Hatay, Karadeniz ve Ege mutfak belgeselleri.",
        stream_url: "https://tv-trtturk.medya.trt.com.tr/master.m3u8",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  }

  if (channelId === "tgtv-oyun") {
    return [
      {
        title: "Sintel: Fantastik Aksiyon Animasyonu (4K)",
        description: "Ejderhasını arayan genç savaşçı Sintel'in destansı fantastik macerası.",
        stream_url: "https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4",
        poster_url: "/assets/posters/movie-sintel-fantasy.jpg",
        durationHours: 1.5,
      },
      {
        title: "G.O.R.A.: Uzay ve Bilim Kurgu Evreni",
        description: "Kült Türk bilim kurgu ve mizah klasiği.",
        stream_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
        poster_url: "/assets/posters/tr-film-gora.jpg",
        durationHours: 2,
      },
      {
        title: "Arif V 216: Zaman Yolculuğu Macerası",
        description: "Robot 216 ve Arif'in zamanda yolculuk serüveni.",
        stream_url: "https://www.youtube.com/watch?v=KFsTkingP94",
        poster_url: "/assets/posters/tr-film-arif-v-216.jpg",
        durationHours: 2,
      },
      {
        title: "The Atomic Brain: Retro Bilim Kurgu Kuşağı",
        description: "Klasik 1960'lar bilim kurgu ve deneysel gerilim sineması.",
        stream_url: "https://archive.org/download/TheAtomicBrain/TheAtomicBrain.mp4",
        poster_url: "/assets/posters/movie-atomic-brain.svg",
        durationHours: 1.5,
      },
    ];
  }

  // TG TV HD (Flagship Main Channel) — Distinct high-profile programs
  return [
    {
      title: "Prime Time Sinema: G.O.R.A.",
      description: "Cem Yılmaz klasiği bilim kurgu komedi başyapıtı.",
      stream_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
      poster_url: "/assets/posters/tr-film-gora.jpg",
      durationHours: 2,
    },
    {
      title: "Efsane Dizi: Kurtlar Vadisi",
      description: "Kurtlar Vadisi HD kalitesiyle TG TV HD ekranlarında.",
      stream_url: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
      poster_url: "/assets/posters/tr-dizi-kurtlar-vadisi.jpg",
      durationHours: 2,
    },
    {
      title: "Yerli Klasik: Hababam Sınıfı",
      description: "Efsane kadro Hababam Sınıfı ile aile boyu nostalji.",
      stream_url: "https://www.youtube.com/watch?v=hf2-8MRPGu8",
      poster_url: "/assets/posters/tr-film-hababam-sinifi.jpg",
      durationHours: 2,
    },
    {
      title: "Gece Dizisi: Ezel",
      description: "Her ihanet sevgiyle başlar — Ezel Bayraktar özel kuşağı.",
      stream_url: "https://www.youtube.com/watch?v=FSo8aRocl9w",
      poster_url: "/assets/posters/tr-dizi-ezel.jpg",
      durationHours: 2,
    },
    {
      title: "Sinema Gecesi: Vizontele",
      description: "Anadolu kasabasında sinema ve hayat dolu kahkaha şöleni.",
      stream_url: "https://www.youtube.com/watch?v=UdFhgigP-Kg",
      poster_url: "/assets/posters/tr-film-vizontele.jpg",
      durationHours: 2,
    },
    {
      title: "Duygu Kuşağı: Babam ve Oğlum",
      description: "Türk sinemasının unutulmaz dram klasiği TG TV HD ekranlarında.",
      stream_url: "https://www.youtube.com/watch?v=_hBUgycpATk",
      poster_url: "/assets/posters/tr-film-babam-ve-oglum.jpg",
      durationHours: 2,
    },
  ];
}

export function buildBreakTrailers(slotIndex: number, channelId?: TGChannelId): BreakTrailer[] {
  const pool = channelId === "tgtv-cocuk" ? KIDS_BREAK_POOL : TRAILER_BREAK_POOL;
  const count = 4;
  const result: BreakTrailer[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[(slotIndex * 3 + i) % pool.length]);
  }
  return result;
}

export function generateScheduleRowsForChannel(channelId: TGChannelId, baseNow: Date = new Date()) {
  const nowIso = baseNow.toISOString();
  const pool = getChannelPool(channelId);

  // Generate 48+ hours of sequential slots with 2-minute Reklam & Fragman breaks between every program
  const top = new Date(baseNow.getTime() - 2 * 3600_000);
  top.setMinutes(0, 0, 0);
  let cursor = top.getTime();

  const rows: any[] = [];
  const targetEnd = baseNow.getTime() + 48 * 3600_000;
  let idx = 0;
  const stamp = Date.now();

  while (cursor < targetEnd) {
    const it = pool[idx % pool.length];
    const durationMs = Math.round(it.durationHours * 3600_000);
    const progStartAt = new Date(cursor).toISOString();
    const progEndAt = new Date(cursor + durationMs).toISOString();

    rows.push({
      id: `${channelId}-${stamp}-${idx}`,
      channel_id: channelId,
      title: it.title,
      description: it.description,
      stream_url: it.stream_url,
      backup_url: it.backup_url,
      poster_url: it.poster_url,
      start_at: progStartAt,
      end_at: progEndAt,
      is_break: false,
      created_at: nowIso,
    });

    cursor += durationMs;

    // Insert 2-minute Commercial & Trailer Break ("Reklam & Fragman Kuşağı") between programs
    if (cursor < targetEnd) {
      const breakTrailers = buildBreakTrailers(idx, channelId);
      const breakStartAt = new Date(cursor).toISOString();
      const breakEndAt = new Date(cursor + BREAK_DURATION_MS).toISOString();
      rows.push({
        id: `${channelId}-${stamp}-${idx}-break`,
        channel_id: channelId,
        title: "Reklam & Fragman Kuşağı",
        description: `2 dakikalık ara kuşağı: ${breakTrailers.map((t) => t.title.split("—")[0].trim()).join(" · ")}`,
        stream_url: breakTrailers[0].streamUrl,
        poster_url: breakTrailers[0].posterUrl || "/assets/aistudio/Media_item_1_1bba30da.jpg",
        start_at: breakStartAt,
        end_at: breakEndAt,
        is_break: true,
        break_trailers: breakTrailers,
        created_at: nowIso,
      });
      cursor += BREAK_DURATION_MS;
    }

    idx++;
  }

  return rows;
}

/**
 * Autonomously ensures a continuous 24-hour broadcast schedule (with 2-min trailer breaks) exists for the channel
 */
async function ensureChannelSchedule(channelId: TGChannelId): Promise<void> {
  const { nativeDb } = await import("@/db/native-db");
  const now = new Date();
  const nowIso = now.toISOString();

  // Check if future schedule slots exist and already include the v2 break-slot format
  const { data: existing } = await nativeDb
    .from("tg_tv_schedule")
    .select("*")
    .eq("channel_id", channelId)
    .gte("end_at", nowIso)
    .order("start_at", { ascending: true });

  const hasBreakSlots = Array.isArray(existing) && existing.some((r: any) => Boolean(r.is_break));
  if (existing && existing.length >= 10 && hasBreakSlots) {
    return; // Schedule already upgraded and active
  }

  const rows = generateScheduleRowsForChannel(channelId, now);

  // Replace stale/legacy rows for this channel
  await nativeDb.from("tg_tv_schedule").delete().eq("channel_id", channelId);
  await nativeDb.from("tg_tv_schedule").insert(rows);
}

/**
 * Get current live broadcast for selected channel (defaults to TG TV HD)
 */
export const getTGTVCurrent = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    return z.object({ channelId: z.string().optional() }).optional().parse(input ?? {});
  })
  .handler(async ({ data: input }): Promise<CurrentBroadcast> => {
    const channelId = ((input?.channelId as TGChannelId) || "tgtv-hd") as TGChannelId;
    const channelInfo = TG_CHANNELS.find((c) => c.id === channelId) || TG_CHANNELS[0];

    // Autonomously ensure the schedule is populated
    await ensureChannelSchedule(channelId);

    const { nativeDb } = await import("@/db/native-db");
    const now = new Date();
    const nowIso = now.toISOString();

    const { data } = await nativeDb
      .from("tg_tv_schedule")
      .select("*")
      .eq("channel_id", channelId)
      .lte("start_at", nowIso)
      .gte("end_at", nowIso)
      .order("start_at", { ascending: true })
      .limit(1);

    const row = (data || [])[0] as
      | {
          id: string;
          channel_id?: string;
          title: string;
          description: string | null;
          stream_url: string;
          backup_url?: string | null;
          poster_url: string | null;
          start_at: string;
          end_at: string;
          is_break?: boolean;
          break_trailers?: BreakTrailer[];
        }
      | undefined;

    if (!row) {
      return {
        channel: channelInfo,
        item: {
          id: `${channelId}-live`,
          channelId,
          title: `${channelInfo.name}`,
          description: channelInfo.description,
          streamUrl: channelInfo.fallbackStreamUrl,
          backupUrl: channelInfo.fallbackStreamUrl,
          posterUrl: "/assets/aistudio/Media_item_1_1bba30da.jpg",
          startAt: new Date(now.getTime() - 1800_000).toISOString(),
          endAt: new Date(now.getTime() + 5400_000).toISOString(),
        },
        offsetSeconds: 1800,
      };
    }

    const totalElapsedSec = Math.max(0, Math.floor((now.getTime() - new Date(row.start_at).getTime()) / 1000));
    let activeTitle = row.title;
    let activeDesc = row.description || undefined;
    let activeStreamUrl = row.stream_url;
    let activePosterUrl = row.poster_url || undefined;
    let effectiveOffset = totalElapsedSec;

    if (row.is_break && Array.isArray(row.break_trailers) && row.break_trailers.length > 0) {
      const idx = Math.min(row.break_trailers.length - 1, Math.floor(totalElapsedSec / 30));
      const tr = row.break_trailers[idx];
      activeTitle = `Reklam & Fragman Kuşağı · ${tr.title}`;
      activeDesc = `[${idx + 1}/${row.break_trailers.length}] ${tr.title} — Sıradaki program az sonra yayında.`;
      activeStreamUrl = tr.streamUrl;
      activePosterUrl = tr.posterUrl || activePosterUrl;
      effectiveOffset = totalElapsedSec % 30;
    }

    const { data: nextRows } = await nativeDb
      .from("tg_tv_schedule")
      .select("*")
      .eq("channel_id", channelId)
      .gte("start_at", row.end_at)
      .order("start_at", { ascending: true })
      .limit(1);

    const nextRow = (nextRows || [])[0] as typeof row | undefined;

    return {
      channel: channelInfo,
      item: {
        id: row.id,
        channelId,
        title: activeTitle,
        description: activeDesc,
        streamUrl: activeStreamUrl,
        backupUrl: row.backup_url || undefined,
        posterUrl: activePosterUrl,
        startAt: row.start_at,
        endAt: row.end_at,
        isBreak: Boolean(row.is_break),
        breakTrailers: row.break_trailers,
      },
      offsetSeconds: effectiveOffset,
      next: nextRow
        ? {
            id: nextRow.id,
            channelId,
            title: nextRow.title,
            description: nextRow.description || undefined,
            streamUrl: nextRow.stream_url,
            backupUrl: nextRow.backup_url || undefined,
            posterUrl: nextRow.poster_url || undefined,
            startAt: nextRow.start_at,
            endAt: nextRow.end_at,
            isBreak: Boolean(nextRow.is_break),
            breakTrailers: nextRow.break_trailers,
          }
        : undefined,
    };
  });

/**
 * Get full 24-hour schedule for the selected channel
 */
export const getTGTVSchedule = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    return z.object({ channelId: z.string().optional() }).optional().parse(input ?? {});
  })
  .handler(async ({ data: input }): Promise<TGTVItem[]> => {
    const channelId = ((input?.channelId as TGChannelId) || "tgtv-hd") as TGChannelId;
    await ensureChannelSchedule(channelId);

    const { nativeDb } = await import("@/db/native-db");
    const today = new Date();
    const start = new Date(today.getTime() - 2 * 3600_000).toISOString();
    const end = new Date(today.getTime() + 24 * 3600_000).toISOString();

    const { data } = await nativeDb
      .from("tg_tv_schedule")
      .select("*")
      .eq("channel_id", channelId)
      .gte("end_at", start)
      .lte("start_at", end)
      .order("start_at", { ascending: true });

    return ((data || []) as Array<{
      id: string;
      channel_id?: string;
      title: string;
      description: string | null;
      stream_url: string;
      backup_url?: string | null;
      poster_url: string | null;
      start_at: string;
      end_at: string;
      is_break?: boolean;
      break_trailers?: BreakTrailer[];
    }>).map((r) => ({
      id: r.id,
      channelId: r.channel_id || channelId,
      title: r.title,
      description: r.description || undefined,
      streamUrl: r.stream_url,
      backupUrl: r.backup_url || undefined,
      posterUrl: r.poster_url || undefined,
      startAt: r.start_at,
      endAt: r.end_at,
      isBreak: Boolean(r.is_break),
      breakTrailers: r.break_trailers,
    }));
  });

/**
 * Public/Admin manual trigger to force-refresh AI schedules for channels
 */
export const generateTGTVSchedule = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return z
      .object({
        channelId: z.string().optional(),
        hoursPerItem: z.number().min(0.5).max(4).default(1.5),
      })
      .optional()
      .parse(input ?? {});
  })
  .handler(async ({ data: input }) => {
    const { nativeDb } = await import("@/db/native-db");
    const channels = input?.channelId ? [input.channelId as TGChannelId] : TG_CHANNELS.map((c) => c.id);

    for (const ch of channels) {
      await nativeDb.from("tg_tv_schedule").delete().eq("channel_id", ch);
      await ensureChannelSchedule(ch);
    }

    return { refreshed: channels.length, success: true };
  });

export const getLiveEpgSchedule = createServerFn({ method: "GET" }).handler(async (): Promise<TGTVItem[]> => {
  const { nativeDb } = await import("@/db/native-db");
  const now = new Date();
  const start = new Date(now.getTime() - 2 * 3600_000).toISOString();
  const end = new Date(now.getTime() + 24 * 3600_000).toISOString();
  const { data } = await (nativeDb as any)
    .from("epg_programmes")
    .select("id,title,description,poster_url,start_at,end_at,stream_id,user_streams(source_url)")
    .gte("end_at", start)
    .lte("start_at", end)
    .order("start_at", { ascending: true })
    .limit(200);

  return ((data || []) as any[])
    .map((row) => ({
      id: row.id,
      channelId: "live",
      title: row.title,
      description: row.description || undefined,
      streamUrl: row.user_streams?.source_url || "",
      posterUrl: row.poster_url || undefined,
      startAt: row.start_at,
      endAt: row.end_at,
    }))
    .filter((row) => row.streamUrl);
});
