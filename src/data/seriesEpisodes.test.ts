import test from "node:test";
import assert from "node:assert/strict";
import { getEpisodesForSeries, SERIES_EPISODES } from "./seriesEpisodes";
import { TG_CHANNELS } from "../lib/tg-tv.functions";

test("TG TV has all 15 exclusive neon-branded channels configured across all categories", () => {
  assert.equal(TG_CHANNELS.length, 15);
  const ids = TG_CHANNELS.map((c) => c.id);
  assert.ok(ids.includes("tgtv-hd"));
  assert.ok(ids.includes("tgtv-sinema"));
  assert.ok(ids.includes("tgtv-sinema2"));
  assert.ok(ids.includes("tgtv-yesilcam"));
  assert.ok(ids.includes("tgtv-yerli"));
  assert.ok(ids.includes("tgtv-spor"));
  assert.ok(ids.includes("tgtv-eglence"));
  assert.ok(ids.includes("tgtv-cocuk"));
  assert.ok(ids.includes("tgtv-belgesel"));
  assert.ok(ids.includes("tgtv-muzik"));
  assert.ok(ids.includes("tgtv-haber"));
  assert.ok(ids.includes("tgtv-dini"));
  assert.ok(ids.includes("tgtv-yasam"));
  assert.ok(ids.includes("tgtv-yemek"));
  assert.ok(ids.includes("tgtv-oyun"));
});

test("Series episodes generator returns episodes for known and unknown series", () => {
  const arkaSokaklar = getEpisodesForSeries("tr-dizi-arka-sokaklar", "Arka Sokaklar");
  assert.ok(arkaSokaklar.length >= 3);
  assert.equal(arkaSokaklar[0].title, "680. Bölüm (Son Bölüm)");

  const kurtlarVadisi = getEpisodesForSeries("tr-dizi-kurtlar-vadisi", "Kurtlar Vadisi");
  assert.ok(kurtlarVadisi.length >= 3);
  assert.equal(kurtlarVadisi[0].title, "1. Bölüm: Bu Bir Mafya Dizisidir");

  const unknown = getEpisodesForSeries("some-random-series", "Rastgele Dizi");
  assert.equal(unknown.length, 5);
  assert.equal(unknown[0].title, "1. Bölüm (İlk Bölüm)");
  assert.ok(unknown[0].videoUrl.startsWith("http"));
});
