import { Injectable, Logger, Res } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryMaterialDto, CreateMaterialDto, WasteMaterialDto } from './dto';
import { PAGE_SIZE, ResponseData } from 'src/global';
import { UpdateCategoryMaterialDto, UpdateMaterialDto } from './dto/update.dto';
import { Material } from '@prisma/client';

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
    async waste(id: number, wasteMaterialDto: WasteMaterialDto) {
        try {
            const material = await this.prismaService.material.findFirst({
                where: {
                    id: id
                }
            })
            if (!material) return new ResponseData<any>(null, 400, "Vật tư không tồn tại")
            await this.prismaService.material.update({
                where: {
                    id: id
                }, data: {
                    quantity: {
                        decrement: wasteMaterialDto.wasteNumber
                    }
                }
            })
            const newWaste = await this.prismaService.waste.create({
                data: {
                    materialId: id,
                    quantity: wasteMaterialDto.wasteNumber,
                    scrapReason: wasteMaterialDto.scrapReason
                }
            })
            return new ResponseData<any>(newWaste, 200, 'Tạo phế phẩm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

}
