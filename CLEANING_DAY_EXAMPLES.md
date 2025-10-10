# 🧹 Příklady blokování dne úklidu

Tento dokument ukazuje konkrétní příklady, jak funguje automatické blokování dne úklidu.

---

## 📅 Příklad 1: Základní rezervace

### Rezervace:
```
Příjezd:  10. března 2025 (pondělí)
Odjezd:   15. března 2025 (sobota)
```

### Kalendář:
```
Po  Út  St  Čt  Pá  So  Ne
                        9
10  11  12  13  14  15  16
🔴  🔴  🔴  🔴  🔴  🔴  🧹
17  18  19  20  21  22  23
🟢  🟢  🟢  🟢  🟢  🟢  🟢

🔴 = Obsazeno (rezervace)
🧹 = Obsazeno (úklid)
🟢 = Volno
```

### Výsledek:
- **10. - 15. března:** Obsazeno (hosté v apartmánu)
- **16. března:** Obsazeno (den úklidu) 🧹
- **17. března:** První možný příjezd ✅

---

## 📅 Příklad 2: Pokus o back-to-back rezervaci

### Existující rezervace:
```
Rezervace A:
Příjezd:  10. března 2025
Odjezd:   15. března 2025
```

### Pokus o novou rezervaci:
```
Rezervace B (POKUS):
Příjezd:  16. března 2025 ❌
Odjezd:   20. března 2025
```

### Výsledek:
```
❌ ZAMÍTNUTO!

Důvod: 16. března je den úklidu po předchozí rezervaci.
Nejbližší možný příjezd: 17. března 2025
```

---

## 📅 Příklad 3: Správná rezervace po úklidu

### Existující rezervace:
```
Rezervace A:
Příjezd:  10. března 2025
Odjezd:   15. března 2025
```

### Nová rezervace:
```
Rezervace B:
Příjezd:  17. března 2025 ✅
Odjezd:   22. března 2025
```

### Kalendář:
```
Po  Út  St  Čt  Pá  So  Ne
10  11  12  13  14  15  16
🔴  🔴  🔴  🔴  🔴  🔴  🧹
17  18  19  20  21  22  23
🔵  🔵  🔵  🔵  🔵  🔵  🧹
24  25  26  27  28  29  30
🟢  🟢  🟢  🟢  🟢  🟢  🟢

🔴 = Rezervace A
🧹 = Den úklidu
🔵 = Rezervace B
🟢 = Volno
```

### Výsledek:
```
✅ POTVRZENO!

Rezervace A: 10. - 15. března
Den úklidu:  16. března
Rezervace B: 17. - 22. března
Den úklidu:  23. března
```

---

## 📅 Příklad 4: Více rezervací za sebou

### Scénář:
```
Rezervace 1: 1. - 5. března
Rezervace 2: 7. - 12. března
Rezervace 3: 14. - 20. března
```

### Kalendář března:
```
Po  Út  St  Čt  Pá  So  Ne
                        1
🔵  2   3   4   5   6   7
    🔵  🔵  🔵  🔵  🧹  🟢
8   9   10  11  12  13  14
🟢  🟢  🟢  🟢  🟢  🧹  🔴
15  16  17  18  19  20  21
🔴  🔴  🔴  🔴  🔴  🔴  🧹
22  23  24  25  26  27  28
🟢  🟢  🟢  🟢  🟢  🟢  🟢

🔵 = Rezervace 1
🟢 = Rezervace 2
🔴 = Rezervace 3
🧹 = Den úklidu
🟢 = Volno
```

### Analýza:
```
Rezervace 1: 1. - 5. března
  → Den úklidu: 6. března

Rezervace 2: 7. - 12. března (možná, 6. března je volný)
  → Den úklidu: 13. března

Rezervace 3: 14. - 20. března (možná, 13. března je volný)
  → Den úklidu: 21. března

Další možný příjezd: 22. března
```

---

## 📅 Příklad 5: Víkendová rezervace

### Rezervace:
```
Příjezd:  Pátek 14. března 2025
Odjezd:   Neděle 16. března 2025
```

### Kalendář:
```
Po  Út  St  Čt  Pá  So  Ne
10  11  12  13  14  15  16
🟢  🟢  🟢  🟢  🔴  🔴  🔴
17  18  19  20  21  22  23
🧹  🟢  🟢  🟢  🟢  🟢  🟢

🔴 = Obsazeno (víkendová rezervace)
🧹 = Pondělí - den úklidu
🟢 = Volno
```

### Výsledek:
```
Rezervace: Pá 14. - Ne 16. března
Den úklidu: Po 17. března
Další možný příjezd: Út 18. března
```

---

## 📅 Příklad 6: Dlouhodobá rezervace

### Rezervace:
```
Příjezd:  1. března 2025
Odjezd:   31. března 2025 (celý měsíc)
```

### Kalendář března:
```
Po  Út  St  Čt  Pá  So  Ne
                        1
🔴  2   3   4   5   6   7
    🔴  🔴  🔴  🔴  🔴  🔴
8   9   10  11  12  13  14
🔴  🔴  🔴  🔴  🔴  🔴  🔴
15  16  17  18  19  20  21
🔴  🔴  🔴  🔴  🔴  🔴  🔴
22  23  24  25  26  27  28
🔴  🔴  🔴  🔴  🔴  🔴  🔴
29  30  31
🔴  🔴  🔴

🔴 = Obsazeno (celý měsíc)
```

