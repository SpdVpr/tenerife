# 📱 Social Media Preview & Favicon - Kompletní návod

## ✅ Co bylo připraveno v kódu

Metadata pro social media preview a favicon jsou **již implementována** v `app/layout.tsx`:

- ✅ Open Graph metadata (Facebook, LinkedIn, WhatsApp)
- ✅ Twitter Card metadata
- ✅ Favicon odkazy
- ✅ PWA manifest
- ✅ Theme color
- ✅ Robots metadata

---

## 📋 Co MUSÍTE udělat (2 kroky)

### Krok 1: Přidat social preview obrázek

**Uložte screenshot z přílohy jako:**
```
public/images/og-image.jpg
```

**Požadavky:**
- Rozměry: 1200 x 630 px (ideální)
- Formát: JPG nebo PNG
- Velikost: Max 8 MB (ideálně pod 1 MB)

**Jak na to:**
1. Uložte screenshot (obrázek s "Cielo Dorado" nápisem)
2. Přejmenujte na `og-image.jpg`
3. Zkopírujte do složky `public/images/`

---

### Krok 2: Vytvořit favicon

**Možnost A: Nejrychlejší (Online nástroj)**

1. Jděte na: https://realfavicongenerator.net/
2. Nahrajte `public/images/logo/logo.webp`
3. Stáhněte vygenerované soubory
4. Zkopírujte do `public/` složky:
   ```
   favicon.ico
   favicon-16x16.png
   favicon-32x32.png
   apple-touch-icon.png
   android-chrome-192x192.png
   android-chrome-512x512.png
   ```

**Možnost B: Next.js způsob (jednodušší)**

1. Zkopírujte logo jako `app/icon.png`
2. Next.js automaticky vygeneruje všechny velikosti

---

## 🎯 Výsledek

### Při sdílení na sociálních sítích:

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Obrázek: Cielo Dorado terasa]           │
│                                             │
├─────────────────────────────────────────────┤
│ Cielo Dorado - Luxusní apartmán na Tenerife│
│                                             │
│ Luxusní apartmán s výhledem na oceán       │
│ v Los Gigantes, Tenerife. Kapacita 4       │
│ osoby, terasa 27m², střešní bazén.         │
│                                             │
│ 🔗 www.cielodorado-tenerife.eu             │
└─────────────────────────────────────────────┘
```

### V prohlížeči:

```
[🏠 Logo] Cielo Dorado - Luxusní apartmán na Tenerife
```

---

## 🧪 Testování

### 1. Lokální test

```bash
npm run dev
```

Otevřete: http://localhost:3000

Zkontrolujte:
- ✅ Favicon v záložce prohlížeče
- ✅ View Page Source → hledejte `<meta property="og:image"`

### 2. Build test

```bash
npm run build
npm start
```

### 3. Social Media test (po nasazení)

**Facebook Debugger:**
```
https://developers.facebook.com/tools/debug/
```
Zadejte: `https://www.cielodorado-tenerife.eu`

**Twitter Card Validator:**
```
https://cards-dev.twitter.com/validator
```

**LinkedIn Post Inspector:**
```
https://www.linkedin.com/post-inspector/
```

---

## 📊 Co je implementováno v kódu

### Open Graph metadata (Facebook, LinkedIn, WhatsApp)

```typescript
openGraph: {
  title: "Cielo Dorado - Luxusní apartmán na Tenerife",
  description: "Luxusní apartmán s výhledem na oceán...",
  type: "website",
  locale: "cs_CZ",
  url: "https://www.cielodorado-tenerife.eu",
  siteName: "Cielo Dorado",
  images: [
    {
      url: "/images/og-image.jpg",  // ← Tento obrázek musíte přidat
      width: 1200,
      height: 630,
      alt: "Cielo Dorado - Premium apartmán na Tenerife",
    },
  ],
}
```

### Twitter Card metadata

```typescript
twitter: {
  card: "summary_large_image",
  title: "Cielo Dorado - Luxusní apartmán na Tenerife",
  description: "Luxusní apartmán s výhledem na oceán...",
  images: ["/images/og-image.jpg"],  // ← Tento obrázek musíte přidat
}
```

