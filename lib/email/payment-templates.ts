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

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #1e40af;">📍 Informace o příjezdu</h3>
            <p style="margin: 5px 0;">
              Před Vaším příjezdem Vám zašleme detailní informace o:
            </p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Adrese apartmánu a GPS souřadnicích</li>
              <li>Parkování</li>
              <li>Předání klíčů</li>
              <li>Check-in proceduře</li>
              <li>Doporučeních v okolí</li>
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
Před Vaším příjezdem Vám zašleme detailní informace o:
- Adrese apartmánu a GPS souřadnicích
- Parkování
- Předání klíčů
- Check-in proceduře
- Doporučeních v okolí

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

