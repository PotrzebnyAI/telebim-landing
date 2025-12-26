// Vercel Serverless Function do wysyłania emaili
// Endpoint: /api/send-email

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, type, duration, message, time } = req.body;

    // Walidacja
    if (!name || !email || !type || !duration || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Wysyłanie emaila przez Resend
    const emailData = await resend.emails.send({
      from: 'Telebim Odrzywołek <telebim@potrzebny.shop>',
      to: 'biz@potrzebny.ai',
      subject: `Nowe zgłoszenie telebim - ${type}`,
      html: `
        <h2>📧 Nowe zgłoszenie - Telebim Odrzywołek</h2>
        
        <h3>Dane kontaktowe:</h3>
        <p><strong>Imię i nazwisko / Firma:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nie podano'}</p>
        
        <h3>Szczegóły zamówienia:</h3>
        <p><strong>Typ zgłoszenia:</strong> ${type}</p>
        <p><strong>Czas aktywności:</strong> ${duration}</p>
        <p><strong>Preferowany czas emisji:</strong> ${time || 'Nie wybrano'}</p>
        
        <h3>Opis / Pomysł na reklamę:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">Wiadomość wysłana z formularza na potrzebny.shop</p>
      `,
    });

    console.log('Email sent:', emailData);

    return res.status(200).json({ 
      success: true, 
      message: 'Email wysłany pomyślnie!',
      id: emailData.id 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Błąd podczas wysyłania emaila',
      details: error.message 
    });
  }
}
