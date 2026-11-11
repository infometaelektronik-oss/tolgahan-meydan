/**
 * Official and verified logo directory for Turkish TV channels
 * Maps messy titles, technical suffixes, or missing posters to verified transparent channel logos.
 */

const VERIFIED_LOGOS: { match: RegExp; logo: string }[] = [
  // 1. National Mainstream Top Channels
  { match: /^trt\s*1\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/TRT_1_logo_%282021-%29.svg/960px-TRT_1_logo_%282021-%29.svg.png" },
  { match: /^atv\b/i, logo: "https://i.imgur.com/HyVUwFC.png" },
  { match: /^kanal\s*d\b/i, logo: "https://i.imgur.com/9o1atM6.png" },
  { match: /^star(\s*tv)?\b/i, logo: "https://i.imgur.com/9O3DHRB.png" },
  { match: /^show(\s*tv)?\b/i, logo: "https://i.imgur.com/1l7SCCu.png" },
  { match: /^beyaz(\s*tv)?\b/i, logo: "https://i.imgur.com/uykIdML.png" },
  { match: /^tv8(\.5|\s*hd)?$/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/6/68/Tv8_Yeni_Logo.png/960px-Tv8_Yeni_Logo.png" },
  { match: /^(now|fox)(\s*tv)?\b/i, logo: "https://i.imgur.com/5EYjWK7.png" },
  { match: /^kanal\s*7\b/i, logo: "https://i.imgur.com/0gq9xOm.png" },

  // 2. TRT Family
  { match: /^trt\s*2\b/i, logo: "https://i.imgur.com/iOCQdyD.png" },
  { match: /^trt\s*haber\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/TRT_Haber_Eyl%C3%BCl_2020_Logo.svg/960px-TRT_Haber_Eyl%C3%BCl_2020_Logo.svg.png" },
  { match: /^trt\s*spor(\s*yıldız)?\b/i, logo: "https://i.imgur.com/6tv0zxh.png" },
  { match: /^trt\s*çocuk\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/TRT_%C3%87ocuk_logo_%282021%29.svg/960px-TRT_%C3%87ocuk_logo_%282021%29.svg.png" },
  { match: /^trt\s*belgesel\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/3/30/TRT_Belgesel_logo_%282020%29.svg/960px-TRT_Belgesel_logo_%282020%29.svg.png" },
  { match: /^trt\s*müzik\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/TRT_M%C3%BCzik_logosu_%282021%29.svg/960px-TRT_M%C3%BCzik_logosu_%282021%29.svg.png" },
  { match: /^trt\s*türk\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/TRT_T%C3%BCrk_logo_%282021%29.svg/960px-TRT_T%C3%BCrk_logo_%282021%29.svg.png" },
  { match: /^trt\s*avaz\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/TRT_Avaz_logo_%282021%29.svg/960px-TRT_Avaz_logo_%282021%29.svg.png" },
  { match: /^trt\s*diyanet\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/4/4e/Diyanet_TV_logosu.png/800px-Diyanet_TV_logosu.png" },
  { match: /^trt\s*world\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/TRT_World_logo.svg/960px-TRT_World_logo.svg.png" },
  { match: /^trt\s*arabi\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TRT_Arabi_logo_%282021%29.svg/960px-TRT_Arabi_logo_%282021%29.svg.png" },

  // 3. News Channels
  { match: /^ntv\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/NTV_%28Turkey%29_logo.svg/960px-NTV_%28Turkey%29_logo.svg.png" },
  { match: /^haber\s*türk\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Habert%C3%BCrk_TV_logosu.svg/800px-Habert%C3%BCrk_TV_logosu.svg.png" },
  { match: /^cnn\s*türk\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/CNN_T%C3%BCrk_logo.svg/960px-CNN_T%C3%BCrk_logo.svg.png" },
  { match: /^(sözcü|szc)\b/i, logo: "https://i.imgur.com/BxpdvsG.png" },
  { match: /^halk\s*tv\b/i, logo: "https://i.imgur.com/xM0HA30.png" },
  { match: /^tele1\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/4/43/Tele1_logosu.png" },
  { match: /^tv100\b/i, logo: "https://i.imgur.com/yUvdP8x.png" },
  { match: /^haber\s*global\b/i, logo: "https://i.imgur.com/m2Uqg3M.png" },
  { match: /^a\s*haber\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Ahaber_Logo.png" },
  { match: /^tgrt\s*haber\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Tgrthaber_yenilogo.png/800px-Tgrthaber_yenilogo.png" },
  { match: /^24(\s*tv)?\b/i, logo: "https://i.imgur.com/8FO41es.png" },
  { match: /^360\b/i, logo: "https://i.imgur.com/agn47sQ.png" },
  { match: /^bengü\s*türk\b/i, logo: "https://i.imgur.com/4Wz95Nf.png" },
  { match: /^flash\s*haber\b/i, logo: "https://i.imgur.com/rP3JqRz.png" },
  { match: /^ekotürk\b/i, logo: "https://i.imgur.com/eBkWQvK.png" },
  { match: /^bloomberg\s*ht\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/d/d4/Bloomberg_HT_logo.png/800px-Bloomberg_HT_logo.png" },
  { match: /^ülke\s*tv\b/i, logo: "https://i.imgur.com/PZt1j4Q.png" },
  { match: /^a\s*para\b/i, logo: "https://i.imgur.com/GjHnq0c.png" },

  // 4. Entertainment & Thematic
  { match: /^teve2\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Teve2_logo.png/500px-Teve2_logo.png" },
  { match: /^a2(\s*tv)?\b/i, logo: "https://iatv.tmgrup.com.tr/site/v2/a2tv/i/a2tv-logo.png" },
  { match: /^tlc\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/TLC_Logo_2016.svg/800px-TLC_Logo_2016.svg.png" },
  { match: /^dmax\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/DMAX_2016_logo.svg/800px-DMAX_2016_logo.svg.png" },

  // 5. Sports
  { match: /^a\s*spor\b/i, logo: "https://i.imgur.com/ZhkZzLf.png" },
  { match: /^tivibu\s*spor\b/i, logo: "https://i.imgur.com/qvrKQY3.png" },
  { match: /^s\s*sport(\s*2)?\b/i, logo: "https://i.imgur.com/bW3JjVb.png" },
  { match: /^fb\s*tv\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/b/b3/FBTV_Logo.png/800px-FBTV_Logo.png" },
  { match: /^gs\s*tv\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/1/14/Galatasaray_TV_logo.png/800px-Galatasaray_TV_logo.png" },
  { match: /^bjk\s*tv\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/1/1a/BJK_TV.png/800px-BJK_TV.png" },
  { match: /^sports\s*tv\b/i, logo: "https://i.imgur.com/L1M4r7n.png" },

  // 6. Music
  { match: /^power\s*türk\b/i, logo: "https://i.imgur.com/9OPoXQG.png" },
  { match: /^kral(\s*tv|\s*pop)?\b/i, logo: "https://i.imgur.com/GeEDOPN.png" },
  { match: /^(number\s*one|nr1)(\s*türk)?\b/i, logo: "https://i.imgur.com/0Q4E5qZ.png" },
  { match: /^dream(\s*tv|\s*türk)?\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Dream_TV_logosu.png/800px-Dream_TV_logosu.png" },

  // 7. Kids
  { match: /^minika\s*çocuk\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/e/ee/Minika_%C3%87ocuk_Logo.png/800px-Minika_%C3%87ocuk_Logo.png" },
  { match: /^minika\s*go\b/i, logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/a/ad/Minika_GO_Logo.png/800px-Minika_GO_Logo.png" },
  { match: /^cartoon\s*network\b/i, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/800px-Cartoon_Network_2010_logo.svg.png" },
];

/**
 * Returns a verified, high-resolution official channel logo if available.
 * If the existing poster is valid and not a generic Unsplash photo, preserves it.
 */
export function getChannelLogo(channelTitle: string, existingPoster?: string | null): string | null {
  const t = (channelTitle || "").trim().toLowerCase();

  // 1. Check verified national and thematic TV logos
  for (const item of VERIFIED_LOGOS) {
    if (item.match.test(t)) {
      return item.logo;
    }
  }

  // 2. If existing poster is an actual custom logo (not generic unsplash photo)
  if (existingPoster && !existingPoster.includes("unsplash.com") && !existingPoster.includes("picsum.photos")) {
    return existingPoster;
  }

  return null;
}
