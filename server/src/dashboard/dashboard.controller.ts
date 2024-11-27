import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/auth/decoractor';
import { USER_TYPES } from 'src/global';
import { MyJWTGuard, RolesGuard } from 'src/auth/guard';
import type { Response } from 'express'

@Controller('dashboard')
@UseGuards(MyJWTGuard, RolesGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }
    @Get('statistical')
    @Roles(USER_TYPES.ADMIN)
    getStatistical(@Query() option: { type: string, month: string, year: string, to: string, from: string }) {
        return this.dashboardService.getStatistical(option)
    }
    @Get('export-device') 
    async downloadExcel(@Res() res: Response,) {
        const { data } = await this.dashboardService.downloadExcel()
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", "attachment; filename=" + `Danh sach d.xlsx`)
        return data.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }

}
