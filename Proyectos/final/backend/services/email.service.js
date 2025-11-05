// backend/src/services/email.service.js 

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, // tu email
    pass: process.env.EMAIL_PASS, // contraseña de aplicación
  },
});

export const emailService = {
  // Notificar a admin sobre nueva solicitud de encargado
  async notificarNuevaSolicitud(encargado, area) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL, // Email del admin
        subject: '🔔 Nueva solicitud de Encargado - Fábrica Textil',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Nueva Solicitud de Encargado</h2>
            <p>Se ha registrado una nueva solicitud de cuenta de Encargado:</p>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 Nombre:</strong> ${encargado.nombre_completo}</p>
              <p><strong>📧 Email:</strong> ${encargado.email}</p>
              <p><strong>📱 Usuario:</strong> ${encargado.usuario}</p>
              <p><strong>🏢 Área solicitada:</strong> ${area ? area.nombre : 'Sin especificar'}</p>
              ${encargado.motivo ? `<p><strong>💬 Motivo:</strong> ${encargado.motivo}</p>` : ''}
            </div>
            
            <p>Por favor, ingresa al panel de administración para revisar y aprobar/rechazar esta solicitud.</p>
            
            <a href="${process.env.FRONTEND_URL}/admin/solicitudes" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Ver Solicitudes Pendientes
            </a>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email de notificación enviado al admin');
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      // No lanzar error para no bloquear el registro
    }
  },

  // Notificar al encargado sobre aprobación
  async notificarAprobacion(encargado) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: encargado.email,
        subject: '✅ Tu solicitud de Encargado fue aprobada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">¡Felicitaciones ${encargado.nombre_completo}!</h2>
            <p>Tu solicitud para ser Encargado ha sido <strong>aprobada</strong>.</p>
            
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0;">Ya puedes iniciar sesión con tus credenciales y comenzar a gestionar actividades en tu área.</p>
            </div>
            
            <a href="${process.env.FRONTEND_URL}/login" 
               style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Iniciar Sesión
            </a>
            
            <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
              Si tienes alguna pregunta, contacta al administrador.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email de aprobación enviado');
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
    }
  },

  // Notificar al encargado sobre rechazo
  async notificarRechazo(encargado, motivo) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: encargado.email,
        subject: '❌ Tu solicitud de Encargado fue rechazada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Solicitud Rechazada</h2>
            <p>Lamentamos informarte que tu solicitud para ser Encargado ha sido rechazada.</p>
            
            ${motivo ? `
              <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <p><strong>Motivo del rechazo:</strong></p>
                <p style="margin: 5px 0 0 0;">${motivo}</p>
              </div>
            ` : ''}
            
            <p>Si crees que esto es un error, puedes contactar al administrador para más información.</p>
            
            <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
              Puedes registrarte nuevamente o contactar al administrador.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email de rechazo enviado');
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
    }
  },
};

export default emailService;