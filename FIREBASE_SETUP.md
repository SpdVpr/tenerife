# Firebase Setup Guide

Tento návod vás provede nastavením Firebase pro rezervační systém Cielo Dorado.

## 1. Vytvoření Firebase projektu

1. Přejděte na [Firebase Console](https://console.firebase.google.com/)
2. Klikněte na "Add project" (Přidat projekt)
3. Zadejte název projektu: `cielo-dorado` (nebo jiný název)
4. Povolte Google Analytics (volitelné)
5. Klikněte na "Create project"

## 2. Nastavení Firestore Database

1. V levém menu klikněte na "Firestore Database"
2. Klikněte na "Create database"
3. Vyberte režim:
   - **Production mode** (doporučeno pro produkci)
   - **Test mode** (pro vývoj - data jsou veřejně přístupná 30 dní)
4. Vyberte lokaci: `europe-west` (nejblíže k Evropě)
5. Klikněte na "Enable"

## 3. Nastavení Security Rules

Po vytvoření databáze nastavte bezpečnostní pravidla:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bookings collection
    match /bookings/{bookingId} {
      // Allow read for authenticated users (admin)
      allow read: if request.auth != null;
      
      // Allow create for everyone (public booking form)
      allow create: if request.resource.data.keys().hasAll([
        'checkIn', 'checkOut', 'guests', 'firstName', 'lastName', 
        'email', 'phone', 'nights', 'totalPrice', 'pricePerNight', 
        'status', 'createdAt'
      ]);
      
      // Allow update/delete only for authenticated users (admin)
      allow update, delete: if request.auth != null;
    }
  }
}
```

## 4. Získání Firebase konfigurace

1. V levém menu klikněte na ikonu ozubeného kola ⚙️ → "Project settings"
2. Scrollujte dolů na "Your apps"
3. Klikněte na ikonu `</>` (Web)
4. Zadejte název aplikace: `cielo-dorado-web`
5. **NEPOVOLUJTE** Firebase Hosting (zatím)
6. Klikněte na "Register app"
7. Zkopírujte konfigurační objekt `firebaseConfig`

## 5. Nastavení Environment Variables

1. Vytvořte soubor `.env.local` v root složce projektu:

```bash
cp .env.local.example .env.local
```

2. Otevřete `.env.local` a vyplňte hodnoty z Firebase konfigurace:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cielo-dorado.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cielo-dorado
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cielo-dorado.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

3. **DŮLEŽITÉ:** Soubor `.env.local` je v `.gitignore` a nebude commitnut do Git!

## 6. Testování

1. Restartujte development server:

```bash
npm run dev
```

2. Otevřete stránku: `http://localhost:3000`
3. Přejděte na sekci "Rezervace"
4. Vyplňte formulář a odešlete testovací rezervaci
5. Zkontrolujte Firebase Console → Firestore Database → `bookings` kolekce

## 7. Admin Panel

Admin panel je dostupný na: `http://localhost:3000/admin`

**Poznámka:** Momentálně je admin panel veřejně přístupný. Pro produkci doporučujeme:
- Přidat Firebase Authentication
- Chránit admin panel přihlášením
- Nastavit správná bezpečnostní pravidla

## 8. Struktura dat v Firestore

### Kolekce: `bookings`

Každý dokument obsahuje:

```typescript
{
  checkIn: string;          // "2024-06-15"
  checkOut: string;         // "2024-06-20"
  guests: number;           // 2
  firstName: string;        // "Jan"
  lastName: string;         // "Novák"
  email: string;            // "jan@example.com"
  phone: string;            // "+420 123 456 789"
  message?: string;         // "Rádi bychom..."
  nights: number;           // 5
  totalPrice: number;       // 475
  pricePerNight: number;    // 95
  status: string;           // "pending" | "confirmed" | "cancelled"
  createdAt: Timestamp;     // Firebase Timestamp
}
```

## 9. Další kroky (volitelné)

### Email notifikace

Pro automatické odesílání emailů po rezervaci:
1. Nastavte Firebase Cloud Functions
2. Použijte SendGrid, Mailgun nebo Nodemailer
3. Trigger funkce při vytvoření nového dokumentu v `bookings`

### Kalendář dostupnosti

Pro zobrazení obsazených termínů:
1. Funkce `checkAvailability()` už je implementována
2. Můžete přidat vizuální kalendář s označenými obsazenými daty
3. Použijte knihovnu jako `react-calendar` nebo `react-day-picker`

### Platební brána

Pro online platby:
1. Integrace Stripe nebo PayPal
2. Přidání platebního kroku do rezervačního formuláře
3. Automatické potvrzení po úspěšné platbě

## 10. Troubleshooting

### Chyba: "Firebase: Error (auth/configuration-not-found)"
- Zkontrolujte, že všechny environment variables jsou správně nastaveny
- Restartujte development server

### Chyba: "Missing or insufficient permissions"
- Zkontrolujte Firestore Security Rules
- Pro vývoj můžete dočasně povolit všechny operace (POUZE PRO VÝVOJ!):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Rezervace se neuloží
- Otevřete Developer Console (F12) a zkontrolujte chyby
- Zkontrolujte Firebase Console → Firestore Database
- Ověřte, že `.env.local` obsahuje správné hodnoty

## Kontakt

Pro další pomoc kontaktujte vývojáře nebo navštivte [Firebase dokumentaci](https://firebase.google.com/docs).

