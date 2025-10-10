# 📧 Nastavení emailového systému - Cielo Dorado

Tento dokument vás provede kompletním nastavením automatického odesílání emailů po vytvoření rezervace.

## ✅ Co už je hotové

- ✅ Nodemailer nainstalován
- ✅ Email šablony vytvořeny (HTML + text)
- ✅ API endpointy pro odesílání emailů
- ✅ Integrace s rezervačním formulářem
- ✅ Testovací endpoint pro ověření konfigurace

## 🔧 Co ještě musíte udělat

### 1. Nastavení DNS záznamů (MX) na Vercelu

Protože máte doménu `cielodorado-tenerife.eu` nastavenou na Vercel DNS, ale email hosting u VEDOS.cz, musíte přidat MX záznamy.

#### Postup:

1. **Přihlaste se do Vercel Dashboard**: https://vercel.com/dashboard
2. Jděte na váš projekt **cielo-dorado**
3. Klikněte na **Settings** → **Domains**
4. Najděte doménu `cielodorado-tenerife.eu` a klikněte na ni
5. Přidejte následující **MX záznamy**:

```
Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.email
Priority: 10

Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.global
Priority: 10

Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.com
Priority: 10

Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.mx
Priority: 10

Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.online
Priority: 20
```

**Poznámka:** MX záznamy jsou potřeba pouze pro **příjem** emailů. Pro odesílání přes SMTP to není nutné, ale je to doporučené pro profesionální nastavení.

#### Ověření MX záznamů:

Po přidání počkejte 5-30 minut na propagaci DNS a ověřte pomocí:
- Online nástroj: https://mxtoolbox.com/
- Zadejte: `cielodorado-tenerife.eu`
- Měli byste vidět všechny MX záznamy WEDOS

---

### 2. Nastavení hesla v .env.local

Otevřete soubor `.env.local` v kořenové složce projektu a **nahraďte** `YOUR_EMAIL_PASSWORD_HERE` skutečným heslem k emailové schránce `info@cielodorado-tenerife.eu`.

```env
# SMTP Email Configuration (VEDOS/WEDOS)
SMTP_HOST=wes1-smtp.wedos.net
SMTP_PORT=587
SMTP_USER=info@cielodorado-tenerife.eu
SMTP_PASSWORD=zde_vlozte_skutecne_heslo
SMTP_FROM_EMAIL=info@cielodorado-tenerife.eu
NOTIFICATION_EMAIL=info@cielodorado-tenerife.eu
```

**Kde najít heslo:**
- Heslo, které jste nastavili při vytváření emailové schránky v administraci VEDOS.cz
- Pokud jste ho zapomněli, můžete ho resetovat v administraci VEDOS.cz

**⚠️ DŮLEŽITÉ:** 
- Soubor `.env.local` je v `.gitignore` a nebude commitován do Gitu (bezpečnost)
- Nikdy nesdílejte heslo veřejně

---

### 3. Nastavení environment variables na Vercelu

Pro produkční prostředí musíte nastavit stejné proměnné i na Vercelu:

1. **Přihlaste se do Vercel Dashboard**
2. Jděte na projekt **cielo-dorado**
3. Klikněte na **Settings** → **Environment Variables**
4. Přidejte následující proměnné:

| Name | Value | Environment |
|------|-------|-------------|
| `SMTP_HOST` | `wes1-smtp.wedos.net` | Production, Preview, Development |
| `SMTP_PORT` | `587` | Production, Preview, Development |
| `SMTP_USER` | `info@cielodorado-tenerife.eu` | Production, Preview, Development |
| `SMTP_PASSWORD` | `vaše_heslo` | Production, Preview, Development |
| `SMTP_FROM_EMAIL` | `info@cielodorado-tenerife.eu` | Production, Preview, Development |
| `NOTIFICATION_EMAIL` | `info@cielodorado-tenerife.eu` | Production, Preview, Development |

5. Klikněte **Save**
6. **Redeploy** aplikaci, aby se změny projevily

---

## 🧪 Testování

### Krok 1: Lokální testování

1. **Spusťte vývojový server:**
```bash
npm run dev
```

2. **Otevřete testovací endpoint v prohlížeči:**
```
http://localhost:3000/api/test-email
```

3. **Co by se mělo stát:**
   - ✅ Měli byste vidět JSON odpověď s `"success": true`
   - ✅ Na email `info@cielodorado-tenerife.eu` by měl přijít testovací email
   - ✅ V konzoli by mělo být: `✅ Email server is ready to send messages`

4. **Pokud vidíte chybu:**
   - ❌ Zkontrolujte heslo v `.env.local`
   - ❌ Zkontrolujte, že všechny proměnné jsou správně nastavené
   - ❌ Zkontrolujte, že email `info@cielodorado-tenerife.eu` existuje v VEDOS.cz

### Krok 2: Test rezervačního formuláře

1. **Jděte na stránku s rezervačním formulářem:**
```
http://localhost:3000/#booking
```

2. **Vyplňte formulář a odešlete testovací rezervaci**

3. **Co by se mělo stát:**
   - ✅ Rezervace se vytvoří v Firebase
   - ✅ Host dostane potvrzovací email na zadaný email
   - ✅ Vy dostanete notifikační email na `info@cielodorado-tenerife.eu`
   - ✅ Zobrazí se úspěšná zpráva

4. **Zkontrolujte konzoli prohlížeče (F12):**
   - Měli byste vidět: `✅ Confirmation emails sent successfully`

