import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import * as Joi from 'joi';

import { MailingModule } from './mailing/mailing.module';
import { LocationModule } from './location/location.module';
import { CategoryModule } from './category/category.module';
import { DeviceModule } from './device/device.module';
import { UsageModule } from './usage/usage.module';
import { RotationModule } from './rotation/rotation.module';
import { MaterialModule } from './material/material.module';
import { StorageModule } from './storage/storage.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NotificationModule } from './notification/notification.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import {SocketModule} from './socket/socket.module'
import { DashboardModule } from './dashboard/dashboard.module';
import { HistoryModule } from './history/history.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    ScheduleModule.forRoot(),SocketModule,
    PrismaModule, AuthModule, UserModule, CloudinaryModule, MailingModule, LocationModule, CategoryModule, DeviceModule, UsageModule, RotationModule, MaterialModule, StorageModule, MaintenanceModule, NotificationModule, ConversationModule, MessageModule, DashboardModule, HistoryModule
  ],

})
export class AppModule { }
