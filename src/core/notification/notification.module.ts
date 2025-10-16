import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationTemplate } from "./entities/notification-templates.entity";
import { NotificationTemplatesRepository } from "./repositories/notification-templates.repository";
import { NotificationsRepository } from "./repositories/notifications.repository";
import { NotificationTemplateTranslation } from "./entities/notifcation-template-translations.entity";
import { NotificationTemplateTranslationsRepository } from "./repositories/notification-template-translations.repository";
import { NotificationService } from "./notification.service";
import { Notification } from "./entities/notifications.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationTemplate, NotificationTemplateTranslation])],
  providers: [
    NotificationService,
    NotificationsRepository,
    NotificationTemplatesRepository,
    NotificationTemplateTranslationsRepository,
  ],
  exports: [
    NotificationService,
    NotificationsRepository,
    NotificationTemplatesRepository,
    NotificationTemplateTranslationsRepository,
  ],
})
export class NotificationModule {}
