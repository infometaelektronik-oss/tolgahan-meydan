/**
 * Official and verified local logo directory for Turkish TV channels.
 * All core channels map to locally served crisp 3D SVG logos under `/assets/channel-logos/*.svg`
 * for 100% 200 OK offline/online reliability without external CDN breakage.
 */

const VERIFIED_LOGOS: { match: RegExp; logo: string }[] = [
  // 1. National Mainstream Top Channels
  { match: /^trt\s*1\b/i, logo: "/assets/channel-logos/trt-1.svg" },
  { match: /^atv(\s|$)/i, logo: "/assets/channel-logos/atv.svg" },
  { match: /^kanal\s*d\b/i, logo: "/assets/channel-logos/kanal-d.svg" },
  { match: /^euro\s*d\b/i, logo: "/assets/channel-logos/kanal-d.svg" },
  { match: /^star(\s*tv)?\b/i, logo: "/assets/channel-logos/star-tv.svg" },
  { match: /^show(\s*tv|\s*türk)?\b/i, logo: "/assets/channel-logos/show-tv.svg" },
  { match: /^beyaz(\s*tv)?\b/i, logo: "/assets/channel-logos/beyaz-tv.svg" },
  { match: /^tv\s*8\.5\b/i, logo: "/assets/channel-logos/tv85.svg" },
  { match: /^tv\s*8(\s*hd|\s*int|\b)/i, logo: "/assets/channel-logos/tv8.svg" },
  { match: /^(now|fox)(\s*tv)?\b/i, logo: "/assets/channel-logos/now-tv.svg" },
  { match: /^kanal\s*7\b/i, logo: "/assets/channel-logos/kanal-7.svg" },

  // 2. TRT Family
  { match: /^trt\s*2\b/i, logo: "/assets/channel-logos/trt-2.svg" },
  { match: /^trt\s*haber\b/i, logo: "/assets/channel-logos/trt-haber.svg" },
  { match: /^trt\s*spor\s*(yıldız|yildiz|2)\b/i, logo: "/assets/channel-logos/trt-spor-yildiz.svg" },
  { match: /^trt\s*spor\b/i, logo: "/assets/channel-logos/trt-spor.svg" },
  { match: /^trt\s*(çocuk|cocuk)\s*diyanet\b/i, logo: "/assets/channel-logos/trt-diyanet.svg" },
  { match: /^trt\s*(çocuk|cocuk)\b/i, logo: "/assets/channel-logos/trt-cocuk.svg" },
  { match: /^trt\s*diyanet(\s*(çocuk|cocuk))?\b/i, logo: "/assets/channel-logos/trt-diyanet.svg" },
  { match: /^diyanet\s*tv\b/i, logo: "/assets/channel-logos/trt-diyanet.svg" },
  { match: /^trt\s*belgesel\b/i, logo: "/assets/channel-logos/trt-belgesel.svg" },
  { match: /^trt\s*(müzik|muzik)\b/i, logo: "/assets/channel-logos/trt-muzik.svg" },
  { match: /^trt\s*(türk|turk)\b/i, logo: "/assets/channel-logos/trt-turk.svg" },
  { match: /^trt\s*avaz\b/i, logo: "/assets/channel-logos/trt-avaz.svg" },
  { match: /^trt\s*world\b/i, logo: "/assets/channel-logos/trt-world.svg" },
  { match: /^trt\s*arabi\b/i, logo: "/assets/channel-logos/trt-arabi.svg" },

  // 3. News & Economy Channels
  { match: /^ntv\b/i, logo: "/assets/channel-logos/ntv.svg" },
  { match: /^(haber\s*türk|haberturk)\b/i, logo: "/assets/channel-logos/haberturk.svg" },
  { match: /^cnn\s*(türk|turk)\b/i, logo: "/assets/channel-logos/cnn-turk.svg" },
  { match: /^(sözcü|sozcu|szc)\b/i, logo: "/assets/channel-logos/sozcu.svg" },
  { match: /^halk\s*tv\b/i, logo: "/assets/channel-logos/halk-tv.svg" },
  { match: /^tele\s*1\b/i, logo: "/assets/channel-logos/tele1.svg" },
  { match: /^tv\s*100\b/i, logo: "/assets/channel-logos/tv100.svg" },
  { match: /^haber\s*global\b/i, logo: "/assets/channel-logos/haber-global.svg" },
  { match: /^a\s*haber\b/i, logo: "/assets/channel-logos/a-haber.svg" },
  { match: /^tgrt\b/i, logo: "/assets/channel-logos/tgrt-haber.svg" },
  { match: /^(tv\s*24|24(\s*tv)?)\b/i, logo: "/assets/channel-logos/tv24.svg" },
  { match: /^(tv\s*360|360(\s*tv)?)\b/i, logo: "/assets/channel-logos/tv360.svg" },
  { match: /^(bengü\s*türk|benguturk)\b/i, logo: "/assets/channel-logos/bengu-turk.svg" },
  { match: /^flash\b/i, logo: "/assets/channel-logos/flash-haber.svg" },
  { match: /^(ekotürk|ekoturk)\b/i, logo: "/assets/channel-logos/ekoturk.svg" },
  { match: /^bloomberg\s*ht\b/i, logo: "/assets/channel-logos/bloomberg-ht.svg" },
  { match: /^(ülke|ulke)\s*tv\b/i, logo: "/assets/channel-logos/ulke-tv.svg" },
  { match: /^a\s*para\b/i, logo: "/assets/channel-logos/a-para.svg" },

  // 4. Entertainment & Thematic
  { match: /^teve\s*2\b/i, logo: "/assets/channel-logos/teve2.svg" },
  { match: /^a2(\s*tv)?\b/i, logo: "/assets/channel-logos/a2.svg" },
  { match: /^tlc\b/i, logo: "/assets/channel-logos/tlc.svg" },
  { match: /^dmax\b/i, logo: "/assets/channel-logos/dmax.svg" },
  { match: /^cnbc-?e\b/i, logo: "/assets/channel-logos/cnbc-e.svg" },
  { match: /^semerkand\b/i, logo: "/assets/channel-logos/semerkand.svg" },
  { match: /^dost(\s*tv)?\b/i, logo: "/assets/channel-logos/dost-tv.svg" },

  // 5. Sports
  { match: /^a\s*spor\b/i, logo: "/assets/channel-logos/a-spor.svg" },
  { match: /^ht\s*spor\b/i, logo: "/assets/channel-logos/ht-spor.svg" },
  { match: /^tivibu\s*spor\b/i, logo: "/assets/channel-logos/tivibu-spor.svg" },
  { match: /^s\s*sport(\s*2)?\b/i, logo: "/assets/channel-logos/s-sport.svg" },
  { match: /^fb\s*tv\b/i, logo: "/assets/channel-logos/fb-tv.svg" },
  { match: /^gs\s*tv\b/i, logo: "/assets/channel-logos/gs-tv.svg" },
  { match: /^bjk\s*tv\b/i, logo: "/assets/channel-logos/bjk-tv.svg" },
  { match: /^sports\s*tv\b/i, logo: "/assets/channel-logos/sports-tv.svg" },
  { match: /^tjk\s*tv\b/i, logo: "/assets/channel-logos/tjk-tv.svg" },

  // 6. Music
  { match: /^power\s*türk|^power\s*turk/i, logo: "/assets/channel-logos/powerturk.svg" },
  { match: /^power\s*(tv|love|dance)\b/i, logo: "/assets/channel-logos/power-tv.svg" },
  { match: /^kral(\s*tv|\s*pop)?\b/i, logo: "/assets/channel-logos/kral-tv.svg" },
  { match: /^(number\s*one|nr1)\b/i, logo: "/assets/channel-logos/nr1.svg" },
  { match: /^dream(\s*tv|\s*türk|\s*turk)?\b/i, logo: "/assets/channel-logos/dream-turk.svg" },

  // 7. Kids
  { match: /^minika\s*(çocuk|cocuk)\b/i, logo: "/assets/channel-logos/minika-cocuk.svg" },
  { match: /^minika\s*go\b/i, logo: "/assets/channel-logos/minika-go.svg" },
  { match: /^cartoon\s*network\b/i, logo: "/assets/channel-logos/cartoon-network.svg" },
  { match: /^zarok\b/i, logo: "/assets/channel-logos/zarok-tv.svg" },
];

const BROKEN_LOGO_DOMAINS = [
  "unsplash.com",
  "picsum.photos",
  "hostux.pics",
  "gia.tv",
  "tmsimg.com",
  "jiotv",
  "imgur.com",
  "wikimedia.org",
];

/**
 * Returns a verified local channel logo if available, or filters out dead/broken external logo hosts
 * so components render clean monogram badges instead of broken image icons.
 */
export function getChannelLogo(channelTitle: string, existingPoster?: string | null): string | null {
  const t = (channelTitle || "").trim().toLowerCase();

  // 1. Check verified national and thematic TV logos (all local 200 OK SVGs)
  for (const item of VERIFIED_LOGOS) {
    if (item.match.test(t)) {
      return item.logo;
    }
  }

  // 2. Keep valid existing poster only if it is NOT a known dead/generic image host or "NONE"
  if (existingPoster) {
    const lower = existingPoster.trim().toLowerCase();
    if (
      lower &&
      lower !== "none" &&
      !BROKEN_LOGO_DOMAINS.some((d) => lower.includes(d))
    ) {
      return existingPoster;
    }
  }

  return null;
}
