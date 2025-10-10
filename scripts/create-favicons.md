# 🎨 Vytvoření Favicon - Krok za krokem

## 🚀 Nejrychlejší způsob (Online nástroj)

### 1. Otevřete RealFaviconGenerator

Jděte na: **https://realfavicongenerator.net/**

### 2. Nahrajte logo

- Klikněte na "Select your Favicon image"
- Vyberte soubor: `public/images/logo/logo.webp`
- Nebo použijte tento obrázek z přílohy (screenshot)

### 3. Nastavte parametry

**iOS Web Clip:**
- ✅ Použít originální obrázek
- Background: Transparent nebo White

**Android Chrome:**
- ✅ Použít originální obrázek
- Theme color: `#0c4a6e` (modrá z webu)

**Windows Metro:**
- ✅ Použít originální obrázek
- Tile color: `#0c4a6e`

**macOS Safari:**
- ✅ Použít originální obrázek
- Theme color: `#0c4a6e`

### 4. Vygenerujte a stáhněte

- Klikněte "Generate your Favicons and HTML code"
- Stáhněte ZIP soubor
- Rozbalte ho

### 5. Zkopírujte soubory

Zkopírujte tyto soubory do `public/` složky:

```
favicon.ico
favicon-16x16.png
favicon-32x32.png
apple-touch-icon.png
android-chrome-192x192.png
android-chrome-512x512.png
site.webmanifest (volitelné)
```

### 6. Hotovo!

Metadata v `app/layout.tsx` jsou již připravena a automaticky použijí tyto soubory.

---

## 🖼️ Přidání Social Media Preview obrázku

### 1. Uložte screenshot

Screenshot z přílohy (obrázek s "Cielo Dorado" nápisem) uložte jako:

```
public/images/og-image.jpg
```

### 2. Doporučené úpravy (volitelné)

Pokud chcete upravit obrázek:

**Rozměry:** 1200 x 630 px (ideální pro všechny sociální sítě)

**Formát:** JPG nebo PNG

**Velikost souboru:** Max 8 MB (ideálně pod 1 MB)

**Kvalita:** 80-90% (dobrý kompromis mezi kvalitou a velikostí)

### 3. Hotovo!

Metadata v `app/layout.tsx` jsou již připravena a automaticky použijí tento obrázek.

---

## 🧪 Testování

### Test 1: Lokální test

```bash
# Spusťte dev server
npm run dev

# Otevřete v prohlížeči
http://localhost:3000

# Zkontrolujte:
# - Favicon v záložce prohlížeče
# - View Page Source -> hledejte <meta property="og:image"
```

### Test 2: Build test

```bash
# Build aplikace
npm run build

# Spusťte produkční server
npm start

# Otevřete v prohlížeči
http://localhost:3000
```

### Test 3: Social Media Preview

Po nasazení na Vercel otestujte:

**Facebook Debugger:**
```
https://developers.facebook.com/tools/debug/
```

**Twitter Card Validator:**
```
https://cards-dev.twitter.com/validator
```

**LinkedIn Post Inspector:**
```
https://www.linkedin.com/post-inspector/
```

Zadejte URL: `https://www.cielodorado-tenerife.eu`

---

## 📋 Checklist

- [ ] Logo zkopírováno jako `app/icon.png` (nebo favicon soubory vytvořeny)
- [ ] Screenshot uložen jako `public/images/og-image.jpg`
- [ ] Metadata v `app/layout.tsx` aktualizována (✅ již hotovo)
- [ ] Lokální test prošel
- [ ] Build test prošel
- [ ] Commitnuto a pushnuto na GitHub
- [ ] Vercel build prošel
- [ ] Social media preview otestován

---

## 🎯 Očekávaný výsledek

### V prohlížeči:

```
[🏠] Cielo Dorado - Luxusní apartmán na Tenerife
```

### Při sdílení na Facebooku/LinkedIn:

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Obrázek: Terasa s bazénem a výhledem]   │
│   Cielo Dorado                              │
│   Váš dokonalý únik na Tenerife             │
│                                             │
├─────────────────────────────────────────────┤
│ Cielo Dorado - Luxusní apartmán na Tenerife│
│                                             │
│ Luxusní apartmán s výhledem na oceán       │
│ v Los Gigantes, Tenerife. Kapacita 4       │
│ osoby, terasa 27m², střešní bazén.         │
│                                             │
│ 🔗 CIELODORADO-TENERIFE.EU                 │
└─────────────────────────────────────────────┘
```

---

## 💡 Tipy

### Tip 1: Optimalizace obrázku

Pokud je `og-image.jpg` příliš velký:

```bash
# Použijte online nástroj:
https://tinypng.com/
https://squoosh.app/

# Nebo příkazovou řádku (pokud máte ImageMagick):
magick convert og-image.jpg -quality 85 -resize 1200x630 og-image-optimized.jpg
```

### Tip 2: Testování různých obrázků

Můžete vytvořit více variant:

```
public/images/og-image.jpg          (výchozí)
public/images/og-image-pool.jpg     (bazén)
public/images/og-image-view.jpg     (výhled)
public/images/og-image-terrace.jpg  (terasa)
```

A pak v `app/layout.tsx` změnit cestu podle potřeby.

### Tip 3: Dynamické OG obrázky

Pro pokročilé: Můžete vytvořit dynamické OG obrázky pro různé stránky:

```typescript
// app/booking/opengraph-image.tsx
export default function Image() {
  return (
    <div style={{ /* ... */ }}>
      Rezervace - Cielo Dorado
    </div>
  );
}
```

---

## 🔧 Řešení problémů

### Problém: Favicon se nezobrazuje

**Řešení:**
1. Vyčistěte cache prohlížeče (Ctrl+Shift+Delete)
2. Zkuste hard refresh (Ctrl+F5)
3. Zkontrolujte, že soubory jsou v `public/` složce
4. Zkontrolujte konzoli prohlížeče (F12) pro chyby

### Problém: OG obrázek se nezobrazuje na Facebooku

**Řešení:**
1. Použijte Facebook Debugger: https://developers.facebook.com/tools/debug/
2. Klikněte "Scrape Again" pro aktualizaci cache
3. Zkontrolujte, že obrázek je veřejně přístupný
4. Zkontrolujte rozměry (min 200x200, doporučeno 1200x630)

### Problém: Build selhává

**Řešení:**
1. Zkontrolujte, že všechny cesty k obrázkům jsou správné
2. Zkontrolujte, že obrázky existují
3. Spusťte: `npm run build` a podívejte se na chybovou hlášku

---

## 📚 Další zdroje

- **Next.js Metadata:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Open Graph Protocol:** https://ogp.me/
- **Twitter Cards:** https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- **Favicon Generator:** https://realfavicongenerator.net/
- **Image Optimizer:** https://squoosh.app/

---

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Status:** 📝 Návod připraven

