import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenancePlanDto, UpdateMaintenanceDto } from './dto';
import { StatusMaintenance } from '@prisma/client';
import { ResponseData, USER_TYPES } from 'src/global';
import { Cron, CronExpression } from '@nestjs/schedule';
import { number } from 'joi';


@Injectable()
export class MaintenanceService {
    constructor(private readonly prismaService: PrismaService) { }
    private readonly logger = new Logger(MaintenanceService.name)

    async getMaintenance(option:{key?:string,status?:string,groupByUser?: boolean; groupByStatus?: boolean }){
        try {
            const {key, status, groupByUser, groupByStatus } = option;
            
            let where: any={isDeleted:false,
            }
            if(status){
                where.maintenanceStatus = status
            }
            if (key) {
                where.OR = [  {
                    title: {
                        contains: key,
                        mode: 'insensitive'
                    }
                },
                {
                    User: {
                        name: {
                            contains: key,
                            mode: 'insensitive',
                        },
                    },
                }]
            }
        const maintenancePlans = await this.prismaService.maintenancePlan.findMany({
            where: where,
            include: {
              Room:{
                include:{
                  deparment:true
                }
              },
                User:{select:{
                    id:true,
                    email:true,
                    employeeId:true,
                    name:true
                }},
                Device:{
                    select:{
                        id:true,
                        name:true,
                        serialNumber:true,
                      
                    }
                },
            },
        });
        let result;
        if (groupByUser) {
            result = maintenancePlans.reduce((acc, maintenance) => {
                const userId = maintenance.userId;
                if (!acc[userId]) {
                    acc[userId] = {
                        user: maintenance.User,
                        maintenancePlans: [],
                    };
                }
                acc[userId].maintenancePlans.push(maintenance);
                return acc;
            }, {});
          
        } else if (groupByStatus) {
       
            result = maintenancePlans.reduce((acc, maintenance) => {
                const status = maintenance.maintenanceStatus;
                if (!acc[status]) {
                    acc[status] = [];
                }
                acc[status].push(maintenance);
                return acc;
            }, {});
        } else {
            result = maintenancePlans;
        }
     
        return new ResponseData<any>(result, 200, "Truy xuất dữ liệu thành công");
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

  async getMaintenanceByUser(
    option: { key?: string; status?: string; }, user: { id: number; role: number },
  ) {
    try {
      const { key, status } = option;
      const { id: userId, role } = user;
        let where: any = {
            maintenanceStatus:{ notIn: ['PENDING', 'CANCEL']}
          };

      if (status) {
        where.maintenanceStatus = status;
      }
      if (role ===2) {
        where.userId = userId;
        
      }
      if (key) {
        where.OR = [
          {
            title: {
              contains: key,
              mode: 'insensitive',
            } 
          },
        
        ];
      }
      const maintenancePlans = await this.prismaService.maintenancePlan.findMany({
        where: where,
        include: {
          Room:{
            include:{
              deparment:true
            }
          },
          User: {
            select: {
              id: true,
              email: true,
              employeeId: true,
              name: true,
            },
          },
          Device: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
            },
          },
        },
      });
      return new ResponseData<any>(maintenancePlans, 200, 'Truy xuất dữ liệu thành công');
    } catch (error) {
      this.logger.error(error.message);
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau');
    }
  }
    async createMaintenance(createMaintenanceDto:CreateMaintenancePlanDto){
        const {title,deviceId,userId,startDate,endDate,descriptionPlan} = createMaintenanceDto
        try {
         
            if(!deviceId){
                return new ResponseData<any>(null,400,"Vui lòng chọn thiết bị bảo trì")
            }
            const exit = await this.prismaService.maintenancePlan.findFirst({
                where:{
                    deviceId:deviceId,
                    maintenanceStatus:{
                        notIn:[StatusMaintenance.COMPLETED,StatusMaintenance.CANCEL]
                    }
                }
            })
            if(exit) return new ResponseData<any>(null,400,"Thiết bị đã có kế hoạch bảo trì")
              const roomIdDevice = await this.prismaService.device.findUnique({
            where:{
              id:deviceId
            }})
            await this.prismaService.maintenancePlan.create({
                data:{
                    title:title,
                    deviceId:deviceId,
                    userId:userId,
                    roomId:roomIdDevice.roomId,
                    startDate:new Date(startDate),
                    endDate:new Date(endDate),
                    maintenanceStatus:StatusMaintenance.PENDING,
                    priority:createMaintenanceDto.priority,
                    descriptionPlan:descriptionPlan
                }
            })
            await this.prismaService.device.update({
                where:{
                    id:deviceId
                },data:{statusDevice:"ĐANG BẢO TRÌ"}
            })
            return new ResponseData<any>(null,200,"Lập kế hoạch thành công")
            } catch (error) {    
                this.logger.error(error.message)
                return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateMaintenance(id:number,updateMaintenanceDto: UpdateMaintenanceDto) {
        const { title, userId,deviceId,startDate, endDate, priority, descriptionPlan } = updateMaintenanceDto;
        try {
          const maintenance = await this.prismaService.maintenancePlan.findUnique({
            where: { id },
          });
         
          if (!maintenance) {
            return new ResponseData<any>(null, 404, "Kế hoạch bảo trì không tồn tại");
          }
      
          if(deviceId && maintenance.deviceId != deviceId){
            await this.prismaService.device.update({
                where:{
                    id:deviceId
                },data:{statusDevice:"ĐANG BẢO TRÌ"}
            })
            console.log(maintenance.deviceId);
            await this.prismaService.device.update({
                where:{
                    id:maintenance.deviceId
                },data:{statusDevice:"ĐANG HOẠT ĐỘNG"}
            })
          }
          const newEndDate = new Date(endDate);
          const currentDate = new Date();
          let newStatusMaintenance =undefined;
      
          if (newEndDate > currentDate && maintenance.endDate !== newEndDate) {
            newStatusMaintenance = StatusMaintenance.APPROVED;
          }
          await this.prismaService.maintenancePlan.update({
            where: { id },
            data: {
              title:title,
              userId:userId,
              deviceId:deviceId,
              startDate: new Date(startDate),
              endDate: newEndDate,
              priority:priority,
              maintenanceStatus:newStatusMaintenance,
              descriptionPlan:descriptionPlan,
            },
          });
       
          return new ResponseData<any>(maintenance.userId, 200, "Cập nhật kế hoạch thành công");
        } catch (error) {
          this.logger.error(error.message);
          return new ResponseData<string>(null, 500, "Lỗi dịch vụ, thử lại sau");
        }
      }
     
      async sendMaintenance( maintenanceId: number) {
        try {
          const maintenance = await this.prismaService.maintenancePlan.findUnique({
            where: { id: maintenanceId },
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
              userId:true
          }
          });
      
          if (!maintenance) {
            return new ResponseData<any>(null, 404, "Kế hoạch bảo trì không tồn tại");
          }
          await this.prismaService.maintenancePlan.update({
            where:{
              id:maintenanceId
            },
            data:{
              maintenanceStatus:StatusMaintenance.APPROVED
            }
          })
          await this.prismaService.notification.create({
            data: {
              read: false,
              message: `Có thiết bị ${maintenance.Device.name} ở   ${maintenance.Device.room.deparment.deparmentName}/${maintenance.Device.room.deparment.symbol} cần bảo trì.`,
              maintenanceId:maintenanceId,
              createdAt: new Date(),
            },
          });
          return new ResponseData<any>(maintenance.userId, 200, "Yêu cầu đã được gửi");
        } catch (error) {
          this.logger.error(error.message);
          return new ResponseData<string>(null, 500, "Lỗi dịch vụ, thử lại sau");
        }
      }
            
      async updateStatus(id:number,status:string){
        try {
            const exit = await this.prismaService.maintenancePlan.findUnique({
                where:{
                    id:id
                }
            })
            if(!exit){return new ResponseData<any>(null, 404, "Kế hoạch bảo trì không tồn tại");}
            console.log(status,StatusMaintenance.COMPLETED);
            if(status && status == StatusMaintenance.COMPLETED){
              await this.prismaService.maintenancePlan.update({
                where:{
                    id:id
                },data:{
                    maintenanceStatus:StatusMaintenance.COMPLETED
                }
            })
              await this.prismaService.device.update({
                where:{
                    id:exit.deviceId
                },data:{
                  statusDevice:"ĐANG HOẠT ĐỘNG"
                }
            })
            
            }else{
              await this.prismaService.maintenancePlan.update({
                where:{
                    id:id
                },data:{
                    maintenanceStatus:StatusMaintenance.APPROVED
                }
            }) 
              await this.prismaService.device.update({
                where:{
                    id:exit.deviceId
                },data:{
                  statusDevice:"ĐANG BẢO TRÌ"
                }
            })
            
            }
          
            return new ResponseData<any>(
                null,
                200,
                "Cập nhật trạng thái thành công"
              );
        } catch (error) {
            this.logger.error(error.message);
            return new ResponseData<string>(null, 500, "Lỗi dịch vụ, thử lại sau");
        }
      }
      async deleteMaintenance(id:number){
            try {
                const exit = await this.prismaService.maintenancePlan.findUnique({
                    where:{id:id,isDeleted:false}
                })
                if(!exit) return new ResponseData<any>(null,400,'Không tìm thấy kế hoạch')
                  if(exit.maintenanceStatus == StatusMaintenance.APPROVED)
                    await this.prismaService.notification.create({
                      data: {
                        read: false,
                        message: `Kế hoạch bảo trì #${exit.id} đã bị huỷ.`,
                        maintenanceId:exit.id,
                        createdAt: new Date(),
                      },
                    });
            await this.prismaService.maintenancePlan.update({
                where:{
                    id:id
                },data:{
                    maintenanceStatus:StatusMaintenance.CANCEL
                }
        })
        await this.prismaService.device.update({
            where:{id:exit.deviceId},data:{
                statusDevice:"ĐANG HOẠT ĐỘNG"
            }
        })
        return new ResponseData<any>(
            exit.userId,
            200,
            "Huỷ kế hoạch thành công"
          );
            } catch (error) {
                this.logger.error(error.message);
                return new ResponseData<string>(null, 500, "Lỗi dịch vụ, thử lại sau");
            }
      }
      async resfreshMaintenance(id:number){
            try {
                const exit = await this.prismaService.maintenancePlan.findUnique({
                    where:{id:id,isDeleted:false}
                })
                if(!exit) return new ResponseData<any>(null,400,'Không tìm thấy kế hoạch')
            
                 const findDevice = await this.prismaService.maintenancePlan.findFirst({
                  where:{
                    deviceId:exit.deviceId,
                    maintenanceStatus: { notIn:[StatusMaintenance.CANCEL,StatusMaintenance.COMPLETED]  },
                  }
                 })
                 if(findDevice) {return new ResponseData<string>(null,400,"Thiết bị đã tồn tại lịch bảo trì")} 
                 await this.prismaService.maintenancePlan.update({
                  where:{
                      id:id
                  },data:{
                      maintenanceStatus:StatusMaintenance.PENDING
                  }
          })
                 
        await this.prismaService.device.update({
            where:{id:exit.deviceId},data:{
                statusDevice:"ĐANG BẢO TRÌ"
            }
        })
        return new ResponseData<any>(
            null,
            200,
            "Mở lại hoạch thành công"
          );
            } catch (error) {
                this.logger.error(error.message);
                return new ResponseData<string>(null, 500, "Lỗi dịch vụ, thử lại sau");
            }
      }
    async getMaintenanceById(id:number){
        try {
            const exit = await this.prismaService.maintenancePlan.findUnique({
                where:{id:id,isDeleted:false}
            })
            if(!exit) return new ResponseData<any>(null,400,'Không tìm thấy kế hoạch')
             const data=    await this.prismaService.maintenancePlan.findFirst({
            where:{
                id:exit.id
            },
            include:{
              Room:{
                include:{
                  deparment:true
                }
              },
                Device:{
                    include:{
                        category:{
                            select:{
                                categoryName:true
                            }
                        },
                        room:{
                            include:{
                                deparment:true
                            }
                        }
                    }
                },
                User:true
            }
            
        })
                return new ResponseData<any>(data,200,"Lấy dữ liệu thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    
    @Cron('*/30 * * * *')
    async autoUpdate() {
        try {
            await this.prismaService.maintenancePlan.updateMany({
                where: {
                    isDeleted: false,
                    maintenanceStatus:{in:[StatusMaintenance.APPROVED]},
                    endDate: {
                        lte: new Date()
                    }
                },
                data: {
                    maintenanceStatus:StatusMaintenance.LATE
                }
            })
            this.logger.log('Cập nhật trạng thái các kế hoạch thành công')
        } catch (error) {
            this.logger.error(error.message)
        }
    }
}
