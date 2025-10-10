# 🚀 Nastavení Environment Variables na Vercelu

## Proč to potřebujete?

Environment variables v `.env.local` fungují pouze **lokálně** na vašem počítači. Pro produkční prostředí (Vercel) musíte nastavit stejné proměnné i tam.

---

## 📋 Krok za krokem

### 1. Přihlaste se do Vercel

1. Jděte na: https://vercel.com/login
2. Přihlaste se svým účtem

### 2. Najděte váš projekt

1. V dashboardu najděte projekt **cielo-dorado**
2. Klikněte na něj

### 3. Otevřete nastavení

1. Klikněte na **Settings** (v horním menu)
2. V levém menu klikněte na **Environment Variables**

### 4. Přidejte SMTP proměnné

Klikněte na **Add New** a přidejte následující proměnné **jednu po druhé**:

---

#### Proměnná 1: SMTP_HOST

```
Name:  SMTP_HOST
Value: wes1-smtp.wedos.net
```

**Environment:** Zaškrtněte všechny tři:
- ✅ Production
- ✅ Preview
- ✅ Development

Klikněte **Save**

---

#### Proměnná 2: SMTP_PORT

```
Name:  SMTP_PORT
Value: 587
```

**Environment:** Zaškrtněte všechny tři:
- ✅ Production
- ✅ Preview
- ✅ Development

Klikněte **Save**

---

#### Proměnná 3: SMTP_USER

```
Name:  SMTP_USER
Value: info@cielodorado-tenerife.eu
```

**Environment:** Zaškrtněte všechny tři:
- ✅ Production
- ✅ Preview
- ✅ Development

Klikněte **Save**

---

#### Proměnná 4: SMTP_PASSWORD

```
Name:  SMTP_PASSWORD
Value: [VAŠE HESLO K EMAILU]
```

**⚠️ DŮLEŽITÉ:** Zde zadejte skutečné heslo k emailové schránce `info@cielodorado-tenerife.eu`

**Environment:** Zaškrtněte všechny tři:
- ✅ Production
- ✅ Preview
- ✅ Development

Klikněte **Save**

---

#### Proměnná 5: SMTP_FROM_EMAIL

```
Name:  SMTP_FROM_EMAIL
Value: info@cielodorado-tenerife.eu
```

**Environment:** Zaškrtněte všechny tři:
- ✅ Production
- ✅ Preview
- ✅ Development

Klikněte **Save**

---

#### Proměnná 6: NOTIFICATION_EMAIL

```
Name:  NOTIFICATION_EMAIL
Value: info@cielodorado-tenerife.eu
```

**Environment:** Zaškrtněte všechny tři:
- ✅ Production
- ✅ Preview
- ✅ Development

Klikněte **Save**

---

### 5. Ověřte nastavení

Po přidání všech proměnných byste měli vidět seznam:

```
SMTP_HOST                 wes1-smtp.wedos.net
SMTP_PORT                 587
SMTP_USER                 info@cielodorado-tenerife.eu
SMTP_PASSWORD             ••••••••••••••••
SMTP_FROM_EMAIL           info@cielodorado-tenerife.eu
NOTIFICATION_EMAIL        info@cielodorado-tenerife.eu
```

---

### 6. Redeploy aplikaci

**⚠️ DŮLEŽITÉ:** Environment variables se projeví až po redeployi!

1. Jděte na **Deployments** (v horním menu)
2. Najděte poslední deployment
3. Klikněte na **...** (tři tečky)
4. Klikněte na **Redeploy**
5. Potvrďte **Redeploy**

Počkejte 1-2 minuty, než se aplikace znovu nasadí.

---

## ✅ Testování v produkci

Po redeployi otestujte, že emaily fungují:

### Test 1: Testovací endpoint

Otevřete v prohlížeči:
```
https://www.cielodorado-tenerife.eu/api/test-email
```

**Očekávaný výsledek:**
- ✅ Vidíte: `"success": true`
- ✅ Dostanete testovací email na `info@cielodorado-tenerife.eu`

