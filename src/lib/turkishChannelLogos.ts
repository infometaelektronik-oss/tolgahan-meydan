/**
 * Official and verified local logo directory for Turkish TV channels.
 * All core channels map to locally cached official broadcaster logos under `/assets/channel-logos/*`
 * for 100% 200 OK offline/online reliability without external CDN breakage.
 */

const VERIFIED_LOGOS: { match: RegExp; logo: string }[] = [
  // 1. National Mainstream Top Channels
  { match: /^trt\s*1\b/i, logo: "/assets/channel-logos/trt-1.png" },
  { match: /^atv(\s+(avrupa|alanya|hd|t[uü]rkiye))?(\s*[\(\[]|\s*$)/i, logo: "/assets/channel-logos/atv.png" },
  { match: /^kanal\s*d\b/i, logo: "/assets/channel-logos/kanal-d.png" },
  { match: /^euro\s*d\b/i, logo: "/assets/channel-logos/kanal-d.png" },
  { match: /^star(\s*(tv|hd|avrupa))?(\s*[\(\[]|\s*$)/i, logo: "/assets/channel-logos/star-tv.png" },
  { match: /^show(\s*(tv|t[uü]rk|max|hd))?(\s*[\(\[]|\s*$)/i, logo: "/assets/channel-logos/show-tv.png" },
  { match: /^beyaz(\s*tv)?\b/i, logo: "/assets/channel-logos/beyaz-tv.png" },
  { match: /^tv\s*8\.5\b/i, logo: "/assets/channel-logos/tv85.png" },
  { match: /^tv\s*8(\s*hd|\s*int|\b)/i, logo: "/assets/channel-logos/tv8.png" },
  { match: /^(now|fox)(\s*(tv|hd|[sş]imdi))?(\s*[\(\[]|\s*$)/i, logo: "/assets/channel-logos/now-tv.png" },
  { match: /^kanal\s*7\b/i, logo: "/assets/channel-logos/kanal-7.png" },

  // 2. TRT Family
  { match: /^trt\s*2\b/i, logo: "/assets/channel-logos/trt-2.png" },
  { match: /^trt\s*haber\b/i, logo: "/assets/channel-logos/trt-haber.png" },
  { match: /^trt\s*spor\s*(yıldız|yildiz|2)\b/i, logo: "/assets/channel-logos/trt-spor-yildiz.png" },
  { match: /^trt\s*spor\b/i, logo: "/assets/channel-logos/trt-spor.png" },
  { match: /^trt\s*(çocuk|cocuk)\s*diyanet\b/i, logo: "/assets/channel-logos/trt-diyanet.png" },
  { match: /^trt\s*(çocuk|cocuk)\b/i, logo: "/assets/channel-logos/trt-cocuk.png" },
  { match: /^trt\s*diyanet(\s*(çocuk|cocuk))?\b/i, logo: "/assets/channel-logos/trt-diyanet.png" },
  { match: /^diyanet\s*tv\b/i, logo: "/assets/channel-logos/trt-diyanet.png" },
  { match: /^trt\s*belgesel\b/i, logo: "/assets/channel-logos/trt-belgesel.png" },
  { match: /^trt\s*(müzik|muzik)\b/i, logo: "/assets/channel-logos/trt-muzik.png" },
  { match: /^trt\s*(türk|turk)\b/i, logo: "/assets/channel-logos/trt-turk.png" },
  { match: /^trt\s*avaz\b/i, logo: "/assets/channel-logos/trt-avaz.png" },
  { match: /^trt\s*world\b/i, logo: "/assets/channel-logos/trt-world.png" },
  { match: /^trt\s*arabi\b/i, logo: "/assets/channel-logos/trt-arabi.png" },
  { match: /^trt\s*(kurd[iî]|6)\b/i, logo: "/assets/channel-logos/trt-kurdi.png" },

  // 3. News & Economy Channels
  { match: /^ntv\b/i, logo: "/assets/channel-logos/ntv.png" },
  { match: /^(haber\s*t[uü]rk|habert[uü]rk)\b/i, logo: "/assets/channel-logos/haberturk.png" },
  { match: /^cnn\s*(türk|turk)\b/i, logo: "/assets/channel-logos/cnn-turk.png" },
  { match: /^(sözcü|sozcu|szc)\b/i, logo: "/assets/channel-logos/sozcu.png" },
  { match: /^halk\s*tv\b/i, logo: "/assets/channel-logos/halk-tv.png" },
  { match: /^tele\s*1\b/i, logo: "/assets/channel-logos/tele1.png" },
  { match: /^tv\s*100\b/i, logo: "/assets/channel-logos/tv100.png" },
  { match: /^haber\s*global\b/i, logo: "/assets/channel-logos/haber-global.png" },
  { match: /^a\s*haber\b/i, logo: "/assets/channel-logos/a-haber.png" },
  { match: /^tgrt\b/i, logo: "/assets/channel-logos/tgrt-haber.png" },
  { match: /^(tv\s*24|24(\s*tv)?)\b/i, logo: "/assets/channel-logos/tv24.png" },
  { match: /^(tv\s*360|360(\s*tv)?)\b/i, logo: "/assets/channel-logos/tv360.png" },
  { match: /^(bengü\s*türk|benguturk)\b/i, logo: "/assets/channel-logos/bengu-turk.png" },
  { match: /^flash\b/i, logo: "/assets/channel-logos/flash-haber.png" },
  { match: /^(ekotürk|ekoturk)\b/i, logo: "/assets/channel-logos/ekoturk.png" },
  { match: /^bloomberg\s*ht\b/i, logo: "/assets/channel-logos/bloomberg-ht.png" },
  { match: /^(ülke|ulke)\s*tv\b/i, logo: "/assets/channel-logos/ulke-tv.png" },
  { match: /^a\s*para\b/i, logo: "/assets/channel-logos/a-para.png" },

  // 4. Entertainment & Thematic
  { match: /^teve\s*2\b/i, logo: "/assets/channel-logos/teve2.png" },
  { match: /^a2(\s*tv)?\b/i, logo: "/assets/channel-logos/a2.png" },
  { match: /^tlc\b/i, logo: "/assets/channel-logos/tlc.png" },
  { match: /^dmax\b/i, logo: "/assets/channel-logos/dmax.png" },
  { match: /^cnbc-?e\b/i, logo: "/assets/channel-logos/cnbc-e.png" },
  { match: /^semerkand\b/i, logo: "/assets/channel-logos/semerkand.png" },
  { match: /^dost(\s*tv)?\b/i, logo: "/assets/channel-logos/dost-tv.jpg" },

  // 5. Sports
  { match: /^a\s*spor\b/i, logo: "/assets/channel-logos/a-spor.png" },
  { match: /^ht\s*spor\b/i, logo: "/assets/channel-logos/ht-spor.png" },
  { match: /^tivibu\s*spor\b/i, logo: "/assets/channel-logos/tivibu-spor.png" },
  { match: /^s\s*sport(\s*2)?\b/i, logo: "/assets/channel-logos/s-sport.png" },
  { match: /^fb\s*tv\b/i, logo: "/assets/channel-logos/fb-tv.png" },
  { match: /^gs\s*tv\b/i, logo: "/assets/channel-logos/gs-tv.png" },
  { match: /^bjk\s*tv\b/i, logo: "/assets/channel-logos/bjk-tv.jpg" },
  { match: /^sports\s*tv\b/i, logo: "/assets/channel-logos/sports-tv.png" },
  { match: /^tjk\s*tv\b/i, logo: "/assets/channel-logos/tjk-tv.png" },

  // 6. Music
  { match: /^power\s*türk|^power\s*turk/i, logo: "/assets/channel-logos/powerturk.png" },
  { match: /^power\s*(tv|love|dance)\b/i, logo: "/assets/channel-logos/power-tv.png" },
  { match: /^kral(\s*tv|\s*pop)?\b/i, logo: "/assets/channel-logos/kral-tv.png" },
  { match: /^number\s*(one|1)\s*damar\b/i, logo: "/assets/channel-logos/nr1-damar.png" },
  { match: /^number\s*(one|1)\s*dance\b/i, logo: "/assets/channel-logos/nr1-dance.png" },
  { match: /^number\s*(one|1)\s*(aşk|ask)\b/i, logo: "/assets/channel-logos/nr1-ask.png" },
  { match: /^(number\s*(one|1)|nr1)\b/i, logo: "/assets/channel-logos/nr1.png" },
  { match: /^dream(\s*tv|\s*türk|\s*turk)?\b/i, logo: "/assets/channel-logos/dream-turk.png" },

  // 7. Kids & Education
  { match: /^minika\s*(çocuk|cocuk)\b/i, logo: "/assets/channel-logos/minika-cocuk.png" },
  { match: /^minika\s*go\b/i, logo: "/assets/channel-logos/minika-go.png" },
  { match: /^cartoon\s*network\b/i, logo: "/assets/channel-logos/cartoon-network.png" },
  { match: /^zarok\b/i, logo: "/assets/channel-logos/zarok-tv.png" },
  { match: /^trt\s*eba\s*ilkokul\b/i, logo: "/assets/channel-logos/eba-tv-ilkokul.png" },
  { match: /^trt\s*eba\s*ortaokul\b/i, logo: "/assets/channel-logos/eba-tv-ortaokul.png" },
  { match: /^trt\s*eba\s*lise\b/i, logo: "/assets/channel-logos/eba-tv-lise.png" },
  { match: /^trt\s*3\b/i, logo: "/assets/channel-logos/trt-3.png" },

  // 8. Regional & Extra Turkish Broadcasters
  { match: /^vav\s*tv\b/i, logo: "/assets/channel-logos/vav-tv.png" },
  { match: /^aksu\s*tv\b/i, logo: "/assets/channel-logos/aksu-tv.png" },
  { match: /^edessa\s*tv\b/i, logo: "/assets/channel-logos/edessa-tv.png" },
  { match: /^kanal\s*15\b/i, logo: "/assets/channel-logos/kanal-15.png" },
  { match: /^kanal\s*58\b/i, logo: "/assets/channel-logos/kanal-58.png" },
  { match: /^laleg[uü]l\s*tv\b/i, logo: "/assets/channel-logos/lalegul-tv.png" },
  { match: /^mercan\s*tv\b/i, logo: "/assets/channel-logos/mercan-tv.png" },
  { match: /^tv\s*264\b/i, logo: "/assets/channel-logos/tv264.png" },
  { match: /^kanal\s*3\b/i, logo: "/assets/channel-logos/kanal-3.png" },
  { match: /^kanal\s*v\b/i, logo: "/assets/channel-logos/kanal-v.png" },
  { match: /^kocaeli\s*tv\b/i, logo: "/assets/channel-logos/kocaeli-tv.png" },
  { match: /^yol\s*tv\b/i, logo: "/assets/channel-logos/yol-tv.png" },
  { match: /^kanal\s*23\b/i, logo: "/assets/channel-logos/kanal-23.png" },
  { match: /^tv\s*den\b/i, logo: "/assets/channel-logos/tv-den.png" },
  { match: /^tivi\s*6\b/i, logo: "/assets/channel-logos/tivi6.png" },
  { match: /^kanal\s*26\b/i, logo: "/assets/channel-logos/kanal-26.png" },
  { match: /^es\s*tv\b/i, logo: "/assets/channel-logos/es-tv.png" },
  { match: /^brtv\b/i, logo: "/assets/channel-logos/brtv.png" },
  { match: /^kanal\s*f[iı]rat\b/i, logo: "/assets/channel-logos/kanal-firat.png" },
  { match: /^tempo\s*tv\b/i, logo: "/assets/channel-logos/tempo-tv.png" },
  { match: /^diyar\s*tv\b/i, logo: "/assets/channel-logos/diyar-tv.png" },
  { match: /^mavi\s*karadeniz\b|^mavikaradeniz\b/i, logo: "/assets/channel-logos/mavi-karadeniz.png" },
  { match: /^[çc]ift[çc]i\s*tv\b/i, logo: "/assets/channel-logos/ciftci-tv.png" },

  // 9. Global EPG Channels
];

const GLOBAL_VERIFIED_LOGOS: { match: RegExp; logo: string }[] = [
  { match: /^bbc\s*(world\s*)?news\b/i, logo: "/assets/channel-logos/bbc-news.png" },
  { match: /^cnn\s*international\b/i, logo: "/assets/channel-logos/cnn-int.png" },
  { match: /^euronews\b/i, logo: "/assets/channel-logos/euronews.png" },
  { match: /^(deutsche\s*welle|dw(\s*tv|\s*news|\s*\(dw\))?)\b/i, logo: "/assets/channel-logos/dw-tv.png" },
];

const BROKEN_LOGO_DOMAINS = [
  "imgur.com",
  "kablowebtv.com",
  "unsplash.com",
  "picsum.photos",
  "hostux.pics",
  "gia.tv",
  "tmsimg.com",
  "jiotv",
  "static.wikia.nocookie.net",
];

/**
 * Returns a verified local channel logo if available, or filters out known dead/geo-blocked hosts
 * (including imgur.com which serves region-block placeholders in UK) so valid external broadcaster logos render cleanly.
 * When `isForeign` is true, Turkish local broadcaster rules are skipped so foreign channels never show Turkish logos.
 */
export function getChannelLogo(channelTitle: string, existingPoster?: string | null, isForeign?: boolean): string | null {
  const t = (channelTitle || "").trim().toLowerCase();

  // 1. Check global EPG channels (apply cleanly regardless of origin)
  for (const item of GLOBAL_VERIFIED_LOGOS) {
    if (item.match.test(t)) {
      return item.logo;
    }
  }

  // 2. Check verified Turkish national & thematic TV logos (only for Turkish channels)
  if (!isForeign) {
    for (const item of VERIFIED_LOGOS) {
      if (item.match.test(t)) {
        return item.logo;
      }
    }
  }

  // 3. Keep valid existing poster only if it is NOT a known dead placeholder host or "NONE"
  if (existingPoster) {
    const lower = existingPoster.trim().toLowerCase();
    if (
      lower &&
      lower !== "none" &&
      !BROKEN_LOGO_DOMAINS.some((d) => lower.includes(d)) &&
      !(isForeign && lower.includes("/assets/channel-logos/"))
    ) {
      return existingPoster;
    }
  }

  return null;
}
