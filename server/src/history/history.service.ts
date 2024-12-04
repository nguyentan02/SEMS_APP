import { Injectable, Logger } from '@nestjs/common';
import { StatusMaintenance } from '@prisma/client';
import { number } from 'joi';
import { ResponseData } from 'src/global';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
    constructor(private readonly prismaService:PrismaService ){}
    private readonly logger = new Logger(HistoryService.name);


    async getMaintenanceHistory(option:{key:string}){
        try {
            let {key} = option
            let where: any = { isDelete: false, maintenancePlan:{
            some:{  maintenanceStatus: StatusMaintenance.COMPLETED}
            } }
            if (key) {
                where.OR = [  {
                    name: {
                        contains: key,
                        mode: 'insensitive'
                    }
                },
                {
                    serialNumber: {
                        contains: key,
                        mode: 'insensitive'
                    }
                }]
              
            }
            const get = await this.prismaService.device.findMany({
                where:where,
                select:{
                    id:true,
                    name:true,
                    serialNumber:true,
                    manufacturer:true,
                    category:{
                        select:{
                            categoryName:true
                        }
                    },
                    maintenancePlan:{
                       
                        include:{
                            User:{
                                select:{
                                    name:true,
                                    employeeId:true
                                }
                            },
                            Room:{
                                include:{
                                    deparment:{
                                        select:
                                         {deparmentName:true,
                                            symbol:true
                                         }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return new ResponseData<any>(get,200,"Tìm thấy lịch sử")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async getRotationHistory(option:{key:string}){
        try {
            let {key} = option
            let where: any = { isDelete: false,RotationDevice:{
                some:{}
            } }
            if (key) {
                where.OR = [  {
                    name: {
                        contains: key,
                        mode: 'insensitive'
                    }
                },
                {
                    serialNumber: {
                        contains: key,
                        mode: 'insensitive'
                    }
                }]
              
            }
            const get = await this.prismaService.device.findMany({
                where:where,
                select:{
                    id:true,
                    name:true,
                    serialNumber:true,
                    manufacturer:true,
                    category:{
                        select:{
                            categoryName:true
                        }
                    },
                    RotationDevice:{
                        select:{
                            id:true,
                            reason:true,
                            transferDate:true,
                            OldRoom:{
                                select:{
                                    roomName:true,
                                    deparment:{
                                        select:{
                                            deparmentName:true,
                                            symbol:true
                                        }
                                    }
                                }
                            },
                            NewRoom:{
                                select:{
                                    roomName:true,
                                    deparment:{
                                        select:{
                                            deparmentName:true,
                                            symbol:true
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            })
            return new ResponseData<any>(get,200,"Tìm thấy lịch sử")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
