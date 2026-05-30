import nodemailer from 'nodemailer';

// Configurar transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ Email SMTP no configurado. Email no enviado.');
      return false;
    }

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return false;
  }
}

export function generatePasswordResetEmail(
  userName: string,
  resetLink: string
): { subject: string; html: string; text: string } {
  const subject = 'Recuperación de contraseña - Consultorio Odontológico';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🦷 Consultorio Odontológico</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">Recuperación de Contraseña</h2>
        
        <p style="color: #666; line-height: 1.6;">Hola ${userName},</p>
        
        <p style="color: #666; line-height: 1.6;">
          Recibimos una solicitud para recuperar tu contraseña. Si no fue realizada por ti, 
          puedes ignorar este email de forma segura.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
          ">Recuperar Contraseña</a>
        </div>
        
        <p style="color: #999; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px;">
          <strong>Válido por 15 minutos:</strong> Este enlace expira en 15 minutos por tu seguridad.
        </p>
        
        <p style="color: #999; font-size: 12px;">
          O copia y pega este enlace en tu navegador:<br>
          <code style="background: #f5f5f5; padding: 2px 4px; border-radius: 2px; word-break: break-all;">
            ${resetLink}
          </code>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Consultorio Odontológico. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;

  const text = `
Recuperación de Contraseña

Hola ${userName},

Recibimos una solicitud para recuperar tu contraseña. Si no fue realizada por ti, 
puedes ignorar este email de forma segura.

Enlace de recuperación (válido por 15 minutos):
${resetLink}

© ${new Date().getFullYear()} Consultorio Odontológico. Todos los derechos reservados.
  `;

  return { subject, html, text };
}

export function generateWelcomeEmail(
  userName: string,
  loginUrl: string,
  role: string
): { subject: string; html: string; text: string } {
  const subject = 'Bienvenido a Consultorio Odontológico';
  
  const getRoleMessage = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Como administrador, tienes acceso completo para gestionar usuarios, roles y la configuración del sistema.';
      case 'dentist':
        return 'Como odontólogo, puedes gestionar citas, crear historiales clínicos y consultar el odontograma de tus pacientes.';
      case 'patient':
        return 'Como paciente, puedes ver tus citas, acceder a tu historial clínico y editar tus datos personales.';
      default:
        return '';
    }
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🦷 Consultorio Odontológico</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">¡Bienvenido ${userName}!</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Tu cuenta ha sido creada exitosamente en nuestro sistema de gestión de consultorio odontológico.
        </p>
        
        <div style="background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
          <p style="color: #333; margin: 0; font-weight: bold;">Tu rol:</p>
          <p style="color: #666; margin: 10px 0 0 0;">${getRoleMessage(role)}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
          ">Ir al Portal</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Consultorio Odontológico. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;

  const text = `
¡Bienvenido ${userName}!

Tu cuenta ha sido creada exitosamente en nuestro sistema de gestión de consultorio odontológico.

Tu rol: ${role}
${getRoleMessage(role)}

Accede a tu portal aquí:
${loginUrl}

© ${new Date().getFullYear()} Consultorio Odontológico. Todos los derechos reservados.
  `;

  return { subject, html, text };
}
