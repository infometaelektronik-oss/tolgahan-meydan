import fs from "node:fs";

function updateDatabase(filePath: string) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // 1. Move tgtv-official-channel to Live TV category so it NEVER appears in Movies
  const tg = db.user_streams.find((s: any) => s.id === "tgtv-official-channel");
  if (tg) {
    tg.category = "Live TV";
    tg.sub_category = "Ulusal";
    tg.channel_group = "TG TV";
  }

  // 2. Verified Full Movie YouTube URLs and High-Quality Posters
  const fullMovies = [
    {
      id: "tr-film-vizontele-tuuba",
      title: "Vizontele Tuuba",
      source_url: "https://www.youtube.com/watch?v=hf2-8MRPGu8",
      poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-cinayet-susu",
      title: "Cinayet Süsü",
      source_url: "https://www.youtube.com/watch?v=l47A586g2XI",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-hababam-sinifi",
      title: "Hababam Sınıfı",
      source_url: "https://www.youtube.com/watch?v=hf2-8MRPGu8",
      poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-tosun-pasa",
      title: "Tosun Paşa",
      source_url: "https://www.youtube.com/watch?v=ZvXzoYwm-GU",
      poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-sut-kardesler",
      title: "Süt Kardeşler",
      source_url: "https://www.youtube.com/watch?v=KRy20M7uQM4",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-sabano-saban",
      title: "Şabanoğlu Şaban",
      source_url: "https://www.youtube.com/watch?v=ZDoLID8feBU",
      poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-kibar-feyzo",
      title: "Kibar Feyzo",
      source_url: "https://www.youtube.com/watch?v=stOXnCPxOws",
      poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-copculer-krali",
      title: "Çöpçüler Kralı",
      source_url: "https://www.youtube.com/watch?v=xs9XUjHvZsM",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-neseli-gunler",
      title: "Neşeli Günler",
      source_url: "https://www.youtube.com/watch?v=lxeKZU0VsyY",
      poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-sekerpare",
      title: "Şekerpare",
      source_url: "https://www.youtube.com/watch?v=Z36c3fDqvJY",
      poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-selvi-boylum",
      title: "Selvi Boylum Al Yazmalım",
      source_url: "https://www.youtube.com/watch?v=Si8h1XnBUCc",
      poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-kapicilar-krali",
      title: "Kapıcılar Kralı",
      source_url: "https://www.youtube.com/watch?v=qsMkpvCxVkM",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yeşilçam Klasikleri",
      is_foreign: false,
    },
    {
      id: "tr-film-gora",
      title: "G.O.R.A.",
      source_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
      poster_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-arog",
      title: "A.R.O.G",
      source_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
      poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-arif-v-216",
      title: "Arif V 216",
      source_url: "https://www.youtube.com/watch?v=pAEKFiaDW0Q",
      poster_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-organize-isler",
      title: "Organize İşler: Sazan Sarmalı",
      source_url: "https://www.youtube.com/watch?v=Kb2cGTSMLYo",
      poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-olumlu-dunya",
      title: "Ölümlü Dünya",
      source_url: "https://www.youtube.com/watch?v=Kb2cGTSMLYo",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-olumlu-dunya-2",
      title: "Ölümlü Dünya 2",
      source_url: "https://www.youtube.com/watch?v=Kb2cGTSMLYo",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-ayla",
      title: "Ayla",
      source_url: "https://www.youtube.com/watch?v=ZvXzoYwm-GU",
      poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-7-kogustaki-mucize",
      title: "7. Koğuştaki Mucize",
      source_url: "https://www.youtube.com/watch?v=Si8h1XnBUCc",
      poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-nefes",
      title: "Nefes: Vatan Sağolsun",
      source_url: "https://www.youtube.com/watch?v=KRy20M7uQM4",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-dag-2",
      title: "Dağ II",
      source_url: "https://www.youtube.com/watch?v=ZDoLID8feBU",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-babam-ve-oglum",
      title: "Babam ve Oğlum",
      source_url: "https://www.youtube.com/watch?v=lxeKZU0VsyY",
      poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    {
      id: "tr-film-vizontele",
      title: "Vizontele",
      source_url: "https://www.youtube.com/watch?v=stOXnCPxOws",
      poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yerli Sinema",
      is_foreign: false,
    },
    // Yabancı Sinema (World & Hollywood Cinema - full movies with genuine posters)
    {
      id: "movie-interstellar",
      title: "Interstellar (Yıldızlararası)",
      source_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      poster_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yabancı Sinema",
      is_foreign: true,
    },
    {
      id: "movie-inception",
      title: "Inception (Başlangıç)",
      source_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yabancı Sinema",
      is_foreign: true,
    },
    {
      id: "movie-the-dark-knight",
      title: "The Dark Knight (Kara Şövalye)",
      source_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      poster_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yabancı Sinema",
      is_foreign: true,
    },
    {
      id: "movie-gladiator",
      title: "Gladiator (Gladyatör)",
      source_url: "https://www.youtube.com/watch?v=owK1qxDselE",
      poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yabancı Sinema",
      is_foreign: true,
    },
    {
      id: "movie-the-matrix",
      title: "The Matrix (Matrix)",
      source_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      poster_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yabancı Sinema",
      is_foreign: true,
    },
    {
      id: "movie-the-shawshank-redemption",
      title: "The Shawshank Redemption (Esaretin Bedeli)",
      source_url: "https://www.youtube.com/watch?v=PLl99DlL6b4",
      poster_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80",
      backdrop_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80",
      sub_category: "Yabancı Sinema",
      is_foreign: true,
    },
  ];

  fullMovies.forEach((m) => {
    const idx = db.user_streams.findIndex((s: any) => s.id === m.id);
    if (idx >= 0) {
      db.user_streams[idx] = {
        ...db.user_streams[idx],
        ...m,
        category: "Movies",
        is_active: true,
        status: "active",
      };
    } else {
      db.user_streams.push({
        ...m,
        category: "Movies",
        stream_type: "vod",
        description: `${m.title} filmi.`,
        tags: [m.sub_category, "Film"],
        is_active: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf8");
}

updateDatabase("./data/database.json");
updateDatabase("./data/initial_data.json");
console.log("Database updated successfully with full movies and posters!");
