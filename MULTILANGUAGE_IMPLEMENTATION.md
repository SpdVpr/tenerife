# Implementace vícejazyčnosti CZ/EN

## ✅ Co bylo implementováno

### 1. **Admin Autentizace** 
- ✅ Přihlašovací stránka `/admin/login`
- ✅ Middleware pro ochranu `/admin` stránky
- ✅ API endpointy pro login/logout
- ✅ Tlačítko "Odhlásit se" v admin panelu
- ✅ Přihlašovací údaje v `.env.local`:
  - Username: `admin`
  - Password: `CieloDorado2025!`

### 2. **Jazykový systém**
- ✅ Language Context (`contexts/LanguageContext.tsx`)
- ✅ Kompletní překlady CZ/EN (`lib/translations.ts`)
- ✅ Přepínač jazyků v hlavičce (desktop i mobile)
- ✅ Ukládání vybraného jazyka do localStorage

### 3. **Přeložené komponenty**
- ✅ Header (navigace + přepínač jazyků)
- ✅ Hero sekce (úvodní banner)
- ⏳ **Zbývá přeložit:**
  - WhyChoose
  - ApartmentDetails
  - Gallery
  - Pricing
  - Booking
  - Location
  - Contact
  - Footer

## 📝 Jak dokončit překlady

### Krok 1: Přidat `useLanguage` hook do komponenty

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { t } = useLanguage();
  
  // ... rest of component
}
```

### Krok 2: Nahradit texty funkcí `t()`

**Před:**
```tsx
<h1>Proč si vybrat Cielo Dorado?</h1>
```

**Po:**
```tsx
<h1>{t('why.title')}</h1>
```

### Krok 3: Najít správný klíč v `lib/translations.ts`

Všechny překlady jsou v souboru `lib/translations.ts`. Klíče jsou organizované podle sekcí:
- `nav.*` - Navigace
- `hero.*` - Hero sekce
- `why.*` - Why Choose sekce
- `details.*` - Apartment Details
- `amenity.*` - Vybavení
- `gallery.*` - Galerie
- `pricing.*` - Ceník
- `booking.*` - Rezervace
- `location.*` - Lokalita
- `contact.*` - Kontakt
- `footer.*` - Footer

## 🔧 Příklad: Překlad WhyChoose sekce

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';
// ... other imports

export default function WhyChoose() {
  const { t } = useLanguage();
  
  return (
    <section>
      <h2>{t('why.title')}</h2>
      <p>{t('why.subtitle')}</p>
      
      {/* Features */}
      <div>
        <h3>{t('why.pool')}</h3>
        <p>{t('why.poolDesc')}</p>
      </div>
      {/* ... more features */}
    </section>
  );
}
```

## 🌐 Testování

1. Otevřete web na `http://localhost:3000`
2. Klikněte na tlačítko "EN" v hlavičce
3. Ověřte, že se texty přeloží do angličtiny
4. Klikněte na "CZ" pro návrat do češtiny

## 🔐 Admin přístup

1. Přejděte na `http://localhost:3000/admin`
2. Budete přesměrováni na `/admin/login`
3. Přihlaste se:
   - Username: `admin`
   - Password: `CieloDorado2025!`
4. Po přihlášení máte přístup k admin panelu
5. Pro odhlášení klikněte na tlačítko "Odhlásit se" vpravo nahoře

## 📋 TODO Seznam

- [ ] Přeložit WhyChoose sekci
- [ ] Přeložit ApartmentDetails sekci
- [ ] Přeložit Gallery sekci
- [ ] Přeložit Pricing sekci
- [ ] Přeložit Booking sekci (včetně formuláře a validací)
- [ ] Přeložit Location sekci
- [ ] Přeložit Contact sekci
- [ ] Přeložit Footer
- [ ] Přeložit Guest Book stránku
- [ ] Otestovat všechny překlady
- [ ] Zkontrolovat responzivitu přepínače jazyků

## 🚀 Nasazení na produkci

Před nasazením na `https://www.cielodorado-tenerife.eu`:

1. Zkontrolujte, že všechny sekce jsou přeložené
2. Otestujte admin přihlášení
3. Změňte heslo v `.env.local` na produkční (silnější)
4. Přidejte `.env.local` do `.gitignore` (už by tam mělo být)
5. Na produkčním serveru nastavte environment variables:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
6. Spusťte `npm run build` a `npm start`

## 📞 Poznámky

- Překlady jsou uloženy v `lib/translations.ts`
- Jazyk se ukládá do localStorage, takže se zachová i po refreshi stránky
- Admin cookie vyprší po 24 hodinách
- Middleware automaticky chrání všechny `/admin/*` cesty kromě `/admin/login`