### Kalendář dubna:
```
Po  Út  St  Čt  Pá  So  Ne
            1   2   3   4
            🧹  🟢  🟢  🟢
5   6   7   8   9   10  11
🟢  🟢  🟢  🟢  🟢  🟢  🟢

🧹 = 1. dubna - den úklidu
🟢 = Volno
```

### Výsledek:
```
Rezervace: 1. - 31. března (31 nocí)
Den úklidu: 1. dubna
Další možný příjezd: 2. dubna
```

---

## 📅 Příklad 7: Minimální pobyt (5 nocí)

### Rezervace:
```
Příjezd:  10. března 2025
Odjezd:   15. března 2025 (5 nocí - minimum)
```

### Kalendář:
```
Po  Út  St  Čt  Pá  So  Ne
10  11  12  13  14  15  16
🔴  🔴  🔴  🔴  🔴  🔴  🧹
17  18  19  20  21  22  23
🟢  🟢  🟢  🟢  🟢  🟢  🟢

🔴 = Obsazeno (5 nocí)
🧹 = Den úklidu
🟢 = Volno
```

### Výsledek:
```
Rezervace: 10. - 15. března (5 nocí)
Den úklidu: 16. března
Další možný příjezd: 17. března

Poznámka: I při minimálním pobytu je den úklidu automaticky zablokován.
```

---

## 📅 Příklad 8: Zrušená rezervace

### Scénář:
```
Rezervace A: 10. - 15. března (ZRUŠENA)
Rezervace B: 16. - 20. března (POKUS)
```

### Výsledek:
```
✅ POTVRZENO!

Důvod: Zrušené rezervace se nepočítají.
Den úklidu se aplikuje pouze na aktivní rezervace (pending, confirmed).
```

### Kalendář:
```
Po  Út  St  Čt  Pá  So  Ne
10  11  12  13  14  15  16
🟢  🟢  🟢  🟢  🟢  🟢  🔴
17  18  19  20  21  22  23
🔴  🔴  🔴  🔴  🧹  🟢  🟢

🟢 = Volno (rezervace A byla zrušena)
🔴 = Rezervace B
🧹 = Den úklidu po rezervaci B
```

---

## 📊 Statistiky a dopad

### Průměrná rezervace: 7 nocí

```
Bez dne úklidu:
- Rezervace: 7 dní
- Celkem zablokováno: 7 dní
- Využití: 100%

S dnem úklidu:
- Rezervace: 7 dní
- Den úklidu: 1 den
- Celkem zablokováno: 8 dní
- Využití: 87.5%
```

### Roční dopad:

```
Scénář: 40 rezervací ročně

Bez dne úklidu:
- 40 rezervací × 7 dní = 280 dní obsazeno
- Využití: 76.7%

S dnem úklidu:
- 40 rezervací × 8 dní = 320 dní obsazeno
- Využití: 87.7%
- Rozdíl: +40 dní zablokováno pro úklid
```

### Výhody převažují:

✅ **Vždy čistý apartmán**  
✅ **Spokojení hosté**  
✅ **Lepší recenze**  
✅ **Žádný stres s úklidem**  
✅ **Profesionální přístup**

---

## 🎯 Praktické tipy

### Pro majitele:

1. **Plánujte úklid dopředu**
   - Víte přesně, kdy máte úklid
   - Můžete si naplánovat úklidovou službu

2. **Komunikujte s hosty**
   - Informujte hosty o check-out času
   - Vysvětlete, proč je den úklidu důležitý

3. **Sledujte kalendář**
   - Pravidelně kontrolujte nadcházející úklidy
   - Zajistěte dostupnost úklidové služby

### Pro hosty:

1. **Plánujte dopředu**
   - Počítejte s tím, že po každé rezervaci je den úklidu
   - Nejbližší možný příjezd je +2 dny po předchozím odjezdu

2. **Flexibilita**
   - Pokud vidíte obsazený termín, zkuste o den později
   - Systém vám ukáže přesně, kdy je volno

---

## ❓ Často kladené otázky

### Q: Můžu přijet v den úklidu, pokud slibuji, že to nevadí?

**A:** Ne, systém to automaticky nedovolí. Den úklidu je zablokován pro všechny. Pokud opravdu potřebujete výjimku, kontaktujte majitele přímo.

### Q: Co když chci zůstat déle a prodloužit rezervaci?

**A:** Pokud prodlužujete existující rezervaci (bez odjezdu), den úklidu se nepřidává. Den úklidu se počítá pouze po skutečném odjezdu.

### Q: Proč je den úklidu potřeba?

**A:** Garantuje, že apartmán bude vždy čistý a připravený pro nové hosty. Je to profesionální standard.

### Q: Můžu si vybrat, kdy bude úklid?

**A:** Ne, den úklidu je automaticky den po vašem odjezdu. Toto zajišťuje konzistentní kvalitu pro všechny hosty.

---

**Poznámka:** Všechny příklady předpokládají, že rezervace mají status 'pending' nebo 'confirmed'. Zrušené rezervace ('cancelled') se nepočítají a den úklidu se na ně nevztahuje.

