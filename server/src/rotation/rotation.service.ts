import { Injectable, Logger, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRotationDto } from './dto';
import { ResponseData } from '../global';

@Injectable()
export class RotationService {
    constructor(private readonly prismaService: PrismaService) {
    }
    private readonly logger = new Logger(RotationService.name)
    async rotationDevice(createRotationDto: CreateRotationDto) {
        try {
            const device = await this.prismaService.device.findUnique({
                where: { id: createRotationDto.deviceId },
            });

            if (!device) {
                throw new Error('Thiết bị không tồn tại');
            }
            if (device && device.roomId === createRotationDto.newLocationId) {
                return new ResponseData<any>(null, 400, 'Thiết bị đang ở phòng này')
            }
            await this.prismaService.rotationDevice.create({
                data: {
                    deviceId: createRotationDto.deviceId,
                    oldLocationId: device.roomId,
                    newLocationId: createRotationDto.newLocationId,
                    reason: createRotationDto.reason,
                    transferDate: new Date()
                }
            })
            await this.prismaService.device.update({
                where: {
                    id: createRotationDto.deviceId
                },
                data: {
                    roomId: createRotationDto.newLocationId
                }
            })
            await this.prismaService.usageInformation.updateMany({
                where: {
                    deviceId: createRotationDto.deviceId,
                    isDeleted: false
                },
                data: {
                    roomId: createRotationDto.newLocationId
                }
            })
            return new ResponseData<any>(null, 200, "Luân chuyển thiết bị thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async getRotationHistory() {
        try {
            const history = await this.prismaService.rotationDevice.findMany({
                // where: { deviceId: deviceId },
                include: {
                    OldRoom: {
                        select: {
                            roomName: true,
                        },
                    },
                    NewRoom: {
                        select: {
                            roomName: true,
                        },
                    },
                    Device: {
                        select: {
                            name: true,
                            room: true
                        },
                    },
                },
            });
            const groupedHistory = history.reduce((acc, current) => {
                const existingGroup = acc.find(item => item.deviceId === current.deviceId);

                if (existingGroup) {

                    existingGroup.rotations.push(current);
                } else {
                    acc.push({
                        deviceId: current.deviceId,
                        rotations: [current],
                        deviceName: current.Device.name,
                        room: current.Device.room
                    });
                }
                return acc;
            }, []);

            return groupedHistory;
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
