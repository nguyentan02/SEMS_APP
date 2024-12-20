import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateDeparmentDto, CreateRoomDto, UpdateDeparmentDto, UpdateRoomDto } from './dto';
import { USER_TYPES } from '../global';
import { Roles } from '../auth/decoractor';
import { MyJWTGuard, RolesGuard } from '../auth/guard';

@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService) { }

    @Get()
    get(@Query() option: { page: number, key: string }) {
        return this.locationService.get(option)
    }
 
    @Get('/usage')
    getUsageInfo() {
        return this.locationService.getUsageInfo()
    }
    @Get('/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.locationService.getLocationById(id)
    }
    @Post('cre-department')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    createDeparment(
        @Body() createDeparmentDto: CreateDeparmentDto

    ) {
        return this.locationService.createDeparment(createDeparmentDto)
    }

    @Patch('up-department/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    updateDeparment(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDeparment: UpdateDeparmentDto

    ) {
        return this.locationService.updateDeparment(id, updateDeparment)
    }
    @Delete('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    deleteDepartment(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.locationService.deleteDeparment(id)
    }
    @Delete('/room/:id')
async removeRoom(@Param('id') id: number) {
    return await this.locationService.deleteRoom(id);
}
}
