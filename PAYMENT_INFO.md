# 💳 Platební informace a podmínky

## 📋 Přehled

Tento dokument popisuje platební systém, podmínky a automatické odesílání platebních údajů hostům.

---

## 🏦 Bankovní údaje

### Účet pro platby:
```
IBAN:       ES56 0049 4166 2227 1404 1761
SWIFT/BIC:  BSCHESMMXXX
Banka:      BANCO SANTANDER, S.A.
Měna:       EUR
```

### Variabilní symbol:
- **Číselné ID rezervace** (např. 1000, 1001, 1002...)
- Automaticky generováno při vytvoření rezervace
- Začíná od čísla **1000**
- Každá rezervace má unikátní číslo

---

## 💰 Platební podmínky

### 1. Záloha (50%)

**Výše:** 50% z celkové ceny rezervace

**Splatnost:** Do 7 dní od vytvoření rezervace

**Účel:** Potvrzení rezervace

**Příklad:**
```
Celková cena: 1000 EUR
Záloha 50%:   500 EUR
Splatnost:    do 7 dní
```

### 2. Zbývající platba (50%)

**Výše:** Zbývajících 50% z celkové ceny

**Splatnost:** Měsíc před příjezdem

**Účel:** Finální platba před ubytováním

**Příklad:**
```
Celková cena:     1000 EUR
Záloha (zaplaceno): 500 EUR
Zbývá:             500 EUR
Splatnost:         měsíc před příjezdem
```

### 3. Možnost platby najednou

Hosté mohou uhradit **celou částku najednou** místo rozdělení na dvě platby.

**Výhody:**
- ✅ Jednodušší správa plateb
- ✅ Není třeba pamatovat na druhou platbu
- ✅ Rezervace okamžitě plně zaplacena

---

## 🚫 Storno podmínky

### Bezplatné storno:
- **Možné do:** Měsíc před příjezdem
- **Vrácení:** 100% zaplacené částky

### Storno po termínu:
- **Po termínu:** Méně než měsíc před příjezdem
- **Vrácení:** Záloha nebude vrácena
- **Důvod:** Krátká doba na nalezení náhradního hosta

### Příklad:
```
Příjezd:              15. března 2025
Storno deadline:      15. února 2025
Storno do 15.2.:      100% vráceno ✅
Storno po 15.2.:      Záloha se nevrací ❌
```

---

## 📧 Automatické odesílání platebních údajů

### V potvrzovacím emailu:

Platební údaje jsou **automaticky zaslány** v potvrzovacím emailu hned po vytvoření rezervace.

**Email obsahuje:**
1. ✅ Bankovní účet (IBAN, SWIFT)
2. ✅ Variabilní symbol (číslo rezervace)
3. ✅ Výši zálohy (50%)
4. ✅ Termín splatnosti zálohy (7 dní)
5. ✅ Výši zbývající platby (50%)
6. ✅ Termín splatnosti zbývající platby (měsíc před příjezdem)
7. ✅ Možnost platby celé částky najednou
8. ✅ Storno podmínky

### Příklad emailu:

```
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

---

## 🔢 Systém číslování rezervací

### Generování čísla rezervace:

1. **První rezervace:** 1000
2. **Druhá rezervace:** 1001
3. **Třetí rezervace:** 1002
4. atd...

### Vlastnosti:
- ✅ Unikátní pro každou rezervaci
- ✅ Sekvenční (postupné)
- ✅ Jednoduché na zapamatování
- ✅ Slouží jako variabilní symbol

### Technická implementace:
```typescript
// Automaticky generováno v Firebase
Counter: bookingNumber
Start: 1000
Increment: +1 při každé rezervaci
```

---

## 📊 Příklady platebních scénářů

### Scénář 1: Standardní platba (2 splátky)

```
Rezervace:
- Celková cena: 1400 EUR
- Číslo rezervace: 1005
- Příjezd: 15. března 2025
- Vytvoření rezervace: 15. ledna 2025

Platby:
1. Záloha 50%: 700 EUR
   - Variabilní symbol: 1005
   - Splatnost: 22. ledna 2025 (7 dní)
   
2. Zbývající 50%: 700 EUR
   - Variabilní symbol: 1005
   - Splatnost: 15. února 2025 (měsíc před příjezdem)

