import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type TGChannelId = "tgtv-hd" | "tgtv-sinema" | "tgtv-sinema2" | "tgtv-yerli" | "tgtv-spor" | "tgtv-eglence";

export interface TGChannelInfo {
  id: TGChannelId;
  name: string;
  badge: string;
  number: number;
  description: string;
  genre: string;
  color: string;
  fallbackStreamUrl: string;
}

export const TG_CHANNELS: TGChannelInfo[] = [
  {
    id: "tgtv-hd",
    name: "TG TV HD",
    badge: "GENEL KUŞAK",
    number: 101,
    description: "TG TV Özel Kuşak: En sevilen Türk filmleri, efsane yerli diziler ve şovlar.",
    genre: "Genel",
    color: "from-purple-600 to-indigo-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=ZvXzoYwm-GU",
  },
  {
    id: "tgtv-sinema",
    name: "TG TV SİNEMA",
    badge: "TÜRK SİNEMASI",
    number: 102,
    description: "7/24 Kesintisiz Türk Sineması, Yeşilçam klasikleri ve yerli gişe filmleri.",
    genre: "Türk Sineması",
    color: "from-amber-600 to-red-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=hf2-8MRPGu8",
  },
  {
    id: "tgtv-sinema2",
    name: "TG TV SİNEMA 2",
    badge: "YABANCI SİNEMA",
    number: 103,
    description: "7/24 Dünya ve Hollywood sineması başyapıtları, kült filmler ve gişe rekortmenleri.",
    genre: "Yabancı Sinema",
    color: "from-rose-600 to-red-800",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=Kb2cGTSMLYo",
  },
  {
    id: "tgtv-yerli",
    name: "TG TV YERLİ",
    badge: "YERLİ DİZİ",
    number: 104,
    description: "Kurtlar Vadisi, Ezel, Çukur, İçerde ve efsane Türk dizileri kuşağı.",
    genre: "Dizi & Nostalji",
    color: "from-blue-600 to-cyan-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
  },
  {
    id: "tgtv-spor",
    name: "TG TV SPOR",
    badge: "EFSANE MAÇLAR",
    number: 105,
    description: "Tarihi maçlar, Galatasaray UEFA Kupası zaferi, efsane derbiler ve yarış özetleri.",
    genre: "Spor",
    color: "from-emerald-600 to-teal-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=_pcWD8XLhPI",
  },
  {
    id: "tgtv-eglence",
    name: "TG TV EĞLENCE",
    badge: "TELEVİZYON PROGRAMLARI",
    number: 106,
    description: "Güldür Güldür Show, Çok Güzel Hareketler Bunlar, Beyaz Show ve gündüz kuşağı şovları.",
    genre: "Eğlence",
    color: "from-fuchsia-600 to-pink-600",
    fallbackStreamUrl: "https://www.youtube.com/watch?v=2CIzV5lraqk",
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
};

export type CurrentBroadcast = {
  channel: TGChannelInfo;
  item: TGTVItem;
  offsetSeconds: number;
  next?: TGTVItem;
} | null;

/**
 * Autonomously ensures a continuous 24-hour broadcast schedule exists for the channel
 */
async function ensureChannelSchedule(channelId: TGChannelId): Promise<void> {
  const { nativeDb } = await import("@/db/native-db");
  const now = new Date();
  const nowIso = now.toISOString();

  // Check if future schedule slots exist for this channel
  const { data: existing } = await nativeDb
    .from("tg_tv_schedule")
    .select("*")
    .eq("channel_id", channelId)
    .gte("end_at", nowIso)
    .order("start_at", { ascending: true });

  if (existing && existing.length >= 6) {
    return; // Schedule already active and sufficient
  }

  const channelInfo = TG_CHANNELS.find((c) => c.id === channelId) || TG_CHANNELS[0];
  const officialLogo = "/assets/aistudio/Media_item_1_1bba30da.jpg";

  let pool: Array<{
    title: string;
    description: string;
    stream_url: string;
    backup_url?: string;
    poster_url: string;
    durationHours: number;
  }> = [];

  if (channelId === "tgtv-sinema") {
    // 7/24 Türk ve Dünya Sineması (Hababam Sınıfı and Cinayet Süsü clearly separated)
    pool = [
      {
        title: "Hababam Sınıfı (Özel Gösterim)",
        description: "Rıfat Ilgaz'ın ölümsüz eseri: Mahmut Hoca, İnek Şaban, Güdük Necmi ve Damat Ferit.",
        stream_url: "https://www.youtube.com/watch?v=hf2-8MRPGu8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Tosun Paşa (4K Restorasyonlu)",
        description: "Hakiki Tosun Paşa Yeşil Vadi'de. Şener Şen, Kemal Sunal ve Adile Naşit kahkaha tufanı.",
        stream_url: "https://www.youtube.com/watch?v=ZvXzoYwm-GU",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "Cinayet Süsü (Yerli Polisiye Komedi)",
        description: "Ali Atay'ın yönettiği, gizemli bir seri katilin peşine düşen cinayet büro ekibinin macerası.",
        stream_url: "https://www.youtube.com/watch?v=l47A586g2XI",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Süt Kardeşler",
        description: "Gulyabani köşkte kol gezerken Şaban ve Ramazan'ın unutulmaz komedisi.",
        stream_url: "https://www.youtube.com/watch?v=KRy20M7uQM4",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "G.O.R.A. (Bilim Kurgu Başyapıtı)",
        description: "Cem Yılmaz klasiği: Halı tüccarı Arif'in uzay macerası.",
        stream_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
        poster_url: officialLogo,
        durationHours: 2.25,
      },
      {
        title: "Şabanoğlu Şaban",
        description: "Nazar Boncuğu hırsızının peşinde Şaban ve Ramazan'ın dedektiflik serüveni.",
        stream_url: "https://www.youtube.com/watch?v=ZDoLID8feBU",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "Ölümlü Dünya",
        description: "Nesillerdir kiralık katillik yapan Mermer Ailesi'nin örgütle olan nefes kesen komedisi.",
        stream_url: "https://www.youtube.com/watch?v=Kb2cGTSMLYo",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Neşeli Günler",
        description: "Kazım Efendi ve Saadet Hanım'ın turşu kavgası ve bir araya gelen aile.",
        stream_url: "https://www.youtube.com/watch?v=lxeKZU0VsyY",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "Şekerpare",
        description: "Ziver Bey ve Cumali'nin Osmanlı dönemindeki unutulmaz komedisi.",
        stream_url: "https://www.youtube.com/watch?v=Z36c3fDqvJY",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "Kibar Feyzo",
        description: "Maho Ağa ve Feyzo'nun unutulmaz köy ve hak arama mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=stOXnCPxOws",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
    ];
  } else if (channelId === "tgtv-sinema2") {
    // 7/24 Yabancı Sinema (World & Hollywood Cinema - strictly movies, no TV channels)
    pool = [
      {
        title: "Interstellar (Yıldızlararası)",
        description: "Christopher Nolan başyapıtı: İnsanlığın hayatta kalması için solucan deliğinden geçen astronotların destansı yolculuğu.",
        stream_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        poster_url: officialLogo,
        durationHours: 2.75,
      },
      {
        title: "Inception (Başlangıç)",
        description: "Rüya içinde rüya mimarisi ve bilinçaltı hırsızlığı. Leonardo DiCaprio başrolünde bir sinema klasiği.",
        stream_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        poster_url: officialLogo,
        durationHours: 2.5,
      },
      {
        title: "The Dark Knight (Kara Şövalye)",
        description: "Batman ve Joker'in Gotham sokaklarındaki efsanevi felsefi ve psikolojik mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
        poster_url: officialLogo,
        durationHours: 2.5,
      },
      {
        title: "Gladiator (Gladyatör)",
        description: "General Maximus Decimus Meridius'un Roma İmparatorluğu'na karşı başkaldırışı ve arenalardaki onur savaşı.",
        stream_url: "https://www.youtube.com/watch?v=owK1qxDselE",
        poster_url: officialLogo,
        durationHours: 2.5,
      },
      {
        title: "The Matrix (Matrix)",
        description: "Gerçek nedir? Neo'nun makinelerin simülasyonundan uyanışı ve insanlığın kurtuluş mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
        poster_url: officialLogo,
        durationHours: 2.25,
      },
      {
        title: "The Shawshank Redemption (Esaretin Bedeli)",
        description: "Andy Dufresne ve Red'in Shawshank hapishanesindeki umut, sabır ve dostluk destanı.",
        stream_url: "https://www.youtube.com/watch?v=PLl99DlL6b4",
        poster_url: officialLogo,
        durationHours: 2.25,
      },
    ];
  } else if (channelId === "tgtv-yerli") {
    // Pure Turkish Series & Nostalgic Cinema (No linear live TV)
    pool = [
      {
        title: "Kurtlar Vadisi: Efsane Kuşak",
        description: "Bu bir mafya dizisidir. Polat Alemdar ve Süleyman Çakır'ın Vadi'deki büyük savaşı.",
        stream_url: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Ezel: İntikam Başlıyor",
        description: "Her ihanet sevgiyle başlar. Ezel Bayraktar ve Ramiz Dayı efsanesi.",
        stream_url: "https://www.youtube.com/watch?v=FSo8aRocl9w",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Nostalji Kuşağı: Şekerpare",
        description: "Ziver Bey ve Cumali'nin Osmanlı dönemindeki unutulmaz komedisi.",
        stream_url: "https://www.youtube.com/watch?v=Z36c3fDqvJY",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "İçerde: Kardeşlerin Mücadelesi",
        description: "Sarp ve Mert'in Kebapçı Celal'in gölgesindeki nefes kesen mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=g9ye2PbZzaQ",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Çukur: Koçovalı Hanedanı",
        description: "Çukur evimiz, İdris babamız. Yamaç ve Vartolu'nun mahalleyi koruma mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=dQIT3XjiOI4",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Yeşilçam Nostalji: Neşeli Günler",
        description: "Kazım Efendi ve Saadet Hanım'ın turşu kavgası ve bir araya gelen aile.",
        stream_url: "https://www.youtube.com/watch?v=lxeKZU0VsyY",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "Poyraz Karayel Kuşağı",
        description: "Albayım ve Poyraz'ın unutulmaz replikleriyle efsane dizi kuşağı.",
        stream_url: "https://www.youtube.com/watch?v=TqJd3E9g_SM",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Arka Sokaklar Özel Kuşak",
        description: "Rıza Baba ve ekibinin İstanbul sokaklarındaki bitmeyen mücadelesi.",
        stream_url: "https://www.youtube.com/watch?v=TBBRBD8Fudg",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  } else if (channelId === "tgtv-spor") {
    // Actual Match Highlights & Sports Shows (UEFA, Süper Lig, F1)
    pool = [
      {
        title: "UEFA Kupası Galatasaray Zaferi Efsane Karşılaşma (17 Mayıs 2000)",
        description: "Galatasaray - Arsenal tarihi final karşılaşması, penaltılar ve kupa töreni.",
        stream_url: "https://www.youtube.com/watch?v=_pcWD8XLhPI",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "UEFA Şampiyonlar Ligi Efsane Finaller & Geniş Özetler",
        description: "Şampiyonlar Ligi tarihinin en heyecan verici final maçları ve golleri.",
        stream_url: "https://www.youtube.com/watch?v=_pcWD8XLhPI",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Süper Lig Derbileri Unutulmaz Maç Özetleri",
        description: "Fenerbahçe, Galatasaray, Beşiktaş ve Trabzonspor efsane derbi maç özetleri.",
        stream_url: "https://www.youtube.com/watch?v=_pcWD8XLhPI",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "Formula 1 İstanbul Park & Dünya Şampiyonası Özel",
        description: "F1 Türkiye GP unutulmaz yarış anları ve sezonun en iyi pit-stop mücadeleleri.",
        stream_url: "https://www.youtube.com/watch?v=_pcWD8XLhPI",
        poster_url: officialLogo,
        durationHours: 1.5,
      },
    ];
  } else if (channelId === "tgtv-eglence") {
    // Television Entertainment Shows, Morning/Evening Talk Shows
    pool = [
      {
        title: "Güldür Güldür Show: En İyi Skeçler Kuşağı",
        description: "Ali Sunal ve efsane kadrosundan haftanın en çok güldüren skeçleri.",
        stream_url: "https://www.youtube.com/watch?v=2CIzV5lraqk",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Çok Güzel Hareketler Bunlar Özel Kuşak",
        description: "Yılmaz Erdoğan yönetiminde BKM Mutfak ekibinin en sevilen bölümleri.",
        stream_url: "https://www.youtube.com/watch?v=2CIzV5lraqk",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Beyaz Show Nostalji & Kahkaha Programı",
        description: "Beyazıt Öztürk ile unutulmaz konuklar, skeçler ve eğlenceli sohbetler.",
        stream_url: "https://www.youtube.com/watch?v=2CIzV5lraqk",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Tolgshow & Arkadaşım Hoşgeldin Komedi Kuşağı",
        description: "Tolga Çevik ve Yönetmen'in doğaçlama kahkaha dolu sahne performansı.",
        stream_url: "https://www.youtube.com/watch?v=2CIzV5lraqk",
        poster_url: officialLogo,
        durationHours: 1.75,
      },
      {
        title: "Avrupa Yakası En Çok Güldüren Bölümler",
        description: "Burhan Altıntop, Aslı, Volkan ve Gaffur ile Nişantaşı komedisi.",
        stream_url: "https://www.youtube.com/watch?v=2CIzV5lraqk",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  } else {
    // TG TV HD (Flagship Channel)
    pool = [
      {
        title: "Türk Sineması: Tosun Paşa",
        description: "Yeşilçam komedi klasiği Kemal Sunal ve Şener Şen başrollerinde.",
        stream_url: "https://www.youtube.com/watch?v=ZvXzoYwm-GU",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Efsane Dizi: Kurtlar Vadisi",
        description: "Kurtlar Vadisi HD kalitesiyle TG TV HD ekranlarında.",
        stream_url: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Prime Time Sinema: G.O.R.A.",
        description: "Cem Yılmaz klasiği bilim kurgu komedi başyapıtı.",
        stream_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
        poster_url: officialLogo,
        durationHours: 2.25,
      },
      {
        title: "Gece Dizisi: İçerde",
        description: "Nefes kesen aksiyon ve polisiye.",
        stream_url: "https://www.youtube.com/watch?v=g9ye2PbZzaQ",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Gece Sineması: Hababam Sınıfı",
        description: "Efsane kadro Hababam Sınıfı.",
        stream_url: "https://www.youtube.com/watch?v=hf2-8MRPGu8",
        poster_url: officialLogo,
        durationHours: 2,
      },
      {
        title: "Sabah Eğlence Kuşağı: Güldür Güldür",
        description: "Güne kahkaha dolu skeçlerle başlayın.",
        stream_url: "https://www.youtube.com/watch?v=2CIzV5lraqk",
        poster_url: officialLogo,
        durationHours: 2,
      },
    ];
  }

  // Generate 24 hours of sequential slots starting from 2 hours ago
  const top = new Date(now.getTime() - 2 * 3600_000);
  top.setMinutes(0, 0, 0);
  let cursor = top.getTime();

  const rows: any[] = [];
  const targetEnd = now.getTime() + 48 * 3600_000;
  let idx = 0;

  while (cursor < targetEnd) {
    const it = pool[idx % pool.length];
    const durationMs = Math.round(it.durationHours * 3600_000);
    const startAt = new Date(cursor).toISOString();
    const endAt = new Date(cursor + durationMs).toISOString();

    rows.push({
      id: `${channelId}-${Date.now()}-${idx}`,
      channel_id: channelId,
      title: it.title,
      description: it.description,
      stream_url: it.stream_url,
      backup_url: it.backup_url,
      poster_url: it.poster_url,
      start_at: startAt,
      end_at: endAt,
      created_at: nowIso,
    });

    cursor += durationMs;
    idx++;
  }

  // Clear past outdated rows for this channel and insert new slots
  await nativeDb
    .from("tg_tv_schedule")
    .delete()
    .eq("channel_id", channelId)
    .lte("end_at", new Date(now.getTime() - 3600_000).toISOString());

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

    const offset = Math.max(0, Math.floor((now.getTime() - new Date(row.start_at).getTime()) / 1000));

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
        title: row.title,
        description: row.description || undefined,
        streamUrl: row.stream_url,
        backupUrl: row.backup_url || undefined,
        posterUrl: row.poster_url || undefined,
        startAt: row.start_at,
        endAt: row.end_at,
      },
      offsetSeconds: offset,
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