---

## 📧 Jak fungují emaily

### Email pro hosta (potvrzení rezervace):

- **Předmět:** `Potvrzení rezervace #XXXXXXXX - Cielo Dorado Tenerife`
- **Obsah:**
  - Poděkování za rezervaci
  - Detaily rezervace (datum, počet nocí, hosté)
  - Cenový souhrn (cena za noc, úklidový poplatek, celková cena)
  - Platební informace (záloha 30%, termíny plateb)
  - Zpráva od hosta (pokud ji napsal)
  - Kontaktní informace
- **Formát:** Krásný HTML email + plain text alternativa

### Email pro vás (notifikace o nové rezervaci):

- **Předmět:** `🔔 Nová rezervace #XXXXXXXX - Jméno Hosta`
- **Obsah:**
  - Informace o nové rezervaci
  - Detaily rezervace
  - Kontaktní údaje hosta (email, telefon)
  - Zpráva od hosta
  - Odkaz do admin panelu
  - Další kroky (co udělat)
- **Formát:** Krásný HTML email + plain text alternativa

---

## 🔍 Řešení problémů

### Problém: "Email configuration verification failed"

**Řešení:**
1. Zkontrolujte heslo v `.env.local`
2. Zkontrolujte, že email `info@cielodorado-tenerife.eu` existuje v VEDOS.cz
3. Zkontrolujte, že SMTP server je `wes1-smtp.wedos.net` a port `587`
4. Zkuste se přihlásit do webmailu: https://webmail.wedos.net/

### Problém: "Missing environment variables"

**Řešení:**
1. Zkontrolujte, že soubor `.env.local` existuje v kořenové složce
2. Zkontrolujte, že všechny proměnné jsou nastavené (bez `YOUR_EMAIL_PASSWORD_HERE`)
3. Restartujte vývojový server (`Ctrl+C` a pak `npm run dev`)

### Problém: Emaily se neodesílají v produkci (Vercel)

**Řešení:**
1. Zkontrolujte, že jste nastavili environment variables na Vercelu
2. Zkontrolujte, že jste po nastavení proměnných udělali redeploy
3. Zkontrolujte logy na Vercelu: Dashboard → Project → Deployments → View Function Logs

### Problém: Emaily končí ve spamu

**Řešení:**
1. Přidejte SPF záznam do DNS (Vercel):
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.wedos.com ~all
   ```
2. Přidejte DKIM záznam (najdete v administraci VEDOS.cz)
3. Počkejte 24-48 hodin na propagaci DNS

### Problém: Host nedostává emaily

**Řešení:**
1. Zkontrolujte spam složku
2. Zkontrolujte, že email byl zadán správně
3. Zkontrolujte logy v konzoli prohlížeče
4. Zkontrolujte logy na serveru (Vercel Function Logs)

---

## 📊 Limity a doporučení

### VEDOS.cz Webhosting limity:
- **500 emailů/den** přes SMTP
- **100 MB** maximální velikost emailu
- Limity se resetují každý den o půlnoci

### Doporučení:
- ✅ Pro apartmán je 500 emailů/den **více než dostačující**
- ✅ I při 100 rezervacích měsíčně je to jen ~6-10 emailů denně
- ✅ Emaily jsou transakční (povolené), ne hromadné (zakázané)
- ✅ Pokud byste potřebovali více, můžete upgradovat na Mailhosting Business (2500/den)

---

## 🎨 Přizpůsobení emailů

Pokud chcete změnit obsah nebo design emailů, upravte soubor:
```
lib/email/templates.ts
```

Můžete změnit:
- Texty a překlady
- Barvy a styly
- Strukturu emailu
- Přidat další informace
- Změnit platební instrukce

---

## 📝 Checklist

Před spuštěním do produkce zkontrolujte:

- [ ] MX záznamy přidány na Vercelu
- [ ] Heslo nastaveno v `.env.local`
- [ ] Testovací email úspěšně odeslán (`/api/test-email`)
- [ ] Testovací rezervace úspěšně vytvořena a emaily odeslány
- [ ] Environment variables nastaveny na Vercelu
- [ ] Aplikace redeployována na Vercelu
- [ ] Produkční test rezervace funguje
- [ ] Emaily nekončí ve spamu
- [ ] Kontaktní informace v emailech jsou správné

---

## 🚀 Další vylepšení (volitelné)

V budoucnu můžete přidat:

1. **Připomínkové emaily:**
   - Email 7 dní před příjezdem s informacemi o check-in
   - Email den před příjezdem s potvrzením

2. **Email po odjezdu:**
   - Poděkování za návštěvu
   - Žádost o recenzi

3. **Platební instrukce:**
   - Automatické generování platebních údajů
   - QR kód pro platbu

4. **Email šablony v češtině a angličtině:**
   - Automatická detekce jazyka podle prohlížeče hosta

5. **Email notifikace pro změny:**
   - Potvrzení rezervace (změna statusu)
   - Zrušení rezervace

---

## 📞 Podpora

Pokud máte jakékoliv problémy nebo otázky:
- Zkontrolujte tento dokument
- Zkontrolujte konzoli prohlížeče (F12)
- Zkontrolujte logy na Vercelu
- Kontaktujte podporu VEDOS.cz pro problémy s emailem

---

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Projekt:** Cielo Dorado Tenerife - Rezervační systém

