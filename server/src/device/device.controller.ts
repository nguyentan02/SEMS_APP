import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DeviceService } from './device.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Roles } from 'src/auth/decoractor';
import { USER_TYPES } from '../global';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';

@Controller('device')
export class DeviceController {
    constructor(private deviceService: DeviceService) { }
    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getAllDevice(
        @Query() option: { page: number, name: string, categoryId: number }
    ) {
        return this.deviceService.getAllDevice(option)
    }

    @Get('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getDeviceById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.deviceService.getDeviceById(id)
    }

    @Post('create')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER,USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('imageDevice'))
    createDevice(
        @Body() createDeviceDto: CreateDeviceDto, @UploadedFile() imageDevice: Express.Multer.File
    ) {
        return this.deviceService.createDevice(createDeviceDto, imageDevice)
    }
    @Post('devices')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER,USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    createDevices(
      @UploadedFile() file: Express.Multer.File
    ) {
        return this.deviceService.createDevices(file)
    }
    @Patch('update/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    @UseInterceptors(FileInterceptor('imageDevice'))
    updateDevice(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDeviceDto: UpdateDeviceDto, @UploadedFile() imageDevice: Express.Multer.File
    ) {
        return this.deviceService.updateDevice(id, updateDeviceDto, imageDevice)
    }
    @Delete('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    deleteDevice(
        @Param('id', ParseIntPipe) id: number
    ) { return this.deviceService.deleteDevice(id) }
}
