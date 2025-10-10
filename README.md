# 🏖️ Cielo Dorado - Premium Apartmán na Tenerife

Moderní webová prezentace luxusního apartmánu v Los Gigantes, Tenerife s plně funkčním rezervačním systémem.

## 🌟 Funkce

- **Responzivní design** - Optimalizováno pro mobil, tablet i desktop
- **Rezervační systém** - Integrovaný s Firebase/Firestore
- **📧 Automatické emaily** - Potvrzení rezervace pro hosty + notifikace pro majitele
- **Galerie** - 32 optimalizovaných fotografií s lightboxem a filtrováním
- **Kalendář dostupnosti** - Vizuální zobrazení volných termínů
- **Guest Book** - Kompletní průvodce pro hosty (12 sekcí)
- **Vícejazyčný obsah** - Čeština a angličtina
- **Admin panel** - Správa rezervací
- **SEO optimalizace** - Meta tagy, Open Graph
- **Optimalizované obrázky** - WebP formát, lazy loading

## ✅ Dokončené sekce

- ✅ Hero slideshow (3 fotky, animace)
- ✅ Proč si vybrat (6 výhod)
- ✅ Detail apartmánu (specifikace, vybavení, bazén)
- ✅ Galerie (32 fotek, 8 kategorií, pagination)
- ✅ Lokalita (mapa, adresa)
- ✅ Ceník (2 cenové varianty)
- ✅ Rezervace (3-krokový formulář, kalendář)
- ✅ Kontakty (telefon, email, WhatsApp)
- ✅ Guest Book (12 sekcí s informacemi pro hosty)
- ✅ Admin panel (správa rezervací)

## 🛠️ Technologie

- **Next.js 15.5.4** - React framework s App Router a Turbopack
- **React 19.1.0** - UI knihovna
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Utility-first CSS framework
- **Firebase/Firestore** - Backend a databáze
- **React Calendar** - Kalendář pro výběr dat
- **Lucide React** - Ikony
- **Sharp** - Optimalizace obrázků

## 📦 Instalace

1. **Klonujte repozitář:**
```bash
git clone https://github.com/SpdVpr/tenerife.git
cd tenerife/cielo-dorado
```

2. **Nainstalujte závislosti:**
```bash
npm install
```

3. **Nastavte environment variables:**
```bash
cp .env.example .env.local
```

Vyplňte Firebase credentials v `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Spusťte development server:**
```bash
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000) v prohlížeči.

## 📧 Nastavení emailového systému

Pro automatické odesílání potvrzovacích emailů po rezervaci:

**Rychlý start:** Viz `EMAIL_QUICKSTART.md` (5 kroků, 10 minut)

**Kompletní návod:** Viz `EMAIL_SETUP.md`

**DNS nastavení:** Viz `VERCEL_DNS_SETUP.md`

### Rychlý přehled:
1. Nastavte heslo v `.env.local` (SMTP_PASSWORD)
2. Restartujte server
3. Otestujte: `http://localhost:3000/api/test-email`
4. Nastavte environment variables na Vercelu
5. Redeploy

## 🚀 Deployment na Vercel

### 1. Připojte GitHub repozitář

1. Přihlaste se na [Vercel](https://vercel.com)
2. Klikněte na "Add New Project"
3. Importujte GitHub repozitář `SpdVpr/tenerife`
4. Vyberte složku `cielo-dorado` jako root directory

### 2. Nastavte Environment Variables

V Vercel projektu přidejte tyto environment variables (hodnoty dostanete od správce):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy

Klikněte na "Deploy" a Vercel automaticky sestaví a nasadí aplikaci.

## 📁 Struktura projektu

```
cielo-dorado/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Hlavní stránka
│   ├── guest-book/          # Guest Book stránka
│   └── admin/               # Admin panel
├── components/
│   ├── sections/            # Sekce stránky
│   │   ├── Hero.tsx
│   │   ├── Gallery.tsx
│   │   ├── Booking.tsx
│   │   └── ...
│   └── ui/                  # UI komponenty
├── lib/
│   └── firebase/            # Firebase konfigurace
├── public/
│   └── images/
│       └── optimized/       # Optimalizované obrázky
├── firestore.rules          # Firestore security rules
└── firebase.json            # Firebase konfigurace
```

## 🔥 Firebase Setup

### 1. Vytvořte Firebase projekt

1. Jděte na [Firebase Console](https://console.firebase.google.com/)
2. Vytvořte nový projekt nebo použijte existující
3. Přidejte Web App
4. Zkopírujte Firebase config do `.env.local`

### 2. Nastavte Firestore

1. V Firebase Console jděte na Firestore Database
2. Vytvořte databázi v production mode
3. Nahrajte security rules:

```bash
firebase deploy --only firestore:rules
```

## 📸 Optimalizace obrázků

Obrázky jsou optimalizované do WebP formátu ve třech velikostech:
- **Hero:** 1920x1080px (slideshow)
- **Medium:** 800x600px (galerie)
- **Thumbnail:** 400x300px (náhledy)

Celková úspora: **64.2%** (z 79.13 MB na 28.36 MB)

## 🎨 Customizace

### Barvy (Tailwind)

Upravte v `tailwind.config.ts`:
```typescript
colors: {
  'primary-blue': '#2563EB',
  'primary-cyan': '#06B6D4',
  'accent-green': '#10B981',
  'accent-red': '#EF4444',
  'accent-yellow': '#F59E0B',
}
```

### Obsah

- **Texty:** Upravte v jednotlivých komponentách v `components/sections/`
- **Fotky:** Nahraďte v `public/images/optimized/`
- **Guest Book:** Upravte v `components/sections/GuestBook.tsx`

## 📱 Responzivita

Web je plně responzivní s breakpointy:
- **Mobile:** < 640px (1 sloupec)
- **Tablet:** 640px - 1024px (2 sloupce)
- **Desktop:** 1024px+ (3-4 sloupce)

## 🔒 Bezpečnost

- ✅ Firebase Security Rules
- ✅ Environment variables pro citlivé údaje
- ✅ Input validace na formulářích
- ✅ HTTPS only (Vercel)

## 📊 Performance

- ✅ Next.js Image optimalizace
- ✅ Lazy loading obrázků
- ✅ Code splitting
- ✅ Turbopack (development)
- ✅ Static generation kde možné

## 📋 Klíčové informace

### Apartmán
- **Název**: Cielo Dorado
- **Lokalita**: Los Gigantes, Puerto de Santiago, Tenerife
- **Kapacita**: Až 4 osoby
- **Plocha**: 47 m² + terasa 27 m²

### Ceny
- **Standardní**: 95 EUR/noc
- **Sleva (10+ nocí)**: 85 EUR/noc
- **Minimum rezervace**: 5 nocí

### Kontakt
- **Telefon/WhatsApp**: +420 723 382 745
- **Email**: martin.holann@gmail.com
- **Instagram**: @mynameis.martin

## 📝 License

© 2025 Cielo Dorado. All rights reserved.

## 🌐 Live Demo

[https://cielo-dorado.vercel.app](https://cielo-dorado.vercel.app) (po deployi)
