import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, ServiceUnavailableException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NotificationsRepository } from "./repositories/notifications.repository";
import { NotificationTemplatesRepository } from "./repositories/notification-templates.repository";
import { NotificationStatus } from "./entities/notifications.entity";
import { NotificationTemplateTranslationsRepository } from "./repositories/notification-template-translations.repository";

export interface BuildNotificationInput {
  email?: string;
  phone?: string;
  subject?: string;
  templateCode: string;
  params: Record<string, string>;
  languageCode?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly ses: SESClient;
  private readonly sender: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationTemplateTranslationsRepository: NotificationTemplateTranslationsRepository
  ) {
    this.ses = new SESClient({
      region: this.configService.get<string>("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID")!,
        secretAccessKey: this.configService.get<string>(
          "AWS_SECRET_ACCESS_KEY"
        )!,
      },
    });

    this.sender = this.configService.get<string>("AWS_SES_SENDER")!;
  }

  // ----------------------------------------------------------------
  // método principal: armar y enviar notificación
  // ----------------------------------------------------------------
  async buildAndSendNotification(data: BuildNotificationInput) {
    const { email, phone, subject, templateCode, params } = data;

    // consultar template
    const template =
      await this.notificationTemplateTranslationsRepository.findByTemplateCodeAndLanguageCode(
        templateCode,
        data.languageCode || "en"
      );
    if (!template) {
      throw new NotFoundException(
        `Template not found for code: ${templateCode}`
      );
    }

    // Reemplazar placeholders dinámicos
    const render = (templateStr: string | null): string | null => {
      if (!templateStr) return null;
      let result = templateStr;
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
      });
      return result;
    };

    const html = render(template.htmlTemplate);
    const sms = render(template.smsTemplate);
    const finalSubject = subject ?? render(template.subject) ?? "Notification";

    // Registrar la notificación en la base de datos
    const notificationRecord = await this.notificationsRepository.create({
      template: template.template,
      email: email,
      phone: phone,
      bodyHtml: html,
      bodyText: sms,
      params,
      status: NotificationStatus.PENDING,
    });

    // Enviar email si corresponde
    if (email && html) {
      const status = await this.sendEmail(email, finalSubject, html)
        .then(() => NotificationStatus.SENT)
        .catch((error) => {
          this.logger.error(
            `Failed to send notification ${notificationRecord.id}`
          );
          return NotificationStatus.FAILED;
        });

      await this.notificationsRepository.updateStatus(
        notificationRecord.id,
        status
      );

      if (status === NotificationStatus.FAILED) {
        throw new Error(`Failed to send email to ${email}`);
      }
    }

    // Enviar SMS si corresponde (por ahora deshabilitado)
    if (phone && sms) {
      // TODO: Integrar servicio SMS (Twilio, AWS SNS, etc.)
      // await this.sendSms(phone, sms);
      this.logger.warn(`📱 SMS sending not implemented yet for ${phone}`);
    }

    return { success: true };
  }

  // ----------------------------------------------------------------
  // Enviar correo electrónico con AWS SES
  // ----------------------------------------------------------------
  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const command = new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Message: {
          Body: { Html: { Data: html, Charset: "UTF-8" } },
          Subject: { Data: subject, Charset: "UTF-8" },
        },
        Source: this.sender,
      });

      await this.ses.send(command);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Failed to send email to ${to}: ${errorMessage}`);
      
      const statusCode = (error as any).$metadata?.httpStatusCode;
      
      this.handleAuthError(
        statusCode || 500,
        `Failed to send email to ${to} error: ${errorMessage}`
      );
    }
  }

  private handleAuthError(status: number, message?: string): never {
    switch (status) {
      case 400:
        throw new BadRequestException(message || "Invalid request data");
      case 401:
        throw new UnauthorizedException(
          message || "Unauthorized: Invalid credentials"
        );
      case 403:
        throw new ForbiddenException(message || "Forbidden: Access denied");
      case 404:
        throw new NotFoundException(message || "User or resource not found");
      case 422:
        throw new UnprocessableEntityException(
          message || "Validation error: Please check your input"
        );
      case 429:
        throw new UnprocessableEntityException({
          statusCode: 429,
          message: message || "Too many requests: Please try again later",
          error: "Too Many Requests",
        });
      case 500:
        throw new InternalServerErrorException(
          message || "Internal server error: Please try again"
        );
      default:
        throw new Error(`Unexpected error: Status ${status}`);
    }
  }

  // ----------------------------------------------------------------
  //  Placeholder de envío de SMS (futuro)
  // ----------------------------------------------------------------
  // private async sendSms(phone: string, message: string) {
  //   // Integrar Twilio o AWS SNS aquí
  //   this.logger.log(`Sending SMS to ${phone}: ${message}`);
  // }
}
