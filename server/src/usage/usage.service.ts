import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsageDto } from './dto';
import e from 'express';
import { DEVICE_STATUS, PAGE_SIZE, ResponseData } from 'src/global';
import { UpdateUsageDto } from './dto/update.dto';

@Injectable()
export class UsageService {
    constructor(private readonly prismaService: PrismaService) { }
    private readonly logger = new Logger(UsageService.name)
    async getAllUsage(option: { page: number, nameDevice: string, startDate: string, endDate: string, departmentId: number, roomId: number }) {
        let pageSize = PAGE_SIZE.PAGE_USAGE
        try {
            let { page, nameDevice, startDate, endDate, departmentId, roomId } = option
            const where: any = {
                isDeleted: false
            }
            if (startDate && endDate) {
                where.usage_start = {
                    gte: startDate,
                    lte: endDate,
                }
            } else if (startDate) {
                where.usage_start = {
                    gte: startDate
                }
            } else if (endDate) {
                where.usage_start = {
                    lte: endDate
                }
            }
            // const roomWhere: any = {}
            // if (roomId) {
            //     roomWhere.id = roomId
            // }
            // if (departmentId) {
            //     roomWhere.deparment = {
            //         id: departmentId
            //     }
            // }

            if (roomId || departmentId) {
                where.room = {};
                if (roomId) {
                    where.room.id = Number(roomId);
                }
                if (departmentId) {
                    where.room.deparmentId = {
                        id: departmentId
                    }
                }
            }

            if (nameDevice) {
                where.Device = {
                    name: {
                        contains: nameDevice, // Tìm kiếm tên thiết bị có chứa chuỗi
                        mode: 'insensitive',
                    }

                };
            }
            const totalCount = await this.prismaService.usageInformation.count({
                where: where,
            });
            let totalPages = Math.ceil(totalCount / pageSize)
            if (!totalPages) totalPages = 1
            if (!page || page < 1) page = 1
            let next = (page - 1) * pageSize
            const data = await this.prismaService.usageInformation.findMany({
                where: where,
                skip: next,
                take: pageSize,
                orderBy: {
                    usage_start: 'desc'
                },
                include: {
                    Device: true,
                    room: {
                        include: {
                            deparment: true,  // Lấy thông tin khoa của phòng
                        },
                    },
                },
            })
            return new ResponseData<any>({ data, totalCount, totalPages }, 200, "Tìm thấy các lịch sử")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async getUsageById(id: number) {
        try {
            const usage = await this.prismaService.usageInformation.findFirst({
                where: {
                    id: id
                }
            })
            if (!usage) return new ResponseData<any>(null, 400, "Thiết bị không tồn tại")
            const data = await this.prismaService.usageInformation.findFirst({
                where: { id: id },
                include: {
                    Device: true
                }
            })
            return new ResponseData<any>(data, 200, "Tìm thấy thiết bị")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async createUsage(createUsageDto: CreateUsageDto) {
        try {
            for (const id of createUsageDto.deviceId) {
                const exist = await this.prismaService.usageInformation.findFirst({
                    where: {
                        deviceId: id,
                        isDeleted: false,
                    },
                });

                if (exist) {
                    return new ResponseData<any>(null, 400, `Thiết bị với ID ${id} đang được sử dụng`);
                }
                if (exist) return new ResponseData<any>(null, 400, "Thiết bị đang được sử dụng")
            }
            const usageArray = []
            for (const id of createUsageDto.deviceId) {
                const data = await this.prismaService.usageInformation.create({
                    data: {
                        deviceId: id,
                        usage_start: new Date(createUsageDto.usage_start),
                        usage_end: new Date(createUsageDto.usage_end),
                        roomId: createUsageDto.roomId,
                        purpose: createUsageDto.purpose
                    }
                })
                usageArray.push(data)
            }
            for (const id of createUsageDto.deviceId) {
                await this.prismaService.device.update({
                    where: {
                        id: id
                    },
                    data: {
                        roomId: createUsageDto.roomId,
                        statusDevice: 'ACTIVE'
                    }
                })
            }
            return new ResponseData<any>(usageArray, 200, "Thêm thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateUsage(id: number, updateUsageDto: UpdateUsageDto) {
        try {
            const exist = await this.prismaService.usageInformation.findFirst({
                where: {
                    id: id,
                    isDeleted: false
                }
            })
            if (!exist) return new ResponseData<any>(null, 400, "Thông tin không tồn tại")
            await this.prismaService.usageInformation.update({
                where: { id: id },
                data: {
                    usage_start: updateUsageDto.usage_start,
                    usage_end: updateUsageDto.usage_end,
                    purpose: updateUsageDto.purpose
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async deleteUsage(id: number) {
        try {
            const exist = await this.prismaService.usageInformation.findFirst({
                where: {
                    id: id
                }
            })
            if (!exist) return new ResponseData<any>(null, 400, "Thông tin không tồn tại")
            await this.prismaService.usageInformation.update({
                where: {
                    id: id
                }, data: {
                    isDeleted: true
                }
            })
            await this.prismaService.device.update({
                where: {
                    id: exist.deviceId
                },
                data: {
                    roomId: null
                }
            })
            return new ResponseData<any>(null, 200, "Xoá thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}