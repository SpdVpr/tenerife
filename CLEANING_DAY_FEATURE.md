# 🧹 Automatické blokování dne úklidu

## 📋 Popis funkce

Systém automaticky blokuje **jeden den po odjezdu hostů** pro úklid apartmánu. To znamená, že pokud hosté odjíždějí např. 15. března, den 16. března bude automaticky zablokován a nebude možné ho rezervovat.

---

## ✅ Jak to funguje

### Příklad:

```
Rezervace:
- Příjezd:  10. března 2025
- Odjezd:   15. března 2025

Automaticky zablokované dny:
- 10. března (příjezd)
- 11. března
- 12. března
- 13. března
- 14. března
- 15. března (odjezd)
- 16. března (🧹 DEN ÚKLIDU - automaticky zablokován)

Další možný příjezd:
- 17. března 2025 ✅
```

---

## 🔧 Technická implementace

### 1. Kontrola dostupnosti (`checkAvailability`)

Funkce `getBookingsByDateRange` v `lib/firebase/bookings.ts` automaticky přidává +1 den k datu odjezdu:

```typescript
// Add 1 day after checkout for cleaning
const checkOutDate = new Date(booking.checkOut);
checkOutDate.setDate(checkOutDate.getDate() + 1);
const checkOutWithCleaning = checkOutDate.toISOString().split('T')[0];

// Check if booking overlaps with the requested date range
if (booking.checkIn <= endDate && checkOutWithCleaning >= startDate) {
  bookings.push(booking);
}
```

### 2. Zobrazení v kalendáři (`getOccupiedDates`)

Funkce `getOccupiedDates` zahrnuje den úklidu do seznamu obsazených dnů:

```typescript
// Add 1 day after checkout for cleaning
const cleaningDay = new Date(checkOut);
cleaningDay.setDate(cleaningDay.getDate() + 1);

// Add all dates between checkIn and checkOut + 1 day (inclusive)
const currentDate = new Date(checkIn);
while (currentDate <= cleaningDay) {
  occupiedDates.add(currentDate.toISOString().split('T')[0]);
  currentDate.setDate(currentDate.getDate() + 1);
}
```

### 3. Vizuální indikace

V kalendáři (`components/ui/AvailabilityCalendar.tsx`) se den úklidu zobrazuje stejně jako ostatní obsazené dny:
- 🔴 **Červená barva** - obsazený den (včetně dne úklidu)
- 🟢 **Zelená barva** - volný den
- 🔵 **Modrá barva** - vybraný den

---

## 📊 Scénáře použití

### Scénář 1: Back-to-back rezervace (není možná)

```
❌ NELZE:
Rezervace A: 10. - 15. března
Rezervace B: 16. - 20. března (16. března je den úklidu)

✅ MOŽNÉ:
Rezervace A: 10. - 15. března
Rezervace B: 17. - 20. března (16. března je volný pro úklid)
```

### Scénář 2: Kontrola dostupnosti

```
Host chce rezervovat: 16. - 20. března

Systém zkontroluje:
1. Existuje rezervace s odjezdem 15. března?
2. Ano → 16. března je den úklidu → NEDOSTUPNÉ
3. Ne → 16. března je volný → DOSTUPNÉ
```

### Scénář 3: Zobrazení v kalendáři

```
Kalendář zobrazí:
- 10. - 15. března: 🔴 Obsazeno (rezervace)
- 16. března: 🔴 Obsazeno (úklid)
- 17. března: 🟢 Volno
```

---

## 🎯 Výhody

### Pro majitele:
- ✅ **Automatické plánování** - není třeba ručně blokovat dny
- ✅ **Vždy čistý apartmán** - garantovaný čas na úklid
- ✅ **Žádné chyby** - systém to dělá automaticky
- ✅ **Flexibilita** - můžete změnit logiku v jednom místě

### Pro hosty:
- ✅ **Jasná dostupnost** - vidí přesně, kdy mohou přijet
- ✅ **Čistý apartmán** - vždy dostanou čistý apartmán
- ✅ **Žádné překvapení** - systém nedovolí rezervovat nedostupné dny

---

