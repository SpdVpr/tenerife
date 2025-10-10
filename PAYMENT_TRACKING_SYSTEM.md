# 💰 Systém sledování plateb a potvrzení rezervací

## 📋 Přehled

Kompletní systém pro správu plateb a automatické odesílání potvrzovacích emailů hostům.

---

## 🎯 Funkce

### 1. **Sledování platebního statusu**

Každá rezervace má 3 možné platební stavy:

- **⏳ Nezaplaceno** (`unpaid`) - Výchozí stav po vytvoření rezervace
- **💵 Záloha zaplacena** (`deposit_paid`) - Přijato 50% zálohy
- **💰 Plně zaplaceno** (`fully_paid`) - Přijato 100% platby

### 2. **Automatické emaily**

#### A) Email potvrzení rezervace
- **Kdy:** Když admin klikne na tlačítko "Potvrdit" v admin panelu
- **Komu:** Host (email z rezervace)
- **Obsah:**
  - Potvrzení rezervace
  - Detaily pobytu (příjezd, odjezd, počet nocí, hostů)
  - Cenový souhrn (noci × cena, úklidový poplatek, celková cena)
  - Platební informace (IBAN, SWIFT, variabilní symbol)
  - Platební podmínky (50% záloha do 7 dní, 50% měsíc před příjezdem)
  - Kontaktní informace

#### B) Email o přijaté záloze
- **Kdy:** Když admin klikne na "Záloha zaplacena"
- **Komu:** Host
- **Obsah:**
  - Potvrzení přijetí zálohy (50%)
  - Zbývající částka k doplacení
  - Termín doplacení (měsíc před příjezdem)
  - Variabilní symbol pro platbu

#### C) Email o plné platbě
- **Kdy:** Když admin klikne na "Zaplaceno celé" nebo "Doplacen zbytek"
- **Komu:** Host
- **Obsah:**
  - Potvrzení přijetí celé platby
  - Informace, že rezervace je plně zaplacena
  - Informace o příjezdu (budou zaslány později)

---

## 🖥️ Admin Panel

### Zobrazení statusů

Každá rezervace zobrazuje 2 barevné odznaky:

1. **Status rezervace:**
   - 🟡 Čeká na potvrzení
   - 🟢 Potvrzeno
   - 🔴 Zrušeno

2. **Platební status:**
   - 🟠 ⏳ Nezaplaceno
   - 🔵 💵 Záloha zaplacena
   - 🟢 💰 Plně zaplaceno

### Akční tlačítka

#### Řádek 1: Status rezervace
- **Potvrdit** - Potvrdí rezervaci a odešle potvrzovací email
- **Zrušit** - Zruší rezervaci
- **Obnovit** - Obnoví zrušenou rezervaci jako čekající
- **Smazat** - Smaže rezervaci z databáze

#### Řádek 2: Platební akce
- **Záloha zaplacena** - Označí zálohu jako zaplacenou, odešle email
- **Doplacen zbytek** - Označí zbytek jako zaplacený, odešle email
- **Zaplaceno celé** - Označí vše jako zaplacené, odešle email

---

## 📧 Email šablony

### Formátování cen

**Opraveno:** Ceny jsou nyní správně formátovány s dvojtečkami a mezerami:

```
💰 Cenový souhrn
6 nocí × 95 EUR:        570 EUR
Úklidový poplatek:       80 EUR
─────────────────────────────────
Celková cena:           650 EUR
```

**Před (špatně):**
```
6 nocí × 95 EUR
570 EUR
Úklidový poplatek
80 EUR
```

### Použité šablony

1. **`getBookingConfirmationEmail()`** - Potvrzení rezervace
2. **`getDepositPaidEmail()`** - Přijatá záloha
3. **`getFullyPaidEmail()`** - Plná platba

Všechny šablony obsahují:
- ✅ HTML verzi (s inline CSS pro kompatibilitu)
- ✅ Textovou verzi (fallback)
- ✅ Responzivní design
- ✅ Barevné zvýraznění důležitých informací

---

## 🔧 Technická implementace

### Databáze (Firestore)

**Nové pole v `bookings` kolekci:**
```typescript
{
  // ... existující pole
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid'
}
```

### API Endpointy

#### 1. `/api/send-confirmation-email`
- **Metoda:** POST
- **Vstup:** `{ booking: BookingDocument }`
- **Výstup:** `{ success: boolean, messageId: string }`
- **Použití:** Odesílá potvrzovací email po kliknutí na "Potvrdit"

