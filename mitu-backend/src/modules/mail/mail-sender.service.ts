import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import UserInternalDto from '../user/dto/user.internal';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger(MailService.name);
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

  sendHtmlMail(resepientEmails: string[], subject: string, html: string) {
    for (const email of resepientEmails) {
      this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
    }
  }

  sendPasswordReset(email: string, newPassword: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Administratorski reset hasła',
      template: 'admin-reset-password',
      context: {
        newPassword,
      },
    });
    this.logger.log(`Password reset email sent for ${email}`);
  }

  sendAdminCreatedYourAccountMail(email: string, password: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Twoje konto zostało utworzone',
      template: 'admin-create-account',
      context: {
        email,
        password,
      },
    });
    this.logger.log(`Admin created account email sent for ${email}`);
  }

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
    });
    this.logger.log(`Change password link email sent for ${user.email}`);
  }
}
