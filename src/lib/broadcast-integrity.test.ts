import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadStore } from "@/db/native-db";

test("Movie integrity: Every movie has a unique non-trailer stream URL and valid local poster", () => {
  const store = loadStore();
  const movies = store.user_streams.filter((s) => s.category === "Movies");
  assert.ok(movies.length >= 40, `Expected at least 40 movies, got ${movies.length}`);

  const urlMap = new Map<string, string[]>();
  const snippetRe = /fragman|trailer|teaser|\bkesit\b|\bklip\b/i;

  for (const m of movies) {
    assert.ok(!snippetRe.test(m.title), `Trailer/snippet leaked into Movies: ${m.title}`);
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

  // Foreign Cinema uses direct Archive.org MP4 streams (no geo/embed blocked YouTube links)
  const foreignMovies = movies.filter((m) => m.is_foreign);
  assert.ok(foreignMovies.length >= 15, `Expected at least 15 foreign movies, got ${foreignMovies.length}`);
  for (const fm of foreignMovies) {
    assert.ok(
      fm.source_url.includes("archive.org/download/") && fm.source_url.endsWith(".mp4"),
      `Foreign movie ${fm.title} should use verified Archive.org MP4, got ${fm.source_url}`
    );
  }
});

test("Live TV integrity: No misclassified foreign channels, no foreign Spor leaks, and no dead image hosts", () => {
  const store = loadStore();
  const live = store.user_streams.filter((s) => s.category === "Live TV");
  const turkishNational = live.filter((s) => !s.is_foreign && s.sub_category === "Ulusal");

  const foreignRegex = /star\s*(international|cinema|sinema|world)|pluto|cinemax|fox\s*(life|live\s*now)/i;
  for (const ch of turkishNational) {
    assert.ok(
      !foreignRegex.test(ch.title),
      `Foreign channel "${ch.title}" found in Turkish national TV`
    );
  }

  const foreignSporLeaks = live.filter((s) => s.is_foreign && s.sub_category === "Spor");
  assert.equal(foreignSporLeaks.length, 0, "Foreign Live TV must not remain under TR 'Spor' sub_category");

  const seenIds = new Set<string>();
  const dupIds: string[] = [];
  for (const item of store.user_streams) {
    if (seenIds.has(item.id)) dupIds.push(item.id);
    seenIds.add(item.id);
  }
  assert.equal(dupIds.length, 0, `Duplicate stream IDs found: ${JSON.stringify(dupIds)}`);

  const deadHostRe = /unsplash\.com|picsum\.photos|hostux\.net|gia\.tv|tmsimg\.com|jiotv\.com/i;
  for (const item of store.user_streams) {
    for (const url of [item.poster_url, item.logo_url, item.backdrop_url]) {
      if (url) {
        assert.ok(!deadHostRe.test(url), `Dead/external placeholder host in ${item.id}: ${url}`);
      }
    }
  }
});

test("Radio integrity: Clean audio stations only (no Italian visual TV streams) with local logos on disk", () => {
  const store = loadStore();
  const radios = store.user_streams.filter((s) => s.category === "Radio");
  assert.ok(radios.length >= 30, `Expected at least 30 verified radios, got ${radios.length}`);

  for (const r of radios) {
    assert.notEqual(r.sub_category, "Yabancı TV", `Visual TV channel leaked into Radio: ${r.title}`);
    assert.ok(!/rds\s*social|radiokisskiss\.tv|deejay\.it\/tv/i.test(r.title), `Visual TV stream leaked into Radio: ${r.title}`);
    const logo = r.logo_url || r.poster_url;
    assert.ok(logo && logo.startsWith("/assets/radio-logos/"), `Radio ${r.title} must use local radio logo, got ${logo}`);
    const absPath = path.join(process.cwd(), "public", logo.replace(/^\//, ""));
    assert.ok(fs.existsSync(absPath), `Radio logo missing on disk: ${absPath}`);
  }
});

test("Home rows integrity: Clean 6 digital platform titles without unwanted suffix words", () => {
  const store = loadStore();
  const rowTitles = store.home_rows.map((r) => r.title);
  for (const expected of ["Netflix", "HBO Max", "Tabii TV", "BluTV", "Disney+", "Gain"]) {
    assert.ok(rowTitles.includes(expected), `Expected exact home row title "${expected}", got ${JSON.stringify(rowTitles)}`);
  }
  const forbiddenRe = /başyapıtlar|orijinal yapımlar|orijinal dizileri|paralı yayınlar/i;
  for (const title of rowTitles) {
    assert.ok(!forbiddenRe.test(title), `Forbidden label phrase found in home row title: ${title}`);
  }
});

test("Turkish Channel Logos: Top national channels resolve to local verified SVGs on disk", async () => {
  const { getChannelLogo } = await import("./turkishChannelLogos");
  for (const name of ["TRT 1 HD", "ATV", "Kanal D", "Star TV", "Show TV", "Beyaz TV", "TV8", "NOW TV", "Kanal 7", "FOX TV"]) {
    const logo = getChannelLogo(name);
    assert.ok(logo && logo.startsWith("/assets/channel-logos/"), `Expected local SVG logo for ${name}, got ${logo}`);
    const absPath = path.join(process.cwd(), "public", logo.replace(/^\//, ""));
    assert.ok(fs.existsSync(absPath), `Channel logo SVG missing on disk: ${absPath}`);
  }
});
