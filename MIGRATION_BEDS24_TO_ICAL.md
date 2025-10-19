# 🔄 Migrace z Beds24 na iCal synchronizaci

⚠️ **POZNÁMKA**: Beds24 integrace byla odstraněna z projektu. Tento dokument slouží pouze jako historická reference.

Průvodce přechodem z Beds24 integrace na přímou iCal synchronizaci s Booking.com.

## 🎯 Proč migrovat?

### Výhody iCal
- ✅ **Žádné poplatky** - Přímá integrace bez prostředníka
- ✅ **Jednodušší** - Méně systémů k údržbě
- ✅ **Standardní** - iCal je univerzální formát
- ✅ **Spolehlivější** - Méně bodů selhání

### Nevýhody iCal
- ⚠️ **Pomalejší** - Aktualizace každých 1-12 hodin (vs. real-time)
- ⚠️ **Méně dat** - iCal neobsahuje osobní údaje hostů
- ⚠️ **Riziko dvojích rezervací** - Kvůli prodlevě v synchronizaci

## 📋 Migrace krok za krokem

### Fáze 1: Příprava (5 minut)

1. **Zálohujte data**
   ```bash
   # Exportujte všechny rezervace z Firebase
   # V admin panelu → Bookings → Export (pokud máte)
   ```

2. **Zkontrolujte současný stav**
   - Kolik rezervací máte v systému?
   - Kolik z nich je z Booking.com (přes Beds24)?
   - Jsou všechny synchronizované?

3. **Připravte iCal URL**
   - Přihlaste se do Booking.com Extranet
   - Calendar → Calendar sync → Export calendar
   - Zkopírujte URL

### Fáze 2: Nastavení iCal (10 minut)

1. **Konfigurace**
   
   Otevřete `.env.local` a přidejte:
   ```env
   # iCal Calendar Synchronization
   BOOKING_COM_ICAL_URL=https://admin.booking.com/hotel/hoteladmin/ical.html?t=YOUR_TOKEN
   NEXT_PUBLIC_BASE_URL=https://www.cielodorado-tenerife.eu
   ```

2. **Nastavení exportu na Booking.com**
   - Booking.com Extranet → Calendar → Calendar sync
   - Add new calendar
   - URL: `https://www.cielodorado-tenerife.eu/api/ical/export`
   - Uložte

3. **První synchronizace**
   - Admin panel → iCal Sync
   - Vložte iCal URL
   - Klikněte "Plná synchronizace"
   - Zkontrolujte výsledky

### Fáze 3: Paralelní provoz (1-2 týdny)

**Doporučení**: Nechte běžet obě integrace paralelně po dobu 1-2 týdnů.

1. **Sledujte obě systémy**
   - Beds24 záložka v admin panelu
   - iCal Sync záložka v admin panelu
   - Porovnejte rezervace

2. **Kontrolní seznam**
   - [ ] iCal importuje všechny rezervace z Booking.com
   - [ ] iCal exportuje všechny webové rezervace
   - [ ] Žádné duplicitní rezervace
   - [ ] Automatická synchronizace běží každou hodinu
   - [ ] Žádné chyby v logách

3. **Testovací scénáře**
   - Vytvořte testovací rezervaci na webu → Zkontrolujte Booking.com
   - Vytvořte testovací rezervaci na Booking.com → Zkontrolujte admin panel
   - Zrušte rezervaci → Zkontrolujte synchronizaci

### Fáze 4: Vypnutí Beds24 (5 minut)

**Pouze pokud je iCal plně funkční!**

1. **Poslední kontrola**
   - Všechny rezervace jsou synchronizované
   - iCal běží bez chyb minimálně týden
   - Žádné duplicity

2. **Vypnutí Beds24 na Booking.com**
   - Booking.com Extranet → Integrations
   - Odpojte Beds24
   - Potvrďte

3. **Vypnutí Beds24 v aplikaci**
   - Můžete ponechat záložku pro historii
   - Nebo ji skrýt v `app/admin/page.tsx`

4. **Vyčištění (volitelné)**
   ```env
   # V .env.local můžete zakomentovat:
   # NEXT_PUBLIC_BEDS24_API_KEY=...
   # NEXT_PUBLIC_BEDS24_PROPERTY_ID=...
   ```

### Fáze 5: Monitoring (průběžně)

1. **První týden po migraci**
   - Denně kontrolujte synchronizaci
   - Sledujte logy ve Vercel Dashboard
   - Reagujte na chyby okamžitě

2. **Dlouhodobě**
   - Týdenní kontrola historie synchronizace
   - Měsíční kontrola duplicit
   - Aktualizace dokumentace

## 🔍 Porovnání dat

