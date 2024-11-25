import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsageService } from './usage.service';
import { MyJWTGuard,RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decoractor';
import { USER_TYPES } from 'src/global';
import { CreateUsageDto } from './dto';
import { UpdateUsageDto } from './dto/update.dto';

@Controller('usage')
export class UsageController {
    constructor(private usageService: UsageService) { }
    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getAllUsage(
        @Query() option: { page: number, nameDevice: string, startDate: string, endDate: string, departmentId: number, roomId: number }
    ) {
        return this.usageService.getAllUsage(option)
    }
    @Get('/room/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getUsageByIdRoom(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usageService.getUsageByIdRoom(id)
    }
    @Get('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getUsageById(
        @Param('id', ParseIntPipe) id: number
       
    ) {
        return this.usageService.getUsageById(id)
    }
    @Post('create')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    createUsage(
        @Body() createUsageDto: CreateUsageDto
    ) {
        return this.usageService.createUsage(createUsageDto)
    }
    @Patch('update/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    updateUsage(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUsageDto: UpdateUsageDto
    ) {
        return this.usageService.updateUsage(id, updateUsageDto)
    }

    @Delete('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    deleteUsage(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usageService.deleteUsage(id)
    }
}
