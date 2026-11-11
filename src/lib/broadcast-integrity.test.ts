import test from "node:test";
import assert from "node:assert/strict";
import { loadStore } from "@/db/native-db";

test("Movie integrity: Every movie has a unique, dedicated stream URL", () => {
  const store = loadStore();
  const movies = store.user_streams.filter((s) => s.category === "Movies");
  assert.ok(movies.length >= 25, "Expected at least 25 movies");

  const urlMap = new Map<string, string[]>();
  for (const m of movies) {
    if (!urlMap.has(m.source_url)) urlMap.set(m.source_url, []);
    urlMap.get(m.source_url)!.push(m.title);
  }

  const duplicates = Array.from(urlMap.entries()).filter(([_, titles]) => titles.length > 1);
  assert.equal(
    duplicates.length,
    0,
    `Found duplicate movie URLs: ${JSON.stringify(duplicates)}`
  );

  // Explicit check for Süt Kardeşler vs Nefes: Vatan Sağolsun
  const sutKardesler = movies.find((m) => m.id === "tr-film-sut-kardesler");
  const nefes = movies.find((m) => m.id === "tr-film-nefes");
  assert.ok(sutKardesler, "Süt Kardeşler must exist");
  assert.ok(nefes, "Nefes Vatan Sağolsun must exist");
  assert.notEqual(
    sutKardesler.source_url,
    nefes.source_url,
    "Süt Kardeşler and Nefes Vatan Sağolsun must NOT share the same URL"
  );
});

test("Live TV integrity: Turkish channels do not contain misclassified foreign channels", () => {
  const store = loadStore();
  const turkishLive = store.user_streams.filter(
    (s) => s.category === "Live TV" && !s.is_foreign && s.sub_category === "Ulusal"
  );

  const foreignRegex = /star\s*(international|cinema|sinema|world)|pluto|cinemax|fox\s*(life|live\s*now)/i;
  for (const ch of turkishLive) {
    assert.ok(
      !foreignRegex.test(ch.title),
      `Foreign channel "${ch.title}" found in Turkish national TV`
    );
  }
});

test("Home rows integrity: Netflix, HBO, and Tabii platform rows exist", () => {
  const store = loadStore();
  const rowTitles = store.home_rows.map((r) => r.title);
  assert.ok(rowTitles.some((t) => t.includes("Netflix")), "Netflix home row must exist");
  assert.ok(rowTitles.some((t) => t.includes("HBO")), "HBO home row must exist");
  assert.ok(rowTitles.some((t) => t.includes("Tabii")), "Tabii home row must exist");
});

test("Turkish Channel Logos: Top national channels resolve to verified high-res logos", async () => {
  const { getChannelLogo } = await import("./turkishChannelLogos");
  assert.ok(getChannelLogo("TRT 1 HD"), "TRT 1 should have verified logo");
  assert.ok(getChannelLogo("ATV"), "ATV should have verified logo");
  assert.ok(getChannelLogo("Kanal D"), "Kanal D should have verified logo");
  assert.ok(getChannelLogo("Star TV"), "Star TV should have verified logo");
  assert.ok(getChannelLogo("Show TV"), "Show TV should have verified logo");
  assert.ok(getChannelLogo("Beyaz TV"), "Beyaz TV should have verified logo");
  assert.ok(getChannelLogo("TV8"), "TV8 should have verified logo");
  assert.ok(getChannelLogo("NOW TV"), "NOW TV should have verified logo");
  assert.ok(getChannelLogo("Kanal 7"), "Kanal 7 should have verified logo");
  assert.ok(getChannelLogo("FOX TV"), "FOX TV should resolve to NOW logo");
});

