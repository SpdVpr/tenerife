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
  .header p {
    margin: 8px 0 0;
    opacity: 0.9;
    font-size: 16px;
  }
  .content {
    padding: 30px;
  }
  .stay-details {
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
  .cta-section {
    text-align: center;
    margin: 30px 0;
    padding: 20px;
    background: #eff6ff;
    border-radius: 8px;
  }
  .cta-button {
    display: inline-block;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white !important;
    text-decoration: none;
    padding: 16px 40px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
  }
  .footer {
    background: #f8fafc;
    padding: 20px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
  }
`;

export interface ReviewRequestData {
  firstName: string;
  lastName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  bookingId: string;
  bookingNumber: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getReviewRequestEmail(data: ReviewRequestData): {
  subject: string;
  html: string;
  text: string;
} {
  const siteUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cielodorado-tenerife.eu';
  const reviewUrl = `${siteUrl}/recenze?token=${data.bookingId}`;

  const subject = `Jak se vám líbilo? Ohodnoťte pobyt v Cielo Dorado #${data.bookingNumber}`;

  const html = `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⭐ Jak se vám líbilo?</h1>
      <p>Cielo Dorado Tenerife</p>
    </div>

    <div class="content">
      <p>Vážený/á <strong>${data.firstName} ${data.lastName}</strong>,</p>

      <p>
        Doufáme, že jste si pobyt v Cielo Dorado užili. Vaše zpětná vazba je pro nás velmi důležitá
        a pomáhá nám neustále zlepšovat naše služby.
      </p>

      <p>
        Rádi bychom vás požádali o krátkou recenzi vašeho pobytu. Zabere vám to jen chvíli,
        ale pro nás i budoucí hosty to má velkou hodnotu.
      </p>

      <div class="stay-details">
        <div class="detail-row">
          <span class="detail-label">Číslo rezervace</span>
          <span class="detail-value">#${data.bookingNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Příjezd</span>
          <span class="detail-value">${formatDate(data.checkIn)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Odjezd</span>
          <span class="detail-value">${formatDate(data.checkOut)}</span>
        </div>
      </div>

      <div class="cta-section">
        <p style="margin: 0 0 5px; color: #1e40af; font-weight: 600;">Zanechte nám recenzi</p>
        <p style="margin: 0 0 15px; color: #64748b; font-size: 14px;">
          Klikněte na tlačítko níže a ohodnoťte váš pobyt
        </p>
        <a href="${reviewUrl}" class="cta-button">
          ✍️ Napsat recenzi
        </a>
      </div>

      <p style="color: #64748b; font-size: 14px;">
        Pokud se vám zobrazí problémy s tlačítkem, zkopírujte tento odkaz do prohlížeče:<br>
        <a href="${reviewUrl}" style="color: #3b82f6; word-break: break-all;">${reviewUrl}</a>
      </p>

      <p>
        Děkujeme za důvěru a těšíme se na vaši návštěvu i příště!
      </p>

      <p>
        S pozdravem,<br>
        <strong>Tým Cielo Dorado Tenerife</strong>
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Cielo Dorado Tenerife. Všechna práva vyhrazena.</p>
      <p>Tento email byl odeslán na základě vašeho pobytu v apartmánu Cielo Dorado.</p>
    </div>
  </div>
</body>
</html>`;

  const text = `
Jak se vám líbilo? - Cielo Dorado Tenerife

Vážený/á ${data.firstName} ${data.lastName},

Doufáme, že jste si pobyt v Cielo Dorado užili. Rádi bychom vás požádali o krátkou recenzi.

Rezervace #${data.bookingNumber}
Příjezd: ${formatDate(data.checkIn)}
Odjezd: ${formatDate(data.checkOut)}

Zanechte recenzi zde:
${reviewUrl}

Děkujeme za důvěru!

Tým Cielo Dorado Tenerife
`;

  return { subject, html, text };
}
