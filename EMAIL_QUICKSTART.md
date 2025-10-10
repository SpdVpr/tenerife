# ⚡ Rychlý start - Emailový systém

## 🎯 Co potřebujete udělat (5 kroků)

### ✅ Krok 1: Nastavte heslo (2 minuty)

Otevřete soubor `.env.local` a nahraďte `YOUR_EMAIL_PASSWORD_HERE` skutečným heslem:

```env
SMTP_PASSWORD=vase_skutecne_heslo_zde
```

Heslo najdete v administraci VEDOS.cz nebo ho resetujte.

---

### ✅ Krok 2: Restartujte server (30 sekund)

```bash
# Zastavte server (Ctrl+C)
# Spusťte znovu:
npm run dev
```

---

### ✅ Krok 3: Otestujte email (1 minuta)

Otevřete v prohlížeči:
```
http://localhost:3000/api/test-email
```

**Očekávaný výsledek:**
- ✅ Vidíte: `"success": true`
- ✅ Dostanete testovací email na váš notifikační email

**Pokud vidíte chybu:**
- ❌ Zkontrolujte heslo v `.env.local`
- ❌ Zkontrolujte, že váš email existuje u vašeho poskytovatele

---

### ✅ Krok 4: Otestujte rezervaci (2 minuty)

1. Jděte na: `http://localhost:3000/#booking`
2. Vyplňte rezervační formulář
3. Odešlete rezervaci

**Očekávaný výsledek:**
- ✅ Rezervace se vytvoří
- ✅ Host dostane potvrzovací email
- ✅ Vy dostanete notifikační email

---

### ✅ Krok 5: Nasaďte na Vercel (5 minut)

1. **Nastavte environment variables na Vercelu:**
   - Jděte na: Vercel Dashboard → Project → Settings → Environment Variables
   - Přidejte všechny proměnné z `.env.local` (kromě Firebase a Admin)
   
2. **Redeploy aplikaci:**
   - Vercel Dashboard → Deployments → ... → Redeploy

3. **Otestujte v produkci:**
   - `https://www.cielodorado-tenerife.eu/api/test-email`

---

## 📧 Co se bude dít po rezervaci?

### Email pro hosta:
- ✉️ **Předmět:** Potvrzení rezervace #XXXXXXXX
- 📋 Detaily rezervace (datum, cena, hosté)
- 💰 Cenový souhrn
- 💳 Platební informace (záloha 30%)
- 📞 Kontaktní informace

### Email pro vás:
- ✉️ **Předmět:** 🔔 Nová rezervace #XXXXXXXX
- 👤 Kontaktní údaje hosta
- 📋 Detaily rezervace
- 💬 Zpráva od hosta
- 🔗 Odkaz do admin panelu

---

## 🔧 Volitelné: MX záznamy (pro příjem emailů)

Pokud chcete přijímat odpovědi na emaily, přidejte MX záznamy na Vercelu.

**Podrobný návod:** `VERCEL_DNS_SETUP.md`

**Rychlá verze:**
1. Vercel → Settings → Domains → cielodorado-tenerife.eu
2. Přidejte 5 MX záznamů (viz `VERCEL_DNS_SETUP.md`)
3. Počkejte 30 minut na propagaci

---

## 📚 Dokumentace

- **Kompletní návod:** `EMAIL_SETUP.md`
- **DNS nastavení:** `VERCEL_DNS_SETUP.md`
- **Tento soubor:** Rychlý start

---

## ❓ Problémy?

### "Email configuration verification failed"
→ Zkontrolujte heslo v `.env.local`

### "Missing environment variables"
→ Restartujte server (`Ctrl+C` a `npm run dev`)

### Emaily se neodesílají v produkci
→ Zkontrolujte environment variables na Vercelu a udělejte redeploy

### Emaily končí ve spamu
→ Přidejte SPF záznam (viz `VERCEL_DNS_SETUP.md`)

---

## ✅ Checklist

- [ ] Heslo nastaveno v `.env.local`
- [ ] Server restartován
- [ ] Testovací email úspěšně odeslán
- [ ] Testovací rezervace funguje
- [ ] Environment variables nastaveny na Vercelu
- [ ] Aplikace redeployována
- [ ] Produkční test úspěšný

---

**Hotovo! 🎉** Váš emailový systém je připraven k použití.

