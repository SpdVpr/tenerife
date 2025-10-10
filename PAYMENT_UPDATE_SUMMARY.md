# 💳 Souhrn aktualizace platebního systému

## ✅ Co bylo změněno

### 🏦 Bankovní údaje

**Nové platební údaje:**
```
IBAN:       ES56 0049 4166 2227 1404 1761
SWIFT/BIC:  BSCHESMMXXX
Banka:      BANCO SANTANDER, S.A.
```

✅ Tyto údaje jsou nyní **automaticky odesílány** v potvrzovacím emailu každému hostovi.

---

### 🔢 Číselné ID rezervace

**Před:**
- ID: Alfanumerický hash (např. `#A3F2B8C1`)
- Těžko zapamatovatelné
- Nelze použít jako variabilní symbol

**Nyní:**
- ID: Číselné (např. `1000`, `1001`, `1002`)
- Začíná od **1000**
- Sekvenční (postupné)
- **Slouží jako variabilní symbol** pro platby

**Výhody:**
- ✅ Snadné sledování plateb
- ✅ Jednoduché na zapamatování
- ✅ Profesionální přístup
- ✅ Automatické párování plateb

---

### 💰 Platební podmínky

#### 1. Záloha

| Parametr | Před | Nyní |
|----------|------|------|
| **Výše** | 30% | **50%** |
| **Splatnost** | 3 dny | **7 dní** |

**Příklad:**
```
Celková cena: 1000 EUR
Záloha 50%:   500 EUR (bylo 300 EUR)
Splatnost:    7 dní (bylo 3 dny)
```

#### 2. Zbývající platba

| Parametr | Před | Nyní |
|----------|------|------|
| **Výše** | 70% | **50%** |
| **Splatnost** | 14 dní před příjezdem | **Měsíc před příjezdem** |

**Příklad:**
```
Celková cena:     1000 EUR
Zbývající 50%:    500 EUR (bylo 700 EUR)
Splatnost:        Měsíc před příjezdem (bylo 14 dní)
```

#### 3. Možnost platby najednou ✨ NOVÉ

Hosté mohou nyní uhradit **celou částku najednou** místo rozdělení na dvě platby.

**Výhody:**
- Jednodušší správa
- Není třeba pamatovat na druhou platbu
- Rezervace okamžitě plně zaplacena

---

### 🚫 Storno podmínky

**Nové pravidlo:**
- **Bezplatné storno:** Do měsíce před příjezdem
- **Po termínu:** Záloha se nevrací

**Příklad:**
```
Příjezd:          15. března 2025
Storno deadline:  15. února 2025

Storno do 15.2.:  100% vráceno ✅
Storno po 15.2.:  Záloha se nevrací ❌
```

---

## 📧 Změny v emailech

### Email pro hosta (potvrzení rezervace)

**Nový obsah:**

```
📋 DETAILY REZERVACE
Číslo rezervace / Variabilní symbol: 1000

💳 PLATEBNÍ INFORMACE

Bankovní účet:
IBAN: ES56 0049 4166 2227 1404 1761
SWIFT/BIC: BSCHESMMXXX
Banka: BANCO SANTANDER, S.A.
Variabilní symbol: 1000

📅 Platební podmínky:

1. Záloha 50%: 500 EUR
   Splatnost: do 22. ledna 2025

2. Zbývajících 50%: 500 EUR
   Splatnost: do 15. února 2025

💡 TIP: Pokud chcete, můžete uhradit celou částku 1000 EUR najednou.

⚠️ STORNO PODMÍNKY:
Bezplatné storno je možné do 15. února 2025 (měsíc před příjezdem).
Po tomto datu nebude záloha vrácena.
```

### Email pro majitele (notifikace)

**Nový obsah:**

```
📋 INFORMACE O REZERVACI
Číslo rezervace: 1000
Očekávaná záloha (50%): 500 EUR

PLATEBNÍ ÚDAJE (již odeslány hostovi):
- Variabilní symbol: 1000
- IBAN: ES56 0049 4166 2227 1404 1761
- Záloha 50%: 500 EUR (splatnost: 7 dní)

DALŠÍ KROKY:
1. Zkontrolujte dostupnost v kalendáři
2. Sledujte příchozí platby (VS: 1000)
3. Po obdržení zálohy potvrďte rezervaci v admin panelu
4. Připomeňte hostovi zbývající platbu měsíc před příjezdem
```

---

## 🔧 Technické změny

### 1. Datový model

**Přidáno pole `bookingNumber`:**

```typescript
interface BookingData {
  bookingNumber: number;  // 1000, 1001, 1002...
  // ... ostatní pole
}
```

### 2. Automatické generování čísel

**Firebase Counter:**
```
Collection: counters
Document: bookingNumber
Field: value (number)
```

**Funkce:**
```typescript
async function generateBookingNumber(): Promise<number> {
  // 1. Načti aktuální hodnotu (např. 1005)
  // 2. Zvyš o 1 (1006)
  // 3. Ulož novou hodnotu
  // 4. Vrať nové číslo (1006)
}
```

### 3. Upravené soubory

| Soubor | Změny |
|--------|-------|
| `lib/firebase/bookings.ts` | + bookingNumber pole, + generování čísel |
| `lib/email/templates.ts` | + bankovní údaje, + nové platební podmínky |
| `lib/email/send.ts` | + bookingNumber v typech |
| `components/sections/Booking.tsx` | + načtení bookingNumber před odesláním emailu |
| `PAYMENT_INFO.md` | + kompletní dokumentace |

