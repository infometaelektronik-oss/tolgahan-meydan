export interface SeriesEpisode {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationMinutes: number;
  airDate?: string;
}

export const SERIES_EPISODES: Record<string, SeriesEpisode[]> = {
  // Arka Sokaklar (Kanal D)
  "tr-dizi-arka-sokaklar": [
    {
      id: "as-680",
      seriesId: "tr-dizi-arka-sokaklar",
      seasonNumber: 19,
      episodeNumber: 680,
      title: "680. Bölüm (Son Bölüm)",
      description: "Rıza Baba ve ekibi İstanbul sokaklarındaki yeni tehlikeye karşı nefes kesen bir operasyon başlatır.",
      thumbnailUrl: "/assets/posters/tr-dizi-arka-sokaklar.jpg",
      videoUrl: "https://www.youtube.com/watch?v=XiA7cGKTZ7c",
      durationMinutes: 125,
      airDate: "2024",
    },
    {
      id: "as-679",
      seriesId: "tr-dizi-arka-sokaklar",
      seasonNumber: 19,
      episodeNumber: 679,
      title: "679. Bölüm",
      description: "Mesut ve Hüsnü Çoban kritik bir pusuya düşer, ekip teyakkuza geçer.",
      thumbnailUrl: "/assets/posters/tr-dizi-arka-sokaklar.jpg",
      videoUrl: "https://www.youtube.com/watch?v=XiA7cGKTZ7c",
      durationMinutes: 120,
      airDate: "2024",
    },
    {
      id: "as-1",
      seriesId: "tr-dizi-arka-sokaklar",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm (Efsane Başlangıç)",
      description: "Rıza Baba önderliğindeki özel asayiş ekibinin İstanbul'daki ilk büyük görevi.",
      thumbnailUrl: "/assets/posters/tr-dizi-arka-sokaklar.jpg",
      videoUrl: "https://www.youtube.com/watch?v=TBBRBD8Fudg",
      durationMinutes: 90,
      airDate: "2006",
    },
  ],

  // İnci Taneleri (Kanal D)
  "tr-dizi-inci-taneleri": [
    {
      id: "it-1",
      seriesId: "tr-dizi-inci-taneleri",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm (İlk Bölüm)",
      description: "Azem Yücedağ, yıllar sonra cezaevinden çıkar ve kaybettiği çocuklarının izini sürmeye başlar.",
      thumbnailUrl: "/assets/posters/tr-dizi-inci-taneleri.jpg",
      videoUrl: "https://www.youtube.com/watch?v=_WnhZhZGPLE",
      durationMinutes: 130,
      airDate: "2024",
    },
    {
      id: "it-2",
      seriesId: "tr-dizi-inci-taneleri",
      seasonNumber: 1,
      episodeNumber: 2,
      title: "2. Bölüm",
      description: "Azem ve Dilber'in yolları kesişir. Azem geçmişin karanlık sırlarıyla yüzleşir.",
      thumbnailUrl: "/assets/posters/tr-dizi-inci-taneleri.jpg",
      videoUrl: "https://www.youtube.com/watch?v=_WnhZhZGPLE",
      durationMinutes: 125,
      airDate: "2024",
    },
    {
      id: "it-17",
      seriesId: "tr-dizi-inci-taneleri",
      seasonNumber: 1,
      episodeNumber: 17,
      title: "17. Bölüm (Sezon Finali)",
      description: "Azem gerçeğe bir adım daha yaklaşır. Dilber ve Azem için karar anı gelmiştir.",
      thumbnailUrl: "/assets/posters/tr-dizi-inci-taneleri.jpg",
      videoUrl: "https://www.youtube.com/watch?v=_WnhZhZGPLE",
      durationMinutes: 135,
      airDate: "2024",
    },
  ],

  // Kurtlar Vadisi (Efsane 1-97)
  "tr-dizi-kurtlar-vadisi": [
    {
      id: "kv-1",
      seriesId: "tr-dizi-kurtlar-vadisi",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Bu Bir Mafya Dizisidir",
      description: "Ali Candan'ın yüzü değiştirilip Polat Alemdar kimliğiyle Vadiye ilk adımı.",
      thumbnailUrl: "/assets/posters/tr-dizi-kurtlar-vadisi.jpg",
      videoUrl: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
      durationMinutes: 75,
      airDate: "2003",
    },
    {
      id: "kv-2",
      seriesId: "tr-dizi-kurtlar-vadisi",
      seasonNumber: 1,
      episodeNumber: 2,
      title: "2. Bölüm: Kurtlar Sofrası",
      description: "Polat Alemdar, Süleyman Çakır ile tanışır ve vadi kuralları işlemeye başlar.",
      thumbnailUrl: "/assets/posters/tr-dizi-kurtlar-vadisi.jpg",
      videoUrl: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
      durationMinutes: 78,
      airDate: "2003",
    },
    {
      id: "kv-97",
      seriesId: "tr-dizi-kurtlar-vadisi",
      seasonNumber: 4,
      episodeNumber: 97,
      title: "97. Bölüm: Büyük Final",
      description: "Kurtlar Vadisi operasyonunun tarihi mahkeme ve unutulmaz büyük finali.",
      thumbnailUrl: "/assets/posters/tr-dizi-kurtlar-vadisi.jpg",
      videoUrl: "https://www.youtube.com/watch?v=DkAHxvoA2Q8",
      durationMinutes: 90,
      airDate: "2005",
    },
  ],

  // Ezel (Ay Yapım)
  "tr-dizi-ezel": [
    {
      id: "ezel-1",
      seriesId: "tr-dizi-ezel",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Her İhanet Sevgiyle Başlar",
      description: "Ömer'in ihanete uğrayışı, hapishanedeki dönüşümü ve Ezel Bayraktar olarak doğuşu.",
      thumbnailUrl: "/assets/posters/tr-dizi-ezel.jpg",
      videoUrl: "https://www.youtube.com/watch?v=FSo8aRocl9w",
      durationMinutes: 90,
      airDate: "2009",
    },
    {
      id: "ezel-2",
      seriesId: "tr-dizi-ezel",
      seasonNumber: 1,
      episodeNumber: 2,
      title: "2. Bölüm: Oyun Başlıyor",
      description: "Ezel kumarhanede Eyşan, Cengiz ve Ali'nin karşısına çıkar.",
      thumbnailUrl: "/assets/posters/tr-dizi-ezel.jpg",
      videoUrl: "https://www.youtube.com/watch?v=4tulyH8Y91Q",
      durationMinutes: 88,
      airDate: "2009",
    },
    {
      id: "ezel-71",
      seriesId: "tr-dizi-ezel",
      seasonNumber: 2,
      episodeNumber: 71,
      title: "71. Bölüm: Unutulmaz Final",
      description: "Ezel, Eyşan ve Ramiz Dayı efsanesinin tren istasyonundaki destansı sonu.",
      thumbnailUrl: "/assets/posters/tr-dizi-ezel.jpg",
      videoUrl: "https://www.youtube.com/watch?v=4tulyH8Y91Q",
      durationMinutes: 95,
      airDate: "2011",
    },
  ],

  // Çukur (Ay Yapım)
  "tr-dizi-cukur": [
    {
      id: "cukur-1",
      seriesId: "tr-dizi-cukur",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Çukur Evimiz, İdris Babamız",
      description: "Yamaç Koçovalı yıllar sonra mahalleye dönmek zorunda kalır.",
      thumbnailUrl: "/assets/posters/tr-dizi-cukur.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQIT3XjiOI4",
      durationMinutes: 120,
      airDate: "2017",
    },
    {
      id: "cukur-2",
      seriesId: "tr-dizi-cukur",
      seasonNumber: 1,
      episodeNumber: 2,
      title: "2. Bölüm: Vartolu'nun Saldırısı",
      description: "Vartolu Sadettin Çukur'un dengelerini alt üst etmeye kararlıdır.",
      thumbnailUrl: "/assets/posters/tr-dizi-cukur.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQIT3XjiOI4",
      durationMinutes: 125,
      airDate: "2017",
    },
  ],

  // İçerde (Ay Yapım)
  "tr-dizi-icerde": [
    {
      id: "icerde-1",
      seriesId: "tr-dizi-icerde",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Polis Okulu Mezuniyeti",
      description: "Sarp Yılmaz mezuniyette Yusuf Müdür'e silah çeker ve Kebapçı Celal'in yanına sızar.",
      thumbnailUrl: "/assets/posters/tr-dizi-icerde.jpg",
      videoUrl: "https://www.youtube.com/watch?v=g9ye2PbZzaQ",
      durationMinutes: 120,
      airDate: "2016",
    },
    {
      id: "icerde-39",
      seriesId: "tr-dizi-icerde",
      seasonNumber: 1,
      episodeNumber: 39,
      title: "39. Bölüm: Büyük Final",
      description: "İki kardeş Sarp ve Umut (Mert) birbirini bulur ve Kebapçı Celal ile son hesaplaşma yaşanır.",
      thumbnailUrl: "/assets/posters/tr-dizi-icerde.jpg",
      videoUrl: "https://www.youtube.com/watch?v=g9ye2PbZzaQ",
      durationMinutes: 135,
      airDate: "2017",
    },
  ],

  // Poyraz Karayel (Kanal D)
  "tr-dizi-poyraz-karayel": [
    {
      id: "pk-1",
      seriesId: "tr-dizi-poyraz-karayel",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Bir Mucize Olsun",
      description: "Eski polis Poyraz Karayel, oğlunu geri almak için mafya babası Bahri Umman'ın yanına sızar.",
      thumbnailUrl: "/assets/posters/tr-dizi-poyraz-karayel.jpg",
      videoUrl: "https://www.youtube.com/watch?v=TqJd3E9g_SM",
      durationMinutes: 120,
      airDate: "2015",
    },
  ],

  // Behzat Ç. (Star TV)
  "tr-dizi-behzat-c": [
    {
      id: "bc-1",
      seriesId: "tr-dizi-behzat-c",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Ankara Cinayet Büro",
      description: "Başkomiser Behzat Ç. ve cinayet büro ekibi Ankara'nın karanlık sokaklarındaki ilk dosyasını açar.",
      thumbnailUrl: "/assets/posters/tr-dizi-behzat-c.jpg",
      videoUrl: "https://www.youtube.com/watch?v=FjyoVZNJriM",
      durationMinutes: 90,
      airDate: "2010",
    },
  ],

  // Yalı Çapkını (Star TV)
  "tr-dizi-yali-capkini": [
    {
      id: "yc-1",
      seriesId: "tr-dizi-yali-capkini",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Yalıda Doğan Bir Aşk",
      description: "Ferit ve Seyran'ın Antep'ten İstanbul yalılarına uzanan fırtınalı evliliği başlar.",
      thumbnailUrl: "/assets/posters/tr-dizi-yali-capkini.jpg",
      videoUrl: "https://www.youtube.com/watch?v=VIBJ4yExWrM",
      durationMinutes: 130,
      airDate: "2022",
    },
  ],

  // Bahar (Show TV)
  "tr-dizi-bahar": [
    {
      id: "bahar-1",
      seriesId: "tr-dizi-bahar",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: Uyanmaya Hazır Mısın?",
      description: "Ölümden dönen Bahar, ailesinin ve eşinin gerçek yüzüyle yüzleşip doktorluk mesleğine geri döner.",
      thumbnailUrl: "/assets/posters/tr-dizi-bahar.jpg",
      videoUrl: "https://www.youtube.com/watch?v=RYzd3cGAsMU",
      durationMinutes: 130,
      airDate: "2024",
    },
  ],

  // Kızılcık Şerbeti (Show TV)
  "tr-dizi-kizilcik-serbeti": [
    {
      id: "ks-1",
      seriesId: "tr-dizi-kizilcik-serbeti",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm: İki Farklı Dünya",
      description: "Doğa ve Fatih'in aşkı, köklü ve farklı kültürdeki iki aileyi bir araya getirir.",
      thumbnailUrl: "/assets/posters/tr-dizi-kizilcik-serbeti.jpg",
      videoUrl: "https://www.youtube.com/watch?v=X_yBRarj8lE",
      durationMinutes: 130,
      airDate: "2022",
    },
  ],

  // Yargı (Kanal D - Ay Yapım)
  "tr-dizi-yargi": [
    {
      id: "yargi-1",
      seriesId: "tr-dizi-yargi",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm (4K - İlk Bölüm)",
      description: "Ilgaz Kaya ve Ceylin Erguvan bir cinayet vakasıyla bir araya gelir.",
      thumbnailUrl: "/assets/posters/tr-dizi-yargi.jpg",
      videoUrl: "https://www.youtube.com/watch?v=KqxAM9FNT-I",
      durationMinutes: 135,
      airDate: "2021",
    },
    {
      id: "yargi-2",
      seriesId: "tr-dizi-yargi",
      seasonNumber: 1,
      episodeNumber: 2,
      title: "2. Bölüm",
      description: "Çınar'ın şüpheli durumu Ilgaz ve Ceylin'i zorlu bir sınavın eşiğine getirir.",
      thumbnailUrl: "/assets/posters/tr-dizi-yargi.jpg",
      videoUrl: "https://www.youtube.com/watch?v=KqxAM9FNT-I",
      durationMinutes: 130,
      airDate: "2021",
    },
  ],

  // Kızıl Goncalar (NOW TV)
  "tr-dizi-kizil-goncalar": [
    {
      id: "kg-1",
      seriesId: "tr-dizi-kizil-goncalar",
      seasonNumber: 1,
      episodeNumber: 12,
      title: "12. Bölüm (Full HD)",
      description: "Meryem, Zeynep ve Levent Alkanlı'nın kesişen hayatlarında gerilim yükselir.",
      thumbnailUrl: "/assets/posters/tr-dizi-kizil-goncalar.jpg",
      videoUrl: "https://www.youtube.com/watch?v=N6F4BXhHQkY",
      durationMinutes: 135,
      airDate: "2024",
    },
  ],

  // Sana Söz (Star TV)
  "tr-dizi-sana-soz": [
    {
      id: "ss-1",
      seriesId: "tr-dizi-sana-soz",
      seasonNumber: 1,
      episodeNumber: 1,
      title: "1. Bölüm (İlk Bölüm)",
      description: "Cinayet Büro Amiri Ömer Duran ve program sunucusu Elif Karaca'nın adalet arayışı.",
      thumbnailUrl: "/assets/posters/tr-dizi-sana-soz.svg",
      videoUrl: "https://www.youtube.com/watch?v=jWHYXYZZmN4",
      durationMinutes: 125,
      airDate: "2021",
    },
  ],
};

