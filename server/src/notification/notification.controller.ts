import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decoractor';
import { NotificationService } from './notification.service';
import { User } from '@prisma/client';
import { MyJWTGuard } from 'src/auth/guard';

@Controller('notification')
@UseGuards(MyJWTGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }
    @Get()
    getAllNotificationsByUserId(@GetUser() user: User) {
        return this.notificationService.getNotificationsByUserId(user.id)
    }
    @Patch(':id')
    readNotification(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.notificationService.readNotification(user.id, id)
    }
}