### Favicon odkazy

```typescript
icons: {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
  // ...
}
```

### PWA Manifest

```json
{
  "name": "Cielo Dorado - Luxusní apartmán na Tenerife",
  "short_name": "Cielo Dorado",
  "theme_color": "#0c4a6e",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

---

## 📁 Struktura souborů

Po dokončení by měla být tato struktura:

```
public/
├── images/
│   ├── og-image.jpg              ← MUSÍTE PŘIDAT (screenshot)
│   └── logo/
│       ├── logo.webp
│       └── logo-small.webp
├── favicon.ico                   ← MUSÍTE PŘIDAT (z generátoru)
├── favicon-16x16.png             ← MUSÍTE PŘIDAT
├── favicon-32x32.png             ← MUSÍTE PŘIDAT
├── apple-touch-icon.png          ← MUSÍTE PŘIDAT
├── android-chrome-192x192.png    ← MUSÍTE PŘIDAT
├── android-chrome-512x512.png    ← MUSÍTE PŘIDAT
└── site.webmanifest              ✅ JIŽ VYTVOŘENO

app/
├── layout.tsx                    ✅ JIŽ AKTUALIZOVÁNO
└── icon.png                      ← VOLITELNĚ (alternativa k favicon)
```

---

## ✅ Checklist

- [ ] Screenshot uložen jako `public/images/og-image.jpg`
- [ ] Favicon soubory vytvořeny a uloženy v `public/`
- [ ] Lokální test: `npm run dev` → favicon viditelný
- [ ] Build test: `npm run build` → bez chyb
- [ ] Commitnuto: `git add -A && git commit -m "feat: Add social media preview and favicon"`
- [ ] Pushnuto: `git push origin main`
- [ ] Vercel build prošel
- [ ] Facebook Debugger test prošel
- [ ] Twitter Card test prošel
- [ ] LinkedIn Post Inspector test prošel

---

## 🚀 Nasazení

```bash
# 1. Přidejte soubory
git add -A

# 2. Commitněte
git commit -m "feat: Add social media preview and favicon"

# 3. Pushněte
git push origin main

# 4. Vercel automaticky nasadí
```

---

## 💡 Tipy

### Tip 1: Optimalizace obrázku

Pokud je `og-image.jpg` příliš velký, použijte:
- https://tinypng.com/
- https://squoosh.app/

### Tip 2: Testování před nasazením

```bash
# Zkontrolujte, že soubory existují
ls public/images/og-image.jpg
ls public/favicon.ico

# Build test
npm run build
```

### Tip 3: Cache problém

Pokud se změny nezobrazují:
1. Vyčistěte cache prohlížeče (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Facebook Debugger → "Scrape Again"

---

## 🔧 Řešení problémů

### Problém: "Cannot find module '/images/og-image.jpg'"

**Řešení:** Zkontrolujte, že soubor existuje v `public/images/og-image.jpg`

### Problém: Favicon se nezobrazuje

**Řešení:**
1. Vyčistěte cache prohlížeče
2. Zkontrolujte, že soubory jsou v `public/` (ne `public/images/`)
3. Hard refresh (Ctrl+F5)

### Problém: OG obrázek se nezobrazuje na Facebooku

**Řešení:**
1. Facebook Debugger: https://developers.facebook.com/tools/debug/
2. Klikněte "Scrape Again"
3. Zkontrolujte rozměry obrázku (min 200x200, doporučeno 1200x630)

---

## 📚 Další dokumentace

- `FAVICON_SETUP.md` - Detailní návod na favicon
- `scripts/create-favicons.md` - Krok za krokem návod
- Next.js Metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

---

## 🎉 Výsledek

Po dokončení budete mít:

✅ **Profesionální social media preview** při sdílení na Facebooku, LinkedIn, WhatsApp  
✅ **Favicon** ve všech velikostech pro všechny zařízení  
✅ **PWA support** - možnost přidat web na plochu  
✅ **SEO optimalizace** - lepší viditelnost ve vyhledávačích  
✅ **Brand konzistence** - logo všude stejné

---

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Status:** ⏳ Čeká na přidání obrázků

