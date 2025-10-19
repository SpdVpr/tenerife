# 🚀 iCal Synchronizace - Rychlý start

Nastavení synchronizace s Booking.com za 5 minut.

## ✅ Checklist

- [ ] Získat iCal URL z Booking.com
- [ ] Přidat URL do `.env.local`
- [ ] Nastavit export URL na Booking.com
- [ ] Spustit první synchronizaci
- [ ] Ověřit automatickou synchronizaci

## 📝 Krok za krokem

### 1️⃣ Booking.com → Váš web (2 minuty)

1. **Booking.com Extranet** → **Calendar** → **Calendar sync**
2. Zkopírujte **Export calendar URL**
3. Otevřete `.env.local` a přidejte:
   ```env
   BOOKING_COM_ICAL_URL=https://admin.booking.com/hotel/hoteladmin/ical.html?t=YOUR_TOKEN
   ```
4. Restartujte aplikaci

### 2️⃣ Váš web → Booking.com (2 minuty)

1. **Booking.com Extranet** → **Calendar** → **Calendar sync**
2. Klikněte **Add new calendar**
3. Vložte URL:
   ```
   https://www.cielodorado-tenerife.eu/api/ical/export
   ```
4. Uložte

### 3️⃣ První synchronizace (1 minuta)

1. Otevřete **Admin panel** → **iCal Sync**
2. Klikněte **Plná synchronizace**
3. Zkontrolujte výsledky

## 🎉 Hotovo!

Synchronizace nyní běží automaticky každou hodinu.

## 🔍 Ověření

### Test exportu
```
https://www.cielodorado-tenerife.eu/api/ical/export
```
Měl by se stáhnout `.ics` soubor s vašimi rezervacemi.

### Test importu
V admin panelu → iCal Sync → Historie synchronizace

### Test automatické synchronizace
Vercel Dashboard → Cron Jobs → Logs

## ⚙️ Konfigurace

### Změna frekvence synchronizace

Upravte `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/ical/sync",
      "schedule": "0 * * * *"  // Každou hodinu
    }
  ]
}
```

Možnosti:
- `0 * * * *` - Každou hodinu (doporučeno)
- `*/30 * * * *` - Každých 30 minut
- `0 */2 * * *` - Každé 2 hodiny

## 📊 Co se synchronizuje

### Export (Váš web → Booking.com)
- ✅ Potvrzené rezervace z webu
- ✅ Datum check-in a check-out
- ✅ Status (potvrzeno/zrušeno)
- ❌ Osobní údaje hostů (z bezpečnostních důvodů)

### Import (Booking.com → Váš web)
- ✅ Všechny rezervace z Booking.com
- ✅ Datum check-in a check-out
- ✅ Status rezervace
- ❌ Jméno hosta (zobrazí se jako "Booking.com Guest")
- ❌ Cena (iCal formát to neposkytuje)

## ⚠️ Důležité

1. **Frekvence**: Booking.com aktualizuje každých 1-12 hodin
2. **Prodleva**: Může být až 13 hodin mezi rezervací a synchronizací
3. **Dvojí rezervace**: Rychle potvrzujte rezervace a kontrolujte kalendář
4. **Čištění**: Systém automaticky přidává 1 den po check-out

## 🆘 Problémy?

### Import nefunguje
```bash
# Zkontrolujte URL v .env.local
cat .env.local | grep BOOKING_COM_ICAL_URL

# Otestujte URL v prohlížeči
# Měl by stáhnout .ics soubor
```

### Export nefunguje
```bash
# Otestujte export endpoint
curl https://www.cielodorado-tenerife.eu/api/ical/export

# Měl by vrátit iCal obsah
```

### Automatická synchronizace neběží
1. Vercel Dashboard → Cron Jobs
2. Zkontrolujte, že máte Vercel Pro plán (nebo Hobby s limity)
3. Alternativa: Externí cron služba

## 📚 Další informace

Kompletní dokumentace: [ICAL_SYNC_SETUP.md](./ICAL_SYNC_SETUP.md)

---

**Potřebujete pomoc?** Zkontrolujte logy v admin panelu nebo Vercel Dashboard.

