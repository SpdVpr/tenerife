# 🗑️ Beds24 Integrace - Odstranění

**Datum**: 2025-10-19  
**Důvod**: Přechod na přímou iCal synchronizaci s Booking.com

---

## 📋 Co bylo odstraněno

### 1. **API Endpointy** (7 souborů)
- ❌ `app/api/beds24/test/route.ts` - Test připojení
- ❌ `app/api/beds24/full-sync/route.ts` - Plná synchronizace
- ❌ `app/api/beds24/get-bookings/route.ts` - Získání rezervací
- ❌ `app/api/beds24/occupied-dates/route.ts` - Obsazené dny
- ❌ `app/api/beds24/push-bookings/route.ts` - Push rezervací
- ❌ `app/api/beds24/sync-availability/route.ts` - Sync dostupnosti
- ❌ `app/api/beds24/sync-reservations/route.ts` - Sync rezervací

### 2. **Knihovny** (3 soubory)
- ❌ `lib/beds24/index.ts` - Hlavní Beds24 API funkce
- ❌ `lib/beds24/auth.ts` - Autentizace a token management
- ❌ `lib/beds24/bookings.ts` - Správa rezervací

### 3. **Komponenty** (2 soubory)
- ❌ `components/admin/Beds24Integration.tsx` - Admin UI pro Beds24
- ❌ `components/admin/Beds24BookingsList.tsx` - Seznam Beds24 rezervací

### 4. **Dokumentace** (2 soubory)
- ❌ `BEDS24_INTEGRATION_SUMMARY.md` - Souhrn implementace
- ❌ `BEDS24_SETUP.md` - Návod na nastavení

### 5. **Konfigurace**
- ❌ Beds24 záložka v admin panelu (`app/admin/page.tsx`)
- ❌ Beds24 props v `AdminAvailabilityCalendar`
- ❌ Beds24 env proměnné v `.env.local`:
  - `NEXT_PUBLIC_BEDS24_API_KEY`
  - `NEXT_PUBLIC_BEDS24_PROPERTY_ID`

---

## 📊 Statistiky

- **Odstraněno souborů**: 14
- **Odstraněno řádků kódu**: ~1,500+
- **Odstraněno API endpointů**: 7
- **Odstraněno komponent**: 2
- **Odstraněno knihoven**: 3

---

## ✅ Co zůstalo

### Zachované funkce
- ✅ Všechny rezervace z Beds24 v Firebase (historická data)
- ✅ Kalendář stále zobrazuje staré Beds24 rezervace (pokud mají `source: 'beds24'`)
- ✅ Migrační dokumentace (`MIGRATION_BEDS24_TO_ICAL.md`)

### Nová implementace
- ✅ iCal synchronizace (`lib/ical/`)
- ✅ iCal API endpointy (`app/api/ical/`)
- ✅ iCal admin UI (`components/admin/ICalIntegration.tsx`)
- ✅ Automatická synchronizace (Vercel Cron)

---

## 🔄 Migrace dat

### Staré Beds24 rezervace
Rezervace importované přes Beds24 zůstávají v Firebase s:
```typescript
{
  source: 'beds24',
  externalId: 'beds24-booking-id',
  ...
}
```

Tyto rezervace:
- ✅ Jsou stále viditelné v admin panelu (záložka Bookings)
- ✅ Jsou stále viditelné v kalendáři
- ✅ Blokují dny v kalendáři
- ❌ Nebudou se už aktualizovat (Beds24 API není dostupné)

### Nové rezervace z Booking.com
Od teď se importují přes iCal s:
```typescript
{
  source: 'booking.com',
  externalId: 'ical-event-id',
  ...
}
```

---

## 🎯 Důvody odstranění

### 1. **Náklady**
- Beds24 vyžaduje měsíční poplatek
- iCal je zdarma

### 2. **Složitost**
- Beds24 přidává další vrstvu mezi vámi a Booking.com
- iCal je přímá integrace

### 3. **Údržba**
- Beds24 API vyžaduje token management
- Beds24 API má rate limity
- iCal je jednodušší standard

### 4. **Funkčnost**
- Pro jeden apartmán je iCal dostačující
- Beds24 je vhodný pro větší objekty s více jednotkami

---

## 📝 Poznámky pro budoucnost

### Pokud budete chtít Beds24 obnovit:
1. Kód je v Git historii (commit před odstraněním)
2. Dokumentace je zachována v `MIGRATION_BEDS24_TO_ICAL.md`
3. Env proměnné byly odstraněny, ale můžete je znovu přidat

### Pokud budete chtít přidat další platformy:
- **Airbnb**: Podporuje iCal export/import
- **VRBO**: Podporuje iCal export/import
- **Jiné**: Většina platforem podporuje iCal standard

Stačí přidat jejich iCal URL do importu a systém bude fungovat stejně!

---

## 🔗 Související dokumentace

- [ICAL_SYNC_SETUP.md](./ICAL_SYNC_SETUP.md) - Kompletní dokumentace iCal
- [ICAL_QUICKSTART.md](./ICAL_QUICKSTART.md) - Rychlý start iCal
- [MIGRATION_BEDS24_TO_ICAL.md](./MIGRATION_BEDS24_TO_ICAL.md) - Migrační průvodce
- [ICAL_INTEGRATION_SUMMARY.md](./ICAL_INTEGRATION_SUMMARY.md) - Technický souhrn

---

**Status**: ✅ Odstranění dokončeno  
**Náhrada**: iCal synchronizace  
**Datum**: 2025-10-19

