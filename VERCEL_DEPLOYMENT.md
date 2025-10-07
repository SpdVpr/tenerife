# 🚀 Vercel Deployment Guide - Cielo Dorado

Kompletní návod pro nasazení projektu na Vercel.

## 📋 Příprava před deploymentem

### ✅ Co je hotovo:
- ✅ Projekt nahrán na GitHub: https://github.com/SpdVpr/tenerife
- ✅ `.gitignore` obsahuje `.env*` (citlivé údaje nejsou na GitHubu)
- ✅ `.env.example` vytvořen jako šablona
- ✅ README.md s kompletní dokumentací
- ✅ Firebase konfigurace připravena

---

## 🔧 Krok 1: Vytvoření Vercel projektu

1. **Přihlaste se na Vercel:**
   - Jděte na https://vercel.com
   - Přihlaste se pomocí GitHub účtu

2. **Vytvořte nový projekt:**
   - Klikněte na **"Add New Project"**
   - Vyberte repozitář **`SpdVpr/tenerife`**
   - Klikněte na **"Import"**

3. **Nastavte Root Directory:**
   - V sekci "Configure Project" najděte **"Root Directory"**
   - Klikněte na **"Edit"**
   - Vyberte složku **`cielo-dorado`**
   - Klikněte na **"Continue"**

---

## 🔐 Krok 2: Nastavení Environment Variables

V sekci **"Environment Variables"** přidejte následující proměnné:

### Firebase Configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY
AIzaSyDgvgANB_9uu8ELYHKoZ-KhnUG82uyJBD4

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
tenerife-a552e.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID
tenerife-a552e

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
tenerife-a552e.firebasestorage.app

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
653818832085

NEXT_PUBLIC_FIREBASE_APP_ID
1:653818832085:web:2c0162e4da7cce1a78ae5c
```

### Jak přidat proměnné:

1. **Name:** `NEXT_PUBLIC_FIREBASE_API_KEY`
2. **Value:** `AIzaSyDgvgANB_9uu8ELYHKoZ-KhnUG82uyJBD4`
3. **Environment:** Vyberte **Production**, **Preview**, **Development** (všechny)
4. Klikněte na **"Add"**
5. Opakujte pro všechny proměnné výše

---

## 🚀 Krok 3: Deploy

1. **Zkontrolujte nastavení:**
   - **Framework Preset:** Next.js (automaticky detekováno)
   - **Build Command:** `npm run build` (automaticky)
   - **Output Directory:** `.next` (automaticky)
   - **Install Command:** `npm install` (automaticky)

2. **Spusťte deployment:**
   - Klikněte na **"Deploy"**
   - Počkejte 2-5 minut na build

3. **Sledujte build log:**
   - Uvidíte progress bar
   - Build log zobrazí všechny kroky
   - Po dokončení uvidíte **"Deployment Ready"**

---

## ✅ Krok 4: Ověření

### 1. Otevřete nasazenou aplikaci:
- Klikněte na **"Visit"** nebo URL (např. `cielo-dorado.vercel.app`)

### 2. Zkontrolujte funkčnost:
- ✅ **Hero slideshow** - Obrázky se načítají
- ✅ **Galerie** - 32 fotek, filtry fungují
- ✅ **Rezervační formulář** - Kalendář funguje
- ✅ **Firebase připojení** - Zkuste zkontrolovat dostupnost
- ✅ **Guest Book** - Stránka se načítá
- ✅ **Admin panel** - Přístupný na `/admin`

### 3. Testujte responzivitu:
- 📱 **Mobil** - Otevřete na telefonu
- 💻 **Desktop** - Zkontrolujte na počítači
- 🖥️ **Tablet** - Zkontrolujte na tabletu

---

## 🔄 Krok 5: Automatické deploymenty

Vercel automaticky nasadí novou verzi při každém push na GitHub:

1. **Push změny na GitHub:**
```bash
git add .
git commit -m "Update: popis změny"
git push origin main
```

2. **Vercel automaticky:**
   - Detekuje změny
   - Spustí build
   - Nasadí novou verzi
   - Pošle notifikaci

---

## 🌐 Krok 6: Custom doména (volitelné)

### Přidání vlastní domény:

1. **V Vercel projektu:**
   - Jděte na **"Settings"** → **"Domains"**
   - Klikněte na **"Add"**
   - Zadejte doménu (např. `cielo-dorado.com`)

2. **Nastavte DNS záznamy:**
   - **A Record:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com`

