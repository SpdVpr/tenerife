# 🎨 Travel Theme Design - Cielo Dorado

## Přehled grafického konceptu

Web nyní používá cestovatelský grafický koncept inspirovaný přiloženými obrázky z marketingových materiálů.

## 🔵 Barevné schéma

### Primární barvy
- **Primary Blue**: `#1B5E7E` - Hlavní modrá barva
- **Primary Cyan**: `#2B7FA6` - Světlejší modrá
- **Light Blue**: `#3A9BC6` - Nejsvětlejší modrá

### Akcentové barvy
- **Beige**: `#F5F1E8` - Béžové pozadí
- **Cream**: `#FFF8E7` - Krémové pozadí
- **Yellow**: `#F59E0B` - Žlutá pro zvýraznění

## ✈️ Grafické prvky

### 1. Letadla s přerušovanými čarami
- Siluety letadel s tečkovanými trajektoriemi
- Směry: right, left, up, down
- Použití: Hero, WhyChoose, Booking, Contact, Location, Pricing, Gallery, ApartmentDetails

### 2. Razítka "TRAVEL"
- Kruhová razítka s textem "TRAVEL" a "TENERIFE"
- Rotace: -25° až +20°
- Velikosti: 100px - 120px
- Obsahuje hvězdičku uprostřed a dekorativní tečky

### 3. Tečkované vzory
- Mřížka teček pro dekoraci
- Konfigurovatelné řady a sloupce
- Opacity: 0.3

### 4. Šipky (>>>)
- Trojice šipek ve směru right, left, up, down
- Použití pro navigační akcenty

### 5. Kompas
- Dekorativní kompas se světovými stranami
- Použití v Contact a Pricing sekcích

### 6. Vlnovky
- Přerušované vlnovité čáry
- Použití v Location sekci

## 📂 Struktura souborů

### Nové komponenty
```
components/ui/TravelDecorations.tsx
```
Obsahuje všechny SVG dekorativní komponenty:
- `PlaneWithTrail` - Letadlo s čárou
- `TravelStamp` - Razítko
- `DottedPattern` - Tečkovaný vzor
- `ArrowPattern` - Šipky
- `CompassDecoration` - Kompas
- `WavyLine` - Vlnovka

### Aktualizované sekce
Všechny sekce byly aktualizovány s novými dekorativními prvky:
- `Hero.tsx` - Hlavní banner
- `WhyChoose.tsx` - Výhody
- `ApartmentDetails.tsx` - Detail apartmánu
- `Gallery.tsx` - Galerie
- `Location.tsx` - Lokalita
- `Pricing.tsx` - Ceník
- `Booking.tsx` - Rezervace
- `Contact.tsx` - Kontakt

### Aktualizované styly
- `tailwind.config.ts` - Nové barvy
- `app/globals.css` - Nové animace a gradienty

## 🎨 Použití dekorací

### Příklad použití v sekci:
```tsx
import { PlaneWithTrail, TravelStamp, DottedPattern } from '@/components/ui/TravelDecorations';

export default function MySection() {
  return (
    <section className="relative overflow-hidden">
      {/* Travel Decorations */}
      <PlaneWithTrail className="top-10 right-10 hidden lg:block" direction="right" color="#1B5E7E" />
      <TravelStamp className="top-20 left-10 hidden md:block" size={100} color="#2B7FA6" rotation={-15} />
      <DottedPattern className="bottom-10 right-20 hidden lg:block" color="#1B5E7E" rows={3} cols={4} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Obsah sekce */}
      </div>
    </section>
  );
}
```

## 🎯 Klíčové vlastnosti

### Responzivita
- Dekorace jsou skryté na mobilech (`hidden lg:block`, `hidden md:block`)
- Zobrazují se pouze na tabletech a desktopech
- Neruší čitelnost obsahu

### Animace
- `animate-float` - Plovoucí efekt (3s)
- `animate-rotate-slow` - Pomalá rotace (20s)
- Použití v `globals.css`

### Gradienty
- `bg-travel-gradient` - Modrý gradient
- `bg-travel-light` - Světlý béžový gradient

## 🔧 Konfigurace

### PlaneWithTrail
```tsx
<PlaneWithTrail 
  className="top-10 right-10" 
  direction="right" // "left" | "right" | "up" | "down"
  color="#1B5E7E" 
/>
```

### TravelStamp
```tsx
<TravelStamp 
  className="top-20 left-10" 
  size={120} 
  color="#2B7FA6" 
  rotation={-15} 
/>
```

### DottedPattern
```tsx
<DottedPattern 
  className="bottom-10 right-20" 
  color="#1B5E7E" 
  rows={3} 
  cols={4} 
/>
```

### ArrowPattern
```tsx
<ArrowPattern 
  className="top-10 left-20" 
  color="#2B7FA6" 
  count={3} 
  direction="right" // "left" | "right" | "up" | "down"
/>
```

### CompassDecoration
```tsx
<CompassDecoration 
  className="bottom-10 right-10" 
  size={80} 
  color="#2B7FA6" 
/>
```

### WavyLine
```tsx
<WavyLine 
  className="bottom-10 right-10" 
  color="#2B7FA6" 
  width={250} 
/>
```

## 📱 Responzivní breakpointy

- **Mobile**: < 640px - Dekorace skryté
- **Tablet**: 640px - 1024px - Některé dekorace viditelné (`md:block`)
- **Desktop**: 1024px+ - Všechny dekorace viditelné (`lg:block`)

## 🎨 Barevná paleta v Tailwind

```typescript
colors: {
  primary: {
    blue: '#1B5E7E',
    cyan: '#2B7FA6',
    lightBlue: '#3A9BC6',
  },
  accent: {
    beige: '#F5F1E8',
    cream: '#FFF8E7',
    yellow: '#F59E0B',
  },
}
```

## 🚀 Další kroky

Pro přidání dalších dekorativních prvků:
1. Vytvořte novou komponentu v `TravelDecorations.tsx`
2. Exportujte ji
3. Importujte a použijte v požadované sekci
4. Nastavte pozici pomocí Tailwind tříd (`top-10`, `right-10`, atd.)
5. Použijte `hidden lg:block` pro responzivitu

## 📝 Poznámky

- Všechny dekorace jsou SVG pro optimální výkon
- Opacity je nastavena na 0.3-0.5 pro jemný efekt
- Dekorace jsou absolutně pozicované
- Obsah sekcí má `relative z-10` pro správné vrstvení
- Sekce mají `overflow-hidden` pro oříznutí dekorací mimo oblast

