const nodemailer = require('nodemailer');

// Configuración SMTP actual
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '9780c6002@smtp-brevo.com',
    pass: 'zpYkFjaEby29fPNG'
  }
});

// Probar conexión
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Error de conexión SMTP:', error);
  } else {
    console.log('✅ Servidor SMTP listo para enviar emails');
    
    // Enviar email de prueba
    const mailOptions = {
      from: '9780c6002@smtp-brevo.com',
      to: 'llontopjuanje@gmail.com',
      subject: '🧪 Prueba de configuración SMTP',
      text: 'Si recibes este email, tu configuración SMTP está funcionando correctamente.'
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Error enviando email:', error);
      } else {
        console.log('✅ Email enviado:', info.messageId);
      }
    });
  }
});