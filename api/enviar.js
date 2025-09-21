const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Agregar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Faltan coordenadas' });
  }

  // Verificar que las variables de entorno estén configuradas
  if (!process.env.SENDINBLUE_SMTP_USER || !process.env.SENDINBLUE_SMTP_PASS || !process.env.EMAIL_TO) {
    console.error('Variables de entorno faltantes:', {
      user: !!process.env.SENDINBLUE_SMTP_USER,
      pass: !!process.env.SENDINBLUE_SMTP_PASS,
      email_to: !!process.env.EMAIL_TO
    });
    return res.status(500).json({ message: 'Error de configuración del servidor' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SENDINBLUE_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SENDINBLUE_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SENDINBLUE_SMTP_USER,
      pass: process.env.SENDINBLUE_SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SENDINBLUE_SMTP_USER,
    to: process.env.EMAIL_TO,
    subject: '📍 Nueva ubicación recibida',
    text: `Latitud: ${lat}\nLongitud: ${lon}\n\nVer en el mapa:\nhttps://maps.google.com/?q=${lat},${lon}`
  };

  try {
    console.log('Intentando enviar email a:', process.env.EMAIL_TO);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', info.messageId);
    res.status(200).json({ message: 'Ubicación enviada exitosamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar correo', error: error.message });
  }
};
