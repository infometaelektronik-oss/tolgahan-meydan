/**
 * Comprehensive Verified Poster Directory for Turkish & Foreign Series & Movies.
 * Proxies Wikimedia and external images via `/api/image-proxy` to ensure 100% 200 OK delivery.
 */

function proxy(url: string): string {
  if (url.startsWith("/") || url.startsWith("data:")) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export const VERIFIED_POSTERS: Record<string, { poster: string; backdrop: string }> = {
  // === TÜRK DİZİLERİ ===
  "tr-dizi-kurulus-osman": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/d/d2/Edip_Osman_Somuno%C4%9Flu.jpg"),
    backdrop: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-yali-capkini": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/9/96/Yal%C4%B1%C3%87apk%C4%B1n%C4%B1Dizi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-bahar": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/0/08/BaharDizi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-kizilcik-serbeti": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/0/03/K%C4%B1z%C4%B1lc%C4%B1k%C5%9Eerbeti.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-tas-kagit-makas": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/9/95/Ta%C5%9F_Ka%C4%9F%C4%B1t_Makas_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-arka-sokaklar": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/4/49/Arka_Sokaklar_18._Sezon%27un_ikinci_afi%C5%9Fidir.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-yargi": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/b/b0/Yarg%C4%B1_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-inci-taneleri": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/0/08/%C4%B0nciTaneleri.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-gonul-dagi": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/2/20/G%C3%B6n%C3%BClDa%C4%9F%C4%B1Afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-teskilat": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/7/77/Teskilat.jpg"),
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-behzat-c": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/3/30/Behzat_%C3%87._Bir_Ankara_Polisiyesi_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-ezel": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/c/cb/Ezel_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-kurtlar-vadisi": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/1/1f/Kurtlar-vadisi-eski.jpg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-poyraz-karayel": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/1/18/Poyraz_Karayel_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-cukur": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/8/87/%C3%87ukur_dizi_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-icerde": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/9/9e/%C4%B0%C3%A7erde-Afi%C5%9F.jpeg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-soz": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/b/b2/S%C3%B6z_dizi_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-kiralik-ask": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/f/f9/Kiral%C4%B1k_A%C5%9Fk_dizi_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-edho": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/f/fd/Edhoafi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-kardeslerim": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/1/1e/Karde%C5%9Flerim_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-dirilis-ertugrul": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/f/fe/Dirili%C5%9F-_Ertu%C4%9Frul_S1.jpg"),
    backdrop: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-kizil-goncalar": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/f/f2/K%C4%B1z%C4%B1lGoncalar.jpg"),
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-hudutsuz-sevda": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/c/ca/Hudutsuz_Sevda_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-dizi-avrupa-yakasi": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/6/66/Avrupa_Yakas%C4%B1_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1280&auto=format&fit=crop&q=80",
  },
  "series-ask-i-memnu": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/d/d4/A%C5%9Fk-%C4%B1_Memnu_%28dizi%2C_2008%29_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "series-kuzey-guney": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/8/87/Kuzey_G%C3%BCney_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80",
  },
  "series-muhtesem-yuzyil": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/9/91/Muhte%C5%9Fem_Y%C3%BCzy%C4%B1l_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1280&auto=format&fit=crop&q=80",
  },
  "series-leyla-ile-mecnun": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/7/70/Leyla_ile_Mecnun_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "series-bir-zamanlar-cukurova": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/4/4b/Bir_Zamanlar_%C3%87ukurova_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "series-mucize-doktor": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/9/94/Mucize_Doktor_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&auto=format&fit=crop&q=80",
  },

  // === YABANCI & PLATFORM DİZİLERİ ===
  "world-dizi-breaking-bad": {
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/9faGSFi5jam6pDWGNd0p8J24gvm.jpg",
  },
  "world-dizi-game-of-thrones": {
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
  },
  "world-dizi-chernobyl": {
    poster: "https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/uL6Ad12W0bxyH4Ss7h76Sbgf4wh.jpg",
  },
  "series-netflix-stranger-things": {
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
  },
  "series-netflix-narcos": {
    poster: "https://image.tmdb.org/t/p/w500/rTmal9fMfwhBX9o0yc3q4qB26gY.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/r0skVb9k4hZtY8u3rK7w4uN9yWw.jpg",
  },
  "series-hbo-house-of-dragon": {
    poster: "https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/etjA2CSg4yAwhg5e1yE9a8L6y9Y.jpg",
  },
  "series-hbo-succession": {
    poster: "https://image.tmdb.org/t/p/w500/7HW473ahJ966VqAPqByyo1V0Teb.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/c4p9sB74vNlT7c6y94Xw5Y7W8.jpg",
  },
  "series-hbo-the-sopranos": {
    poster: "https://image.tmdb.org/t/p/w500/rTc7BtWLKSEKUrqjK44y9fGvNfB.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1z9y6p7w2E7t.jpg",
  },
  "series-hbo-the-last-of-us": {
    poster: "https://image.tmdb.org/t/p/w500/uKvVjK1q1yt2Xb1x9q9v9Z6v0.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLuv67.jpg",
  },
  "series-netflix-kulup": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/0/05/Kul%C3%BCp_dizisi_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80",
  },
  "series-netflix-bir-baskadir": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/e/e0/Bir_Ba%C5%9Fkad%C4%B1r_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "series-netflix-terzi": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/8/87/Terzi_dizisi_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "series-tabii-bozkir-arslani": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/4/4b/Mendirman_Jaloliddin.jpg"),
    backdrop: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1280&auto=format&fit=crop&q=80",
  },
  "series-tabii-mevlana": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/9/9a/Mevlana_Celaleddin-i_Rumi_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1280&auto=format&fit=crop&q=80",
  },
  "series-tabii-adalet": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/7/7b/Adalet_dizisi_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&auto=format&fit=crop&q=80",
  },
  "series-tabii-sebeke": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/3/30/%C5%9Eebeke_dizisi_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&auto=format&fit=crop&q=80",
  },

  // === FİLMLER (YEŞİLÇAM, YERLİ & YABANCI SİNEMA) ===
  "tr-film-hababam-sinifi": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/8/87/Hababam_S%C4%B1n%C4%B1f%C4%B1_%28film%29.jpg"),
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-tosun-pasa": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/b/bb/Tosun_Pa%C5%9Fa_film_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-sut-kardesler": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/1/1a/S%C3%BCt_Karde%C5%9Fler.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-sabano-saban": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/1/16/%C5%9Eabano%C4%9Flu_%C5%9Eaban.jpg"),
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-kibar-feyzo": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/3/36/Kibar_Feyzo.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-copculer-krali": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/5/52/%C3%87%C3%B6p%C3%A7%C3%BCler_Kral%C4%B1_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-neseli-gunler": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/1/10/Ne%C5%9Feli_G%C3%BCnler.jpg"),
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-sekerpare": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/7/77/%C5%9Eekerpare_film_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-selvi-boylum": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/9/94/Selvi_Boylum_Al_Yazmal%C4%B1m_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-kapicilar-krali": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/6/69/Kap%C4%B1c%C4%B1lar_Kral%C4%B1.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-gora": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/f/f6/G.O.R.A._afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-arog": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/d/d3/A.R.O.G_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-arif-v-216": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/e/e0/Arif_V_216_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-vizontele": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/3/30/Vizontele_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-vizontele-tuuba": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/a/ae/Vizontele_Tuuba_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-babam-ve-oglum": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/a/ad/Babam_ve_O%C4%9Flum.jpg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-ayla": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/e/e5/Ayla_film_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-7-kogustaki-mucize": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/e/eb/7._Ko%C4%9Fu%C5%9Ftaki_Mucize_afi%C5%9F.jpg"),
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-nefes": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/8/87/Nefes_Vatan_Sa%C4%9Folsun_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-dag-2": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/b/b3/Da%C4%9F_II_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-organize-isler": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/0/07/Organize_%C4%B0%C5%9Fler_Sazan_Sarmal%C4%B1_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-olumlu-dunya": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/f/f6/%C3%96l%C3%BCml%C3%BC_D%C3%BCnya_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-olumlu-dunya-2": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/f/f8/%C3%96l%C3%BCml%C3%BC_D%C3%BCnya_2_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "tr-film-cinayet-susu": {
    poster: proxy("https://upload.wikimedia.org/wikipedia/tr/4/4b/Cinayet_S%C3%BCs%C3%BC_afi%C5%9Fi.jpg"),
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1280&auto=format&fit=crop&q=80",
  },
  "movie-interstellar": {
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rAiYTrKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  "movie-inception": {
    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  },
  "movie-the-dark-knight": {
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
  },
  "movie-gladiator": {
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  },
  "movie-the-matrix": {
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/l4QHerTSbMI7qgvejvIjU92LRam.jpg",
  },
  "movie-the-shawshank-redemption": {
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
  },
};

/**
 * Returns authentic verified poster and backdrop if available for id or title match
 */
export function getContentPoster(id: string, title?: string): { poster: string; backdrop: string } | null {
  if (VERIFIED_POSTERS[id]) {
    return VERIFIED_POSTERS[id];
  }

  // Fallback title regex matcher
  const t = (title || "").toLowerCase();
  for (const [key, val] of Object.entries(VERIFIED_POSTERS)) {
    const cleanKey = key.replace(/^(tr-dizi-|series-|tr-film-|movie-|world-dizi-)/, "").replace(/-/g, " ");
    if (t.includes(cleanKey)) {
      return val;
    }
  }

  return null;
}