### Beds24 rezervace
```typescript
{
  firstName: "Jan",
  lastName: "Novák",
  email: "jan@example.com",
  phone: "+420 123 456 789",
  checkIn: "2024-06-15",
  checkOut: "2024-06-20",
  guests: 2,
  totalPrice: 500,
  status: "confirmed",
  source: "beds24",
  externalId: "beds24-booking-123"
}
```

### iCal rezervace
```typescript
{
  firstName: "Booking.com",
  lastName: "Guest",
  email: "",
  phone: "",
  checkIn: "2024-06-15",
  checkOut: "2024-06-20",
  guests: 2,
  totalPrice: 0,
  status: "confirmed",
  source: "booking.com",
  externalId: "ical-event-456"
}
```

**Rozdíly**:
- ❌ iCal neobsahuje jméno hosta
- ❌ iCal neobsahuje email
- ❌ iCal neobsahuje telefon
- ❌ iCal neobsahuje cenu
- ✅ iCal obsahuje datum check-in/out
- ✅ iCal obsahuje status

## 🛠️ Řešení problémů během migrace

### Duplicitní rezervace

**Problém**: Stejná rezervace se objeví 2x (z Beds24 i iCal)

**Řešení**:
1. Zkontrolujte `source` pole v Firebase
2. Smažte starší duplicitu (obvykle z Beds24)
3. Nechte iCal verzi

**Prevence**:
```typescript
// Systém automaticky kontroluje externalId
// Rezervace s různými externalId se považují za různé
```

### Chybějící rezervace

**Problém**: Rezervace z Booking.com se neimportuje

**Možné příčiny**:
1. iCal URL je neplatná
2. Booking.com ještě neaktualizoval kalendář
3. Rezervace je zrušená

**Řešení**:
1. Zkontrolujte iCal URL v prohlížeči
2. Počkejte 1-2 hodiny a zkuste znovu
3. Zkontrolujte status rezervace na Booking.com

### Synchronizace neběží

**Problém**: Automatická synchronizace se nespouští

**Řešení**:
1. Vercel Dashboard → Cron Jobs → Zkontrolujte logy
2. Zkontrolujte `vercel.json` v root složce
3. Vercel Cron vyžaduje Pro plán (nebo Hobby s limity)
4. Alternativa: Externí cron služba

## 📊 Kontrolní tabulka

| Funkce | Beds24 | iCal | Poznámka |
|--------|--------|------|----------|
| Frekvence sync | Real-time | 1-12 hodin | iCal pomalejší |
| Jméno hosta | ✅ | ❌ | iCal neobsahuje |
| Email hosta | ✅ | ❌ | iCal neobsahuje |
| Telefon | ✅ | ❌ | iCal neobsahuje |
| Cena | ✅ | ❌ | iCal neobsahuje |
| Datum | ✅ | ✅ | Obě OK |
| Status | ✅ | ✅ | Obě OK |
| Poplatky | ❌ | ✅ | iCal zdarma |
| Složitost | Vysoká | Nízká | iCal jednodušší |

## 🎯 Doporučení

### Pro malé apartmány (1-2 jednotky)
✅ **iCal je ideální**
- Nízký počet rezervací
- Prodleva není kritická
- Žádné poplatky

### Pro větší objekty (3+ jednotky)
⚠️ **Zvažte Beds24 nebo jiný channel manager**
- Více rezervací = vyšší riziko dvojích rezervací
- Real-time synchronizace je důležitá
- Potřebujete detailní údaje o hostech

### Pro Cielo Dorado (1 apartmán)
✅ **iCal je perfektní volba**
- Jeden apartmán
- Nízká frekvence rezervací
- Úspora nákladů
- Jednodušší údržba

## 📚 Další kroky

Po úspěšné migraci:

1. **Aktualizujte dokumentaci**
   - Poznamenejte si datum migrace
   - Zdokumentujte případné problémy

2. **Školení**
   - Naučte se používat nový admin panel
   - Pochopte omezení iCal

3. **Monitoring**
   - Nastavte si upozornění na chyby
   - Pravidelně kontrolujte synchronizaci

4. **Optimalizace**
   - Zvažte změnu frekvence synchronizace
   - Přidejte vlastní notifikace

## 🆘 Podpora

Pokud máte problémy během migrace:

1. **Dokumentace**
   - [ICAL_SYNC_SETUP.md](./ICAL_SYNC_SETUP.md) - Kompletní dokumentace
   - [ICAL_QUICKSTART.md](./ICAL_QUICKSTART.md) - Rychlý start

2. **Logy**
   - Admin panel → iCal Sync → Historie
   - Vercel Dashboard → Logs

3. **Rollback**
   - Pokud iCal nefunguje, můžete se vrátit k Beds24
   - Stačí znovu připojit Beds24 na Booking.com

---

**Vytvořeno**: 2025-01-19  
**Verze**: 1.0  
**Status**: ✅ Připraveno k použití