function normalizeTrText(input: string): string {
  return input
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim();
}

export function getEpisodesForSeries(seriesId: string, seriesTitle: string, defaultVideoUrl?: string): SeriesEpisode[] {
  const cleanId = seriesId.replace(/^custom-/, "");
  if (SERIES_EPISODES[seriesId]) {
    return SERIES_EPISODES[seriesId];
  }
  if (SERIES_EPISODES[cleanId]) {
    return SERIES_EPISODES[cleanId];
  }

  // Also check normalized ID & Turkish diacritic matching
  const norm = normalizeTrText(seriesTitle);
  const normCleanId = normalizeTrText(cleanId).replace(/-/g, " ");
  for (const [key, eps] of Object.entries(SERIES_EPISODES)) {
    const k = normalizeTrText(key.replace(/^(tr-dizi-|series-|world-dizi-)/, "").replace(/-/g, " "));
    if ((norm && (norm.includes(k) || k.includes(norm))) || (normCleanId && normCleanId.includes(k))) {
      return eps;
    }
  }

  const fallbackThumb = "/assets/aistudio/Media_item_1_1bba30da.jpg";
  const safeVideoUrl = defaultVideoUrl || "https://www.youtube.com/watch?v=DkAHxvoA2Q8";

  return [1, 2, 3].map((epNum) => ({
    id: `${seriesId}-ep-${epNum}`,
    seriesId,
    seasonNumber: 1,
    episodeNumber: epNum,
    title: epNum === 1 ? `1. Bölüm (İlk Bölüm)` : `${epNum}. Bölüm`,
    description: `${seriesTitle} dizisinin heyecan dolu ${epNum}. bölümü.`,
    thumbnailUrl: fallbackThumb,
    videoUrl: safeVideoUrl,
    durationMinutes: 90 + epNum * 10,
    airDate: "2024",
  }));
}
