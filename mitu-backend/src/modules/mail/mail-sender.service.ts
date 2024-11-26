import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import UserInternalDto from '../user/dto/user.internal';

/**
 * Mail service
 * @export
 * @class MailService
 * @param {MailerService} mailerService
 * @constructor
 */
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger(MailService.name);

  /**
   * Send register confirmation email
   * @param {UserInternalDto} user - The user DTO
   * @param {string} confirmationUrl - The confirmation URL
   */
  sendRegisterConfirmation(user: UserInternalDto, confirmationUrl: string) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Potwierdzenie rejestracji',
      template: 'confirm-register',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        url: confirmationUrl,
      },
      attachments: [
        {
          filename: 'mitu-logo.png',
          path: `${process.cwd()}/mail-templates/mitu-logo.png`,
          cid: 'mitu-logo',
        },
      ],
    });
    this.logger.log(
      `Register confirmation email sent for ${user.email} to link ${confirmationUrl}`,
    );
  }

  /**
   * Send HTML email
   * @param {string[]} resepientEmails - The recipient emails
   * @param {string} subject - The subject
   * @param {string} html - The HTML
   */
  sendHtmlMail(resepientEmails: string[], subject: string, html: string) {
    for (const email of resepientEmails) {
      this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
    }
  }

  /**
   * Send password reset email
   * @param {string} email - The email
   * @param {string} newPassword - The new password
   */
  sendPasswordReset(email: string, newPassword: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Administratorski reset hasła',
      template: 'admin-reset-password',
      context: {
        newPassword,
      },
      attachments: [
        {
          filename: 'mitu-logo.png',
          path: `${process.cwd()}/mail-templates/mitu-logo.png`,
          cid: 'mitu-logo',
        },
      ],
    });
    this.logger.log(`Password reset email sent for ${email}`);
  }

  /**
   * Send admin created account email
   * @param {string} email - The email
   * @param {string} password - The password
   */
  sendAdminCreatedYourAccountMail(email: string, password: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Twoje konto zostało utworzone',
      template: 'admin-create-account',
      context: {
        email,
        password,
      },
      attachments: [
        {
          filename: 'mitu-logo.png',
          path: `${process.cwd()}/mail-templates/mitu-logo.png`,
          cid: 'mitu-logo',
        },
      ],
    });
    this.logger.log(`Admin created account email sent for ${email}`);
  }

  /**
   * Send change password link
   * @param {UserInternalDto} user - The user DTO
   * @param {string} changePasswordLink - The change password link
   */
  sendChangePasswordLink(user: UserInternalDto, changePasswordLink: string) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Zmiana hasła',
      template: 'forgot-password',
      context: {
        url: changePasswordLink,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      attachments: [
        {
          filename: 'mitu-logo.png',
          path: `${process.cwd()}/mail-templates/mitu-logo.png`,
          cid: 'mitu-logo',
        },
      ],
    });
    this.logger.log(`Change password link email sent for ${user.email}`);
  }
}
