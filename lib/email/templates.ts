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
export function getGuestConfirmationEmail(booking: BookingData & { id: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const checkInDate = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);
  const cleaningFee = 80;
  const subtotal = booking.nights * booking.pricePerNight;

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
              <span class="detail-label">Číslo rezervace:</span>
              <span class="detail-value">#${booking.id.substring(0, 8).toUpperCase()}</span>
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
            <div class="price-row">
              <span>${booking.nights} ${booking.nights === 1 ? 'noc' : booking.nights < 5 ? 'noci' : 'nocí'} × ${booking.pricePerNight} EUR</span>
              <span>${subtotal} EUR</span>
            </div>
            <div class="price-row">
              <span>Úklidový poplatek</span>
              <span>${cleaningFee} EUR</span>
            </div>
            <div class="price-row total-row">
              <span>Celková cena</span>
              <span>${booking.totalPrice} EUR</span>
            </div>
          </div>

          <div class="payment-info">
            <h3 style="margin-top: 0; color: #d97706;">💳 Platební informace</h3>
            <p style="margin: 10px 0;">Pro potvrzení rezervace prosím uhraďte zálohu ve výši <strong>30% (${Math.round(booking.totalPrice * 0.3)} EUR)</strong> do 3 dnů.</p>
            <p style="margin: 10px 0;">Zbývající částku uhraďte nejpozději 14 dní před příjezdem.</p>
            <p style="margin: 10px 0;"><strong>Platební údaje vám zašleme v samostatném emailu.</strong></p>
          </div>

          ${booking.message ? `
          <div style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #475569;">📝 Vaše zpráva:</h3>
            <p style="margin: 0; font-style: italic;">"${booking.message}"</p>
          </div>
          ` : ''}

          <div class="contact-info">
            <h3 style="color: #1e40af;">📞 Kontaktní informace</h3>
            <p><strong>Email:</strong> info@cielodorado-tenerife.eu</p>
            <p><strong>Telefon:</strong> +420 777 123 456</p>
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
- Číslo rezervace: #${booking.id.substring(0, 8).toUpperCase()}
- Příjezd: ${checkInDate}
- Odjezd: ${checkOutDate}
- Počet nocí: ${booking.nights}
- Počet hostů: ${booking.guests}

CENOVÝ SOUHRN:
- ${booking.nights} nocí × ${booking.pricePerNight} EUR = ${subtotal} EUR
- Úklidový poplatek: ${cleaningFee} EUR
- CELKOVÁ CENA: ${booking.totalPrice} EUR

PLATEBNÍ INFORMACE:
Pro potvrzení rezervace prosím uhraďte zálohu ve výši 30% (${Math.round(booking.totalPrice * 0.3)} EUR) do 3 dnů.
Zbývající částku uhraďte nejpozději 14 dní před příjezdem.
Platební údaje vám zašleme v samostatném emailu.

${booking.message ? `VAŠE ZPRÁVA:\n"${booking.message}"\n` : ''}

KONTAKT:
Email: info@cielodorado-tenerife.eu
Telefon: +420 777 123 456
Web: www.cielodorado-tenerife.eu

Těšíme se na vás!
Tým Cielo Dorado
  `;

  return {
    subject: `Potvrzení rezervace #${booking.id.substring(0, 8).toUpperCase()} - Cielo Dorado Tenerife`,
    html,
    text,
  };
}

// Owner notification email template
export function getOwnerNotificationEmail(booking: BookingData & { id: string }): {
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
          <h1>🔔 Nová rezervace!</h1>
          <p>Cielo Dorado - Admin notifikace</p>
        </div>
        
        <div class="content">
          <h2>Přijata nová rezervace</h2>
          <p>Do systému byla právě vložena nová rezervace apartmánu Cielo Dorado.</p>
          
          <div class="booking-details">
            <h3 style="margin-top: 0; color: #059669;">📋 Informace o rezervaci</h3>
            <div class="detail-row">
              <span class="detail-label">ID rezervace:</span>
              <span class="detail-value">#${booking.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value" style="color: #f59e0b;">⏳ Čeká na potvrzení</span>
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
- ID: #${booking.id.substring(0, 8).toUpperCase()}
- Status: Čeká na potvrzení
- Příjezd: ${checkInDate}
- Odjezd: ${checkOutDate}
- Počet nocí: ${booking.nights}
- Počet hostů: ${booking.guests}
- Celková cena: ${booking.totalPrice} EUR

KONTAKTNÍ ÚDAJE HOSTA:
- Jméno: ${booking.firstName} ${booking.lastName}
- Email: ${booking.email}
- Telefon: ${booking.phone}

${booking.message ? `ZPRÁVA OD HOSTA:\n"${booking.message}"\n` : ''}

DALŠÍ KROKY:
1. Zkontrolujte dostupnost v kalendáři
2. Potvrďte rezervaci v admin panelu
3. Zašlete hostovi platební údaje
4. Po obdržení zálohy potvrďte rezervaci

Admin panel: https://www.cielodorado-tenerife.eu/admin
  `;

  return {
    subject: `🔔 Nová rezervace #${booking.id.substring(0, 8).toUpperCase()} - ${booking.firstName} ${booking.lastName}`,
    html,
    text,
  };
}

