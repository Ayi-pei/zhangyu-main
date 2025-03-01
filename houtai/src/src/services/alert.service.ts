import { BaseService } from './base.service';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { ServiceError } from '../types';

export class AlertService extends BaseService {
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
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
      return { success: true };
    } catch (error) {
      logger.error('Failed to send alert', { error, subject, level });
      throw new ServiceError('Failed to send alert', 500, error);
    }
  }
} 