Storno:
- Bezplatné do: 15. února 2025
- Po tomto datu: Záloha 700 EUR se nevrací
```

### Scénář 2: Platba najednou

```
Rezervace:
- Celková cena: 1400 EUR
- Číslo rezervace: 1006
- Příjezd: 20. března 2025
- Vytvoření rezervace: 20. ledna 2025

Platba:
- Celá částka: 1400 EUR
- Variabilní symbol: 1006
- Splatnost: 27. ledna 2025 (7 dní)
- Výhoda: Není třeba pamatovat na druhou platbu

Storno:
- Bezplatné do: 20. února 2025
- Po tomto datu: Celá částka 1400 EUR se nevrací
```

### Scénář 3: Storno před termínem

```
Rezervace:
- Celková cena: 1000 EUR
- Záloha zaplacena: 500 EUR
- Příjezd: 10. března 2025
- Storno deadline: 10. února 2025

Storno: 5. února 2025 (před termínem)
Vráceno: 500 EUR ✅
```

### Scénář 4: Storno po termínu

```
Rezervace:
- Celková cena: 1000 EUR
- Záloha zaplacena: 500 EUR
- Příjezd: 10. března 2025
- Storno deadline: 10. února 2025

Storno: 25. února 2025 (po termínu)
Vráceno: 0 EUR ❌
Důvod: Méně než měsíc před příjezdem
```

---

## 🔍 Sledování plateb

### Pro majitele:

1. **Kontrola příchozích plateb:**
   - Sledujte bankovní účet
   - Hledejte platby podle variabilního symbolu
   - Variabilní symbol = číslo rezervace

2. **Potvrzení platby:**
   - Po obdržení zálohy → změňte status na "confirmed"
   - Po obdržení zbývající platby → poznamenejte si do poznámek

3. **Připomínky:**
   - 7 dní po rezervaci: Zkontrolujte, zda přišla záloha
   - Měsíc před příjezdem: Připomeňte zbývající platbu (pokud nebyla zaplacena celá částka)

### Email pro majitele obsahuje:

```
INFORMACE O REZERVACI:
- Číslo rezervace: 1000
- Očekávaná záloha (50%): 500 EUR

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

## ⚙️ Technické detaily

### Databázová struktura:

```typescript
interface BookingData {
  bookingNumber: number;      // 1000, 1001, 1002...
  totalPrice: number;         // Celková cena v EUR
  // ... další pole
}
```

### Counter v Firebase:

```
Collection: counters
Document: bookingNumber
Field: value (number)

Příklad:
{
  id: "bookingNumber",
  value: 1005  // Poslední použité číslo
}
```

### Generování čísla:

```typescript
async function generateBookingNumber(): Promise<number> {
  // 1. Načti aktuální hodnotu counteru
  // 2. Zvyš o 1
  // 3. Ulož novou hodnotu
  // 4. Vrať nové číslo
}
```

---

## 📝 Checklist implementace

- [x] Bankovní údaje přidány do emailů
- [x] Variabilní symbol = číslo rezervace
- [x] Záloha změněna na 50% (bylo 30%)
- [x] Splatnost zálohy: 7 dní (bylo 3 dny)
- [x] Zbývající platba: měsíc před příjezdem (bylo 14 dní)
- [x] Možnost platby celé částky najednou
- [x] Storno podmínky: měsíc před příjezdem
- [x] Automatické generování číselného ID
- [x] Counter v Firebase pro sekvenční čísla
- [x] Aktualizace emailových šablon
- [x] Aktualizace dokumentace

---

## 🎯 Výhody nového systému

### Pro hosty:
- ✅ **Jasné platební podmínky** - vše v jednom emailu
- ✅ **Jednoduché číslo** - snadné na zapamatování
- ✅ **Flexibilita** - možnost platby najednou
- ✅ **Férové storno** - měsíc na rozmyšlenou

### Pro majitele:
- ✅ **Automatizace** - platební údaje se odesílají automaticky
- ✅ **Snadné sledování** - variabilní symbol = číslo rezervace
- ✅ **Lepší cash flow** - 50% záloha místo 30%
- ✅ **Profesionální přístup** - jako ve velkých hotelech

---

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Platební systém:** BANCO SANTANDER, S.A.  
**Měna:** EUR

