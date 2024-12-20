import { Body, Controller, Delete, flatten, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DeviceService } from './device.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Roles } from 'src/auth/decoractor';
import { USER_TYPES } from '../global';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';
import type { Response } from 'express'

@Controller('device')
export class DeviceController {
    constructor(private deviceService: DeviceService) { }
    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getAllDevice(
        @Query() option: { page: number, key: string, categoryId: number , groupByCategory?: boolean, sortByDate?: 'asc' | 'desc' }
    ) {
        return this.deviceService.getAllDevice(option)
    }
    @Get('/byUsage')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getAllDeviceByUsage(
  
    ) {
        return this.deviceService.getAllDeviceByUsage()
    }
    @Get('/byMaintenance')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getDeviceByMaintenance(
  
    ) {
        return this.deviceService.getAllDeviceByMaintenance()
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
    @Roles(USER_TYPES.ADMIN,USER_TYPES.USER)
    deleteDevice(
        @Param('id', ParseIntPipe) id: number
    ) { return this.deviceService.deleteDevice(id) }


    

}
