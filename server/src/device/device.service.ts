import { BadRequestException, Injectable, Logger, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateDeviceDto, UpdateDeviceDto ,CreateDevicesDto} from './dto';
import { PAGE_SIZE, ResponseData } from '../global';
import { Device, Prisma, StatusMaintenance } from '@prisma/client';
import { Workbook } from 'exceljs'
import { Cron, CronExpression } from '@nestjs/schedule';
import { join } from 'path';

@Injectable()
export class DeviceService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService) { }
    private readonly logger = new Logger(DeviceService.name)


    async getAllDevice(option: { page: number, key: string, categoryId: number, groupByCategory?: boolean, sortByDate?: 'asc' | 'desc'  }) {
        let pageSize = PAGE_SIZE.PAGE_DEVICE
        try {
            let { page, key, categoryId,groupByCategory ,sortByDate} = option
            let where: any = { isDelete: false }
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
                , orderBy: {
                 // Default to 'asc' if not specified
                    expirationDate: sortByDate || 'asc' , // Default to 'asc' if not specified
                }
            })
            let groupedData;
            if (groupByCategory) {
                groupedData = data.reduce((acc, device) => {
                    const categoryName = device.category?.categoryName || "Uncategorized";
                    if (!acc[categoryName]) {
                        acc[categoryName] = {
                            categoryName: categoryName,
                            devices: []
                        }
                    }
                    acc[categoryName].devices.push(device);
                    return acc;
                }, {});
            }
            const totalDevice = await this.prismaService.device.count({
                where:{
                    isDelete:false
                }
            })
            const resultData = groupByCategory ? groupedData : data;
            return new ResponseData<any>({ data:resultData, totalCount,totalDevice, totalPages }, 200, "Tìm các thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async getAllDeviceByUsage() {
        try {
            const data = await this.prismaService.device.findMany({
                where: {
                    statusDevice:"KHÔNG HOẠT ĐỘNG",
                    isDelete:false
                },
                include:{
                    category:{
                        select:{
                            categoryName:true
                        }
                    },
                }
                , orderBy: {
                    purchaseDate: 'asc'  // Default to 'asc' if not specified
                }
            })
           
            return new ResponseData<any>(data, 200, "Tìm các thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async getAllDeviceByMaintenance() {
        try {
            const data = await this.prismaService.device.findMany({
                where: {
                    statusDevice:"ĐANG HOẠT ĐỘNG",
                    isDelete:false
                },
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
                , orderBy: {
                    purchaseDate: 'asc' 
                }
            })
            if(data.length == 0) return new ResponseData<any>(null,300,"Không có thiết bị")
            return new ResponseData<any>(data, 200, "Tìm các thiết bị thành công")
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
                where: { id: id ,isDelete:false},
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
         
            const exist = await this.prismaService.device.findFirst({
                where: {
                    serialNumber: createDeviceDto.serialNumber,
                    isDelete:false
                }
            })
            if (exist) return new ResponseData<any>(null, 400, "Số serial thiết bị đã được sử dụng")
                const category = await this.prismaService.category.findUnique({
                    where: { id: Number(categoryId) },
                    include: { AttribyutesCategory: true },
                });
                if (!category) return new ResponseData<any>(null, 400, "Không tìm thấy danh mục")
                    const attributeValues = [];
                if(!attributes){
                    return new ResponseData<any>(null,400,"Thuộc tính không được bỏ trống !")
                }else
                    {for (const attribute of attributes) {
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
                }}
                
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
    async createDevices(file: Express.Multer.File) {
        const keys = ['name', 'serialNumber', 'manufacturer', 'purchaseDate', 'expirationDate', 'price', 'categoryName', 'attributes'];
        const data = [];
        const deviceErrors = [];
        const successfulDevices = []; // Mảng để lưu thiết bị thành công
        let devices: CreateDevicesDto[];
    
        try {
            const workbook = new Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.getWorksheet(1);
            const headerRow = worksheet.getRow(1).values;
    
            // Kiểm tra tiêu đề cột có khớp không
            const isEqual = keys.every((key, index) => key === headerRow[index + 1]);
            if (!isEqual) {
                return new ResponseData<string>(null, 400, 'Không đúng định dạng dữ liệu');
            }
    
            // Lấy dữ liệu từ các hàng
            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex !== 1) {
                    data.push(row.values);
                }
            });
    
            devices = data.map((row) => {
                const device = {} as CreateDevicesDto;
                for (let i = 1; i < row.length; i++) {
                    device[keys[i - 1]] = row[i];
                }
                return device;
            });
    
            for (const device of devices) {
                const categoryValid = await this.prismaService.category.findFirst({
                    where: { categoryName: device.categoryName }
                });
    
                if (!categoryValid) {
                    deviceErrors.push({ ...device, error: 'Danh mục không tồn tại' });
                    continue;
                }
    
                const exist = await this.prismaService.device.findFirst({
                    where: { serialNumber: device.serialNumber, isDelete: false }
                });
    
                if (exist || isNaN(Number(device.price))) {
                    deviceErrors.push({ ...device, error: 'Thiết bị đã tồn tại hoặc giá không hợp lệ' });
                    continue;
                }
    
                const attributesWithId = [];
                const attributes = await this.prismaService.attribyutesCategory.findMany({
                    where: { categoryId: categoryValid.id }
                });
    
                for (const attr of attributes) {
                    const attrValue = (device.attributes && device.attributes[attr.name]) || "";
                    attributesWithId.push({ id: attr.id, value: attrValue });
                }
    
                try {
                    const newDevice = await this.prismaService.device.create({
                        data: {
                            name: device.name,
                            categoryId: categoryValid.id,
                            serialNumber: device.serialNumber,
                            manufacturer: device.manufacturer,
                            purchaseDate: device.purchaseDate,
                            expirationDate: device.expirationDate,
                            price: new Prisma.Decimal(device.price),
                            DeviceAttributeValues: {
                                create: attributesWithId.map(attr => ({ attributeId: attr.id, value: attr.value }))
                            }
                        }
                    });
                    successfulDevices.push(newDevice);
                } catch (error) {
                    deviceErrors.push({ ...device, error: 'Lỗi khi tạo thiết bị' });
                }
            }
    
            return new ResponseData<any>({
                deviceErrors,
                successfulDevices,
                totalSuccess: successfulDevices.length,
                totalError: deviceErrors.length,
            }, 200, 'Tạo thiết bị thành công');
    
        } catch (error) {
            this.logger.error(error.message);
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau');
        }
    }
    
    async isCategory(categoryId:number){
        const category = await this.prismaService.category.findFirst({
            where: { id: categoryId },
            include: { AttribyutesCategory: true },
        });
        return category ? true :false
    }
    async updateDevice(id: number, updateDeviceDto: UpdateDeviceDto, imageDevice: Express.Multer.File) {
        const {
            name,
            serialNumber,
            manufacturer,
            purchaseDate,
            expirationDate,
            price,
            categoryId,
            attributes 
        } = updateDeviceDto;
        try {
            const exist = await this.prismaService.device.findUnique({
                where: {
                    id: id
                }
            })
            if (!exist) return new ResponseData<any>(null, 400, "Thiết bị không tồn tại")
                if (serialNumber && serialNumber !== exist.serialNumber) {
                    const extSerial = await this.prismaService.device.findFirst({
                      where: { serialNumber: serialNumber },
                    });
                    if (extSerial) {
                      return new ResponseData<any>(null,400, "Số serial đã tồn tại", );
                    }
                  }
                    const category = await this.prismaService.category.findUnique({
                        where: { id: Number(categoryId) },
                        include: { AttribyutesCategory: true },
                    });
                    if (!category) return new ResponseData<any>(null, 400, "Không tìm thấy danh mục")
                        const attributeValues = [];
                    if(!attributes){
                        return new ResponseData<any>(null,400,"Thuộc tính không được bỏ trống !")
                    }else
                        {for (const attribute of attributes) {
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
                    }}
                    let imgUrl = exist.image;
                if(imageDevice){
                    const img = await this.cloudinaryService.uploadFile(imageDevice)
                     imgUrl = img.url
                }
                const dateUpdate: any = {
                    purchaseDate,
                    expirationDate
                };
                if (purchaseDate) {
                    dateUpdate.purchaseDate = new Date(purchaseDate);
                }
                
                
                if (expirationDate) {
                    dateUpdate.expirationDate = new Date(expirationDate);
                }
             
                
                const update = await this.prismaService.device.update({
                    where:{id},
                    data: {
                        name: name,
                        serialNumber: serialNumber,
                        manufacturer: manufacturer,
                        purchaseDate: dateUpdate.purchaseDate,
                        expirationDate: dateUpdate.expirationDate,
                        price:  price ? new Prisma.Decimal(price) : undefined,
                        image: imgUrl,
                        categoryId: categoryId,
                        updatedAt:new Date(),
                        DeviceAttributeValues:{
                            deleteMany : { deviceId: id },
                            create:attributeValues.map((attr) =>({
                                attributeId:attr.attributeId,
                                value:attr.value     
                            })),
                        },
                    },
                    include: { DeviceAttributeValues: true },
                })
                
            return new ResponseData<any>(update, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async deleteDevice(id: number) {
        try {
      console.log(id);
                const exist = await this.prismaService.device.findFirst({
                    where: {
                        id: id
                    }
                })
                if (!exist) return new ResponseData<any>(null, 400, "Thiết bị không tồn tại")
                 const maintenancePlanExist = await this.prismaService.maintenancePlan.findFirst({
                        where: { deviceId: id ,maintenanceStatus:{
                            notIn:[StatusMaintenance.PENDING,StatusMaintenance.COMPLETED,StatusMaintenance.CANCEL]
                        }}
                      });
                    
                      if(maintenancePlanExist){
                        return new ResponseData<any>(null, 400, "Thiết bị đang có bảo trì không thể xoá")
                      }
                        await this.prismaService.maintenancePlan.updateMany({
                            where:{
                                deviceId:exist.id,
                            },data:{
                                isDeleted:true,
                                maintenanceStatus:StatusMaintenance.CANCEL
                            }
                        })
                      await this.prismaService.usageInformation.updateMany({
                        where:{
                            deviceId:exist.id
                        },data:{
                            end:new Date(),
                            isDeleted:true
                        }
                    })
                      await this.prismaService.device.update({
                        where: { id: id },
                        data: {
                            isDelete: true,
                            roomId:null,
                            statusDevice:"KHÔNG HOẠT ĐỘNG"
                        }
     })
              return new ResponseData<any>(null, 200, "Xoá thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
   
    @Cron('*/30 * * * *')
    async autoUpdateDevice() {
        try {
            await this.prismaService.device.updateMany({
                where: {
                    isDelete: false,
                    expirationDate: {
                        lte: new Date()
                    }
                },
                data: {
                  expired:true
                }
            })
            this.logger.log('Cập nhật thiết bị thành công')
        } catch (error) {
            this.logger.error(error.message)
        }
    }
}
