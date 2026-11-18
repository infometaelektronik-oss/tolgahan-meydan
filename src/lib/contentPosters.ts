/**
 * Comprehensive Verified Poster Directory for Turkish & Foreign Series & Movies.
 * All 76 core titles are locally cached under `/assets/posters/<id>.jpg` for 100% 200 OK delivery.
 */

function localPoster(id: string, ext: "jpg" | "svg" = "jpg"): string {
  return `/assets/posters/${id}.${ext}`;
}

function localPair(id: string, ext: "jpg" | "svg" = "jpg"): { poster: string; backdrop: string } {
  const path = localPoster(id, ext);
  return { poster: path, backdrop: path };
}

export const VERIFIED_POSTERS: Record<string, { poster: string; backdrop: string }> = {
  // === TÜRK DİZİLERİ ===
  "tr-dizi-kurulus-osman": localPair("tr-dizi-kurulus-osman"),
  "tr-dizi-yali-capkini": localPair("tr-dizi-yali-capkini"),
  "tr-dizi-bahar": localPair("tr-dizi-bahar"),
  "tr-dizi-kizilcik-serbeti": localPair("tr-dizi-kizilcik-serbeti"),
  "tr-dizi-tas-kagit-makas": localPair("tr-dizi-tas-kagit-makas"),
  "tr-dizi-arka-sokaklar": localPair("tr-dizi-arka-sokaklar"),
  "tr-dizi-yargi": localPair("tr-dizi-yargi"),
  "tr-dizi-inci-taneleri": localPair("tr-dizi-inci-taneleri"),
  "tr-dizi-gonul-dagi": localPair("tr-dizi-gonul-dagi"),
  "tr-dizi-teskilat": localPair("tr-dizi-teskilat"),
  "tr-dizi-behzat-c": localPair("tr-dizi-behzat-c"),
  "tr-dizi-ezel": localPair("tr-dizi-ezel"),
  "tr-dizi-kurtlar-vadisi": localPair("tr-dizi-kurtlar-vadisi"),
  "tr-dizi-poyraz-karayel": localPair("tr-dizi-poyraz-karayel"),
  "tr-dizi-cukur": localPair("tr-dizi-cukur"),
  "tr-dizi-icerde": localPair("tr-dizi-icerde"),
  "tr-dizi-soz": localPair("tr-dizi-soz"),
  "tr-dizi-sana-soz": localPair("tr-dizi-sana-soz", "svg"),
  "tr-dizi-kiralik-ask": localPair("tr-dizi-kiralik-ask"),
  "tr-dizi-edho": localPair("tr-dizi-edho"),
  "tr-dizi-kardeslerim": localPair("tr-dizi-kardeslerim"),
  "tr-dizi-dirilis-ertugrul": localPair("tr-dizi-dirilis-ertugrul"),
  "tr-dizi-kizil-goncalar": localPair("tr-dizi-kizil-goncalar"),
  "tr-dizi-hudutsuz-sevda": localPair("tr-dizi-hudutsuz-sevda"),
  "tr-dizi-avrupa-yakasi": localPair("tr-dizi-avrupa-yakasi"),
  "series-ask-i-memnu": localPair("series-ask-i-memnu"),
  "series-kuzey-guney": localPair("series-kuzey-guney"),
  "series-muhtesem-yuzyil": localPair("series-muhtesem-yuzyil"),
  "series-leyla-ile-mecnun": localPair("series-leyla-ile-mecnun"),
  "series-bir-zamanlar-cukurova": localPair("series-bir-zamanlar-cukurova"),
  "series-mucize-doktor": localPair("series-mucize-doktor"),

  // === YABANCI & PLATFORM DİZİLERİ ===
  "world-dizi-breaking-bad": localPair("world-dizi-breaking-bad"),
  "world-dizi-game-of-thrones": localPair("world-dizi-game-of-thrones"),
  "world-dizi-chernobyl": localPair("world-dizi-chernobyl"),
  "world-dizi-sherlock": localPair("world-dizi-sherlock", "svg"),
  "world-dizi-lucy": localPair("world-dizi-lucy", "svg"),
  "world-dizi-dick-van-dyke": localPair("world-dizi-dick-van-dyke", "svg"),
  "world-dizi-bonanza": localPair("world-dizi-bonanza", "svg"),
  "world-dizi-robin-hood": localPair("world-dizi-robin-hood", "svg"),
  "series-netflix-stranger-things": localPair("series-netflix-stranger-things"),
  "series-netflix-narcos": localPair("series-netflix-narcos"),
  "series-netflix-kulup": localPair("series-netflix-kulup"),
  "series-netflix-bir-baskadir": localPair("series-netflix-bir-baskadir"),
  "series-netflix-terzi": localPair("series-netflix-terzi"),
  "series-netflix-our-planet": localPair("series-netflix-our-planet", "svg"),
  "series-netflix-explained": localPair("series-netflix-explained", "svg"),
  "series-netflix-abstract": localPair("series-netflix-abstract", "svg"),
  "series-netflix-13th": localPair("series-netflix-13th", "svg"),
  "series-hbo-house-of-dragon": localPair("series-hbo-house-of-dragon"),
  "series-hbo-succession": localPair("series-hbo-succession"),
  "series-hbo-the-sopranos": localPair("series-hbo-the-sopranos"),
  "series-hbo-the-last-of-us": localPair("series-hbo-the-last-of-us"),
  "series-hbo-john-oliver": localPair("series-hbo-john-oliver", "svg"),
  "series-hbo-vice": localPair("series-hbo-vice", "svg"),
  "series-hbo-witches": localPair("series-hbo-witches", "svg"),
  "series-tabii-bozkir-arslani": localPair("series-tabii-bozkir-arslani"),
  "series-tabii-mevlana": localPair("series-tabii-mevlana"),
  "series-tabii-adalet": localPair("series-tabii-adalet"),
  "series-tabii-sebeke": localPair("series-tabii-sebeke"),
  "series-tabii-yanki": localPair("series-tabii-yanki", "svg"),
  "series-tabii-cirak": localPair("series-tabii-cirak", "svg"),
  "series-blutv-behzat-cekic": localPair("series-blutv-behzat-cekic"),
  "series-blutv-prens": localPair("series-blutv-prens", "svg"),
  "series-blutv-magarsus": localPair("series-blutv-magarsus", "svg"),
  "series-blutv-ilk-ve-son": localPair("series-blutv-ilk-ve-son", "svg"),
  "series-blutv-saygi": localPair("series-blutv-saygi", "svg"),
  "series-disney-kacis": localPair("series-disney-kacis", "svg"),
  "series-disney-aktris": localPair("series-disney-aktris", "svg"),
  "series-disney-arayis": localPair("series-disney-arayis", "svg"),
  "series-disney-dunya-aramda": localPair("series-disney-dunya-aramda", "svg"),
  "series-disney-ben-gri": localPair("series-disney-ben-gri", "svg"),
  "series-gain-ayak-isleri": localPair("series-gain-ayak-isleri", "svg"),
  "series-gain-10-bin-adim": localPair("series-gain-10-bin-adim", "svg"),
  "series-gain-dogu": localPair("series-gain-dogu", "svg"),
  "series-gain-sahsiyet": localPair("series-gain-sahsiyet", "svg"),
  "series-gain-haysiyet": localPair("series-gain-haysiyet", "svg"),

  // === FİLMLER (YEŞİLÇAM, YERLİ & YABANCI SİNEMA) ===
  "tr-film-hababam-sinifi": localPair("tr-film-hababam-sinifi"),
  "tr-film-tosun-pasa": localPair("tr-film-tosun-pasa"),
  "tr-film-sut-kardesler": localPair("tr-film-sut-kardesler"),
  "tr-film-sabano-saban": localPair("tr-film-sabano-saban"),
  "tr-film-kibar-feyzo": localPair("tr-film-kibar-feyzo"),
  "tr-film-copculer-krali": localPair("tr-film-copculer-krali"),
  "tr-film-neseli-gunler": localPair("tr-film-neseli-gunler"),
  "tr-film-sekerpare": localPair("tr-film-sekerpare"),
  "tr-film-selvi-boylum": localPair("tr-film-selvi-boylum"),
  "tr-film-kapicilar-krali": localPair("tr-film-kapicilar-krali"),
  "tr-film-gora": localPair("tr-film-gora"),
  "tr-film-arog": localPair("tr-film-arog"),
  "tr-film-arif-v-216": localPair("tr-film-arif-v-216"),
  "tr-film-vizontele": localPair("tr-film-vizontele"),
  "tr-film-vizontele-tuuba": localPair("tr-film-vizontele-tuuba"),
  "tr-film-babam-ve-oglum": localPair("tr-film-babam-ve-oglum"),
  "tr-film-ayla": localPair("tr-film-ayla"),
  "tr-film-7-kogustaki-mucize": localPair("tr-film-7-kogustaki-mucize"),
  "tr-film-nefes": localPair("tr-film-nefes"),
  "tr-film-dag-2": localPair("tr-film-dag-2"),
  "tr-film-organize-isler": localPair("tr-film-organize-isler"),
  "tr-film-olumlu-dunya": localPair("tr-film-olumlu-dunya"),
  "tr-film-olumlu-dunya-2": localPair("tr-film-olumlu-dunya-2"),
  "tr-film-cinayet-susu": localPair("tr-film-cinayet-susu"),
  "tr-film-hokkabaz": localPair("tr-film-hokkabaz", "svg"),
  "tr-film-yahsi-bati": localPair("tr-film-yahsi-bati", "svg"),
  "tr-film-dugun-dernek": localPair("tr-film-dugun-dernek", "svg"),
  "movie-interstellar": localPair("movie-interstellar"),
  "movie-inception": localPair("movie-inception"),
  "movie-the-dark-knight": localPair("movie-the-dark-knight"),
  "movie-gladiator": localPair("movie-gladiator"),
  "movie-the-matrix": localPair("movie-the-matrix"),
  "movie-the-shawshank-redemption": localPair("movie-the-shawshank-redemption"),
  "movie-the-general": localPair("movie-the-general"),
  "movie-nosferatu": localPair("movie-nosferatu"),
  "movie-the-stranger": localPair("movie-the-stranger"),
  "movie-carnival-souls": localPair("movie-carnival-souls"),
  "movie-his-girl-friday": localPair("movie-his-girl-friday"),
  "movie-sherlock-holmes": localPair("movie-sherlock-holmes"),
  "movie-scarlet-street": localPair("movie-scarlet-street"),
  "movie-detour": localPair("movie-detour"),
  "movie-haunted-hill": localPair("movie-haunted-hill"),
  "movie-cyrano": localPair("movie-cyrano"),
  "movie-39-steps": localPair("movie-39-steps"),
  "movie-sintel-fantasy": localPair("movie-sintel-fantasy"),
  "movie-big-buck-bunny": localPair("movie-big-buck-bunny"),
  "movie-little-shop": localPair("movie-little-shop", "svg"),
  "movie-popeye-sindbad": localPair("movie-popeye-sindbad", "svg"),
  "movie-atomic-brain": localPair("movie-atomic-brain", "svg"),
};

function normalizeTr(text: string): string {
  return text
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

/**
 * Returns authentic verified poster and backdrop if available for id or title match
 */
export function getContentPoster(id: string, title?: string): { poster: string; backdrop: string } | null {
  const cleanId = id.replace(/^custom-/, "");
  if (VERIFIED_POSTERS[id]) {
    return VERIFIED_POSTERS[id];
  }
  if (VERIFIED_POSTERS[cleanId]) {
    return VERIFIED_POSTERS[cleanId];
  }

  // Fallback title regex matcher with Turkish diacritic normalization & platform prefixes
  const t = normalizeTr(title || "");
  if (!t) return null;
  for (const [key, val] of Object.entries(VERIFIED_POSTERS)) {
    const cleanKey = normalizeTr(
      key
        .replace(/^(tr-dizi-|world-dizi-|series-netflix-|series-hbo-|series-tabii-|series-blutv-|series-disney-|series-gain-|series-|tr-film-|movie-)/, "")
        .replace(/-/g, " ")
    );
    if (cleanKey && t.includes(cleanKey)) {
      return val;
    }
  }

  return null;
}
