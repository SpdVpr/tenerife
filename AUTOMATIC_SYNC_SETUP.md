# ⏰ Automatická synchronizace - Nastavení

Průvodce nastavením automatické synchronizace iCal kalendářů s Booking.com.

---

## 🎯 Přehled

Automatická synchronizace zajišťuje, že rezervace z Booking.com se pravidelně importují do vašeho systému.

### Frekvence
- **Doporučeno**: Každou hodinu (60 minut)
- **Minimum**: Každé 2 hodiny
- **Maximum**: Každých 30 minut (může být rate-limited)

### Metody
1. **Vercel Cron** (produkce) - ✅ Doporučeno
2. **Externí Cron služba** (development + produkce)
3. **Manuální spuštění** (admin panel)

---

## 1️⃣ Vercel Cron (Produkce)

### ✅ Výhody
- Automatické spouštění na produkci
- Žádná konfigurace potřeba
- Spolehlivé
- Zdarma (v rámci Vercel plánu)

### ⚠️ Omezení
- **Funguje POUZE na produkci** (ne v development módu)
- Vyžaduje Vercel Pro plán pro častější spouštění
- Hobby plán: max 1x za hodinu

### 📋 Konfigurace

Soubor `vercel.json` (již nakonfigurováno):
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

**Schedule formát** (cron syntax):
- `0 * * * *` - Každou hodinu (0. minuta)
- `*/30 * * * *` - Každých 30 minut
- `0 */2 * * *` - Každé 2 hodiny
- `0 0 * * *` - Jednou denně o půlnoci

### 🚀 Aktivace

1. **Nasaďte na Vercel**:
   ```bash
   git add .
   git commit -m "feat: Add automatic iCal sync"
   git push
   ```

