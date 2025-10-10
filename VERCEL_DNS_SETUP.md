# 🌐 Nastavení DNS záznamů na Vercelu pro VEDOS.cz email

## Proč potřebujete MX záznamy?

MX (Mail Exchange) záznamy říkají internetu, kam mají být doručovány emaily pro vaši doménu. Protože máte:
- **Doménu:** `cielodorado-tenerife.eu` na Vercel DNS
- **Email hosting:** u VEDOS.cz (WEDOS)

Musíte přidat MX záznamy, které směrují emaily na WEDOS servery.

---

## 📋 Krok za krokem

### 1. Přihlaste se do Vercel

1. Jděte na: https://vercel.com/login
2. Přihlaste se svým účtem

### 2. Najděte váš projekt

1. V dashboardu najděte projekt **cielo-dorado**
2. Klikněte na něj

### 3. Otevřete nastavení domény

1. Klikněte na **Settings** (v horním menu)
2. V levém menu klikněte na **Domains**
3. Najděte doménu `cielodorado-tenerife.eu`
4. Klikněte na ni (nebo na tlačítko **Edit** / **Manage**)

### 4. Přidejte MX záznamy

Vercel má různá rozhraní, ale obvykle najdete sekci **DNS Records** nebo **Add DNS Record**.

**Přidejte těchto 5 MX záznamů:**

#### MX záznam 1:
```
Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.email
Priority: 10
TTL: 3600 (nebo Auto)
```

#### MX záznam 2:
```
Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.global
Priority: 10
TTL: 3600 (nebo Auto)
```

#### MX záznam 3:
```
Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.com
Priority: 10
TTL: 3600 (nebo Auto)
```

#### MX záznam 4:
```
Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.mx
Priority: 10
TTL: 3600 (nebo Auto)
```

#### MX záznam 5:
```
Type: MX
Name: @ (nebo prázdné, nebo cielodorado-tenerife.eu)
Value: mx1.wedos.online
Priority: 20
TTL: 3600 (nebo Auto)
```

### 5. Uložte změny

Klikněte na **Save** nebo **Add Record** pro každý záznam.

---

## ⏱️ Čekání na propagaci

- DNS změny se propagují obvykle za **5-30 minut**
- Někdy to může trvat až **24 hodin** (vzácně)
- Během této doby mohou emaily fungovat nepravidelně

---

## ✅ Ověření MX záznamů

### Online nástroj (nejjednodušší):

1. Jděte na: https://mxtoolbox.com/
2. Do pole zadejte: `cielodorado-tenerife.eu`
3. Klikněte na **MX Lookup**
4. Měli byste vidět všech 5 MX záznamů WEDOS:
   ```
   Priority 10: mx1.wedos.email
   Priority 10: mx1.wedos.global
   Priority 10: mx1.wedos.com
   Priority 10: mx1.wedos.mx
   Priority 20: mx1.wedos.online
   ```

### Příkazová řádka (pro pokročilé):

**Windows (PowerShell):**
```powershell
nslookup -type=MX cielodorado-tenerife.eu
```

**Mac/Linux (Terminal):**
```bash
dig MX cielodorado-tenerife.eu
```

---

## 🔧 Volitelné: SPF a DKIM záznamy

Pro lepší doručitelnost emailů (aby nekončily ve spamu) doporučuji přidat i tyto záznamy:

### SPF záznam (doporučeno):

```
Type: TXT
Name: @ (nebo prázdné)
Value: v=spf1 include:_spf.wedos.com ~all
TTL: 3600
```

**Co to dělá:** Říká emailovým serverům, že WEDOS servery jsou oprávněné odesílat emaily z vaší domény.

### DKIM záznam (volitelné):

DKIM záznam najdete v administraci VEDOS.cz:
1. Přihlaste se do VEDOS.cz
2. Jděte na E-mailové schránky
3. Najděte sekci DKIM
4. Zkopírujte záznam a přidejte ho na Vercel

**Formát:**
```
Type: TXT
Name: default._domainkey (nebo jak uvádí VEDOS)
Value: v=DKIM1; k=rsa; p=... (dlouhý klíč)
TTL: 3600
```

---

## 📊 Shrnutí všech DNS záznamů

Po dokončení byste měli mít tyto záznamy:

| Type | Name | Value | Priority | Účel |
|------|------|-------|----------|------|
| MX | @ | mx1.wedos.email | 10 | Příjem emailů |
| MX | @ | mx1.wedos.global | 10 | Příjem emailů |
| MX | @ | mx1.wedos.com | 10 | Příjem emailů |
| MX | @ | mx1.wedos.mx | 10 | Příjem emailů |
| MX | @ | mx1.wedos.online | 20 | Příjem emailů (záložní) |
| TXT | @ | v=spf1 include:_spf.wedos.com ~all | - | Anti-spam (SPF) |
| TXT | default._domainkey | v=DKIM1; k=rsa; p=... | - | Anti-spam (DKIM) |

---

## ❓ Časté problémy

### Problém: "Vercel mi nedovolí přidat MX záznamy"

**Možné příčiny:**
1. Doména není plně nastavena na Vercel DNS
2. Používáte externí DNS (ne Vercel DNS)

**Řešení:**
- Zkontrolujte, že doména používá Vercel nameservery
- Pokud používáte jiné DNS (např. Cloudflare), přidejte MX záznamy tam

### Problém: "MX záznamy se nezobrazují v MXToolbox"

**Řešení:**
- Počkejte 30-60 minut na propagaci
- Zkontrolujte, že jste záznamy správně uložili
- Zkuste vymazat DNS cache: `ipconfig /flushdns` (Windows) nebo `sudo dscacheutil -flushcache` (Mac)

### Problém: "Nevím, jestli mám Vercel DNS nebo externí DNS"

**Jak zjistit:**
1. Jděte na Vercel → Settings → Domains
2. Klikněte na vaši doménu
3. Pokud vidíte sekci "DNS Records", máte Vercel DNS ✅
4. Pokud vidíte pouze "Nameservers", používáte externí DNS

---

## 🎯 Co dál?

Po nastavení MX záznamů:

1. ✅ Počkejte 30 minut na propagaci
2. ✅ Ověřte MX záznamy na MXToolbox.com
3. ✅ Pokračujte podle `EMAIL_SETUP.md` - nastavte heslo v `.env.local`
4. ✅ Otestujte odesílání emailů

---

## 📞 Potřebujete pomoc?

- **Vercel dokumentace:** https://vercel.com/docs/projects/domains/working-with-domains
- **VEDOS.cz podpora:** https://vedos.cz/kontakt/
- **MX Toolbox:** https://mxtoolbox.com/

---

**Poznámka:** MX záznamy jsou potřeba pouze pro **příjem** emailů na `@cielodorado-tenerife.eu`. Pro **odesílání** emailů přes SMTP (což děláte) to není nutné, ale je to doporučené pro profesionální nastavení.

