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
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
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
