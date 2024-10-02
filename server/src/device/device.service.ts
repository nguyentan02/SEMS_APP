import { Injectable, Logger, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';
import { PAGE_SIZE, ResponseData } from '../global';
import e from 'express';
import { contains } from 'class-validator';

@Injectable()
export class DeviceService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService) { }
    private readonly logger = new Logger(DeviceService.name)


    async getAllDevice(option: { page: number, name: string, categoryId: number }) {
        let pageSize = PAGE_SIZE.PAGE_DEVICE
        try {
            let { page, name, categoryId } = option
            const where: any = {}
            if (name) {
                where.name = {
                    contains: name,
                    mode: 'insensitive'
                }
            }
            if (categoryId) {
                where.categoryId = Number(categoryId)
            }
            const totalCount = await this.prismaService.device.count({
                where: where
            })
            let totalPages = Math.ceil(totalCount / pageSize)
            if (!totalPages) totalPages = 1
            if (!page || page < 1) page = 1
            let next = (page - 1) * pageSize
            const data = await this.prismaService.device.findMany({
                where: where,
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data, totalCount, totalPages }, 200, "Tìm các thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async createDevice(createDeviceDto: CreateDeviceDto, imageDevice: Express.Multer.File) {
        try {

            const exist = await this.prismaService.device.findFirst({
                where: {
                    serialNumber: createDeviceDto.serialNumber
                }
            })
            if (exist) return new ResponseData<any>(null, 400, "Số serial thiết bị đã được sử dụng")
            const img = await this.cloudinaryService.uploadFile(imageDevice)
            const device = await this.prismaService.device.create({
                data: {
                    name: createDeviceDto.name,
                    serialNumber: createDeviceDto.serialNumber,
                    manufacturer: createDeviceDto.manufacturer,
                    purchaseDate: new Date(createDeviceDto.purchaseDate),
                    expirationDate: new Date(createDeviceDto.expirationDate),
                    price: createDeviceDto.price,
                    image: img.url,
                    categoryId: createDeviceDto.categoryId,
                    // roomId: createDeviceDto.roomId
                }
            })
            return new ResponseData<any>(device, 200, "Thêm thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateDevice(id: number, updateDeviceDto: UpdateDeviceDto, imageDevice: Express.Multer.File) {
        try {
            const exist = await this.prismaService.device.findUnique({
                where: {
                    id: id
                }
            })
            if (!exist) return new ResponseData<any>(null, 400, "Thiết bị không tồn tại")
            if (updateDeviceDto.serialNumber && updateDeviceDto.serialNumber !== exist.serialNumber) {
                const existSerial = await this.prismaService.device.findFirst({
                    where: {
                        serialNumber: updateDeviceDto.serialNumber,
                        NOT: {
                            id: id
                        }
                    }
                })
                if (existSerial) {
                    return new ResponseData<any>(null, 400, "Số serial này đã tồn tại trên thiết bị khác");
                }
            }
            const data: { imageDevice?: string } = {}
            if (imageDevice) {
                const img = await this.cloudinaryService.uploadFile(imageDevice)
                data.imageDevice = img.url
            }
            await this.prismaService.device.update({
                where: {
                    id: id
                },
                data: {
                    ...updateDeviceDto,
                    image: data.imageDevice
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async deleteDevice(id: number) {
        try {
            const exist = await this.prismaService.device.findFirst({
                where: {
                    id: id
                }
            })
            if (!exist) return new ResponseData<any>(null, 400, "Thiết bị không tồn tại")
            await this.prismaService.device.update({
                where: { id: id },
                data: {
                    isDelete: true
                }
            })
            return new ResponseData<any>(null, 200, "Xoá thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
