import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { MyJWTGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decoractor';
import { USER_TYPES } from 'src/global';

@Controller('history')
@UseGuards(MyJWTGuard, RolesGuard)
@Roles(USER_TYPES.USER)
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }
    

    @Get('maintenance')
    getHistoryMaintenance(@Query() option:{key:string}){
        return this.historyService.getMaintenanceHistory(option)
    }
    @Get('rotation')
    getRotationHistory(@Query() option:{key:string}){
        return this.historyService.getRotationHistory(option)
    }
}
    
