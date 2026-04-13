import { BookingData } from '@/lib/firebase/bookings';

// Email template styles (same as templates.ts)
const emailStyles = `
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .header {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    padding: 30px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
  }
  .content {
    padding: 30px;
  }
  .booking-details {
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 20px;
    margin: 20px 0;
    border-radius: 5px;
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .detail-row:last-child {
    border-bottom: none;
  }
  .detail-label {
    font-weight: 600;
    color: #64748b;
  }
  .detail-value {
    color: #1e293b;
    font-weight: 500;
  }
  .footer {
    background: #f8fafc;
    padding: 20px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
  }
  .contact-info {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
  }
`;

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('cs-CZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Deposit paid email
export function getDepositPaidEmail(booking: BookingData & { id: string; bookingNumber: number }): {
  subject: string;
  html: string;
  text: string;
} {
  const checkInDate = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);
  const deposit50 = Math.round(booking.totalPrice * 0.5);
  const remaining50 = booking.totalPrice - deposit50;

  const checkInDateObj = new Date(booking.checkIn);
  const remainingDeadline = new Date(checkInDateObj);
  remainingDeadline.setMonth(remainingDeadline.getMonth() - 1);
  const remainingDeadlineStr = remainingDeadline.toLocaleDateString('cs-CZ');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
          <h1>✅ Záloha přijata!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Rezervace #${booking.bookingNumber}</p>
        </div>

        <div class="content">
          <p>Dobrý den ${booking.firstName},</p>
          
          <p><strong>Přijali jsme Vaši zálohu ve výši ${deposit50} EUR.</strong> ✅</p>
          
          <p>Děkujeme za platbu! Vaše rezervace je nyní plně potvrzena.</p>

          <div class="booking-details">
            <h3 style="margin-top: 0; color: #059669;">📅 Detaily rezervace</h3>
            <div class="detail-row">
              <span class="detail-label">Číslo rezervace:</span>
              <span class="detail-value">#${booking.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Příjezd:</span>
              <span class="detail-value">${checkInDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Odjezd:</span>
              <span class="detail-value">${checkOutDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Celková cena:</span>
              <span class="detail-value">${booking.totalPrice} EUR</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Zaplacená záloha:</span>
              <span class="detail-value" style="color: #059669; font-weight: bold;">${deposit50} EUR ✅</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Zbývá doplatit:</span>
              <span class="detail-value" style="color: #d97706; font-weight: bold;">${remaining50} EUR</span>
            </div>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #d97706;">💳 Zbývající platba</h3>
            <p style="margin: 5px 0;"><strong>Částka:</strong> ${remaining50} EUR</p>
            <p style="margin: 5px 0;"><strong>Splatnost:</strong> ${remainingDeadlineStr}</p>
            <p style="margin: 5px 0;"><strong>Variabilní symbol:</strong> ${booking.bookingNumber}</p>
            <p style="margin: 15px 0 5px 0; font-size: 14px;">
              Zbývající částku prosím uhraďte nejpozději měsíc před příjezdem.
            </p>
          </div>

          <div class="contact-info">
            <h3 style="color: #1e40af;">📞 Kontaktní informace</h3>
            <p><strong>Email:</strong> martin.holann@gmail.com</p>
            <p><strong>Web:</strong> <a href="https://www.cielodorado-tenerife.eu">www.cielodorado-tenerife.eu</a></p>
          </div>

          <p style="margin-top: 30px;">Těšíme se na Vás!</p>
          <p><strong>Tým Cielo Dorado</strong></p>
        </div>

        <div class="footer">
          <p>Tento email byl odeslán automaticky systémem rezervací Cielo Dorado.</p>
          <p>&copy; ${new Date().getFullYear()} Cielo Dorado Tenerife. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
ZÁLOHA PŘIJATA!
Rezervace #${booking.bookingNumber}

Dobrý den ${booking.firstName},

Přijali jsme Vaši zálohu ve výši ${deposit50} EUR. ✅

Děkujeme za platbu! Vaše rezervace je nyní plně potvrzena.

DETAILY REZERVACE:
- Číslo rezervace: #${booking.bookingNumber}
- Příjezd: ${checkInDate}
- Odjezd: ${checkOutDate}
- Celková cena: ${booking.totalPrice} EUR
- Zaplacená záloha: ${deposit50} EUR ✅
- Zbývá doplatit: ${remaining50} EUR

ZBÝVAJÍCÍ PLATBA:
- Částka: ${remaining50} EUR
- Splatnost: ${remainingDeadlineStr}
- Variabilní symbol: ${booking.bookingNumber}

Zbývající částku prosím uhraďte nejpozději měsíc před příjezdem.

KONTAKT:
Email: martin.holann@gmail.com
Web: www.cielodorado-tenerife.eu

Těšíme se na Vás!
Tým Cielo Dorado
  `;

  return {
    subject: `✅ Záloha přijata #${booking.bookingNumber} - Cielo Dorado Tenerife`,
    html,
    text,
  };
}

// Fully paid email
export function getFullyPaidEmail(booking: BookingData & { id: string; bookingNumber: number }): {
  subject: string;
  html: string;
  text: string;
} {
  const checkInDate = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
          <h1>🎉 Plně zaplaceno!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Rezervace #${booking.bookingNumber}</p>
        </div>

        <div class="content">
          <p>Dobrý den ${booking.firstName},</p>
          
          <p><strong>Přijali jsme Vaši platbu ve výši ${booking.totalPrice} EUR.</strong> 🎉</p>
          
          <p>Vaše rezervace je plně zaplacena! Těšíme se na Vaši návštěvu v apartmánu Cielo Dorado.</p>

          <div class="booking-details">
            <h3 style="margin-top: 0; color: #059669;">📅 Detaily rezervace</h3>
            <div class="detail-row">
              <span class="detail-label">Číslo rezervace:</span>
              <span class="detail-value">#${booking.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Příjezd:</span>
              <span class="detail-value">${checkInDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Odjezd:</span>
              <span class="detail-value">${checkOutDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Počet nocí:</span>
              <span class="detail-value">${booking.nights}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Počet hostů:</span>
              <span class="detail-value">${booking.guests}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Celková cena:</span>
              <span class="detail-value" style="color: #059669; font-weight: bold; font-size: 18px;">${booking.totalPrice} EUR ✅</span>
            </div>
          </div>

          <div style="background: #d1fae5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #059669;">✅ Stav platby</h3>
            <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #059669;">
              PLNĚ ZAPLACENO
            </p>
            <p style="margin: 10px 0 5px 0; font-size: 14px;">
              Všechny platby byly přijaty. Nemusíte již nic doplácet.
            </p>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #1e40af;">📍 Informace o příjezdu</h3>
            <p style="margin: 5px 0;">
              <strong>2 dny před Vaším příjezdem</strong> obdržíte samostatný email s:
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
              <li>Přesnou adresou apartmánu a odkazem na mapu</li>
              <li>Navigací k bytu v budově</li>
              <li>Kódem a fotkou key boxu pro vyzvednutí klíčů</li>
            </ul>
          </div>

          <div class="contact-info">
            <h3 style="color: #1e40af;">📞 Kontaktní informace</h3>
            <p><strong>Email:</strong> martin.holann@gmail.com</p>
            <p><strong>Web:</strong> <a href="https://www.cielodorado-tenerife.eu">www.cielodorado-tenerife.eu</a></p>
          </div>

          <p style="margin-top: 30px;">Těšíme se na Vás!</p>
          <p><strong>Tým Cielo Dorado</strong></p>
        </div>

        <div class="footer">
          <p>Tento email byl odeslán automaticky systémem rezervací Cielo Dorado.</p>
          <p>&copy; ${new Date().getFullYear()} Cielo Dorado Tenerife. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
PLNĚ ZAPLACENO!
Rezervace #${booking.bookingNumber}

Dobrý den ${booking.firstName},

Přijali jsme Vaši platbu ve výši ${booking.totalPrice} EUR. 🎉

Vaše rezervace je plně zaplacena! Těšíme se na Vaši návštěvu v apartmánu Cielo Dorado.

DETAILY REZERVACE:
- Číslo rezervace: #${booking.bookingNumber}
- Příjezd: ${checkInDate}
- Odjezd: ${checkOutDate}
- Počet nocí: ${booking.nights}
- Počet hostů: ${booking.guests}
- Celková cena: ${booking.totalPrice} EUR ✅

STAV PLATBY:
✅ PLNĚ ZAPLACENO

Všechny platby byly přijaty. Nemusíte již nic doplácet.

INFORMACE O PŘÍJEZDU:
2 dny před Vaším příjezdem obdržíte samostatný email s přesnou adresou,
navigací k bytu a kódem pro key box s klíči.

KONTAKT:
Email: martin.holann@gmail.com
Web: www.cielodorado-tenerife.eu

Těšíme se na Vás!
Tým Cielo Dorado
  `;

  return {
    subject: `🎉 Plně zaplaceno #${booking.bookingNumber} - Cielo Dorado Tenerife`,
    html,
    text,
  };
}

// Arrival info email (sent 2 days before check-in)
export function getArrivalInfoEmail(booking: BookingData & { id: string; bookingNumber: number }): {
  subject: string;
  html: string;
  text: string;
} {
  const checkInDate = formatDate(booking.checkIn);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);">
          <h1>🏖️ Informace o příjezdu</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Rezervace #${booking.bookingNumber} — příjezd ${checkInDate}</p>
        </div>

        <div class="content">
          <p>Dobrý den ${booking.firstName},</p>
          <p>Těšíme se na Vás! Zde jsou veškeré informace potřebné k Vašemu příjezdu.</p>

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #1e40af;">🏠 Adresa apartmánu</h3>
            <p style="margin: 8px 0; font-size: 16px;">
              <strong>Av. José González Forte 73</strong><br>
              38683 Santiago del Teide (Los Gigantes)<br>
              Tenerife, Španělsko
            </p>
            <p style="margin: 12px 0 5px 0;">
              <a href="https://maps.google.com/?q=Av.+Jose+Gonzalez+Forte+73,+38683+Santiago+del+Teide,+Tenerife" style="background: #1e40af; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                📍 Otevřít v Google Maps
              </a>
            </p>
          </div>

          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #059669;">🚪 Jak najít apartmán</h3>
            <ol style="margin: 8px 0; padding-left: 20px; line-height: 2;">
              <li>Vstupte do budovy</li>
              <li>Jděte k výtahu — <strong>před výtahem odbočte vpravo</strong></li>
              <li>Pokračujte chodbou <strong>nahoru a doleva</strong></li>
              <li><strong>Byt č. 5, 1. patro</strong></li>
            </ol>
            <div style="margin: 15px 0 5px 0; text-align: center;">
              <img src="cid:door" alt="Dveře apartmánu č. 5" style="width: 100%; max-width: 400px; border-radius: 8px; display: block; margin: 0 auto;">
            </div>
          </div>

          <div style="background: #fefce8; border-left: 4px solid #ca8a04; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #92400e;">🔑 Přístup — Key Box</h3>
            <p style="margin: 5px 0;">Klíče jsou uloženy v schránce (key box) u vchodu do apartmánu.</p>
            <div style="margin: 12px 0; text-align: center;">
              <img src="cid:keybox" alt="Key box" style="width: 100%; max-width: 400px; border-radius: 8px; display: block; margin: 0 auto;">
            </div>
            <p style="margin: 10px 0 5px 0;"><strong>Kód pro otevření:</strong></p>
            <div style="background: #1e40af; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 18px; border-radius: 8px; letter-spacing: 10px; margin: 8px 0;">
              3377
            </div>
            <p style="margin: 10px 0 0 0; font-size: 13px; color: #475569;">
              ⚠️ Po odjezdu prosím klíče vraťte zpět do key boxu a zavřete ho.
            </p>
          </div>

          <div class="contact-info">
            <h3 style="color: #1e40af;">📞 Kontakt</h3>
            <p><strong>Email:</strong> info@cielodorado-tenerife.eu</p>
            <p><strong>Web:</strong> <a href="https://www.cielodorado-tenerife.eu">www.cielodorado-tenerife.eu</a></p>
          </div>

          <p style="margin-top: 30px;">Přejeme Vám krásný pobyt!</p>
          <p><strong>Tým Cielo Dorado</strong></p>
        </div>

        <div class="footer">
          <p>Tento email byl odeslán automaticky 2 dny před Vaším příjezdem.</p>
          <p>&copy; ${new Date().getFullYear()} Cielo Dorado Tenerife. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
INFORMACE O PŘÍJEZDU
Rezervace #${booking.bookingNumber} — příjezd ${checkInDate}

Dobrý den ${booking.firstName},

Těšíme se na Vás! Zde jsou informace k příjezdu.

ADRESA:
Av. José González Forte 73
38683 Santiago del Teide (Los Gigantes), Tenerife, Španělsko
Google Maps: https://maps.google.com/?q=Av.+Jose+Gonzalez+Forte+73,+38683+Santiago+del+Teide,+Tenerife

JAK NAJÍT APARTMÁN:
1. Vstupte do budovy
2. Jděte k výtahu — před výtahem odbočte vpravo
3. Pokračujte chodbou nahoru a doleva
4. Byt č. 5, 1. patro

KEY BOX — KÓD: 3377
Klíče jsou v schránce u vchodu do apartmánu.
Po odjezdu klíče vraťte zpět do key boxu.

KONTAKT:
Email: info@cielodorado-tenerife.eu
Web: www.cielodorado-tenerife.eu

Přejeme Vám krásný pobyt!
Tým Cielo Dorado
  `;

  return {
    subject: `🏖️ Informace o příjezdu #${booking.bookingNumber} — ${checkInDate}`,
    html,
    text,
  };
}