---

## 📊 Porovnání: Před vs. Nyní

### Platební podmínky

| Položka | Před | Nyní | Změna |
|---------|------|------|-------|
| Záloha | 30% | 50% | +20% |
| Splatnost zálohy | 3 dny | 7 dní | +4 dny |
| Zbývající platba | 70% | 50% | -20% |
| Splatnost zbývající | 14 dní | 30 dní | +16 dní |
| Storno | - | Měsíc před | Nové |
| Platba najednou | - | Možné | Nové |

### Příklad: Rezervace za 1000 EUR

**Před:**
```
Záloha:           300 EUR (3 dny)
Zbývající:        700 EUR (14 dní před příjezdem)
Variabilní symbol: -
Storno:           -
```

**Nyní:**
```
Záloha:           500 EUR (7 dní)
Zbývající:        500 EUR (měsíc před příjezdem)
Variabilní symbol: 1000
Storno:           Měsíc před příjezdem
Možnost:          Platba 1000 EUR najednou
```

---

## 🎯 Výhody nového systému

### Pro hosty:

✅ **Jasné platební podmínky** - vše v jednom emailu  
✅ **Více času na zálohu** - 7 dní místo 3  
✅ **Více času na zbývající platbu** - měsíc místo 14 dní  
✅ **Jednoduché číslo** - snadné na zapamatování  
✅ **Flexibilita** - možnost platby najednou  
✅ **Férové storno** - měsíc na rozmyšlenou  

### Pro majitele:

✅ **Automatizace** - platební údaje se odesílají automaticky  
✅ **Snadné sledování** - variabilní symbol = číslo rezervace  
✅ **Lepší cash flow** - 50% záloha místo 30%  
✅ **Profesionální přístup** - jako ve velkých hotelech  
✅ **Méně práce** - není třeba ručně odesílat platební údaje  

---

## 🧪 Testování

### Před nasazením do produkce:

1. **Vytvořte testovací rezervaci:**
   ```
   - Zkontrolujte, že se vygeneruje číselné ID (např. 1000)
   - Ověřte, že email obsahuje bankovní údaje
   - Zkontrolujte výpočet zálohy (50%)
   - Ověřte termíny splatnosti
   ```

2. **Zkontrolujte Firebase:**
   ```
   - Collection: counters
   - Document: bookingNumber
   - Hodnota by měla být 1000 (nebo vyšší)
   ```

3. **Zkontrolujte emaily:**
   ```
   - Email pro hosta: Obsahuje IBAN, SWIFT, VS?
   - Email pro majitele: Obsahuje očekávanou zálohu?
   - Oba emaily: Správné termíny splatnosti?
   ```

---

## 📝 Checklist nasazení

### Před nasazením:

- [x] Bankovní údaje přidány do emailů
- [x] Variabilní symbol = číslo rezervace
- [x] Záloha změněna na 50%
- [x] Splatnost zálohy: 7 dní
- [x] Zbývající platba: měsíc před příjezdem
- [x] Možnost platby celé částky najednou
- [x] Storno podmínky: měsíc před příjezdem
- [x] Automatické generování číselného ID
- [x] Counter v Firebase
- [x] Aktualizace emailových šablon
- [x] Dokumentace vytvořena
- [x] Změny commitnuty do Gitu
- [x] Změny nahrány na GitHub

### Po nasazení:

- [ ] Vytvořit testovací rezervaci
- [ ] Zkontrolovat email pro hosta
- [ ] Zkontrolovat email pro majitele
- [ ] Ověřit Firebase counter
- [ ] Zkontrolovat číslo rezervace v admin panelu
- [ ] Otestovat druhou rezervaci (číslo by mělo být +1)

---

## 🔗 Související dokumentace

| Dokument | Popis |
|----------|-------|
| `PAYMENT_INFO.md` | Kompletní dokumentace platebního systému |
| `EMAIL_SETUP.md` | Návod na nastavení emailů |
| `EMAIL_PREVIEW.md` | Náhled emailových šablon |

---

## 📞 Podpora

Pokud máte problémy:

1. **Číslo rezervace se negeneruje:**
   - Zkontrolujte Firebase (collection: counters)
   - Zkontrolujte konzoli prohlížeče (F12)

2. **Email neobsahuje platební údaje:**
   - Zkontrolujte `lib/email/templates.ts`
   - Restartujte server

3. **Variabilní symbol není v emailu:**
   - Zkontrolujte, že booking má `bookingNumber`
   - Zkontrolujte `components/sections/Booking.tsx`

---

## 🎉 Shrnutí

Platební systém byl úspěšně aktualizován s:

- ✅ Bankovními údaji BANCO SANTANDER
- ✅ Číselným ID rezervace (variabilní symbol)
- ✅ Novými platebními podmínkami (50% + 50%)
- ✅ Možností platby najednou
- ✅ Storno podmínkami (měsíc před příjezdem)
- ✅ Automatickým odesíláním všech údajů v emailu

**Systém je připraven k použití!** 🚀

---

**Vytvořeno:** 2025-01-10  
**Verze:** 2.0  
**Commit:** e2be36b  
**Status:** ✅ Nasazeno na GitHub

