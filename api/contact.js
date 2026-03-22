export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prenom, societe, email, message } = req.body;

  if (!prenom || !email) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Centurio Stratégie <onboarding@resend.dev>',
      to: ['guyonloic89@gmail.com'],
      reply_to: email,
      subject: `Demande d'audit — ${prenom} (${societe || 'sans société'})`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#D4AF37;">Nouvelle demande d'audit gratuit</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:120px;">Prénom</td><td style="padding:8px 0;"><strong>${prenom}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Société</td><td style="padding:8px 0;"><strong>${societe || '—'}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Message</td><td style="padding:8px 0;">${message || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
          <p style="color:#aaa;font-size:12px;">Envoyé via centuriostrategie.com</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend error:', error);
    return res.status(500).json({ error: "Erreur d'envoi. Réessayez." });
  }

  return res.status(200).json({ success: true });
}
