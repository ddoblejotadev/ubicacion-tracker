const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para enviar ubicación
app.post('/api/ubicacion', async (req, res) => {
  try {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ message: 'Faltan coordenadas' });
    }

    console.log('Enviando ubicación:', lat, lon);
    console.log('Variables de entorno disponibles:');
    console.log('SMTP_USER:', !!process.env.SENDINBLUE_SMTP_USER);
    console.log('SMTP_PASS:', !!process.env.SENDINBLUE_SMTP_PASS);
    console.log('EMAIL_TO:', !!process.env.EMAIL_TO);

    // Configuración SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SENDINBLUE_SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SENDINBLUE_SMTP_PORT) || 587,
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
    console.log('Email enviado exitosamente:', info.messageId);
    
    res.status(200).json({ 
      message: 'Ubicación enviada correctamente',
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ 
      message: 'Error al enviar ubicación', 
      error: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});