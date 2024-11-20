import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenancePlanDto } from './dto';
import { StatusMaintenance } from '@prisma/client';
import { ResponseData } from 'src/global';

@Injectable()
export class MaintenanceService {
    constructor(private readonly prismaService: PrismaService) { }
    private readonly logger = new Logger(MaintenanceService.name)

    async createMaintenance(createMaintenanceDto:CreateMaintenancePlanDto){
        const {title,deviceId,userId,startDate,endDate,descriptionPlan} = createMaintenanceDto
        try {
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
}
