# 🎨 Favicon a Social Media Preview - Návod

## 📋 Co potřebujete udělat

### 1. Uložit social preview obrázek

Uložte screenshot (obrázek s "Cielo Dorado" nápisem) jako:
```
public/images/og-image.jpg
```

**Doporučené rozměry:** 1200x630 px (ideální pro Facebook, Twitter, LinkedIn)

---

### 2. Vytvořit favicon z loga

Máte logo v `public/images/logo/logo.webp`. Potřebujete vytvořit favicon v různých velikostech.

#### Možnost A: Online nástroj (nejjednodušší)

1. Otevřete: https://realfavicongenerator.net/
2. Nahrajte `public/images/logo/logo.webp`
3. Stáhněte vygenerované soubory
4. Zkopírujte je do `public/` složky

#### Možnost B: Manuálně (pokud máte Photoshop/GIMP)

Vytvořte tyto soubory z loga:

```
public/favicon.ico          (16x16, 32x32, 48x48 - multi-size ICO)
public/favicon-16x16.png    (16x16 px)
public/favicon-32x32.png    (32x32 px)
public/apple-touch-icon.png (180x180 px)
public/android-chrome-192x192.png (192x192 px)
public/android-chrome-512x512.png (512x512 px)
```

#### Možnost C: Použít Next.js app/icon.png (nejjednodušší pro Next.js 15)

Next.js 15 podporuje automatické generování favicon:

1. Zkopírujte logo jako `app/icon.png` (nebo `app/icon.jpg`)
2. Next.js automaticky vygeneruje všechny potřebné velikosti

---

## 🔧 Aktualizace kódu

Metadata jsou již připravena v kódu níže. Po uložení obrázků budou automaticky fungovat.

---

## ✅ Checklist

Po dokončení zkontrolujte:

- [ ] Obrázek `public/images/og-image.jpg` je uložen (1200x630 px)
- [ ] Favicon soubory jsou vytvořeny a uloženy v `public/`
- [ ] Metadata v `app/layout.tsx` jsou aktualizována (již hotovo v kódu)
- [ ] Build prošel úspěšně: `npm run build`
- [ ] Test na produkci: Sdílejte odkaz na Facebooku/LinkedIn

---

## 🧪 Testování

### Test 1: Favicon

1. Otevřete web v prohlížeči
2. Zkontrolujte záložku - mělo by být vidět logo
3. Přidejte stránku do záložek - mělo by být vidět logo

### Test 2: Social Media Preview

1. **Facebook Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

Zadejte URL: `https://www.cielodorado-tenerife.eu`

Měli byste vidět:
- ✅ Obrázek s "Cielo Dorado" nápisem
- ✅ Titulek: "Cielo Dorado - Luxusní apartmán na Tenerife"
- ✅ Popis: "Luxusní apartmán s výhledem na oceán..."

---

## 📊 Výsledek

### Při sdílení na sociálních sítích:

```
┌─────────────────────────────────────┐
│                                     │
│   [Obrázek: Cielo Dorado terasa]   │
│                                     │
├─────────────────────────────────────┤
│ Cielo Dorado - Luxusní apartmán    │
│ na Tenerife                         │
│                                     │
│ Luxusní apartmán s výhledem na     │
│ oceán v Los Gigantes, Tenerife     │
│                                     │
│ 🔗 www.cielodorado-tenerife.eu     │
└─────────────────────────────────────┘
```

### V prohlížeči:

```
[🏠 Logo] Cielo Dorado - Luxusní apartmán na Tenerife
```

---

## 🎨 Doporučené rozměry obrázků

| Typ | Rozměry | Formát | Umístění |
|-----|---------|--------|----------|
| **Open Graph** | 1200x630 px | JPG/PNG | `public/images/og-image.jpg` |
| **Twitter Card** | 1200x630 px | JPG/PNG | Stejný jako OG |
| **Favicon ICO** | 16x16, 32x32, 48x48 | ICO | `public/favicon.ico` |
| **Favicon PNG** | 32x32 px | PNG | `public/favicon-32x32.png` |
| **Apple Touch** | 180x180 px | PNG | `public/apple-touch-icon.png` |
| **Android Chrome** | 192x192 px | PNG | `public/android-chrome-192x192.png` |
| **Android Chrome** | 512x512 px | PNG | `public/android-chrome-512x512.png` |

---

## 🚀 Rychlý start (Next.js 15 způsob)

Nejjednodušší způsob pro Next.js 15:

1. **Social preview:**
   ```bash
   # Uložte screenshot jako:
   public/images/og-image.jpg
   ```

2. **Favicon:**
   ```bash
   # Zkopírujte logo jako:
   app/icon.png
   # Next.js automaticky vygeneruje všechny velikosti
   ```

3. **Hotovo!** Metadata jsou již v kódu.

---

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Status:** ⏳ Čeká na obrázky

