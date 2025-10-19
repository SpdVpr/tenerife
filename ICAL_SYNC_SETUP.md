# 📅 iCal Synchronizace s Booking.com

Přímá synchronizace kalendářů mezi vaším webem a Booking.com pomocí iCal formátu (.ics) bez prostředníka Beds24.

## 🎯 Výhody oproti Beds24

- ✅ **Žádné poplatky** - Přímá integrace bez prostředníka
- ✅ **Jednodušší** - Méně systémů k údržbě
- ✅ **Standardní formát** - iCal je univerzální standard
- ✅ **Automatická synchronizace** - Běží každou hodinu
- ✅ **Obousměrná** - Export i import rezervací

## 🔄 Jak to funguje

### Export (Váš web → Booking.com)
1. Váš web exportuje potvrzené rezervace jako iCal kalendář
2. Booking.com stahuje tento kalendář každých 1-12 hodin
3. Rezervace z vašeho webu se zobrazí jako blokované dny na Booking.com

### Import (Booking.com → Váš web)
1. Booking.com poskytuje iCal URL s rezervacemi
2. Váš web stahuje tento kalendář každou hodinu (Vercel Cron)
3. Rezervace z Booking.com se vytvoří ve Firebase jako potvrzené

## 📋 Nastavení krok za krokem

### 1. Získání iCal URL z Booking.com

1. Přihlaste se do **Booking.com Extranet**
2. Jděte na **Calendar** → **Calendar sync**
3. V sekci **Export calendar** zkopírujte iCal URL
   - Vypadá jako: `https://admin.booking.com/hotel/hoteladmin/ical.html?t=...`

### 2. Konfigurace na vašem webu

1. Otevřete soubor `.env.local`
2. Přidejte iCal URL z Booking.com:

```env
# iCal Calendar Synchronization
BOOKING_COM_ICAL_URL=https://admin.booking.com/hotel/hoteladmin/ical.html?t=YOUR_TOKEN_HERE
NEXT_PUBLIC_BASE_URL=https://www.cielodorado-tenerife.eu
```

3. Uložte soubor a restartujte aplikaci

### 3. Nastavení exportu na Booking.com

1. V **Booking.com Extranet** jděte na **Calendar** → **Calendar sync**
2. V sekci **Import calendar** klikněte na **Add new calendar**
3. Vložte URL vašeho exportu:
   ```
   https://www.cielodorado-tenerife.eu/api/ical/export
   ```
4. Pojmenujte kalendář (např. "Cielo Dorado Web")
5. Klikněte na **Save**

### 4. První synchronizace

1. Přihlaste se do **Admin panelu** na vašem webu
2. Jděte na záložku **iCal Sync**
3. Vložte iCal URL z Booking.com (pokud jste to neudělali v .env.local)
4. Klikněte na **Plná synchronizace**
5. Zkontrolujte výsledky v historii synchronizace

## 🤖 Automatická synchronizace

Synchronizace běží automaticky každou hodinu pomocí **Vercel Cron**.

### Konfigurace (již nastaveno)

Soubor `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/ical/sync",
      "schedule": "0 * * * *"
    }
  ]
}
```

- **Frekvence**: Každou hodinu (0. minuta každé hodiny)
- **Endpoint**: `/api/ical/sync`
- **Akce**: Import rezervací z Booking.com

### Změna frekvence

Pokud chcete změnit frekvenci, upravte `schedule` v `vercel.json`:

- `0 * * * *` - Každou hodinu
- `*/30 * * * *` - Každých 30 minut
- `0 */2 * * *` - Každé 2 hodiny
- `0 0 * * *` - Jednou denně o půlnoci

## 📡 API Endpointy

### Export kalendáře
```
GET /api/ical/export
```
- Exportuje všechny potvrzené rezervace jako iCal
- Používá Booking.com pro import
- Automaticky filtruje externí rezervace (aby se zabránilo cyklické synchronizaci)

### Import kalendáře
```
POST /api/ical/import
Content-Type: application/json

{
  "icalUrl": "https://admin.booking.com/hotel/hoteladmin/ical.html?t=..."
}
```
- Importuje rezervace z Booking.com iCal URL
- Vytváří nové rezervace ve Firebase
- Přeskakuje již existující rezervace

### Plná synchronizace
```
POST /api/ical/sync
Content-Type: application/json

{
  "icalUrl": "https://admin.booking.com/hotel/hoteladmin/ical.html?t=..." // optional
}
```
- Spustí kompletní synchronizaci
- Používá URL z .env.local pokud není zadána
- Volá import endpoint

## 🔍 Testování

### Test exportu
1. Otevřete v prohlížeči: `https://www.cielodorado-tenerife.eu/api/ical/export`
2. Měl by se stáhnout soubor `.ics`
3. Otevřete ho v textovém editoru a zkontrolujte obsah

