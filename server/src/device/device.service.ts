import { BadRequestException, Injectable, Logger, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';
import { PAGE_SIZE, ResponseData } from '../global';
import { Device, Prisma } from '@prisma/client';


@Injectable()
export class DeviceService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService) { }
    private readonly logger = new Logger(DeviceService.name)


    async getAllDevice(option: { page: number, name: string, categoryId: number }) {
        let pageSize = PAGE_SIZE.PAGE_DEVICE
        try {
            let { page, name, categoryId } = option
            let where: any = { isDelete: false, }
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
                take: pageSize,
                include:{
                    category:{
                        select:{
                            categoryName:true
                        }
                    },
                    DeviceAttributeValues:{
                        include:{
                            AttribyutesCategory:{
                                select:{
                                    name:true
                                }
                            }
                        }
                    }
                }
            })
            return new ResponseData<any>({ data, totalCount, totalPages }, 200, "Tìm các thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async getDeviceById(id: number) {
        try {
            const device = await this.prismaService.device.findFirst({
                where: {
                    id: id
                }
            })
            if (!device) return new ResponseData<any>(null, 400, "Thiết bị không tồn tại")
            const data = await this.prismaService.device.findMany({
                where: { id: id },
                include:{
                    category:{
                        select:{
                            categoryName:true
                        }
                    },
                    DeviceAttributeValues:{
                        include:{
                            AttribyutesCategory:{
                                select:{
                                    name:true
                                }
                            }
                        }
                    }
                }
            })
            return new ResponseData<Device[]>(data, 200, "Tìm thấy thiết bị")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async createDevice(createDeviceDto: CreateDeviceDto, imageDevice: Express.Multer.File) {
        try {
            const {
                name,
                serialNumber,
                manufacturer,
                purchaseDate,
                expirationDate,
                price,
                categoryId,
                attributes 
            } = createDeviceDto;
            console.log(createDeviceDto);
            console.log(imageDevice);
            const exist = await this.prismaService.device.findFirst({
                where: {
                    serialNumber: createDeviceDto.serialNumber
                }
            })
            if (exist) return new ResponseData<any>(null, 400, "Số serial thiết bị đã được sử dụng")
                const category = await this.prismaService.category.findUnique({
                    where: { id: categoryId },
                    include: { AttribyutesCategory: true },
                });
                if (!category) return new ResponseData<any>(null, 400, "Không tìm thấy danh mục")
                    const attributeValues = [];
                for (const attribute of attributes) {
                    const attributeCategory = category.AttribyutesCategory.find(
                        (attr) => attr.id === attribute.id
                    );
                    if (!attributeCategory) {
                        throw new BadRequestException(`Invalid attribute ID: ${attribute.id}`);
                    }
                    attributeValues.push({
                        attributeId: attribute.id,
                        value: attribute.value,
                    });
                }
              let imgUrl:any 
            if(imageDevice){
                const img = await this.cloudinaryService.uploadFile(imageDevice)
                 imgUrl = img.url
            }
            const device = await this.prismaService.device.create({
                data: {
                    name: name,
                    serialNumber: serialNumber,
                    manufacturer: manufacturer,
                    purchaseDate: new Date(purchaseDate),
                    expirationDate: new Date(expirationDate),
                    price: new Prisma.Decimal(price),
                    image: imgUrl,
                    categoryId: categoryId,
                    DeviceAttributeValues:{
                        create:attributeValues.map((attr) =>({
                            attributeId:attr.attributeId,
                            value:attr.value     
                        })),
                    },
                },
                include: { DeviceAttributeValues: true },
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
