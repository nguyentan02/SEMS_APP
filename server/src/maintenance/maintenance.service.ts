import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenancePlanDto, UpdateMaintenanceDto } from './dto';
import { StatusMaintenance } from '@prisma/client';
import { ResponseData, USER_TYPES } from 'src/global';


@Injectable()
export class MaintenanceService {
    constructor(private readonly prismaService: PrismaService) { }
    private readonly logger = new Logger(MaintenanceService.name)

    async getMaintenance(option:{key?:string,status?:string,groupByUser?: boolean; groupByStatus?: boolean }){
        try {
            const {key, status, groupByUser, groupByStatus } = option;
            
            let where: any={}
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
                        room:{
                            include:{
                                deparment:true
                            }
                        },
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
    option: { key?: string; status?: string; },    user: { id: number; role: number },
  ) {
    try {
      const { key, status } = option;
      const { id: userId, role } = user;
        console.log(role);
        let where: any = {
            maintenanceStatus:"APPROVED"
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
            },
          }
        ];
      }
      const maintenancePlans = await this.prismaService.maintenancePlan.findMany({
        where: where,
        include: {
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
              room: {
                include: {
                  deparment: true,
                },
              },
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
            console.log(createMaintenanceDto);
            if(!deviceId){
                return new ResponseData<any>(null,400,"Vui lòng chọn thiết bị bảo trì")
            }
            const exit = await this.prismaService.maintenancePlan.findFirst({
                where:{
                    deviceId:deviceId,
      
                    maintenanceStatus:{
                        not:StatusMaintenance.COMPLETED
                    }
                }
            })
            if(exit) return new ResponseData<any>(null,400,"Thiết bị đã có kế hoạch bảo trì")

            await this.prismaService.maintenancePlan.create({
                data:{
                    title:title,
                    deviceId:deviceId,
                    userId:userId,
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
          await this.prismaService.maintenancePlan.update({
            where: { id },
            data: {
              title:title,
              userId:userId,
              deviceId:deviceId,
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              priority:priority,
              descriptionPlan:descriptionPlan,
            },
          });
       
          return new ResponseData<any>(null, 200, "Cập nhật kế hoạch thành công");
        } catch (error) {
          this.logger.error(error.message);
          return new ResponseData<string>(null, 500, "Lỗi dịch vụ, thử lại sau");
        }
      }
     
      async sendMaintenance( maintenanceId: number) {
        try {
          const maintenance = await this.prismaService.maintenancePlan.findUnique({
            where: { id: maintenanceId },
          });
      
          if (!maintenance) {
            return new ResponseData<any>(null, 404, "Kế hoạch bảo trì không tồn tại");
          }
      
          await this.prismaService.notification.create({
            data: {
              read: false,
              maintenanceId:maintenanceId,
              createdAt: new Date(),
            },
          });
      
          return new ResponseData<any>(null, 200, "Thông báo đã được gửi");
        } catch (error) {
          this.logger.error(error.message);
          return new ResponseData<string>(null, 500, "Lỗi dịch vụ, thử lại sau");
        }
      }
            
      async updateStatus(id:number,status:StatusMaintenance){
        try {
            const exit = await this.prismaService.maintenancePlan.findUnique({
                where:{
                    id:id
                }
            })
            if(!exit){return new ResponseData<any>(null, 404, "Kế hoạch bảo trì không tồn tại");}
    
            await this.prismaService.maintenancePlan.update({
                where:{
                    id:id
                },data:{
                    maintenanceStatus:status
                }
            })
            return new ResponseData<any>(
                null,
                200,
                "Cập nhật trạng thái kế hoạch bảo trì thành công"
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
            await this.prismaService.maintenancePlan.update({
                where:{
                    id:id
                },data:{
                    isDeleted:false,
                    maintenanceStatus:StatusMaintenance.CANCEL
                }
        })
        await this.prismaService.device.update({
            where:{id:exit.deviceId},data:{
                statusDevice:"ĐANG HOẠT ĐỘNG"
            }
        })
        return new ResponseData<any>(
            null,
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
            "Tạo lại hoạch thành công"
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
}
