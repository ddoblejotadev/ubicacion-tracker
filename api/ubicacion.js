const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ message: 'Faltan coordenadas' });
    }

    // Configuración SMTP con las credenciales correctas
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDINBLUE_SMTP_USER || '9780c6002@smtp-brevo.com',
        pass: process.env.SENDINBLUE_SMTP_PASS || 'zpYkFjaEby29fPNG'
      }
    });

    const mailOptions = {
      from: process.env.SENDINBLUE_SMTP_USER || '9780c6002@smtp-brevo.com',
      to: process.env.EMAIL_TO || 'llontopjuanje@gmail.com',
      subject: '📍 Nueva ubicación recibida',
      text: `Latitud: ${lat}\nLongitud: ${lon}\n\nVer en el mapa:\nhttps://maps.google.com/?q=${lat},${lon}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    
    res.status(200).json({ 
      message: 'Ubicación enviada correctamente',
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Error al enviar ubicación', 
      error: error.message 
    });
  }
}