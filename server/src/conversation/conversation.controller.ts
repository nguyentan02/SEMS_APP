import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decoractor';
import { MyJWTGuard, RolesGuard } from 'src/auth/guard';
import { USER_TYPES } from 'src/global';
import { AccessConversationDto } from './dto';
import { User } from '@prisma/client';
import { ConversationService } from './conversation.service';


@Controller('conversation')
@UseGuards(MyJWTGuard, RolesGuard)
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) { }

    @Post()
    @Roles(USER_TYPES.USER, USER_TYPES.TECHNICAL, USER_TYPES.ADMIN)
    accessConversation(@GetUser() user: User, @Body() accessConversationDto: AccessConversationDto) {
        return this.conversationService.accessConversation(user.id, accessConversationDto)
    }

    @Get()
    @Roles(USER_TYPES.USER, USER_TYPES.TECHNICAL, USER_TYPES.ADMIN)
    fetchConversation(@GetUser() user: User) {
        return this.conversationService.fetchConversations(user.id)
    }
}
