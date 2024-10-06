import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStorageDto } from './dto/create.dto';
import { randomBytes } from 'crypto';
import { ResponseData } from '../global';
import { UpdateStorageDto } from './dto/update.dto';

@Injectable()
export class StorageService {
    constructor(private readonly prismaService: PrismaService) { }
    private readonly logger = new Logger(StorageService.name)
    async createStorage(createStorageDto: CreateStorageDto) {
        try {
            const totalAmount = createStorageDto.orderItems.reduce((total, item) => {
                return total + item.quantity * item.price;
            }, 0)
            const orderCode = this.generateOrderCode()

            let orderEnd = createStorageDto.orderDateEnd ? new Date(createStorageDto.orderDateEnd) : null
            const newOrder = await this.prismaService.order.create({
                data: {
                    source: createStorageDto.source,
                    notes: createStorageDto.notes,
                    activityType: createStorageDto.activityType,
                    orderDate: new Date(),
                    orderDateEnd: orderEnd,
                    orderStatus: createStorageDto.orderStatus,
                    orderCode: orderCode,
                    totalAmount: totalAmount,
                    orderItems: {
                        create: createStorageDto.orderItems.map(item => ({
                            materialId: item.materialId,
                            quantity: item.quantity,
                            price: item.price,
                            totalPrice: item.quantity * item.price
                        }))
                    }
                }
            })
            return new ResponseData<any>(newOrder, 200, "Tìm thấy thiết bị")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    private generateOrderCode(): string {
        const randomSuffix = randomBytes(2).toString('hex').toUpperCase();
        return `ORD-${randomSuffix}`;
    }
    async updateStatus(id: number, updateStorage: UpdateStorageDto) {
        try {
            const order = await this.prismaService.order.findUnique({
                where: {
                    id: id
                },
                include: {
                    orderItems: true
                }
            })
            if (!order) return new ResponseData<any>(null, 400, "Đơn hàng không tồn tại")
            if (updateStorage.orderStatus == 'CANCELLED') {
                await this.prismaService.order.update({
                    where: {
                        id: id
                    },
                    data: {
                        orderStatus: updateStorage.orderStatus
                    }
                })
            }
            if (updateStorage.orderStatus == 'COMPLETED') {
                await this.prismaService.order.update({
                    where: {
                        id: id
                    },
                    data: {
                        orderStatus: updateStorage.orderStatus,
                        orderDateEnd: new Date()
                    }
                })
                if (order.activityType == 'IN') {
                    for (const orderItem of order.orderItems) {
                        await this.prismaService.material.update({
                            where: { id: orderItem.materialId },
                            data: {
                                quantity: {
                                    increment: orderItem.quantity
                                }
                            }
                        });
                    }
                } else {
                    for (const orderItem of order.orderItems) {
                        await this.prismaService.material.update({
                            where: { id: orderItem.materialId },
                            data: {
                                quantity: {
                                    decrement: orderItem.quantity
                                }
                            }
                        });
                    }
                }
            }
            return new ResponseData<any>(null, 200, "Cập nhật trạng thái đơn hàng thành công");
        } catch (error) {
            this.logger.error(error.message);
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau');
        }
    }

}
