import { BookingData } from '@/lib/firebase/bookings';

// Email template styles
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
  .price-summary {
    background: #eff6ff;
    padding: 20px;
    margin: 20px 0;
    border-radius: 5px;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  }
  .total-row {
    border-top: 2px solid #3b82f6;
    margin-top: 10px;
    padding-top: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #1e40af;
  }
  .payment-info {
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
  }
  .footer {
    background: #f8fafc;
    padding: 20px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
  }
  .button {
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 12px 30px;
    text-decoration: none;
    border-radius: 5px;
    margin: 20px 0;
    font-weight: 600;
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

// Guest confirmation email template
export function getGuestConfirmationEmail(booking: BookingData & { id: string; bookingNumber: number }): {
  subject: string;
  html: string;
  text: string;
} {
  const checkInDate = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);
  const cleaningFee = 80;
  const subtotal = booking.nights * booking.pricePerNight;
  const deposit50 = Math.round(booking.totalPrice * 0.5);
  const remaining50 = booking.totalPrice - deposit50;

  // Calculate deposit due date (7 days from now)
  const depositDueDate = new Date();
  depositDueDate.setDate(depositDueDate.getDate() + 7);
  const depositDueDateStr = depositDueDate.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate remaining payment due date (1 month before check-in)
  const remainingDueDate = new Date(booking.checkIn);
  remainingDueDate.setMonth(remainingDueDate.getMonth() - 1);
  const remainingDueDateStr = remainingDueDate.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate cancellation deadline (1 month before check-in)
  const cancellationDeadline = new Date(booking.checkIn);
  cancellationDeadline.setMonth(cancellationDeadline.getMonth() - 1);
  const cancellationDeadlineStr = cancellationDeadline.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏖️ Potvrzení rezervace</h1>
          <p>Cielo Dorado - Tenerife</p>
        </div>
        
        <div class="content">
          <h2>Děkujeme za vaši rezervaci!</h2>
          <p>Milý/á ${booking.firstName} ${booking.lastName},</p>
          <p>Vaše rezervace apartmánu <strong>Cielo Dorado</strong> na Tenerife byla úspěšně přijata. Těšíme se na vaši návštěvu!</p>
          
          <div class="booking-details">
            <h3 style="margin-top: 0; color: #1e40af;">📋 Detaily rezervace</h3>
            <div class="detail-row">
              <span class="detail-label">Číslo rezervace / Variabilní symbol:</span>
              <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #1e40af;">${booking.bookingNumber}</span>
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
              <span class="detail-value">${booking.nights} ${booking.nights === 1 ? 'noc' : booking.nights < 5 ? 'noci' : 'nocí'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Počet hostů:</span>
              <span class="detail-value">${booking.guests} ${booking.guests === 1 ? 'osoba' : booking.guests < 5 ? 'osoby' : 'osob'}</span>
            </div>
          </div>

          <div class="price-summary">
            <h3 style="margin-top: 0; color: #1e40af;">💰 Cenový souhrn</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; text-align: left;">${booking.nights} ${booking.nights === 1 ? 'noc' : booking.nights < 5 ? 'noci' : 'nocí'} × ${booking.pricePerNight} EUR:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${subtotal} EUR</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; text-align: left;">Úklidový poplatek:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${cleaningFee} EUR</td>
              </tr>
              <tr style="border-top: 2px solid #3b82f6;">
                <td style="padding: 12px 0 0 0; text-align: left; font-size: 18px; font-weight: bold; color: #1e40af;">Celková cena:</td>
                <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #1e40af;">${booking.totalPrice} EUR</td>
              </tr>
            </table>
          </div>

          <div class="payment-info">
            <h3 style="margin-top: 0; color: #d97706;">💳 Platební informace</h3>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e40af;">Bankovní účet:</p>
              <p style="margin: 5px 0;"><strong>IBAN:</strong> ES56 0049 4166 2227 1404 1761</p>
              <p style="margin: 5px 0;"><strong>SWIFT/BIC:</strong> BSCHESMMXXX</p>
              <p style="margin: 5px 0;"><strong>Banka:</strong> BANCO SANTANDER, S.A.</p>
              <p style="margin: 5px 0;"><strong>Variabilní symbol:</strong> <span style="font-size: 16px; font-weight: bold; color: #d97706;">${booking.bookingNumber}</span></p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 16px;">📅 Platební podmínky:</p>

              <p style="margin: 10px 0;">
                <strong>1. Záloha 50%:</strong> ${deposit50} EUR<br>
                <span style="color: #92400e;">Splatnost: do ${depositDueDateStr}</span>
              </p>

              <p style="margin: 10px 0;">
                <strong>2. Zbývajících 50%:</strong> ${remaining50} EUR<br>
                <span style="color: #92400e;">Splatnost: do ${remainingDueDateStr}</span>
              </p>

              <p style="margin: 15px 0 10px 0; padding: 10px; background: white; border-radius: 5px;">
                💡 <strong>Tip:</strong> Pokud chcete, můžete uhradit celou částku <strong>${booking.totalPrice} EUR</strong> najednou.
              </p>
            </div>

            <div style="background: #fee2e2; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 0; color: #991b1b;">
                <strong>⚠️ Storno podmínky:</strong><br>
                Bezplatné storno je možné do <strong>${cancellationDeadlineStr}</strong> (měsíc před příjezdem).<br>
                Po tomto datu nebude záloha vrácena.
              </p>
            </div>
          </div>

          ${booking.message ? `
          <div style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #475569;">📝 Vaše zpráva:</h3>
            <p style="margin: 0; font-style: italic;">"${booking.message}"</p>
          </div>
          ` : ''}

          <div class="contact-info">
            <h3 style="color: #1e40af;">📞 Kontaktní informace</h3>
            <p><strong>Email:</strong> martin.holann@gmail.com</p>
            <p><strong>Web:</strong> <a href="https://www.cielodorado-tenerife.eu">www.cielodorado-tenerife.eu</a></p>
          </div>

          <p style="margin-top: 30px;">Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat.</p>
          <p>Těšíme se na vás! ☀️</p>
          <p style="margin-top: 20px;"><strong>Tým Cielo Dorado</strong></p>
        </div>

        <div class="footer">
          <p>Tento email byl odeslán jako potvrzení vaší rezervace.</p>
          <p>© ${new Date().getFullYear()} Cielo Dorado Tenerife. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Potvrzení rezervace - Cielo Dorado Tenerife

Děkujeme za vaši rezervaci!

Milý/á ${booking.firstName} ${booking.lastName},

Vaše rezervace apartmánu Cielo Dorado na Tenerife byla úspěšně přijata.

DETAILY REZERVACE:
- Číslo rezervace / Variabilní symbol: ${booking.bookingNumber}
- Příjezd: ${checkInDate}
- Odjezd: ${checkOutDate}
- Počet nocí: ${booking.nights}
- Počet hostů: ${booking.guests}

CENOVÝ SOUHRN:
- ${booking.nights} nocí × ${booking.pricePerNight} EUR = ${subtotal} EUR
- Úklidový poplatek: ${cleaningFee} EUR
- CELKOVÁ CENA: ${booking.totalPrice} EUR

PLATEBNÍ INFORMACE:

Bankovní účet:
IBAN: ES56 0049 4166 2227 1404 1761
SWIFT/BIC: BSCHESMMXXX
Banka: BANCO SANTANDER, S.A.
Variabilní symbol: ${booking.bookingNumber}

Platební podmínky:
1. Záloha 50%: ${deposit50} EUR
   Splatnost: do ${depositDueDateStr}

2. Zbývajících 50%: ${remaining50} EUR
   Splatnost: do ${remainingDueDateStr}

TIP: Pokud chcete, můžete uhradit celou částku ${booking.totalPrice} EUR najednou.

STORNO PODMÍNKY:
Bezplatné storno je možné do ${cancellationDeadlineStr} (měsíc před příjezdem).
Po tomto datu nebude záloha vrácena.

${booking.message ? `VAŠE ZPRÁVA:\n"${booking.message}"\n` : ''}

KONTAKT:
Email: martin.holann@gmail.com
Web: www.cielodorado-tenerife.eu

Těšíme se na vás!
Tým Cielo Dorado
  `;

  return {
    subject: `Potvrzení rezervace #${booking.bookingNumber} - Cielo Dorado Tenerife`,
    html,
    text,
  };
}