## 🔄 Změna délky úklidu

Pokud byste chtěli změnit délku úklidu (např. 2 dny místo 1), upravte tyto funkce:

### V `lib/firebase/bookings.ts`:

#### Funkce `getBookingsByDateRange`:
```typescript
// Změňte z 1 na 2 dny
checkOutDate.setDate(checkOutDate.getDate() + 2); // bylo: + 1
```

#### Funkce `getOccupiedDates`:
```typescript
// Změňte z 1 na 2 dny
cleaningDay.setDate(cleaningDay.getDate() + 2); // bylo: + 1
```

---

## 🧪 Testování

### Test 1: Vytvoření rezervace

1. Vytvořte rezervaci: 10. - 15. března
2. Zkontrolujte kalendář
3. **Očekávaný výsledek:** 10. - 16. března jsou červené (obsazené)

### Test 2: Pokus o rezervaci dne úklidu

1. Existující rezervace: 10. - 15. března
2. Pokuste se rezervovat: 16. - 20. března
3. **Očekávaný výsledek:** Systém nedovolí (16. března je den úklidu)

### Test 3: Rezervace po dni úklidu

1. Existující rezervace: 10. - 15. března
2. Pokuste se rezervovat: 17. - 20. března
3. **Očekávaný výsledek:** Rezervace úspěšná ✅

---

## 📝 Poznámky

### Důležité:
- Den úklidu se počítá **automaticky** pro všechny rezervace
- Platí pro všechny statusy rezervací (pending, confirmed)
- **Neplatí** pro zrušené rezervace (cancelled)

### Výjimky:
- Pokud chcete ručně povolit rezervaci v den úklidu, musíte to udělat přímo v databázi
- Admin panel tuto funkci neobchází (což je správně)

### Budoucí vylepšení:
- Možnost nastavit délku úklidu v admin panelu
- Různé délky úklidu pro různé sezóny
- Možnost vypnout automatický úklid pro konkrétní rezervace

---

## 🔍 Řešení problémů

### Problém: Den úklidu se nezobrazuje v kalendáři

**Řešení:**
1. Zkontrolujte, že rezervace není zrušená (status !== 'cancelled')
2. Obnovte stránku (Ctrl+F5)
3. Zkontrolujte konzoli prohlížeče (F12) pro chyby

### Problém: Systém dovolí rezervovat den úklidu

**Řešení:**
1. Zkontrolujte, že funkce `getBookingsByDateRange` obsahuje logiku +1 den
2. Zkontrolujte, že rezervace má správný status
3. Zkontrolujte datum odjezdu předchozí rezervace

### Problém: Chci změnit délku úklidu

**Řešení:**
- Viz sekce "Změna délky úklidu" výše
- Upravte obě funkce (`getBookingsByDateRange` a `getOccupiedDates`)
- Restartujte server a otestujte

---

## 📊 Statistiky

### Typické scénáře:

| Délka pobytu | Dny úklidu | Celkem zablokováno |
|--------------|------------|-------------------|
| 5 nocí       | 1 den      | 6 dní             |
| 7 nocí       | 1 den      | 8 dní             |
| 10 nocí      | 1 den      | 11 dní            |
| 14 nocí      | 1 den      | 15 dní            |

### Dopad na dostupnost:

- **Bez dne úklidu:** 365 dní / 7 dní = ~52 rezervací/rok
- **S dnem úklidu:** 365 dní / 8 dní = ~45 rezervací/rok
- **Rozdíl:** ~7 rezervací/rok (13% méně)

**Ale:** Garantovaný čistý apartmán a spokojení hosté jsou důležitější! 🌟

---

## ✅ Checklist implementace

- [x] Upravena funkce `getBookingsByDateRange` (+1 den)
- [x] Upravena funkce `getOccupiedDates` (+1 den)
- [x] Kalendář automaticky zobrazuje den úklidu
- [x] Kontrola dostupnosti zahrnuje den úklidu
- [x] Dokumentace vytvořena
- [x] Testováno

---

**Vytvořeno:** 2025-01-10  
**Verze:** 1.0  
**Funkce:** Automatické blokování dne úklidu po odjezdu hostů