2. **Ověřte v Vercel Dashboard**:
   - Přihlaste se na [vercel.com](https://vercel.com)
   - Vyberte projekt
   - Jděte na **Settings** → **Cron Jobs**
   - Měli byste vidět: `/api/ical/sync` s schedule `0 * * * *`

3. **Zkontrolujte logy**:
   - **Vercel Dashboard** → **Logs**
   - Filtr: `cron`
   - Měli byste vidět spuštění každou hodinu

### 🔍 Testování

Po nasazení počkejte hodinu a zkontrolujte:
```bash
# V Vercel Dashboard → Logs
# Hledejte:
🔄 Starting iCal synchronization...
📥 Step 1: Importing from Booking.com...
✅ Import complete: X imported, Y skipped
```

---

## 2️⃣ Externí Cron služba (Development + Produkce)

Pro development nebo jako backup můžete použít externí cron službu.

### Doporučené služby

#### A) **cron-job.org** (Zdarma)
1. Jděte na [cron-job.org](https://cron-job.org)
2. Vytvořte účet
3. Klikněte **Create Cronjob**
4. Nastavte:
   - **Title**: Cielo Dorado iCal Sync
   - **URL**: `https://www.cielodorado-tenerife.eu/api/ical/sync`
   - **Schedule**: Every hour (nebo custom)
   - **Request method**: POST
   - **Request body**: (nechte prázdné, použije se env variable)
5. Uložte

#### B) **EasyCron** (Zdarma tier)
1. Jděte na [easycron.com](https://www.easycron.com)
2. Vytvořte účet
3. Vytvořte nový cron job:
   - **URL**: `https://www.cielodorado-tenerife.eu/api/ical/sync`
   - **Cron Expression**: `0 * * * *`
   - **HTTP Method**: POST
4. Uložte

#### C) **GitHub Actions** (Zdarma)
Vytvořte `.github/workflows/ical-sync.yml`:
```yaml
name: iCal Sync

on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger iCal Sync
        run: |
          curl -X POST https://www.cielodorado-tenerife.eu/api/ical/sync \
            -H "Content-Type: application/json"
```

---

## 3️⃣ Manuální spuštění (Admin Panel)

### Kdy použít
- Testování
- Okamžitá synchronizace po nové rezervaci
- Troubleshooting

### Jak spustit
1. Přihlaste se do admin panelu
2. Jděte na záložku **iCal Sync**
3. Klikněte **Plná synchronizace**
4. Zkontrolujte výsledky v historii

---

## 🔧 Konfigurace env proměnných

### Produkce (Vercel)
1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Přidejte:
   ```
   BOOKING_COM_ICAL_URL=https://ical.booking.com/v1/export?t=YOUR_TOKEN
   NEXT_PUBLIC_BASE_URL=https://www.cielodorado-tenerife.eu
   ```
3. Klikněte **Save**
4. Redeploy projekt

### Development (Local)
Soubor `.env.local`:
```env
BOOKING_COM_ICAL_URL=https://ical.booking.com/v1/export?t=YOUR_TOKEN
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 📊 Monitoring

### Vercel Dashboard
1. **Logs** → Filtr: `ical` nebo `sync`
2. Hledejte:
   - ✅ `Starting iCal synchronization`
   - ✅ `Import complete`
   - ❌ `Sync error`

### Admin Panel
1. **iCal Sync** záložka
2. **Historie synchronizace** (posledních 10)
3. Zkontrolujte:
   - Timestamp
   - Status (success/error)
   - Počet importovaných/přeskočených

### Email notifikace (volitelné)
Můžete přidat email notifikace při chybách:

```typescript
// app/api/ical/sync/route.ts
if (!importResult.success) {
  // Send email notification
  await fetch('/api/send-error-email', {
    method: 'POST',
    body: JSON.stringify({
      subject: 'iCal Sync Failed',
      error: importResult.message
    })
  });
}
```

---

## 🐛 Troubleshooting

### Cron neběží
**Problém**: Synchronizace se nespouští automaticky

**Řešení**:
1. Zkontrolujte Vercel Dashboard → Cron Jobs
2. Ověřte, že jste na produkci (ne localhost)
3. Zkontrolujte Vercel plán (Hobby má limity)
4. Použijte externí cron službu jako backup

### Import selhává
**Problém**: `Sync error: Unexpected end of JSON input`

**Řešení**:
1. Zkontrolujte `BOOKING_COM_ICAL_URL` v env variables
2. Otestujte URL v prohlížeči (měl by stáhnout .ics soubor)
3. Zkontrolujte logy v Vercel Dashboard
4. Zkuste manuální import v admin panelu

### Duplicitní rezervace
**Problém**: Stejná rezervace se importuje vícekrát

**Řešení**:
- Systém automaticky kontroluje `externalId`
- Pokud se stále duplikují, zkontrolujte Firebase data
- Smažte duplicity manuálně v admin panelu

### Rate limiting
**Problém**: Booking.com blokuje požadavky

**Řešení**:
- Snižte frekvenci synchronizace (každé 2 hodiny místo každou hodinu)
- Booking.com má vlastní rate limity
- Použijte User-Agent header (již implementováno)

---

## 📈 Best Practices

### 1. Frekvence
- **Nízká sezóna**: Každé 2 hodiny
- **Vysoká sezóna**: Každou hodinu
- **Kritické období**: Každých 30 minut (s externí službou)

### 2. Monitoring
- Kontrolujte logy týdně
- Nastavte alerting pro chyby
- Sledujte počet importovaných rezervací

### 3. Backup
- Používejte Vercel Cron + externí službu
- Manuální kontrola po každé nové rezervaci
- Pravidelné zálohy Firebase dat

### 4. Testing
- Testujte po každém nasazení
- Ověřte import v admin panelu
- Zkontrolujte kalendář

---

## 🎯 Doporučené nastavení pro Cielo Dorado

### Produkce
```json
{
  "method": "Vercel Cron",
  "frequency": "Every hour (0 * * * *)",
  "backup": "cron-job.org (každou hodinu)",
  "monitoring": "Vercel Dashboard + Admin Panel"
}
```

### Development
```json
{
  "method": "Manual (Admin Panel)",
  "frequency": "On demand",
  "testing": "Before each deployment"
}
```

---

## 📚 Další zdroje

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Cron Expression Generator](https://crontab.guru/)
- [ICAL_SYNC_SETUP.md](./ICAL_SYNC_SETUP.md) - Kompletní dokumentace

---

**Status**: ✅ Připraveno k použití  
**Poslední aktualizace**: 2025-10-19

