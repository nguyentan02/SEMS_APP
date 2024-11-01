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

    // @Post('cre-room')
    // @UseGuards(MyJWTGuard, RolesGuard)
    // @Roles(USER_TYPES.ADMIN)
    // createRoom(
    //     @Body() createRoomDto: CreateRoomDto

    // ) {
    //     return this.locationService.createRoom(createRoomDto)
    // }

    @Post('up-room/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    updateRoom(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoomDto: UpdateRoomDto

    ) {
        return this.locationService.updateRoom(id, updateRoomDto)
    }
}
