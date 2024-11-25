import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/auth/decoractor';
import { USER_TYPES } from 'src/global';
import { MyJWTGuard, RolesGuard } from 'src/auth/guard';

@Controller('dashboard')
@UseGuards(MyJWTGuard, RolesGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }
    @Get('statistical')
    @Roles(USER_TYPES.ADMIN)
    getStatistical(@Query() option: { type: string, month: string, year: string, to: string, from: string }) {
        return this.dashboardService.getStatistical(option)
    }
}
