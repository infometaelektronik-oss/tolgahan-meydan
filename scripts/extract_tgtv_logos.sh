#!/bin/bash
set -e

SRC="public/assets/aistudio/Neon_TG_TV_Kanal_Kategorileri_60a0ea7f.png"
OUT_DIR="public/assets/tgtv-logos"
mkdir -p "$OUT_DIR"

# Channels mapping:
# Row 0:
# Col 0: tgtv-genel (TG TV)
# Col 1: tgtv-sinema (SİNEMA)
# Col 2: tgtv-yerli-sinema (YERLİ SİNEMA)
# Col 3: tgtv-yesilcam (YEŞİLÇAM)
# Col 4: tgtv-dizi (DİZİ)
# Row 1:
# Col 0: tgtv-spor (SPOR)
# Col 1: tgtv-eglence (EĞLENCE)
# Col 2: tgtv-cocuk (ÇOCUK)
# Col 3: tgtv-belgesel (BELGESEL)
# Col 4: tgtv-muzik (MÜZİK)
# Row 2:
# Col 0: tgtv-haber (HABER)
# Col 1: tgtv-dini (DİNİ)
# Col 2: tgtv-yasam (YAŞAM)
# Col 3: tgtv-yemek (YEMEK)
# Col 4: tgtv-oyun (OYUN)

NAMES=(
  "tgtv-genel"
  "tgtv-sinema"
  "tgtv-yerli-sinema"
  "tgtv-yesilcam"
  "tgtv-dizi"
  "tgtv-spor"
  "tgtv-eglence"
  "tgtv-cocuk"
  "tgtv-belgesel"
  "tgtv-muzik"
  "tgtv-haber"
  "tgtv-dini"
  "tgtv-yasam"
  "tgtv-yemek"
  "tgtv-oyun"
)

# Crop 5x3 tiles
convert "$SRC" -crop 5x3@ +repage "$OUT_DIR/raw_%d.png"

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"
  raw_file="$OUT_DIR/raw_$i.png"
  out_file="$OUT_DIR/$name.png"
  
  # Keep original pristine colors, and make outer black transparent with smooth fuzz
  convert "$raw_file" -fuzz 7% -transparent black "$out_file"
  # Also keep exact original raw tile without color alteration
  cp "$raw_file" "$OUT_DIR/${name}-orig.png"
  
  echo "Extracted: $out_file and ${name}-orig.png"
done

rm -f "$OUT_DIR"/raw_*.png
echo "All 15 TG TV logos successfully extracted!"
