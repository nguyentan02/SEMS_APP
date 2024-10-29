import { Injectable, Logger, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttribyutesDto, CreateCategoryAttribyute, CreateCategoryDto, DeleteCateAttriDto } from './dto';
import { PAGE_SIZE, ResponseData } from 'src/global';
import { UpdateAttribyutesDto, UpdateCategory } from './dto/update-category.dto';
import { contains } from 'class-validator';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) { }

    private readonly logger = new Logger(CategoryService.name);

    async getCategory(option: { page: number, name: string }) {
        let pageSize = PAGE_SIZE.PAGE_CATEGORY
        try {
            let { page } = option
            const totalCount = await this.prismaService.category.count({
                where: {
                    categoryName: {
                        contains: option.name,
                        mode: 'insensitive'
                    }
                }
            })
            const totalPages = totalCount == 0 ? 1 : Math.ceil(totalCount / pageSize)
            if (!page || page < 1) page = 1
            if (page > totalPages) page = totalPages
            let next = (page - 1) * pageSize
            const data = await this.prismaService.category.findMany({
                where: {
                    categoryName: {
                        contains: option.name,
                        mode: 'insensitive'
                    }
                },
                select:{
                    id:true,
                    categoryName:true,
                    CategoryAttribyutes:{
                        select:{
                            attribyute:true
                        }
                    }
                },
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data: data, totalPages, total: totalCount }, 200, "Tìm thấy các danh mục")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async getCategoryById(id: number) {
        try {
            const category = await this.prismaService.category.findFirst({
                where: {
                    id: id
                }
            })
            if (!category) return new ResponseData<any>(null, 400, "Danh mục không tồn tại")
            const data = await this.prismaService.category.findFirst({
                where: {
                    id: id
                },
                include: {
                    CategoryAttribyutes: {
                        select: {
                            attribyute: true
                        }
                    }
                }
            })
            return new ResponseData<any>(data, 200, "Trả dữ liệu thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async createCategory(createCategoryDto: CreateCategoryDto) {
        try {
            const category = await this.prismaService.category.findFirst({
                where: {
                    categoryName: createCategoryDto.categoryName
                }
            })
            if (category) return new ResponseData<any>(null, 400, "Danh mục đã tồn tại");
            const newCategory = await this.prismaService.category.create({
                data: {
                    categoryName: createCategoryDto.categoryName
                }
            })
            // const categoryAt = await this.prismaService.categoryAttribyutes.findMany({
            //     where: {
            //         categoryId: newCategory.id,
            //         attribyuteId: {
            //             in: createCategoryDto.attribyuteId
            //         }
            //     }
            // })
            // if (categoryAt) return new ResponseData<any>(null, 200, "Tạo thuộc tính đã tồn tại trong danh mục")
            for (const attribyuteId of createCategoryDto.attribyuteId)
                await this.prismaService.categoryAttribyutes.create({
                    data: {
                        categoryId: newCategory.id,
                        attribyuteId: attribyuteId
                    }
                })
            return new ResponseData<any>(null, 200, "Tạo danh mục thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateCategory(id: number, updateCategoryDto: UpdateCategory) {
        try {
            const category = await this.prismaService.category.findFirst({
                where: {
                    id: id
                }

            })
            if (!category) return new ResponseData<any>(null, 400, "Danh mục không tồn tại")
            const existingCategoryWithSameName = await this.prismaService.category.findFirst({
                where: {
                    categoryName: updateCategoryDto.categoryName,
                    NOT: {
                        id: id,
                    },
                },
            });
            if (existingCategoryWithSameName) {
                return new ResponseData<any>(null, 400, "Tên danh mục đã tồn tại")
            }
            await this.prismaService.category.update({
                where: {
                    id: id
                }, data: {
                    categoryName: updateCategoryDto.categoryName
                }
            })
            await this.prismaService.categoryAttribyutes.deleteMany({
                where: { categoryId: id },
            });
            for (const attribyuteId of updateCategoryDto.attribyuteId)
                await this.prismaService.categoryAttribyutes.create({
                    data: {
                        categoryId: id,
                        attribyuteId: attribyuteId
                    }
                })
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async deleteCategory(id: number) {
        try {
            const category = await this.prismaService.category.findFirst({
                where: {
                    id: id
                }
            })
            if (!category) return new ResponseData<any>(null, 400, "Danh mục không tồn tại")
            await this.prismaService.category.delete({
                where: {
                    id: id
                }
            })
            return new ResponseData<any>(null, 200, "Xoá thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async createAttribute(createAttributeDto: CreateAttribyutesDto) {
        try {
            const attribute = await this.prismaService.attribyutes_category.findFirst({
                where: {
                    name: CreateAttribyutesDto.name
                }
            })
            if (attribute) return new ResponseData<any>(null, 400, "Thuộc tính đã tồn tại");
            await this.prismaService.attribyutes_category.create({
                data: {
                    name: createAttributeDto.name
                }
            })
            return new ResponseData<any>(null, 200, "Tạo thuộc tính thành công")

        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateAttribyute(id: number, updateAttribyuteDto: UpdateAttribyutesDto) {
        try {
            const attribyute = await this.prismaService.attribyutes_category.findFirst({
                where: {
                    id: id
                }
            })
            if (!attribyute) return new ResponseData<any>(null, 400, "Danh mục không tồn tại")
            if (attribyute.name === updateAttribyuteDto.name) {
                return new ResponseData<any>(null, 400, "Tên danh mục đã tồn tại")
            }
            await this.prismaService.attribyutes_category.update({
                where: {
                    id: id
                }, data: {
                    name: updateAttribyuteDto.name
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async deleteAttribyute(id: number) {
        try {
            const attribyute = await this.prismaService.attribyutes_category.findFirst({
                where: {
                    id: id
                }
            })
            if (!attribyute) return new ResponseData<any>(null, 400, "Thuộc tính không tồn tại")
            await this.prismaService.attribyutes_category.delete({
                where: {
                    id: id
                }
            })
            return new ResponseData<any>(null, 200, "Xoá thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    // async createCategoryAttribute(createCategoryAttDto: CreateCategoryAttribyute) {
    //     try {
    //         const categoryAt = await this.prismaService.categoryAttribyutes.findFirst({
    //             where: {
    //                 categoryId: createCategoryAttDto.categoryId,
    //                 attribyuteId: createCategoryAttDto.attributeId
    //             }
    //         })
    //         if (categoryAt) return new ResponseData<any>(null, 200, "Tạo thuộc tính đã tồn tại trong danh mục")
    //         await this.prismaService.categoryAttribyutes.create({
    //             data: {
    //                 categoryId: createCategoryAttDto.categoryId,
    //                 attribyuteId: createCategoryAttDto.attributeId
    //             }
    //         })
    //         return new ResponseData<any>(null, 200, "Tạo thành công")
    //     } catch (error) {
    //         this.logger.error(error.message)
    //         return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    //     }
    // }
    // async deleteCateAttri(deleteCateAttriDto: DeleteCateAttriDto) {
    //     try {
    //         const exist = await this.prismaService.categoryAttribyutes.findFirst({
    //             where: {
    //                 ...deleteCateAttriDto
    //             }
    //         })
    //         if (!exist) return new ResponseData<any>(null, 400, "Không tồn tại")
    //         await this.prismaService.categoryAttribyutes.delete({
    //             where: {
    //                 categoryId_attribyuteId: {
    //                     categoryId: deleteCateAttriDto.categoryId,
    //                     attribyuteId: deleteCateAttriDto.attributeId,
    //                 }
    //             }
    //         })
    //     } catch (error) {
    //         this.logger.error(error.message)
    //         return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    //     }
    // }
}
