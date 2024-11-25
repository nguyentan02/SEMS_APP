import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment-timezone';
import { ResponseData } from 'src/global';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {

    constructor(private readonly prismaService:PrismaService){}
    private readonly logger = new Logger(DashboardService.name)

    async getStatistical(option: { type: string, month: string, year: string, to: string, from: string }) {
        let start: any
        let end: any
        try {
            const { type, month, year, to, from } = option
            switch (type) {
                case 'month':
                    start = new Date(Number(year), Number(month) - 1, 1)
                    end = new Date(Number(year), Number(month), 0);
                    break;
                case 'year':
                    start = new Date(Number(year), 0, 1)
                    end = new Date(Number(year), 12, 0)
                    break;
                case 'any':
                    const startDate = moment.tz(to, 'Asia/Ho_Chi_Minh');
                    const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh').endOf('day');
                    start = new Date(startDate.clone().utc().format())
                    end = new Date(endDate.clone().utc().format())
                    break;
            }
            const user = await this.prismaService.user.count({
                where: {
                    role: {
                        not: 0
                    },
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                }
            })
            const device = await this.prismaService.device.count({
                where: {
                    isDelete:false,
                    expirationDate: {
                        gte: start,
                        lte: end
                    }
                }
            })

            return new ResponseData<any>({ user, device }, 200, 'Thống kê thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

}
