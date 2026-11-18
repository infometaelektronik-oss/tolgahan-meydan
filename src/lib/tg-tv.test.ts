import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadStore } from "@/db/native-db";
import { getContentPoster } from "@/lib/contentPosters";
import { getEpisodesForSeries } from "@/data/seriesEpisodes";
import {
  BREAK_DURATION_MS,
  KIDS_BREAK_POOL,
  TG_CHANNELS,
  generateScheduleRowsForChannel,
  getChannelPool,
  getTGTVChannelAnimation,
} from "@/lib/tg-tv.functions";

test("Poster integrity: All Series & Movies resolve to valid local posters on disk (including custom- IDs)", () => {
  const store = loadStore();
  const vodItems = store.user_streams.filter(
    (s) => s.category === "Series" || s.category === "Movies"
  );
  assert.ok(vodItems.length >= 80, `Expected at least 80 VOD items, got ${vodItems.length}`);

  for (const item of vodItems) {
    const resolved = getContentPoster(item.id, item.title);
    assert.ok(resolved, `Missing poster mapping for ${item.id} (${item.title})`);
    assert.ok(
      resolved.poster.startsWith("/assets/posters/"),
      `Expected local poster asset for ${item.id}, got ${resolved.poster}`
    );

    const resolvedCustom = getContentPoster(`custom-${item.id}`, item.title);
    assert.equal(resolvedCustom?.poster, resolved.poster, `custom- prefix must resolve identically for ${item.id}`);

    const absPath = path.join(process.cwd(), "public", resolved.poster.replace(/^\//, ""));
    assert.ok(fs.existsSync(absPath), `Poster file missing on disk: ${absPath}`);
    const stat = fs.statSync(absPath);
    assert.ok(stat.size > 300, `Poster file appears corrupt/too small (${stat.size}B): ${absPath}`);
  }
});

test("Episode lookup: custom- prefix and Turkish characters resolve real series episodes", () => {
  const ezelEps = getEpisodesForSeries("custom-tr-dizi-ezel", "Ezel (Tüm Bölümler)");
  assert.ok(ezelEps.length >= 2, "Expected real Ezel episodes");
  assert.ok(
    ezelEps.some((e) => !e.title.includes("Genel Yayın") && /ezel|ramiz|ömer|intikam|ihanet/i.test(`${e.title} ${e.description}`)),
    `Expected authentic Ezel episode metadata, got: ${JSON.stringify(ezelEps[0])}`
  );

  const ksEps = getEpisodesForSeries("custom-tr-dizi-kizilcik-serbeti", "Kızılcık Şerbeti");
  assert.ok(ksEps.length >= 1, "Expected real Kızılcık Şerbeti episodes");
  assert.equal(ksEps[0].seriesId, "tr-dizi-kizilcik-serbeti");
});

test("TG TV Channels: 15 channels use original -orig.png logos, distinct animations, and clean genre separation", () => {
  assert.equal(TG_CHANNELS.length, 15, "Expected 15 TG TV channels");

  const animSet = new Set<string>();
  for (const ch of TG_CHANNELS) {
    assert.ok(ch.logoUrl.endsWith("-orig.png"), `Channel ${ch.id} must use original -orig.png logo, got ${ch.logoUrl}`);
    const logoPath = path.join(process.cwd(), "public", ch.logoUrl.replace(/^\//, ""));
    assert.ok(fs.existsSync(logoPath), `TG TV logo missing on disk: ${logoPath}`);

    const animClass = getTGTVChannelAnimation(ch.id);
    assert.ok(animClass.startsWith("tgtv-anim-"), `Invalid animation class for ${ch.id}: ${animClass}`);
    animSet.add(animClass);

    const pool = getChannelPool(ch.id);
    assert.ok(pool.length >= 4, `Channel ${ch.id} should have at least 4 programs`);

    const urls = pool.map((p) => p.stream_url);
    for (const u of urls) {
      assert.ok(!u.includes("dQw4w9WgXcQ"), `Placeholder Rickroll found in ${ch.id}`);
      assert.ok(!u.includes("tele1-live.ercdn.net"), `Dead tele1 URL found in ${ch.id}`);
    }
    const uniqueUrls = new Set(urls);
    assert.equal(
      uniqueUrls.size,
      urls.length,
      `Duplicate stream URLs found inside channel ${ch.id}`
    );
  }

  assert.equal(animSet.size, 15, "All 15 TG TV channels must have distinct animations");

  const yerliSinemaTitles = getChannelPool("tgtv-sinema2").map((p) => p.title.toLowerCase());
  for (const t of yerliSinemaTitles) {
    assert.ok(!/interstellar|inception|matrix|gladiator|shawshank|dark knight/.test(t), `Foreign movie found in tgtv-sinema2: ${t}`);
    assert.ok(!/hababam|tosun paşa|süt kardeşler|kibar feyzo/.test(t), `Yeşilçam movie found in tgtv-sinema2: ${t}`);
  }

  // Eğlence kanalı sadece TV programları / yarışma / gündüz kuşağı içermeli, dizi değil
  const eglenceTitles = getChannelPool("tgtv-eglence").map((p) => p.title.toLowerCase());
  for (const t of eglenceTitles) {
    assert.ok(!/kurtlar vadisi|ezel|çukur|yalı çapkını|kızılcık şerbeti|bahar|inci taneleri/.test(t), `TV series found in tgtv-eglence: ${t}`);
  }
});

test("TG TV Schedule: Inserts contiguous 2-minute Reklam & Fragman breaks and kid-safe breaks for Çocuk", () => {
  const baseNow = new Date("2026-04-01T12:15:00.000Z");
  const rows = generateScheduleRowsForChannel("tgtv-sinema2", baseNow);
  assert.ok(rows.length >= 10, "Expected generated schedule rows");

  const breakRows = rows.filter((r) => r.is_break === true);
  assert.ok(breakRows.length >= 4, "Expected 2-minute break slots between programs");

  for (let i = 0; i < rows.length - 1; i++) {
    assert.equal(
      rows[i + 1].start_at,
      rows[i].end_at,
      `Schedule gap/overlap between ${rows[i].id} and ${rows[i + 1].id}`
    );
  }

  for (const br of breakRows) {
    const dur = new Date(br.end_at).getTime() - new Date(br.start_at).getTime();
    assert.equal(dur, BREAK_DURATION_MS, "Break slot must be exactly 2 minutes (120000 ms)");
    assert.equal(br.title, "Reklam & Fragman Kuşağı");
    assert.ok(Array.isArray(br.break_trailers) && br.break_trailers.length === 4, "Each break must carry 4 trailers");
    for (const tr of br.break_trailers) {
      assert.equal(tr.durationSeconds, 30, "Each break trailer must be 30 seconds");
      assert.ok(tr.streamUrl.startsWith("https://"), "Trailer must have valid streamUrl");
    }
  }

  // TG TV Çocuk must use KIDS_BREAK_POOL exclusively for breaks
  const kidsRows = generateScheduleRowsForChannel("tgtv-cocuk", baseNow);
  const kidsBreakRows = kidsRows.filter((r) => r.is_break === true);
  const kidUrls = new Set(KIDS_BREAK_POOL.map((k) => k.streamUrl));
  assert.ok(kidsBreakRows.length >= 4, "Expected kids break rows");
  for (const br of kidsBreakRows) {
    for (const tr of br.break_trailers) {
      assert.ok(kidUrls.has(tr.streamUrl), `Non-kid trailer ${tr.title} leaked into tgtv-cocuk break`);
    }
  }
});
