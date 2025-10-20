# 🔒 Nasazení Firestore Security Rules

## Proč je potřeba nasadit rules?

Přidali jsme novou kolekci `syncLogs` do Firestore pro ukládání historie synchronizace.
Firestore security rules musí být aktualizovány, aby umožňovaly čtení a zápis do této kolekce.

## 📋 Co bylo přidáno do `firestore.rules`:

```javascript
// Sync logs collection
match /syncLogs/{logId} {
  // Allow read for everyone (needed for admin panel)
  allow read: if true;

  // Allow create for everyone (needed for API endpoints)
  allow create: if
    request.resource.data.keys().hasAll([
      'timestamp', 'type', 'status', 'message'
    ]) &&
    request.resource.data.type in ['sync', 'import', 'export'] &&
    request.resource.data.status in ['success', 'error'];

  // No updates or deletes allowed
  allow update, delete: if false;
}
```

## 🚀 Jak nasadit rules:

### Možnost 1: Firebase Console (Doporučeno)

1. **Otevřete Firebase Console:**
   - Jděte na: https://console.firebase.google.com/
   - Vyberte projekt: **cielo-dorado-tenerife**

2. **Navigujte do Firestore Rules:**
   - V levém menu: **Firestore Database**
   - Záložka: **Rules**

3. **Zkopírujte obsah souboru `firestore.rules`:**
   - Otevřete soubor `firestore.rules` v projektu
   - Zkopírujte celý obsah

4. **Vložte do Firebase Console:**
   - Vložte zkopírovaný obsah do editoru
   - Klikněte **Publish**

5. **Ověření:**
   - Rules by měly být okamžitě aktivní
   - Zkontrolujte, že se nezobrazují žádné chyby

### Možnost 2: Firebase CLI

Pokud máte nainstalované Firebase CLI:

```bash
# Přihlášení do Firebase
firebase login

# Nasazení rules
firebase deploy --only firestore:rules
```

## ✅ Ověření, že rules fungují:

Po nasazení rules:

1. **Otevřete admin panel:**
   - https://www.cielodorado-tenerife.eu/admin
   - Záložka: **iCal Sync**

2. **Klikněte "Plná synchronizace"**

3. **Zkontrolujte "Historie synchronizace":**
   - Měli byste vidět nový záznam o synchronizaci
   - Pokud vidíte záznamy, rules fungují správně! ✅

4. **Klikněte "Obnovit":**
   - Historie by se měla aktualizovat
   - Měli byste vidět všechny předchozí synchronizace z Vercel Cron

## 🔍 Co se stane, když rules nejsou nasazeny:

Pokud rules nejsou nasazeny, uvidíte v konzoli prohlížeče chybu:

```
❌ Error saving sync log: FirebaseError: Missing or insufficient permissions
```

A v admin panelu:
- Historie synchronizace bude prázdná
- Synchronizace bude fungovat, ale logy se neuloží

## 📊 Struktura syncLogs kolekce:

```typescript
{
  timestamp: Timestamp,        // Čas synchronizace
  type: 'sync' | 'import' | 'export',  // Typ operace
  status: 'success' | 'error', // Výsledek
  message: string,             // Popis (např. "Synchronizace dokončena: 3 importováno, 0 přeskočeno")
  details: {                   // Volitelné detaily
    imported?: number,
    skipped?: number,
    total?: number,
    duration?: string,
    error?: string
  }
}
```

## 🎯 Příklad záznamu v Firestore:

```json
{
  "timestamp": "2025-10-20T08:00:06.000Z",
  "type": "sync",
  "status": "success",
  "message": "Synchronizace dokončena: 3 importováno, 0 přeskočeno",
  "details": {
    "imported": 3,
    "skipped": 0,
    "total": 3,
    "duration": "824ms"
  }
}
```

## 🔐 Bezpečnost:

- **Read:** Povoleno pro všechny (potřebné pro admin panel)
- **Create:** Povoleno pro všechny, ale s validací struktury dat
- **Update/Delete:** Zakázáno (logy jsou immutable)

V budoucnu můžete přidat autentizaci pro admin:

```javascript
allow read, create: if request.auth != null && request.auth.token.admin == true;
```

## 📝 Poznámky:

- Rules jsou globální pro celý Firestore projekt
- Změny jsou okamžité (bez restartu)
- Můžete testovat rules v Firebase Console → Rules → Simulator
- Logy se automaticky ukládají při každé synchronizaci (manuální i automatické)

---

**Po nasazení rules budete vidět kompletní historii všech synchronizací včetně těch z Vercel Cron!** 🎉

