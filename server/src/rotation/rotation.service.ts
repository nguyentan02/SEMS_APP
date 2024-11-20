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
            const {deviceId,newLocationId,reason} = createRotationDto
            console.log(createRotationDto);
            const devices = await this.prismaService.device.findMany({
                where: { id: { in: deviceId } },
            });
                const existingDeviceIds = devices.map((d) => d.id);
            const nonExistingDevices = deviceId.filter((id) => !existingDeviceIds.includes(id));
            if (nonExistingDevices.length > 0) {
                throw new Error(`Thiết bị không tồn tại: ${nonExistingDevices.join(", ")}`);
            }
           const existingRoom = await this.prismaService.room.findUnique({
            where:{
                id:newLocationId
            }
           })
           if(!existingRoom) return new ResponseData<any>(null, 400, "Phòng mới không tồn tại");
            const devicesAtNewLocation = devices.filter((d) => d.roomId === newLocationId);
            if (devicesAtNewLocation.length > 0) {
                const deviceNames = devicesAtNewLocation.map((d) => d.name || d.id).join(", ");
                return new ResponseData<any>(null, 401, `Thiết bị ${deviceNames} đã ở phòng này`);
            }
            await this.prismaService.$transaction([
                this.prismaService.rotationDevice.createMany({
                    data: devices.map((device) => ({
                        deviceId: device.id,
                        oldLocationId: device.roomId,
                        newLocationId: newLocationId,
                        reason: reason,
                    
                    })),
                }),
            
                this.prismaService.device.updateMany({
                    where: { id: { in: deviceId } },
                    data: { roomId: newLocationId },
                }),
            
                this.prismaService.usageInformation.updateMany({
                    where: { deviceId: { in: deviceId }, isDeleted: false },
                    data: { roomId: newLocationId },
                }),
            ]);
    
            return new ResponseData<any>(null, 200, "Luân chuyển thiết bị thành công");
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
