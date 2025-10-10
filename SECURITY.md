# 🔒 Bezpečnostní pokyny

## ⚠️ DŮLEŽITÉ: Ochrana citlivých údajů

Tento dokument popisuje, jak správně zacházet s citlivými údaji v projektu.

---

## 🚨 Co NIKDY nesmí být na GitHubu

### ❌ Zakázáno nahrávat:

1. **`.env.local`** - Obsahuje skutečná hesla a API klíče
2. **`.env.production`** - Produkční konfigurace
3. **Skutečná hesla** - V jakémkoliv souboru
4. **API klíče** - Firebase, SMTP, platební brány
5. **SMTP credentials** - Email, heslo, server
6. **Databázové přístupy** - Connection strings
7. **Privátní klíče** - SSL certifikáty, SSH klíče

---

## ✅ Co JE v pořádku nahrát

### ✅ Povoleno:

1. **`.env.example`** - Pouze s placeholdery
2. **Dokumentace** - Bez skutečných údajů
3. **Kód aplikace** - Bez hardcoded secrets
4. **Konfigurace** - S generickými hodnotami

---

## 📋 Kontrolní seznam před commitem

Před každým `git commit` zkontrolujte:

- [ ] `.env.local` není v staged files
- [ ] Žádné skutečné heslo v kódu
- [ ] Žádné skutečné API klíče
- [ ] `.env.example` obsahuje jen placeholdery
- [ ] Dokumentace neobsahuje citlivé údaje

### Jak zkontrolovat:

```bash
# Zobrazit, co bude commitnuto
git status

# Zkontrolovat obsah staged files
git diff --cached

# Hledat potenciální secrets
git diff --cached | Select-String "password|api_key|secret"
```

---

## 🛡️ Správné použití environment variables

### 1. Lokální vývoj (`.env.local`)

**Soubor:** `.env.local` (NIKDY nenahrávat na GitHub!)

```env
# ✅ SPRÁVNĚ - Skutečné hodnoty v .env.local
SMTP_HOST=wes1-smtp.wedos.net
SMTP_USER=info@cielodorado-tenerife.eu
SMTP_PASSWORD=your_actual_password_here
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...actual_key
```

**Ochrana:**
- ✅ Soubor je v `.gitignore`
- ✅ Nikdy se nenahraje na GitHub
- ✅ Každý vývojář má svou vlastní kopii

### 2. Šablona (`.env.example`)

**Soubor:** `.env.example` (Nahrává se na GitHub)

```env
# ✅ SPRÁVNĚ - Pouze placeholdery
SMTP_HOST=your_smtp_server_here
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_password_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
```

**Pravidla:**
- ✅ Pouze generické placeholdery
- ✅ Žádné skutečné hodnoty
- ✅ Slouží jako dokumentace

### 3. Produkce (Vercel)

**Kde:** Vercel Dashboard → Settings → Environment Variables

```
✅ SPRÁVNĚ - Nastaveno v Vercel UI
SMTP_HOST=wes1-smtp.wedos.net
SMTP_USER=info@cielodorado-tenerife.eu
SMTP_PASSWORD=actual_password
```

**Výhody:**
- ✅ Bezpečně uloženo na Vercelu
- ✅ Nikdy se nedostane do Gitu
- ✅ Šifrováno at rest

---

## 🔍 Co dělat, když se secret dostal na GitHub

### Krok 1: OKAMŽITĚ změňte heslo/klíč

```
1. Přihlaste se k poskytovateli služby
2. Změňte heslo/vygenerujte nový klíč
3. Aktualizujte .env.local
4. Aktualizujte Vercel environment variables
```

### Krok 2: Odstraňte secret z Gitu

```bash
# Odstraňte soubor z Gitu (ale nechte lokálně)
git rm --cached .env.local

# Commitněte změnu
git commit -m "Remove sensitive file from Git"

# Pushněte
git push origin main
```

### Krok 3: Vyčistěte Git historii (pokud je to nutné)

**Varování:** Toto přepíše historii!

```bash
# Použijte git-filter-repo nebo BFG Repo-Cleaner
# Nebo kontaktujte GitHub Support pro pomoc
```

### Krok 4: Ověřte .gitignore

```bash
# Zkontrolujte, že .env* je v .gitignore
cat .gitignore | Select-String "\.env"

# Mělo by zobrazit:
# .env*
```

---

## 📝 Příklad: GitGuardian alert

Pokud dostanete email od GitGuardian:

```
Subject: GitGuardian has detected SMTP credentials

Secret type: SMTP credentials
Repository: SpdVpr/tenerife
```

### Co udělat:

