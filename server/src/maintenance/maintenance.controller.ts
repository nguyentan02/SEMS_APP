import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { USER_TYPES } from '../global';
import { GetUser, Roles } from '../auth/decoractor';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { CreateMaintenancePlanDto, UpdateMaintenanceDto } from './dto';
import { StatusMaintenance } from '@prisma/client';
@Controller('maintenance')
export class MaintenanceController {

    constructor(private maintenanceService: MaintenanceService) { }
    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getMaintenance(@Query()option:{key?:string,status?:string,groupByUser?: boolean; groupByStatus?: boolean }) {
        return this.maintenanceService.getMaintenance(option)
    }
    @Get('/byTech')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.TECHNICAL)
    getMaintenanceByTech(@Query()option:{key?:string,status?:string},   @GetUser() user: { id: number; role: number },) {
        return this.maintenanceService.getMaintenanceByUser(option,user)
    }
    @Get('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER,USER_TYPES.TECHNICAL)
    getMaintenanceById(  @Param('id', ParseIntPipe) id: number, ) {
        return this.maintenanceService.getMaintenanceById(id)
    }
    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    createMaitenance(
        @Body() createMaintenancePlanDto: CreateMaintenancePlanDto
    ) {
        return this.maintenanceService.createMaintenance(createMaintenancePlanDto)
    }
    @Patch('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER,)
    UpdateMaintenance(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMaintenanceDto: UpdateMaintenanceDto
    ) {
        return this.maintenanceService.updateMaintenance(id,updateMaintenanceDto)
    }
    @Patch('/status/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER,USER_TYPES.TECHNICAL)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { status: string }
    ) {
        return this.maintenanceService.updateStatus(id,body.status)
    }
    @Delete('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    deleteMaintenance(
        @Param('id', ParseIntPipe) id: number,
   
    ) {
        return this.maintenanceService.deleteMaintenance(id)
    }
    @Patch('/send/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    sendMaintenace(
        @Param('id', ParseIntPipe) id: number,
   
    ) {
        return this.maintenanceService.sendMaintenance(id)
    }
    @Patch('/res/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    resMainance(
        @Param('id', ParseIntPipe) id: number,
   
    ) {
        return this.maintenanceService.resfreshMaintenance(id)
    }
}
 

