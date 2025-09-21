import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Faltan coordenadas' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: '9780c6001@smtp-brevo.com',
      pass: '8F6RQI3YfaLqjdUK'
    }
  });

  const mailOptions = {
    from: '9780c6001@smtp-brevo.com',
    to: process.env.EMAIL_TO,  // configúralo en variables de entorno para seguridad
    subject: '📍 Nueva ubicación recibida',
    text: `Latitud: ${lat}\nLongitud: ${lon}\n\nVer en el mapa:\nhttps://maps.google.com/?q=${lat},${lon}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Ubicación enviada' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar correo' });
  }
}
