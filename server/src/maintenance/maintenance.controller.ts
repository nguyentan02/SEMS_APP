import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MyJWTGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decoractor';
import { USER_TYPES } from 'src/global';
import { JwtStrategy } from 'src/auth/strategy';
import { CreateMaintenancePlanDto } from './dto';
@Controller('maintenance')
export class MaintenanceController {

    constructor(private maintenanceService: MaintenanceService) { }

    @Post()
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.USER)
    createStorage(
        @Body() createMaintenancePlanDto: CreateMaintenancePlanDto
    ) {
        return this.maintenanceService.createMaintenance(createMaintenancePlanDto)
    }
}
