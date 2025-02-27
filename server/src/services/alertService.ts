import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

class AlertService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendAlert(subject: string, message: string, level: 'info' | 'warning' | 'error') {
    try {
      await this.transporter.sendMail({
        from: process.env.ALERT_FROM,
        to: process.env.ALERT_TO,
        subject: `[${level.toUpperCase()}] ${subject}`,
        text: message
      });

      logger.info('Alert sent successfully', { subject, level });
    } catch (error) {
      logger.error('Failed to send alert', { error, subject, level });
    }
  }
}

export const alertService = new AlertService(); 