**Pokud vidíte chybu:**
- ❌ Zkontrolujte, že jste nastavili všechny proměnné
- ❌ Zkontrolujte, že heslo je správné
- ❌ Zkontrolujte, že jste udělali redeploy

### Test 2: Rezervační formulář

1. Jděte na: `https://www.cielodorado-tenerife.eu/#booking`
2. Vyplňte rezervační formulář
3. Odešlete rezervaci

**Očekávaný výsledek:**
- ✅ Rezervace se vytvoří
- ✅ Host dostane potvrzovací email
- ✅ Vy dostanete notifikační email

---

## 🔍 Řešení problémů

### Problém: "Missing environment variables"

**Řešení:**
1. Zkontrolujte, že jste přidali všech 6 proměnných
2. Zkontrolujte, že jste zaškrtli všechny tři prostředí (Production, Preview, Development)
3. Udělejte redeploy

### Problém: "Email configuration verification failed"

**Řešení:**
1. Zkontrolujte heslo - je správné?
2. Zkontrolujte, že email `info@cielodorado-tenerife.eu` existuje v VEDOS.cz
3. Zkuste se přihlásit do webmailu: https://webmail.wedos.net/

### Problém: Emaily se neodesílají

**Řešení:**
1. Zkontrolujte Function Logs na Vercelu:
   - Dashboard → Project → Deployments → View Function Logs
2. Hledejte chybové hlášky
3. Zkontrolujte, že všechny proměnné jsou správně nastavené

### Problém: Vidím "Redacted" místo hodnoty

**To je normální!** Vercel skrývá hodnoty environment variables z bezpečnostních důvodů. Můžete je pouze přidat nebo smazat, ne zobrazit.

---

## 📊 Přehled všech Environment Variables

Po dokončení byste měli mít na Vercelu tyto proměnné:

### Firebase (už máte):
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Admin (už máte):
```
ADMIN_USERNAME
ADMIN_PASSWORD
```

### SMTP (nové):
```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM_EMAIL
NOTIFICATION_EMAIL
```

**Celkem:** 14 proměnných

---

## 🔒 Bezpečnost

### ✅ Dobré praktiky:
- ✅ Nikdy nesdílejte heslo veřejně
- ✅ Nikdy necommitujte `.env.local` do Gitu
- ✅ Používejte silné heslo pro email
- ✅ Pravidelně měňte heslo

### ⚠️ Co nedělat:
- ❌ Nesdílejte screenshot s heslem
- ❌ Neposílejte heslo emailem
- ❌ Neukládejte heslo do kódu
- ❌ Nepoužívejte stejné heslo pro více služeb

---

## 📝 Checklist

- [ ] Přihlášen do Vercel
- [ ] Projekt cielo-dorado otevřen
- [ ] Settings → Environment Variables otevřeno
- [ ] SMTP_HOST přidán
- [ ] SMTP_PORT přidán
- [ ] SMTP_USER přidán
- [ ] SMTP_PASSWORD přidán (s heslem!)
- [ ] SMTP_FROM_EMAIL přidán
- [ ] NOTIFICATION_EMAIL přidán
- [ ] Všechny proměnné mají zaškrtnuté všechny 3 prostředí
- [ ] Aplikace redeployována
- [ ] Testovací endpoint funguje
- [ ] Testovací rezervace funguje

---

## 🎉 Hotovo!

Po dokončení těchto kroků bude váš emailový systém plně funkční v produkci!

**Další kroky:**
1. ✅ Otestujte rezervační formulář
2. ✅ Zkontrolujte, že emaily přicházejí
3. ✅ Zkontrolujte, že nekončí ve spamu
4. ✅ (Volitelně) Přidejte MX záznamy (viz `VERCEL_DNS_SETUP.md`)

---

**Poznámka:** Pokud v budoucnu změníte heslo k emailu, musíte aktualizovat `SMTP_PASSWORD` na Vercelu a udělat redeploy.

