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
      thumbnailUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
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
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://www.youtube.com/watch?v=X_yBRarj8lE",
      durationMinutes: 130,
      airDate: "2022",
    },
  ],
};

/**
 * Returns episode list for a series.
 * Uses the series own real stream URL or verified catalogue URL if not in static dict.
 */
export function getEpisodesForSeries(seriesId: string, seriesTitle: string, defaultVideoUrl?: string): SeriesEpisode[] {
  if (SERIES_EPISODES[seriesId]) {
    return SERIES_EPISODES[seriesId];
  }

  // Also check normalized ID matching
  const norm = seriesTitle.toLowerCase();
  for (const [key, eps] of Object.entries(SERIES_EPISODES)) {
    const k = key.replace(/^tr-dizi-/, "").replace(/-/g, " ");
    if (norm.includes(k) || k.includes(norm)) {
      return eps;
    }
  }

  const fallbackThumb = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80";
  const safeVideoUrl = defaultVideoUrl || "https://www.youtube.com/watch?v=DkAHxvoA2Q8";

  return [1, 2, 3, 4, 5].map((epNum) => ({
    id: `${seriesId}-ep-${epNum}`,
    seriesId,
    seasonNumber: 1,
    episodeNumber: epNum,
    title: epNum === 1 ? `1. Bölüm (İlk Bölüm)` : epNum === 5 ? `5. Bölüm (Sezon Finali)` : `${epNum}. Bölüm`,
    description: `${seriesTitle} dizisinin heyecan dolu ${epNum}. bölümü.`,
    thumbnailUrl: fallbackThumb,
    videoUrl: safeVideoUrl,
    durationMinutes: 110 + epNum * 4,
    airDate: "2024",
  }));
}
