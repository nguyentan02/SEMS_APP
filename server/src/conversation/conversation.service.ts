import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessConversationDto } from './dto';
import { ResponseData } from '../global';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationService {
    constructor(private readonly prismaService: PrismaService) { }

    private readonly logger = new Logger(ConversationService.name);

    async accessConversation(reqUserId: number, accessConversationDto: AccessConversationDto) {
        try {
            if (reqUserId == accessConversationDto.userId) {
                return new ResponseData<string>(null, 400, 'Bạn không thể nhắn tin với chính mình.')
            }
            const isConversation = await this.prismaService.conversation.findFirst({
                where: {
                    AND: [
                        {
                            User: {
                                some: {
                                    id: reqUserId
                                }
                            }
                        },
                        {
                            User: {
                                some: {
                                    id: accessConversationDto.userId
                                }
                            }
                        }
                    ]
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            user_avt: true,
                            name: true
                        }
                    }
                }
            })
            console.log(isConversation);
            
            if (isConversation) {
                return new ResponseData<Conversation>(isConversation, 200, 'Tìm thấy cuộc trò chuyện')
            } else {
                const connect = [reqUserId, accessConversationDto.userId]
                const newConversation = await this.prismaService.conversation.create({
                    data: {
                        User: {
                            connect: connect.map(id => ({ id }))
                        }
                    },
                    include: {
                        User: {
                            select: {
                                id: true,
                                user_avt: true,
                                name: true
                            }
                        }
                    }
                })
                return new ResponseData<Conversation>(newConversation, 200, 'Tạo thành công cuộc trò chuyện')
            }
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async fetchConversations(userId: number) {
        try {
            console.log(1); 
            const conversations = await this.prismaService.conversation.findMany({
                where: {
                    User: {
                        some: {
                            id: userId
                        }
                    }
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            name: true,
                            user_avt: true
                        }
                    },
                    Message: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true,
                            userId: true,
                            isImage: true,
                            read: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1
                    }
                }
            })
            const result = conversations.filter((e) => e.Message.length > 0)
            result.sort((a, b) => b.Message[0].id - a.Message[0].id)
            let totalReadMessage = 0
            result.forEach(e => {
                if (e.Message[0].userId !== userId && e.Message[0].read == false) {
                    totalReadMessage = totalReadMessage + 1
                }
            })
            return new ResponseData<any>({ result, totalReadMessage }, 200, 'Tất cả liên hệ')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}