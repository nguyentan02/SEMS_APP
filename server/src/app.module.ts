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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    PrismaModule, AuthModule, UserModule, CloudinaryModule, MailingModule, LocationModule, CategoryModule
  ]
})
export class AppModule { }
