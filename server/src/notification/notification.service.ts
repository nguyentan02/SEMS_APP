import { Injectable, Logger } from '@nestjs/common';
import { ResponseData } from 'src/global';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {

    constructor(private readonly prismaService: PrismaService) { }   
    private readonly logger = new Logger(NotificationService.name)

    async getNotificationsByUserId(userId: number) {
        try {
          const notifications = await this.prismaService.notification.findMany({
            where: {
              Maintenance: {
                userId: userId, 
              },
            },
            include: {
              Maintenance:{
                select:{
                    Device:{
                        select:{
                            name:true,
                            serialNumber:true,
                            room:{
                              select:{
                                roomName:true,
                                deparment:true
                              }
                            }
                        }
                    },
                }
              },
            },
            orderBy: {
              createdAt: 'desc', 
            },
          });
          const totalUnread = notifications.filter((n) => !n.read).length;
          return new ResponseData<any>(
            { notifications, totalUnread },
            200,
            'Lấy thông báo thành công'
          );
        } catch (error) {
            this.logger.error(error.message)
          return new ResponseData<string>(
            null,
            500,
            'Lỗi dịch vụ, vui lòng thử lại sau'
          );
        }
      }
      async readNotification(userId: number, id: number) {
        try {
          
          const notification = await this.prismaService.notification.findUnique({
            where: { id: id }
            ,include:{
               Maintenance:{
                select:{
                  userId:true
                }
               }
         } });
    
          if (!notification) {
            return new ResponseData<string>(null, 404, 'Thông báo không tồn tại');
          }
    
          if (notification.read) {
            return new ResponseData<string>(null, 400, 'Thông báo đã được đọc')
          }
         await this.prismaService.notification.update({
            where: { id: id },
            data: { read: true },
          });
    
          return new ResponseData<any>(
            null,
            200,
            'Xem thông báo thành công'
          );
        } catch (error) {
            this.logger.error(error.message)
          return new ResponseData<string>(
            null,
            500,
            'Lỗi dịch vụ, vui lòng thử lại sau'
          );
        }
      }
    
}
