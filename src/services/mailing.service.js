const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// Función para enviar correo de recuperación de contraseña
async function sendPasswordRecoveryEmail(mail, resetPasswordLink) {
  console.log("3 er  paso nodemailer")
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetPasswordLink}">Recuperar contraseña</a>`,
    };

    console.log("3 er paso mailOptions", mailOptions)
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de recuperación enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
  }
}

module.exports = {
  sendPasswordRecoveryEmail,
};
