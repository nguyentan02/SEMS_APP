import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeparmentDto, UpdateDeparmentDto, CreateRoomDto, UpdateRoomDto } from './dto';
import { PAGE_SIZE, ResponseData } from '../global';



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
                            createAt: "desc"
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
                await this.prismaService.room.deleteMany({
                    where: {
                        deparmentId: id
                    }
                })
                 if(updateDeparmentDto.roomName && updateDeparmentDto.roomName.length > 0) {
                for (const name of updateDeparmentDto.roomName) {
                    const room = await this.prismaService.room.findFirst({
                        where: {
                            roomName: name,
                            deparmentId: id
                        },
                        orderBy: { createAt: "desc" }
                    });
                    if (!room) {
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
            const deparment = await this.prismaService.deparment.findFirst({
                where: {
                    id: id
                }
            })
            if (!deparment) return new ResponseData<any>(null, 400, "Khoa không tồn tại")
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
    async updateRoom(id: number, updateRoomDto: UpdateRoomDto) {
        try {
            const room = await this.prismaService.room.findFirst({
                where: {
                    id: id
                }
            })

            if (!room) return new ResponseData<any>(null, 400, "Phòng không tồn tại")
            const duplicateRoom = await this.prismaService.room.findFirst({
                where: {
                    roomName: updateRoomDto.roomName,
                    deparmentId: room.deparmentId,
                    NOT: { id: id }
                }
            });

            if (duplicateRoom) {
                return new ResponseData<any>(null, 400, "Tên phòng đã tồn tại trong khoa");
            }
            await this.prismaService.room.update({
                where: { id: id }
                , data: {
                    ...updateRoomDto,
                    createAt: new Date()
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
}
