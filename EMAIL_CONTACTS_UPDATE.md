# 📧 Aktualizace kontaktních informací v emailech

## 📝 Shrnutí změn

### 1. Kontaktní informace v emailech hostům

**Změněno z:**
```
Email: info@cielodorado-tenerife.eu
Telefon: +420 777 123 456
```

**Na:**
```
Email: martin.holann@gmail.com
```

### 2. Notifikace o nových rezervacích

**Před:** Notifikace se posílaly jen na `info@cielodorado-tenerife.eu`

**Nyní:** Notifikace se posílají na **OBA** emaily:
- ✅ `info@cielodorado-tenerife.eu`
- ✅ `martin.holann@gmail.com`

---

## 🎯 Co to znamená

### Pro hosty:
- Když host dostane potvrzovací email, uvidí kontakt: **martin.holann@gmail.com**
- Host může psát dotazy na tento email

### Pro majitele:
- Když někdo vytvoří rezervaci, dostanete notifikaci na **OBA** emaily:
  - `info@cielodorado-tenerife.eu`
  - `martin.holann@gmail.com`
- Nemusíte kontrolovat jen jeden email - dostanete to na oba

---

## 🔧 Technické detaily

### Upravené soubory:

#### 1. `lib/email/templates.ts`
- Změněn kontaktní email v HTML šabloně
- Změněn kontaktní email v textové šabloně
- Odstraněno telefonní číslo

#### 2. `lib/email/config.ts`
- Přidána podpora pro více notifikačních emailů
- Nové pole: `additionalNotificationEmails`
- Podporuje environment variable: `ADDITIONAL_NOTIFICATION_EMAILS`

#### 3. `lib/email/send.ts`
- Funkce `sendOwnerNotificationEmail()` nyní posílá na všechny emaily
- Kombinuje `NOTIFICATION_EMAIL` + `ADDITIONAL_NOTIFICATION_EMAILS`

#### 4. `.env.example`
- Přidána dokumentace pro `ADDITIONAL_NOTIFICATION_EMAILS`

---

## 📋 Konfigurace

### Lokální vývoj (`.env.local`)

Můžete přidat další emaily (volitelné):

```env
# Primární notifikační email
NOTIFICATION_EMAIL=info@cielodorado-tenerife.eu

# Další notifikační emaily (volitelné, oddělené čárkou)
ADDITIONAL_NOTIFICATION_EMAILS=martin.holann@gmail.com
```

**Poznámka:** Pokud `ADDITIONAL_NOTIFICATION_EMAILS` není nastaveno, použije se výchozí hodnota `martin.holann@gmail.com` (hardcoded v kódu).

### Vercel (Produkce)

Můžete přidat environment variable:

```
Name: ADDITIONAL_NOTIFICATION_EMAILS
Value: martin.holann@gmail.com
```

Nebo můžete přidat více emailů oddělených čárkou:

```
Value: martin.holann@gmail.com,another@example.com
```

---

## ✅ Výhody

### 1. Redundance
- Pokud jeden email nefunguje, dostanete notifikaci na druhý
- Žádná ztracená rezervace

### 2. Flexibilita
- Můžete přidat další emaily přes environment variable
- Nemusíte měnit kód

### 3. Jednoduchost pro hosty
- Host vidí jeden jasný kontaktní email
- Nemusí vybírat, na který email psát

---

## 🧪 Testování

### Test 1: Kontaktní informace v emailu

1. Vytvořte testovací rezervaci
2. Zkontrolujte email, který dostane host
3. Ověřte, že kontaktní email je: `martin.holann@gmail.com`

### Test 2: Notifikace na oba emaily

1. Vytvořte testovací rezervaci
2. Zkontrolujte **OBA** emaily:
   - `info@cielodorado-tenerife.eu`
   - `martin.holann@gmail.com`
3. Ověřte, že oba dostaly notifikaci

---

## 📊 Příklad emailu hostovi

### Kontaktní sekce:

```
📞 Kontaktní informace

Email: martin.holann@gmail.com
Web: www.cielodorado-tenerife.eu
```

---

## 📊 Příklad notifikace majiteli

### Odesláno na:
```
To: info@cielodorado-tenerife.eu, martin.holann@gmail.com
```

### Obsah:
```
🎉 Nová rezervace #1001

INFORMACE O HOSTOVI:
Jméno: Jan Novák
Email: jan.novak@example.com
Telefon: +420 123 456 789

DETAILY REZERVACE:
Příjezd: 15. března 2025
Odjezd: 22. března 2025
Počet nocí: 7
Počet hostů: 2

CENA:
Cena za noc: 2,500 Kč
Celková cena: 17,500 Kč
```

---

## 🔄 Jak změnit emaily v budoucnu

### Změnit kontaktní email pro hosty:

Upravte soubor `lib/email/templates.ts`:

```typescript
<p><strong>Email:</strong> novy_email@example.com</p>
```

### Přidat další notifikační email:

**Možnost 1:** Přes environment variable (doporučeno)

```env
ADDITIONAL_NOTIFICATION_EMAILS=email1@example.com,email2@example.com,email3@example.com
```

**Možnost 2:** Změnit výchozí hodnotu v kódu

Upravte soubor `lib/email/config.ts`:

```typescript
additionalNotificationEmails: process.env.ADDITIONAL_NOTIFICATION_EMAILS 
  ? process.env.ADDITIONAL_NOTIFICATION_EMAILS.split(',').map(e => e.trim())
  : ['martin.holann@gmail.com', 'novy_email@example.com'],
```

---

## 🚀 Nasazení

### 1. Lokální test

```bash
# Spusťte dev server
npm run dev

# Otevřete test endpoint
http://localhost:3000/api/test-email

# Vytvořte testovací rezervaci
http://localhost:3000/#booking
```

### 2. Vercel nasazení

```bash
# Commitněte změny
git add -A
git commit -m "feat: Update contact emails"
git push origin main

# Vercel automaticky nasadí
```

### 3. Ověření v produkci

```bash
# Test endpoint
https://www.cielodorado-tenerife.eu/api/test-email

# Vytvořte testovací rezervaci
https://www.cielodorado-tenerife.eu/#booking
```

---

## 📝 Checklist

Po nasazení zkontrolujte:

- [ ] Host dostane email s kontaktem `martin.holann@gmail.com`
- [ ] Notifikace přijde na `info@cielodorado-tenerife.eu`
- [ ] Notifikace přijde na `martin.holann@gmail.com`
- [ ] Email vypadá správně (HTML i text verze)
- [ ] Všechny informace jsou správné

---

## 🎉 Výsledek

### Email hostovi:
```
✅ Kontakt: martin.holann@gmail.com
✅ Bez telefonního čísla
✅ Profesionální vzhled
```

### Notifikace majiteli:
```
✅ Posláno na: info@cielodorado-tenerife.eu
✅ Posláno na: martin.holann@gmail.com
✅ Žádná ztracená rezervace
```

---

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Status:** ✅ Implementováno

