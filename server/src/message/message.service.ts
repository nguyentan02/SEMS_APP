import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { Message } from '@prisma/client';
import { SendImageDto, SendMessageDto } from './dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MessageService {
    constructor(private prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService) { }

    private readonly logger = new Logger(MessageService.name);

    async getAllMessages(userId: number, conversationId: number) {
        try {
            const isConversation = await this.prismaService.conversation.findUnique({
                where: {
                    id: conversationId,
                    User: {
                        some: {
                            id: userId
                        }
                    }
                }
            })
            if (!isConversation) {
                return new ResponseData<Message[]>(null, 400, 'Cuộc trò chuyện không tồn tại')
            }
            const messages = await this.prismaService.message.findMany({
                where: {
                    conversationId: conversationId
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            user_avt: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })
            return new ResponseData<Message[]>(messages, 200, 'Tất cả tin nhắn')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async sendMessage(userId: number, sendMessageDto: SendMessageDto) {
        try {
            const isConversation = await this.prismaService.conversation.findUnique({
                where: {
                    id: sendMessageDto.conversationId,
                    User: {
                        some: {
                            id: userId
                        }
                    }
                }
            })
            if (!isConversation) {
                return new ResponseData<Message[]>(null, 400, 'Cuộc trò chuyện không tồn tại')
            }
            const message = await this.prismaService.message.create({
                data: {
                    content: sendMessageDto.content,
                    conversationId: sendMessageDto.conversationId,
                    userId: userId,
                    isImage: false
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
            return new ResponseData<Message>(message, 200, 'Gửi tin nhắn thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async sendImage(userId: number, sendImageDto: SendImageDto, images: Express.Multer.File[]) {
        try {
            const isConversation = await this.prismaService.conversation.findUnique({
                where: {
                    id: sendImageDto.conversationId,
                    User: {
                        some: {
                            id: userId
                        }
                    }
                }
            })
            if (!isConversation) {
                return new ResponseData<Message[]>(null, 400, 'Cuộc trò chuyện không tồn tại')
            }
            const messages: Message[] = []
            for (let i = 0; i < images.length; i++) {
                const uploadImg = await this.cloudinaryService.uploadFile(images[i])
                const message = await this.prismaService.message.create({
                    data: {
                        content: uploadImg.url,
                        userId: userId,
                        isImage: true,
                        conversationId: sendImageDto.conversationId
                    },
                    include: {
                        User: {
                            select: {
                                id: true,
                                name: true,
                                user_avt: true
                            }
                        }
                    }
                })
                messages.push(message)
            }
            return new ResponseData<Message[]>(messages, 200, 'Gửi tin nhắn thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async readMessages(userId: number, conversationId: number) {
        try {
            const isConversation = await this.prismaService.conversation.findUnique({
                where: {
                    id: conversationId
                }
            })
            if (!isConversation) {
                return new ResponseData<string>(null, 400, 'Cuộc trò chuyện không tồn tại')
            }
            await this.prismaService.message.updateMany({
                where: {
                    conversationId: conversationId,
                    userId: {
                        not: userId
                    }
                },
                data: {
                    read: true
                }
            })
            return new ResponseData<Message>(null, 200, 'Đã đọc tin nhắn')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}