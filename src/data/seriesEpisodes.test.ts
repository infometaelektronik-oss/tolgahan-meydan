import test from "node:test";
import assert from "node:assert/strict";
import { getEpisodesForSeries, SERIES_EPISODES } from "./seriesEpisodes";
import { TG_CHANNELS } from "../lib/tg-tv.functions";

test("TG TV has all 5 Digiturk-style channels configured", () => {
  assert.equal(TG_CHANNELS.length, 5);
  const ids = TG_CHANNELS.map((c) => c.id);
  assert.ok(ids.includes("tgtv-hd"));
  assert.ok(ids.includes("tgtv-sinema"));
  assert.ok(ids.includes("tgtv-yerli"));
  assert.ok(ids.includes("tgtv-spor"));
  assert.ok(ids.includes("tgtv-eglence"));
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