### Test importu
1. V admin panelu jděte na **iCal Sync**
2. Vložte iCal URL z Booking.com
3. Klikněte na **Importovat nyní**
4. Zkontrolujte historii synchronizace

### Test automatické synchronizace
1. Počkejte hodinu po nasazení
2. Zkontrolujte logy ve Vercel Dashboard
3. Nebo spusťte manuálně v admin panelu

## 📊 Struktura dat

### iCal Event (Export)
```ics
BEGIN:VEVENT
UID:booking-id-123@cielodorado-tenerife.eu
DTSTART;VALUE=DATE:20240615
DTEND;VALUE=DATE:20240621
SUMMARY:Blocked
DESCRIPTION:Property is not available
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
```

### Firebase Booking (Import)
```typescript
{
  firstName: "Booking.com",
  lastName: "Guest",
  email: "",
  phone: "",
  checkIn: "2024-06-15",
  checkOut: "2024-06-20",
  guests: 2,
  nights: 5,
  totalPrice: 0,
  pricePerNight: 0,
  message: "Importováno z Booking.com přes iCal",
  status: "confirmed",
  paymentStatus: "fully_paid",
  createdAt: Timestamp,
  externalId: "booking-com-event-id",
  source: "booking.com",
  syncedAt: Timestamp
}
```

## ⚠️ Důležitá omezení

### Frekvence aktualizace
- **Booking.com**: Aktualizuje každých 1-12 hodin (není garantováno)
- **Váš web**: Aktualizuje každou hodinu (Vercel Cron)
- **Riziko**: V nejhorším případě až 13 hodin prodleva

### Chybějící informace v iCal
- ❌ Jméno hosta (zobrazí se jako "Booking.com Guest")
- ❌ Email hosta
- ❌ Telefon hosta
- ❌ Cena rezervace
- ❌ Počet hostů (nastaví se na 2)
- ✅ Datum check-in a check-out
- ✅ Status rezervace

### Prevence dvojích rezervací
1. **Rychlá reakce**: Potvrďte rezervace co nejdříve
2. **Manuální kontrola**: Pravidelně kontrolujte kalendář
3. **Komunikace**: Informujte hosty o potvrzení
4. **Buffer**: Zvažte 1-denní buffer mezi rezervacemi

## 🛠️ Řešení problémů

### Import nefunguje
1. Zkontrolujte iCal URL v `.env.local`
2. Otestujte URL v prohlížeči (měl by stáhnout .ics soubor)
3. Zkontrolujte logy ve Vercel Dashboard
4. Zkuste manuální import v admin panelu

### Export nefunguje
1. Zkontrolujte, že máte potvrzené rezervace
2. Otestujte `/api/ical/export` v prohlížeči
3. Zkontrolujte, že Booking.com má správnou URL

### Rezervace se neduplikují
1. Systém kontroluje `externalId` a `source`
2. Rezervace z Booking.com mají `source: "booking.com"`
3. Rezervace z webu mají `source: "web"` nebo žádný source
4. Export filtruje externí rezervace

### Automatická synchronizace neběží
1. Zkontrolujte `vercel.json` v root složce
2. Zkontrolujte Vercel Dashboard → Cron Jobs
3. Vercel Cron vyžaduje Pro plán (nebo Hobby s limity)
4. Alternativa: Použijte externí cron službu (cron-job.org)

## 📈 Monitoring

### Admin panel
- Historie synchronizace (posledních 10 záznamů)
- Počet importovaných/přeskočených rezervací
- Chybové hlášky

### Vercel Dashboard
- Cron Jobs → Logs
- Functions → Logs
- Monitoring → Errors

### Firebase Console
- Firestore → bookings collection
- Filtr: `source == "booking.com"`

## 🔐 Bezpečnost

- iCal URL obsahuje tajný token - nesdílejte ji
- Export URL je veřejná, ale neobsahuje citlivé údaje
- Rezervace z Booking.com nemají osobní údaje hostů
- Všechny API endpointy jsou rate-limited

## 📚 Další zdroje

- [iCalendar RFC 5545](https://tools.ietf.org/html/rfc5545)
- [Booking.com Calendar Sync Help](https://partner.booking.com/en-gb/help/calendar-sync)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

## 🆘 Podpora

Pokud máte problémy:
1. Zkontrolujte tuto dokumentaci
2. Zkontrolujte logy ve Vercel Dashboard
3. Zkontrolujte historii synchronizace v admin panelu
4. Kontaktujte podporu Booking.com pro problémy s jejich iCal URL

---

**Vytvořeno**: 2025-01-19  
**Verze**: 1.0  
**Status**: ✅ Aktivní