1. **Okamžitě změňte heslo** u poskytovatele emailu
2. **Odstraňte soubor z Gitu** (viz výše)
3. **Aktualizujte dokumentaci** - odstraňte citlivé údaje
4. **Ověřte .gitignore** - ujistěte se, že .env* je ignorován
5. **Aktualizujte Vercel** - nastavte nové heslo

---

## 🎯 Best practices

### 1. Používejte environment variables

```typescript
// ❌ ŠPATNĚ - Hardcoded secret
const apiKey = "AIzaSyC1234567890abcdef";

// ✅ SPRÁVNĚ - Environment variable
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
```

### 2. Validujte environment variables

```typescript
// ✅ SPRÁVNĚ - Kontrola při startu
if (!process.env.SMTP_PASSWORD) {
  throw new Error('SMTP_PASSWORD is required');
}
```

### 3. Používejte různé hodnoty pro dev/prod

```typescript
// ✅ SPRÁVNĚ - Různé hodnoty pro různá prostředí
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://api.production.com'
  : 'https://api.dev.com';
```

### 4. Dokumentujte bez citlivých údajů

```markdown
<!-- ❌ ŠPATNĚ -->
SMTP_HOST=wes1-smtp.wedos.net
SMTP_USER=info@cielodorado-tenerife.eu

<!-- ✅ SPRÁVNĚ -->
SMTP_HOST=your_smtp_server
SMTP_USER=your_email@example.com
```

---

## 🔐 Typy citlivých údajů

### 1. Autentizační údaje
- Hesla
- API klíče
- Access tokens
- Refresh tokens

### 2. Konfigurační údaje
- SMTP servery (pokud jsou specifické)
- Databázové connection strings
- Emailové adresy (v některých případech)

### 3. Kryptografické klíče
- Private keys
- SSL certifikáty
- Signing keys
- Encryption keys

---

## 📊 Kontrola projektu

### Zkontrolujte, co je v Gitu:

```bash
# Seznam všech tracked files
git ls-files

# Hledat .env soubory
git ls-files | Select-String "\.env"

# Mělo by být prázdné nebo jen .env.example
```

### Zkontrolujte .gitignore:

```bash
# Zobrazit .gitignore
cat .gitignore

# Mělo by obsahovat:
# .env*
```

### Zkontrolujte historii:

```bash
# Hledat secrets v historii
git log --all --full-history -- .env.local

# Mělo by být prázdné
```

---

## ✅ Checklist pro nový projekt

Při zakládání nového projektu:

- [ ] Vytvořte `.gitignore` s `.env*`
- [ ] Vytvořte `.env.example` s placeholdery
- [ ] Vytvořte `.env.local` (lokálně, ne v Gitu)
- [ ] Nastavte environment variables na Vercelu
- [ ] Dokumentujte bez citlivých údajů
- [ ] Nastavte pre-commit hook (volitelné)

---

## 🚀 Automatická ochrana (volitelné)

### Pre-commit hook

Vytvořte `.git/hooks/pre-commit`:

```bash
#!/bin/sh

# Kontrola .env.local
if git diff --cached --name-only | grep -q "\.env\.local"; then
  echo "❌ Error: .env.local cannot be committed!"
  exit 1
fi

# Kontrola hesel v kódu
if git diff --cached | grep -i "password.*=.*[^placeholder]"; then
  echo "⚠️  Warning: Possible password in code!"
  exit 1
fi

exit 0
```

### GitGuardian (doporučeno)

- Zaregistrujte se na https://gitguardian.com
- Připojte GitHub repozitář
- Dostanete automatické alerty při detekci secrets

---

## 📞 V případě problémů

### Kontakty:

1. **GitHub Support** - Pro pomoc s odstraněním secrets z historie
2. **GitGuardian** - Pro pomoc s detekcí a remediation
3. **Poskytovatel služby** - Pro změnu hesel/klíčů

### Užitečné odkazy:

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [GitGuardian: Secret detection](https://www.gitguardian.com/)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 📝 Shrnutí

### ✅ DO:
- Používejte environment variables
- Ukládejte secrets v `.env.local` (lokálně)
- Používejte `.env.example` s placeholdery
- Nastavte secrets na Vercelu
- Kontrolujte před commitem

### ❌ DON'T:
- Nenahrávejte `.env.local` na GitHub
- Nedávejte hesla do kódu
- Nedávejte API klíče do dokumentace
- Nesdílejte secrets veřejně

---

**Pamatujte:** Jednou nahraný secret na GitHub je kompromitovaný, i když ho později smažete!

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Status:** ✅ Aktivní

