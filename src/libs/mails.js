import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = (subject, content) => {
  try {
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: subject,
      subject: 'Recuperación de Contraseña',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de Contraseña</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
      
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
      
              p {
                  margin-bottom: 20px;
              }
      
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #6366f1;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Recuperación de Contraseña</h2>
              <p>Hola,</p>
              <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
              <p><a href="${content}" class="button">Restablecer Contraseña</a></p>
              <p>Si no has solicitado este restablecimiento, puedes ignorar este correo.</p>
              <p>Gracias,<br>El equipo de Recuperación de Contraseña de SGCD</p>
          </div>
      </body>
      </html>`
    });
  } catch (error) {
    console.log(error);
  }
}