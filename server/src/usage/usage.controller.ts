import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsageService } from './usage.service';
import { MyJWTGuard } from '../auth/guard';
import { JwtStrategy } from '../auth/strategy';
import { Roles } from '../auth/decoractor';
import { USER_TYPES } from 'src/global';
import { CreateUsageDto } from './dto';
import { UpdateUsageDto } from './dto/update.dto';

@Controller('usage')
export class UsageController {
    constructor(private usageService: UsageService) { }
    @Get()
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    getAllUsage(
        @Query() option: { page: number, nameDevice: string, startDate: string, endDate: string, departmentId: number, roomId: number }
    ) {
        return this.usageService.getAllUsage(option)
    }
    @Get('/:id')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    getUsageById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usageService.getUsageById(id)
    }
    @Post('create')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    createUsage(
        @Body() createUsageDto: CreateUsageDto
    ) {
        return this.usageService.createUsage(createUsageDto)
    }
    @Patch('update/:id')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    updateUsage(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUsageDto: UpdateUsageDto
    ) {
        return this.usageService.updateUsage(id, updateUsageDto)
    }

    @Delete('/:id')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    deleteUsage(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usageService.deleteUsage(id)
    }
}