3. **Počkejte na propagaci:**
   - DNS propagace trvá 24-48 hodin
   - Vercel automaticky vystaví SSL certifikát

---

## 🔥 Firebase Firestore Rules

### Ověření security rules:

1. **Přihlaste se do Firebase Console:**
   - https://console.firebase.google.com/
   - Vyberte projekt **tenerife-a552e**

2. **Zkontrolujte Firestore Rules:**
   - Jděte na **Firestore Database** → **Rules**
   - Ověřte, že rules jsou nasazené

3. **Pokud nejsou nasazené:**
```bash
cd cielo-dorado
firebase deploy --only firestore:rules
```

---

## 📊 Monitoring a Analytics

### Vercel Analytics:

1. **Zapněte Analytics:**
   - V projektu jděte na **"Analytics"**
   - Klikněte na **"Enable"**

2. **Sledujte metriky:**
   - Page views
   - Unique visitors
   - Performance metrics
   - Error tracking

### Firebase Analytics (volitelné):

1. **Přidejte Firebase Analytics:**
```bash
npm install firebase/analytics
```

2. **Inicializujte v `lib/firebase/config.ts`**

---

## 🐛 Troubleshooting

### Build selhává:

**Problém:** Build error v Vercelu
**Řešení:**
1. Zkontrolujte build log
2. Ověřte, že všechny dependencies jsou v `package.json`
3. Zkuste build lokálně: `npm run build`

### Environment variables nefungují:

**Problém:** Firebase chyby, "undefined" values
**Řešení:**
1. Zkontrolujte, že všechny proměnné začínají `NEXT_PUBLIC_`
2. Ověřte, že jsou nastavené pro všechny environments
3. Redeploy projekt po přidání proměnných

### Obrázky se nenačítají:

**Problém:** 404 na obrázky
**Řešení:**
1. Zkontrolujte, že složka `public/images/` je na GitHubu
2. Ověřte cesty v komponentách
3. Zkontrolujte `.gitignore` - nesmí ignorovat `public/`

### Firestore chyby:

**Problém:** "Permission denied" při čtení/zápisu
**Řešení:**
1. Zkontrolujte Firestore security rules
2. Nasaďte rules: `firebase deploy --only firestore:rules`
3. Ověřte Firebase projekt ID v `.env`

---

## 📝 Checklist před spuštěním

- [ ] Projekt nahrán na GitHub
- [ ] Vercel projekt vytvořen
- [ ] Root directory nastavena na `cielo-dorado`
- [ ] Všechny environment variables přidány
- [ ] Build úspěšně dokončen
- [ ] Aplikace funguje na Vercel URL
- [ ] Firebase připojení funguje
- [ ] Rezervační formulář funguje
- [ ] Galerie se načítá
- [ ] Responzivita zkontrolována
- [ ] Custom doména nastavena (volitelné)
- [ ] SSL certifikát aktivní
- [ ] Analytics zapnuté (volitelné)

---

## 🎉 Hotovo!

Váš web je nyní živý na:
- **Vercel URL:** https://cielo-dorado.vercel.app
- **Custom doména:** https://cielo-dorado.com (pokud nastavena)

### Další kroky:

1. **Sdílejte URL** s klienty a hosty
2. **Testujte rezervace** - zkuste vytvořit testovací rezervaci
3. **Sledujte analytics** - kolik návštěvníků máte
4. **Aktualizujte obsah** - přidávejte nové fotky, upravujte texty
5. **Propagujte web** - Instagram, Facebook, Google

---

**Vytvořeno:** 7. října 2025
**Autor:** Martin Holann
**Kontakt:** martin.holann@gmail.com

