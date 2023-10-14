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
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetPasswordLink}">Recuperar contraseña</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
  }
}
// Emails de notificación de cuentas eliminadaspor faltade inactividad
async function sendAccountDeletionEmail(mail) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Hemos dado de baja tu cuenta por inactividad',
      html: '<p>Tu cuenta ha sido eliminada debido a la falta de actividad, Te esperamos prónto, puedes volver a registrate cuandolo desees!.</p>',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de eliminación de cuenta enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo de eliminación de cuenta:', error);
  }
}

async function sendPurchaseCompleted(userEmail, productsPurchased) {
  console.log("entro en mail confirmación de compra");
  console.log("userMail", userEmail);
  console.log("productsPurchased", productsPurchased);
  try {
    let productList = "<ul>";
    productsPurchased.forEach((product) => {
      productList += `<li>${product.title} - Precio: ${product.price}</li>`;
    });
    productList += "</ul>";
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Confirmación de Compra',
      html: `<p>Queremos confirmarte la compra de los siguientes productos:</p> ${productList}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de confirmación de compra:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo de confirmación de compra:', error);
  }
}


module.exports = {
  sendPasswordRecoveryEmail,
  sendAccountDeletionEmail,
  sendPurchaseCompleted
};
