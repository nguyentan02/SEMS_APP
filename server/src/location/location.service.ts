import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeparmentDto, UpdateDeparmentDto, CreateRoomDto, UpdateRoomDto } from './dto';
import { PAGE_SIZE, ResponseData } from '../global';
import { Room } from '@prisma/client';



@Injectable()
export class LocationService {
    constructor(private readonly prismaService: PrismaService) { }
    private readonly logger = new Logger(LocationService.name);


    async get(option: { page: number, key: string }) {
        try {
            let { page, key } = option
            let totalPages = 1
            let pageSize = undefined
            let next = undefined
            let where: any = {}
            if (key) {
                where.OR = [
                    {
                        deparmentName: {
                            contains: key,
                            mode: 'insensitive'
                        }
                    },
                    {
                        symbol: {
                            contains: key,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
            let totalCount = 0
            if (page){   
                pageSize = PAGE_SIZE.PAGE_LOCATION
                totalCount = await this.prismaService.deparment.count({
                    where: where,
                    orderBy: {
                        id: "asc"
                    }
                })
              
                totalPages = Math.ceil(totalCount / pageSize)
                if (!totalPages) totalPages = 1
                if (!page || page < 1) page = 1
                next = (page - 1) * pageSize
            }
            
            const data = await this.prismaService.deparment.findMany({
                include:{
                    rooms:{
                        select:{
                            id:true,
                            roomName:true
                        }
                    }
                },
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize,
                where: where
               
            })
            const dataWithRoomCount = data.map(department => ({
                ...department,
                roomCount: department.rooms.length
            }));
            return new ResponseData<any>({ dataWithRoomCount,totalPages, totalCount }, 200, 'Tìm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async getUsageInfo() {
        try {
         
            const data = await this.prismaService.deparment.findMany({

                include:{
                    rooms:{
                        include:{
                            Device:true,
                            UsageInformation:{
                                where:{
                                    isDeleted:false
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    id: 'asc'
                },
               
            })
            const dataWithRoomAndDeviceStatus = data.map(department => {
                const roomCount = department.rooms.length;
                const roomsWithDeviceStatus = department.rooms.map(room => {
                    const deviceStatusCounts = room.Device.reduce(
                        (acc, device) => {
                            if (device.statusDevice === 'ĐANG HOẠT ĐỘNG') acc.active++;
                            else if (device.statusDevice === 'ĐANG BẢO TRÌ') acc.maintenance++;
                            else if (device.expired == true) acc.needMaintenance++;
                            return acc;
                        },
                        { active: 0, maintenance: 0, needMaintenance: 0,total:0 } // Khởi tạo bộ đếm
                    );
                    deviceStatusCounts.total =  deviceStatusCounts.active + deviceStatusCounts.maintenance + deviceStatusCounts.needMaintenance;
                                return {
                        ...room,
                        deviceStatusCounts, // Thêm tổng trạng thái thiết bị vào mỗi phòng
                    };
                });
              
    const totalDevices = roomsWithDeviceStatus.reduce(
        (total, room) => total + room.deviceStatusCounts.total,
        0 
    );
                return {
                    ...department,
                    roomCount,
                    rooms: roomsWithDeviceStatus,
                    totalDevices // Cập nhật danh sách phòng với thông tin tổng hợp
                };
            });
            return new ResponseData<any>({ dataWithRoomAndDeviceStatus }, 200, 'Tìm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async getLocationById(id:number){
        try {
            const exit = await this.prismaService.deparment.findUnique({
                where:{
                    id:id
                }
            })
            if (!exit) return new ResponseData<any>(null, 400, "Không tồn tại địa điểm")
                const data = await this.prismaService.room.findMany({
            where:{
                deparmentId:id
            },
        })
        return new ResponseData<Room[]>(data, 200, "Lấy dữ liệu thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async createDeparment(createDeparmentDto: CreateDeparmentDto) {
        try {
            const deparment = await this.prismaService.deparment.findFirst({
                where: {
                    OR: [
                        {
                            deparmentName: createDeparmentDto.deparmentName
                        },
                        {
                            symbol: createDeparmentDto.symbol
                        }
                    ]
                }
            })
            if (deparment) return new ResponseData<any>(null, 400, "Khoa đã tồn tại")
             const deparmentNew = await this.prismaService.deparment.create({
                data: {
                    deparmentName:createDeparmentDto.deparmentName,
                    symbol:createDeparmentDto.symbol
                }
            })
            if(createDeparmentDto.roomName){
                for(const name of createDeparmentDto.roomName){
                    const room = await this.prismaService.room.findFirst({
                        where: {
                            roomName: name
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    })
                    if (room && room.deparmentId ===deparmentNew.id) return new ResponseData<any>(null, 400, "Phòng đã tồn tại trong khoa")
                    await this.prismaService.room.create({
                        data: {
                            roomName: name,
                            deparmentId: deparmentNew.id
                        }
                    })
                }
            }  
            return new ResponseData<any>(null, 200, "Tạo thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async updateDeparment(id: number, updateDeparmentDto: UpdateDeparmentDto) {
        try {
       
            const deparment = await this.prismaService.deparment.findUnique({
                where: {
                    id: id
                }
            })
            if (!deparment) return new ResponseData<any>(null, 400, "Khoa không tồn tại")
            await this.prismaService.deparment.update({
                where: { id: id }
                , data: {
                    deparmentName:updateDeparmentDto.deparmentName,
                    symbol:updateDeparmentDto.symbol
                }
            })
          
                 if(updateDeparmentDto.roomName && updateDeparmentDto.roomName.length > 0) {
                for (const name of updateDeparmentDto.roomName) {
                
                    const room = await this.prismaService.room.findFirst({
                        where: {
                            roomName: name,
                            deparmentId: id
                        },
                            
                    });
                    if (room) {
                        if (room.roomName != name) {
                            await this.prismaService.room.update({
                                where: { id: room.id },
                                data: { roomName: name }
                            });
                        }
                    } else {
                       await this.prismaService.room.create({
                            data: {
                                roomName: name,
                                deparmentId: id
                            }
                        });
                    }
                }
            }
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async deleteDeparment(id: number) {
        try {
            const deparment = await this.prismaService.deparment.findUnique({
                where: {
                    id: id
                },
               
            })
            if (!deparment) return new ResponseData<any>(null, 400, "Khoa không tồn tại")
                const exit = await this.prismaService.deparment.findUnique({
                    where: {
                        id: id
                    },
                   include:{
                    rooms:{
                        include:{
                            Device:true
                        }
                    }
                   }
                })
            
                const hasDevices = exit.rooms.some((room) => room.Device.length > 0);

                if (hasDevices) {
                    return new ResponseData<any>(
                        null,
                        400,
                        "Đang có thiết bị trong các phòng thuộc khoa, không thể xoá!"
                    );
                }
        
                 await this.prismaService.deparment.delete({
                where: { id: id }
            })
            return new ResponseData<any>(null, 200, "Xoá thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }

    //Room Service

    // async createRoom(createRoomDto: CreateRoomDto) {
    //     try {
    //     const { roomName, deparmentId } = createRoomDto;
    //     console.log(createRoomDto);
    //         for(const name of roomName){
    //             const room = await this.prismaService.room.findFirst({
    //                 where: {
    //                     roomName: name
    //                 },
    //                 orderBy: {
    //                     createAt: "desc"
    //                 }
    //             })
    //             if (room && room.deparmentId ===deparmentId) return new ResponseData<any>(null, 400, "Phòng đã tồn tại trong khoa")
    //             await this.prismaService.room.create({
    //                 data: {
    //                     roomName: name,
    //                     deparmentId: deparmentId
    //                 }
    //             })
    //         }
           
    //         return new ResponseData<any>(null, 200, "Tạo phòng thành công")
    //     } catch (error) {
    //         this.logger.error(error.message)
    //         return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
    //     }
    // }
    async deleteRoom(id: number) {
        try {
            // Tìm phòng với ID tương ứng
            const room = await this.prismaService.room.findUnique({
                where: {
                    id: id,
                    Device:{
                        some:{}
                    }
                },
      
            });
    
            // Nếu phòng không tồn tại
           
            if (room) {
                return new ResponseData<any>(null, 400, "Phòng chứa thiết bị, không thể xóa!");
            }
    
            await this.prismaService.room.delete({
                where: {
                    id: id,
                },
            });
    
            return new ResponseData<any>(null, 200, "Xóa phòng thành công");
        } catch (error) {
            this.logger.error(error.message);
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau");
        }
    }
    
}
