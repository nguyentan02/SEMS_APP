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
                where = {
                    name: {
                        contains: key,
                        mode: 'insensitive'
                    }
                }

            }
            let totalCount = 0
            if (page)
                pageSize = PAGE_SIZE.PAGE_LOCATION
            totalCount = await this.prismaService.deparment.count({
                where: where,
                orderBy: {
                    id: "asc"
                }
            })
            totalPages = Math.ceil(totalPages / pageSize)
            if (!totalPages) totalPages = 1
            if (!page || page < 1) page = 1
            next = (page - 1) * pageSize
            const data = await this.prismaService.deparment.findMany({
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize,
                where: where
            })
            return new ResponseData<any>({ data, totalPages, totalCount }, 200, 'Tìm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }

    async createDeparment(createDeparmentDto: CreateDeparmentDto) {
        try {
            const deparment = await this.prismaService.deparment.findFirst({
                where: {
                    deparmentName: createDeparmentDto.deparmentName
                }
            })
            if (deparment) return new ResponseData<any>(null, 400, "Khoa đã tồn tại")
            await this.prismaService.deparment.create({
                data: {
                    deparmentName: createDeparmentDto.deparmentName
                }
            })
            return new ResponseData<any>(null, 200, "Tạo thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async updateDeparment(id: number, updateDeparmentDto: UpdateDeparmentDto) {
        try {
            const deparment = await this.prismaService.deparment.findFirst({
                where: {
                    id: id
                }
            })
            if (!deparment) return new ResponseData<any>(null, 400, "Khoa không tồn tại")
            await this.prismaService.deparment.update({
                where: { id: id }
                , data: {
                    ...updateDeparmentDto
                }
            })
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

    async createRoom(createRoomDto: CreateRoomDto) {
        try {

            const room = await this.prismaService.room.findFirst({
                where: {
                    roomName: createRoomDto.roomName
                },
                orderBy: {
                    createAt: "desc"
                }
            })
            if (room && room.deparmentId === createRoomDto.deparmentId) return new ResponseData<any>(null, 400, "Phòng đã tồn tại trong khoa")
            await this.prismaService.room.create({
                data: {
                    roomName: createRoomDto.roomName,
                    deparmentId: createRoomDto.deparmentId
                }
            })
            return new ResponseData<any>(null, 200, "Tạo phòng thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
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