#### 2. `/api/send-payment-email`
- **Metoda:** POST
- **Vstup:** `{ booking: BookingDocument, paymentType: 'deposit_paid' | 'fully_paid' }`
- **Výstup:** `{ success: boolean, messageId: string, paymentType: string }`
- **Použití:** Odesílá platební potvrzení

### Funkce v `lib/firebase/bookings.ts`

```typescript
// Aktualizace platebního statusu
updatePaymentStatus(
  bookingId: string, 
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid'
): Promise<void>
```

---

## 📝 Workflow

### Typický průběh rezervace:

1. **Host vytvoří rezervaci** 
   - Status: `pending`
   - Platba: `unpaid`
   - Email: Potvrzení o přijetí rezervace (původní)

2. **Admin potvrdí rezervaci** (klikne "Potvrdit")
   - Status: `confirmed`
   - Platba: `unpaid`
   - Email: ✅ **Potvrzení rezervace s platebními údaji**

3. **Host zaplatí zálohu 50%**
   - Admin klikne "Záloha zaplacena"
   - Status: `confirmed`
   - Platba: `deposit_paid`
   - Email: ✅ **Potvrzení přijetí zálohy**

4. **Host doplatí zbývajících 50%**
   - Admin klikne "Doplacen zbytek"
   - Status: `confirmed`
   - Platba: `fully_paid`
   - Email: ✅ **Potvrzení plné platby**

### Alternativní workflow:

**Host zaplatí vše najednou:**
1. Host vytvoří rezervaci
2. Admin potvrdí (email s platebními údaji)
3. Host zaplatí celou částku
4. Admin klikne "Zaplaceno celé"
   - Email: ✅ **Potvrzení plné platby**

---

## 🎨 UI/UX vylepšení

### Barevné kódování

- **Zelená** 🟢 - Potvrzeno, Plně zaplaceno
- **Modrá** 🔵 - Záloha zaplacena
- **Oranžová** 🟠 - Nezaplaceno
- **Žlutá** 🟡 - Čeká na potvrzení
- **Červená** 🔴 - Zrušeno

### Responzivní layout

- Tlačítka se zalamují na menších obrazovkách
- Dvouřádkový layout pro přehlednost
- Tooltips s nápovědou při najetí myší

---

## ✅ Testování

### Před nasazením otestujte:

1. **Vytvoření rezervace**
   - Zkontrolujte, že `paymentStatus` je `unpaid`

2. **Potvrzení rezervace**
   - Klikněte "Potvrdit"
   - Zkontrolujte email v inboxu hosta
   - Ověřte formátování cen

3. **Platební akce**
   - Klikněte "Záloha zaplacena"
   - Zkontrolujte email
   - Klikněte "Doplacen zbytek"
   - Zkontrolujte email

4. **Admin panel**
   - Ověřte zobrazení barevných odznaků
   - Zkontrolujte, že tlačítka se mění podle stavu

---

## 🔐 Bezpečnost

- ✅ Všechny API endpointy validují vstupní data
- ✅ Emaily se odesílají pouze po úspěšné aktualizaci databáze
- ✅ Chybové stavy jsou loggovány
- ✅ Uživatel dostane feedback při chybě

---

## 📊 Statistiky v admin panelu

Admin panel zobrazuje:
- **Celkem rezervací** - Všechny rezervace
- **Čeká na potvrzení** - Rezervace se statusem `pending`
- **Potvrzeno** - Rezervace se statusem `confirmed`

**Možné rozšíření:**
- Přidat statistiku "Nezaplaceno"
- Přidat statistiku "Plně zaplaceno"
- Přidat celkový příjem

---

## 🚀 Další možná vylepšení

1. **Automatické připomínky**
   - Email připomínka 7 dní před splatností zálohy
   - Email připomínka měsíc před příjezdem (doplatek)

2. **Historie plateb**
   - Zaznamenávat datum každé platby
   - Zobrazit timeline plateb v admin panelu

3. **Export dat**
   - Export rezervací do CSV/Excel
   - Filtrování podle platebního statusu

4. **Notifikace**
   - Push notifikace při nové rezervaci
   - Email notifikace majiteli při platbě

---

## 📞 Kontakt

Při problémech kontaktujte:
- **Email:** martin.holann@gmail.com
- **Web:** www.cielodorado-tenerife.eu

---

**Systém je plně funkční a připravený k použití!** 🎉