// Owner notification email template
export function getOwnerNotificationEmail(booking: BookingData & { id: string; bookingNumber: number }): {
  subject: string;
  html: string;
  text: string;
} {
  const checkInDate = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);
  const deposit50 = Math.round(booking.totalPrice * 0.5);

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
          <h1>🔔 Nová rezervace!</h1>
          <p>Cielo Dorado - Admin notifikace</p>
        </div>
        
        <div class="content">
          <h2>Přijata nová rezervace</h2>
          <p>Do systému byla právě vložena nová rezervace apartmánu Cielo Dorado.</p>
          
          <div class="booking-details">
            <h3 style="margin-top: 0; color: #059669;">📋 Informace o rezervaci</h3>
            <div class="detail-row">
              <span class="detail-label">Číslo rezervace:</span>
              <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #059669;">${booking.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value" style="color: #f59e0b;">⏳ Čeká na potvrzení</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Očekávaná záloha (50%):</span>
              <span class="detail-value" style="font-weight: bold; color: #059669;">${deposit50} EUR</span>
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
              <span class="detail-value" style="color: #059669; font-size: 18px;">${booking.totalPrice} EUR</span>
            </div>
          </div>

          <div class="booking-details" style="border-left-color: #3b82f6;">
            <h3 style="margin-top: 0; color: #1e40af;">👤 Kontaktní údaje hosta</h3>
            <div class="detail-row">
              <span class="detail-label">Jméno:</span>
              <span class="detail-value">${booking.firstName} ${booking.lastName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value"><a href="mailto:${booking.email}">${booking.email}</a></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Telefon:</span>
              <span class="detail-value"><a href="tel:${booking.phone}">${booking.phone}</a></span>
            </div>
          </div>

          ${booking.message ? `
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d97706;">💬 Zpráva od hosta:</h3>
            <p style="margin: 0;">"${booking.message}"</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.cielodorado-tenerife.eu/admin" class="button" style="background: #059669;">
              Zobrazit v admin panelu
            </a>
          </div>

          <div style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #475569;">⚡ Další kroky:</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Zkontrolujte dostupnost v kalendáři</li>
              <li>Potvrďte rezervaci v admin panelu</li>
              <li>Zašlete hostovi platební údaje</li>
              <li>Po obdržení zálohy potvrďte rezervaci</li>
            </ol>
          </div>
        </div>

        <div class="footer">
          <p>Toto je automatická notifikace z rezervačního systému.</p>
          <p>© ${new Date().getFullYear()} Cielo Dorado Tenerife</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
NOVÁ REZERVACE - Cielo Dorado Tenerife

Do systému byla právě vložena nová rezervace.

INFORMACE O REZERVACI:
- Číslo rezervace: ${booking.bookingNumber}
- Status: Čeká na potvrzení
- Příjezd: ${checkInDate}
- Odjezd: ${checkOutDate}
- Počet nocí: ${booking.nights}
- Počet hostů: ${booking.guests}
- Celková cena: ${booking.totalPrice} EUR
- Očekávaná záloha (50%): ${deposit50} EUR

KONTAKTNÍ ÚDAJE HOSTA:
- Jméno: ${booking.firstName} ${booking.lastName}
- Email: ${booking.email}
- Telefon: ${booking.phone}

${booking.message ? `ZPRÁVA OD HOSTA:\n"${booking.message}"\n` : ''}

PLATEBNÍ ÚDAJE (již odeslány hostovi):
- Variabilní symbol: ${booking.bookingNumber}
- IBAN: ES56 0049 4166 2227 1404 1761
- Záloha 50%: ${deposit50} EUR (splatnost: 7 dní)

DALŠÍ KROKY:
1. Zkontrolujte dostupnost v kalendáři
2. Sledujte příchozí platby (VS: ${booking.bookingNumber})
3. Po obdržení zálohy potvrďte rezervaci v admin panelu
4. Připomeňte hostovi zbývající platbu měsíc před příjezdem

Admin panel: https://www.cielodorado-tenerife.eu/admin
  `;

  return {
    subject: `🔔 Nová rezervace #${booking.bookingNumber} - ${booking.firstName} ${booking.lastName}`,
    html,
    text,
  };
}

// Booking confirmation email (sent when admin confirms)
export function getBookingConfirmationEmail(booking: BookingData & { id: string; bookingNumber: number }): {
  subject: string;
  html: string;
  text: string;
} {
  const checkInDate = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);
  const cleaningFee = 80;
  const subtotal = booking.totalPrice - cleaningFee;
  const deposit50 = Math.round(booking.totalPrice * 0.5);
  const remaining50 = booking.totalPrice - deposit50;

  // Calculate payment deadlines
  const depositDeadline = new Date();
  depositDeadline.setDate(depositDeadline.getDate() + 7);
  const depositDeadlineStr = depositDeadline.toLocaleDateString('cs-CZ');

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
        <div class="header">
          <h1>✅ Rezervace potvrzena!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Číslo rezervace: #${booking.bookingNumber}</p>
        </div>

        <div class="content">
          <p>Dobrý den ${booking.firstName},</p>

          <p><strong>Vaše rezervace byla úspěšně potvrzena!</strong> 🎉</p>

          <p>Těšíme se na Vaši návštěvu v apartmánu Cielo Dorado na Tenerife.</p>

          <div class="booking-details">
            <h3 style="margin-top: 0; color: #1e40af;">📅 Detaily rezervace</h3>
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
              <span class="detail-value">${booking.nights} ${booking.nights === 1 ? 'noc' : booking.nights < 5 ? 'noci' : 'nocí'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Počet hostů:</span>
              <span class="detail-value">${booking.guests} ${booking.guests === 1 ? 'osoba' : booking.guests < 5 ? 'osoby' : 'osob'}</span>
            </div>
          </div>

          <div class="price-summary">
            <h3 style="margin-top: 0; color: #1e40af;">💰 Cenový souhrn</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; text-align: left;">${booking.nights} ${booking.nights === 1 ? 'noc' : booking.nights < 5 ? 'noci' : 'nocí'} × ${booking.pricePerNight} EUR:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${subtotal} EUR</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; text-align: left;">Úklidový poplatek:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${cleaningFee} EUR</td>
              </tr>
              <tr style="border-top: 2px solid #3b82f6;">
                <td style="padding: 12px 0 0 0; text-align: left; font-size: 18px; font-weight: bold; color: #1e40af;">Celková cena:</td>
                <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #1e40af;">${booking.totalPrice} EUR</td>
              </tr>
            </table>
          </div>

          <div class="payment-info">
            <h3 style="margin-top: 0; color: #d97706;">💳 Platební informace</h3>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e40af;">Bankovní účet:</p>
              <p style="margin: 5px 0;"><strong>IBAN:</strong> ES56 0049 4166 2227 1404 1761</p>
              <p style="margin: 5px 0;"><strong>SWIFT/BIC:</strong> BSCHESMMXXX</p>
              <p style="margin: 5px 0;"><strong>Banka:</strong> BANCO SANTANDER, S.A.</p>
              <p style="margin: 5px 0;"><strong>Variabilní symbol:</strong> ${booking.bookingNumber}</p>
            </div>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #d97706;">Platební podmínky:</p>
              <p style="margin: 5px 0;">✅ <strong>Záloha 50%:</strong> ${deposit50} EUR (splatnost: ${depositDeadlineStr})</p>
              <p style="margin: 5px 0;">✅ <strong>Zbývajících 50%:</strong> ${remaining50} EUR (splatnost: ${remainingDeadlineStr})</p>
            </div>

            <p style="margin: 15px 0; padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 3px;">
              <strong>⚠️ Důležité:</strong> Prosím uveďte variabilní symbol <strong>${booking.bookingNumber}</strong> při platbě.
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
REZERVACE POTVRZENA!
Číslo rezervace: #${booking.bookingNumber}

Dobrý den ${booking.firstName},

Vaše rezervace byla úspěšně potvrzena! 🎉

Těšíme se na Vaši návštěvu v apartmánu Cielo Dorado na Tenerife.

DETAILY REZERVACE:
- Číslo rezervace: #${booking.bookingNumber}
- Příjezd: ${checkInDate}
- Odjezd: ${checkOutDate}
- Počet nocí: ${booking.nights}
- Počet hostů: ${booking.guests}

CENOVÝ SOUHRN:
- ${booking.nights} nocí × ${booking.pricePerNight} EUR = ${subtotal} EUR
- Úklidový poplatek: ${cleaningFee} EUR
- CELKOVÁ CENA: ${booking.totalPrice} EUR

PLATEBNÍ INFORMACE:

Bankovní účet:
IBAN: ES56 0049 4166 2227 1404 1761
SWIFT/BIC: BSCHESMMXXX
Banka: BANCO SANTANDER, S.A.
Variabilní symbol: ${booking.bookingNumber}

Platební podmínky:
✅ Záloha 50%: ${deposit50} EUR (splatnost: ${depositDeadlineStr})
✅ Zbývajících 50%: ${remaining50} EUR (splatnost: ${remainingDeadlineStr})

⚠️ DŮLEŽITÉ: Prosím uveďte variabilní symbol ${booking.bookingNumber} při platbě.

KONTAKT:
Email: martin.holann@gmail.com
Web: www.cielodorado-tenerife.eu

Těšíme se na Vás!
Tým Cielo Dorado
  `;

  return {
    subject: `✅ Rezervace potvrzena #${booking.bookingNumber} - Cielo Dorado Tenerife`,
    html,
    text,
  };
}

