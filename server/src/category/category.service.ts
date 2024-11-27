import { Injectable, Logger, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto,CreateAttributeDto,UpdateCategory } from './dto';
import { PAGE_SIZE, ResponseData } from 'src/global';
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
               include:{
                AttribyutesCategory:true,
                devices:{
                    where:{
                        isDelete:false
                    }
                }
                
                   }
            ,
                skip: next,
                take: pageSize
            })
    
            const dataWithDeviceCount = data.map(category => ({
                ...category,
                devicesCount: category.devices.length
            }));
            return new ResponseData<any>({ data: dataWithDeviceCount, totalPages, total: totalCount }, 200, "Tìm thấy các danh mục")
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
                    AttribyutesCategory:true
                }
            })
            return new ResponseData<any>(data, 200, "Trả dữ liệu thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<any>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async createCategory(createCategoryDto: CreateCategoryDto) {
        const { categoryName, description,attributes } = createCategoryDto;
        try {
            const category = await this.prismaService.category.findFirst({
                where: {
                    categoryName: categoryName
                }
            })
            if (category) return new ResponseData<any>(null, 400, "Danh mục đã tồn tại");
    

            const newCategory = await this.prismaService.category.create({
                data: {
                    categoryName,
                    description,
                    AttribyutesCategory: {
                    create: attributes.map((attr: CreateAttributeDto) => ({
                            name: attr.name,
                        })),
                    },
                },
                include: { AttribyutesCategory: true },
            });
    
            return new ResponseData<any>(newCategory, 200, "Tạo danh mục thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateCategory(id: number, updateCategoryDto: UpdateCategory) {
        const { categoryName, description, attributes } = updateCategoryDto;
        try {
            console.log(attributes);
            const category = await this.prismaService.category.findUnique({
                where: { id: id },
            });
            if (!category) return new ResponseData<any>(null, 400, "Danh mục không tồn tại");
    
            if (categoryName) {
                const duplicateCategory = await this.prismaService.category.findFirst({
                    where: { categoryName, NOT: { id: id } },
                });
                if (duplicateCategory) {
                    return new ResponseData<any>(null, 400, "Tên danh mục đã tồn tại");
                }
            }
            const updatedCategory = await this.prismaService.category.update({
                where: { id: id },
                data: { categoryName, description },
            });
    
            if (attributes) {
                const existingAttributes = await this.prismaService.attribyutesCategory.findMany({
                    where: { categoryId: id },
                });

                const existingAttributeIds = existingAttributes.map(attr => attr.id);
    
                const attributesToDelete = existingAttributes.filter(
                    attr => !attributes.some(newAttr => newAttr.id === attr.id)
                );
                await this.prismaService.attribyutesCategory.deleteMany({
                    where: { id: { in: attributesToDelete.map(attr => attr.id) } },
                });
    
                for (const attribute of attributes) {
                    if (attribute.id && existingAttributeIds.includes(attribute.id)) {
                        await this.prismaService.attribyutesCategory.update({
                            where: { id: attribute.id },
                            data: { name: attribute.name ?? existingAttributes.find(attr => attr.id === attribute.id)?.name },
                        });
                    } else if (attribute.id === null) {
                        const newAttribute = await this.prismaService.attribyutesCategory.create({
                            data: { name: attribute.name, categoryId: id },
                        });
    
                        const devices = await this.prismaService.device.findMany({
                            where: { categoryId: id },
                        });
    
                        for (const device of devices) {
                            await this.prismaService.deviceAttributeValues.create({
                                data: {
                                    deviceId: device.id,
                                    attributeId: newAttribute.id,
                                    value: "", 
                                },
                            });
                        }
                    }
                }
            }
    
            return new ResponseData<any>(updatedCategory, 200, "Cập nhật thành công và đồng bộ hóa thiết bị");
        } catch (error) {
            this.logger.error(error.message);
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau');
        }
    }
    
    
    async deleteCategory(id: number) {
        try {
            const category = await this.prismaService.category.findFirst({
                where: {
                    id: id
                },
                include:{
                    devices:true
                }
            })
            if (!category) return new ResponseData<any>(null, 400, "Danh mục không tồn tại")
                if(category.devices.length > 0 )
                    return new ResponseData<any>(null,404,"Tồn tại thiết bị không thế xoá danh mục")

            await this.prismaService.category.delete({
                where: {
                    id: id
                }
            })
            return new ResponseData<any>(null, 200, "Xoá thành công")
        } catch (error) {
        
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    // async createAttribute(createAttributeDto: CreateAttribyutesDto) {
    //     try {
    //         const attribute = await this.prismaService.attribyutes_category.findFirst({
    //             where: {
    //                 name: CreateAttribyutesDto.name
    //             }
    //         })
    //         if (attribute) return new ResponseData<any>(null, 400, "Thuộc tính đã tồn tại");
    //         await this.prismaService.attribyutes_category.create({
    //             data: {
    //                 name: createAttributeDto.name
    //             }
    //         })
    //         return new ResponseData<any>(null, 200, "Tạo thuộc tính thành công")

    //     } catch (error) {
    //         this.logger.error(error.message)
    //         return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    //     }
    // }
    // async updateAttribyute(id: number, updateAttribyuteDto: UpdateAttribyutesDto) {
    //     try {
    //         const attribyute = await this.prismaService.attribyutes_category.findFirst({
    //             where: {
    //                 id: id
    //             }
    //         })
    //         if (!attribyute) return new ResponseData<any>(null, 400, "Danh mục không tồn tại")
    //         if (attribyute.name === updateAttribyuteDto.name) {
    //             return new ResponseData<any>(null, 400, "Tên danh mục đã tồn tại")
    //         }
    //         await this.prismaService.attribyutes_category.update({
    //             where: {
    //                 id: id
    //             }, data: {
    //                 name: updateAttribyuteDto.name
    //             }
    //         })
    //         return new ResponseData<any>(null, 200, "Cập nhật thành công")
    //     } catch (error) {
    //         this.logger.error(error.message)
    //         return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    //     }
    // }
    // async deleteAttribyute(id: number) {
    //     try {
    //         const attribyute = await this.prismaService.attribyutes_category.findFirst({
    //             where: {
    //                 id: id
    //             }
    //         })
    //         if (!attribyute) return new ResponseData<any>(null, 400, "Thuộc tính không tồn tại")
    //         await this.prismaService.attribyutes_category.delete({
    //             where: {
    //                 id: id
    //             }
    //         })
    //         return new ResponseData<any>(null, 200, "Xoá thành công")
    //     } catch (error) {
    //         this.logger.error(error.message)
    //         return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    //     }
    // }
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
