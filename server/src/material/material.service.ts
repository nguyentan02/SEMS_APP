import { Injectable, Logger, Res } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActualQuantityDto, CreateCategoryMaterialDto, CreateMaterialDto, WasteMaterialDto } from './dto';
import { PAGE_SIZE, ResponseData } from 'src/global';
import { UpdateCategoryMaterialDto, UpdateMaterialDto } from './dto/update.dto';
import { Material } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class MaterialService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinary: CloudinaryService) { }

    private readonly logger = new Logger(MaterialService.name)

    async createCategoryMaterial(createCategoryMaterialDto: CreateCategoryMaterialDto) {
        try {
            const exist = await this.prismaService.listMaterials.findFirst({
                where: {
                    name: createCategoryMaterialDto.name
                }
            })
            if (exist) return new ResponseData<any>(null, 400, "Danh mục đã tồn tại")
            await this.prismaService.listMaterials.create({
                data: {
                    name: createCategoryMaterialDto.name
                }
            })
            return new ResponseData<any>(null, 200, "Tạo danh mục thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async createCategoryMaterials() { }
    async updateCategoryMaterial(id: number, updateCategoryMaterialDto: UpdateCategoryMaterialDto) {
        try {
            const exist = await this.prismaService.listMaterials.findFirst({
                where: {
                    name: updateCategoryMaterialDto.name,
                    NOT: {
                        id: id
                    }
                }
            })
            if (exist) return new ResponseData<any>(null, 400, "Danh mục đã tồn tại")
            await this.prismaService.listMaterials.update({
                where: {
                    id: id
                },
                data: {
                    name: updateCategoryMaterialDto.name
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật danh mục thành công")
        } catch (error) {

        }
    }

    async getAllMaterial(option: { page: number, name: string, categoryId: number }
    ) {

        try {
            let { page, name, categoryId } = option
            let pageSize = undefined
            let where: any = {}
            let totalPages = 1
            let next = undefined
            if (name) {
                where.name = {
                    contains: name,
                    mode: 'insensitive'
                }
            }
            if (categoryId) {
                where.categoryId = Number(categoryId)
            }
            let totalCount = 0
            if (page) {
                pageSize = PAGE_SIZE.PAGE_MATERIAL
                totalCount = await this.prismaService.material.count({
                    where: where,
                    orderBy: {
                        id: 'asc'
                    }
                })

                totalPages = Math.ceil(totalCount / pageSize)
                if (!totalPages) totalPages = 1
                if (!page || page < 1) page = 1
                next = (page - 1) * pageSize
            }
            const data = await this.prismaService.material.findMany({
                where: where,
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data, totalCount, totalPages }, 200, "Tìm thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async getAllMaterialById(materialId: number) {
        try {
            const material = await this.prismaService.material.findUnique({
                where: { id: materialId }
            })
            if (!material) return new ResponseData<any>(null, 400, "Vật tư không tồn tại")

            const data = await this.prismaService.material.findMany({
                where: {
                    id: materialId
                }
            })
            return new ResponseData<Material[]>(data, 200, 'Tìm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async createMaterial(createMaterialDto: CreateMaterialDto, image: Express.Multer.File) {
        try {
            console.log(createMaterialDto.name);
            const material = await this.prismaService.material.findFirst({
                where: {
                    name: createMaterialDto.name,
                    categoryId: createMaterialDto.categoryId
                }
            })
            if (material) return new ResponseData<any>(null, 400, "Vật tư đã tồn tại")
            let img: any
            if (image) {
                const upload = await this.cloudinary.uploadFile(image)
                img = upload.url
            }
            await this.prismaService.material.create({
                data: {
                    name: createMaterialDto.name,
                    note: createMaterialDto.note,
                    image: img,
                    categoryId: createMaterialDto.categoryId,
                }
            })
            return new ResponseData<any>(null, 200, "Tạo vật tư thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updateMaterial(id: number, updateMaterialDto: UpdateMaterialDto, image: Express.Multer.File) {
        try {
            const material = await this.prismaService.material.findFirst({
                where: {
                    id: id
                }
            })
            if (!material) return new ResponseData<any>(null, 400, "Vật tư không tồn tại")
            let img: any
            if (image) {
                const upload = await this.cloudinary.uploadFile(image)
                img = upload.url
            }
            await this.prismaService.material.update({
                where: {
                    id: id
                },
                data: {
                    name: updateMaterialDto.name,
                    note: updateMaterialDto.note,
                    image: img,
                    categoryId: updateMaterialDto.categoryId,
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async waste(wasteMaterialDto: WasteMaterialDto) {
        try {
            const material = await this.prismaService.material.findFirst({
                where: {
                    id: wasteMaterialDto.materialId
                }
            })
            if (!material) return new ResponseData<any>(null, 400, "Vật tư không tồn tại")
            await this.prismaService.material.update({
                where: {
                    id: wasteMaterialDto.materialId
                }, data: {
                    quantity: {
                        decrement: wasteMaterialDto.wasteNumber
                    }
                }
            })
            const code = this.generateOrderCode()
            const newWaste = await this.prismaService.waste.create({
                data: {
                    materialId: wasteMaterialDto.materialId,
                    wasteCode: code,
                    quantity: wasteMaterialDto.wasteNumber,
                    wasteReason: wasteMaterialDto.scrapReason
                }
            })
            return new ResponseData<any>(newWaste, 200, 'Tạo phế phẩm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updatewaste(id: number, upWasteMaterialDto: WasteMaterialDto) {
        try {

        } catch (error) {

        }
    }
    async actualQuantity(actualQuantityDto: ActualQuantityDto) {
        try {
            const material = await this.prismaService.material.findFirst({
                where: { id: actualQuantityDto.materialId }
            })
            if (!material) return new ResponseData<any>(null, 400, "Vật tư không tồn tại")
            let total: number = actualQuantityDto.quantity - material.quantity;

            await this.prismaService.actualQuantity.create({
                data: {
                    materialId: actualQuantityDto.materialId,
                    quantity: total,
                    userId: actualQuantityDto.userId
                }
            })
            await this.prismaService.material.update({
                where: {
                    id: actualQuantityDto.materialId
                }, data: {
                    quantity: material.quantity + total
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật số lượng thành công");
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    private generateOrderCode(): string {
        const randomSuffix = randomBytes(2).toString('hex').toUpperCase();
        return `SP-${randomSuffix}`;
    }
}
