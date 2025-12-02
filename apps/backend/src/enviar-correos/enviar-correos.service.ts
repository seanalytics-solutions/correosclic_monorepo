import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

interface IEmail {
  correo: string;
  token?: string;
  nombre?: string;
}

interface IVendedorEmail {
  correo: string;
  nombre: string;
  nombreTienda: string;
}

@Injectable()
export class EnviarCorreosService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async enviarConfirmacion(user: IEmail): Promise<void> {
    const mailOptions = {
      from: '"Correos México" <correosdemexicoclic@gmail.com>',
      to: user.correo,
      subject: 'Confirma tu cuenta - Correos México',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>¡Bienvenido ${user.nombre || ''}!</h2>
          <p>Tu código de verificación es:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
            ${user.token}
          </div>
          <p>Este código expirará en 10 minutos.</p>
          <p>Si no solicitaste este código, puedes ignorar este email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    console.log('Email de confirmación enviado a:', user.correo);
  }

  async enviarAdvertenciaEliminacion(user: IEmail): Promise<void> {
    const mailOptions = {
      from: '"Correos México" <correosdemexicoclic@gmail.com>',
      to: user.correo,
      subject: 'Tu cuenta será eliminada pronto',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hola ${user.nombre || 'usuario'},</h2>
          <p>Tu cuenta en Correos México será eliminada en las próximas 4 horas por falta de verificación.</p>
          <p>Por favor verifica tu cuenta usando el código que recibiste anteriormente.</p>
          <p>Si ya verificaste tu cuenta, puedes ignorar este mensaje.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    console.log('Email de advertencia enviado a:', user.correo);
  }

  async enviarBienvenidaVendedor(vendedor: IVendedorEmail): Promise<void> {
    const mailOptions = {
      from: '"Correos México" <correosdemexicoclic@gmail.com>',
      to: vendedor.correo,
      subject: '¡Bienvenido a Correos México como Vendedor! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a;">¡Felicidades, ${vendedor.nombre}!</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0;">Tu tienda está lista</h2>
            <p style="font-size: 24px; font-weight: bold; margin: 15px 0;">${vendedor.nombreTienda}</p>
          </div>

          <!-- Mensaje importante sobre cerrar sesión -->
          <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Importante</h3>
            <p style="color: #856404; margin-bottom: 0;">
              Para ver los cambios reflejados en tu cuenta, por favor <strong>cierra sesión</strong> y <strong>vuelve a iniciar sesión</strong> en la aplicación.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-top: 0;">¿Qué sigue?</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>📦 Agrega tus primeros productos</li>
              <li>🏷️ Configura tus precios y categorías</li>
              <li>📸 Sube fotos atractivas de tus productos</li>
              <li>🚀 ¡Comienza a vender!</li>
            </ul>
          </div>
          
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>© ${new Date().getFullYear()} Correos México. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    console.log('Email de bienvenida vendedor enviado a:', vendedor.correo);
  }

  async enviarTestEmail(): Promise<string> {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: '"Test Email" <test@example.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    });

    return nodemailer.getTestMessageUrl(info);
  }
}
