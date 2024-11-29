import { Injectable, Logger } from '@nestjs/common';
import { Workbook } from 'exceljs';
import moment from 'moment-timezone';
import { join } from 'path';
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
                    updatedAt: {
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
    async getChart(option: { type: string, month: string, year: string, to: string, from: string }) {
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
          const countType = await this.prismaService.device.groupBy({
              by: ['expired'],
              _count: true,
              where: {
                isDelete:false,
                  updatedAt: {
                      gte: start,
                      lte: end
                  },
                 
              }
          })
          const countCategory = await this.prismaService.device.groupBy({
              by: ['categoryId'],
              _count: true,
              orderBy:{
                  categoryId:'asc'
              },
              where: {
                isDelete:false, 
                  updatedAt: {
                      gte: start,
                      lte: end
                  },
                 
              }
          })
          
          const departments = await this.prismaService.deparment.findMany({
            include: {
              rooms: {
                include: {
                  _count: {
                    select: { Device:true }, 
                  },
                },
              },
            },
            where:{
              rooms:{
                some:{
                  Device:{
                    some:{
                      updatedAt:{
                        gte:start,
                        lte:end
                      }
                    }
                  }
                }
              }
            }
          });
          
            const location = departments.map((department) => ({
              deparmentName: department.deparmentName,
              symbol: department.symbol,
              totalDevices: department.rooms.reduce(
                (sum, room) => sum + room._count.Device, 
                0
              ),
            }));
         
          return new ResponseData<any>({ countType,countCategory,location  }, 200, 'Thống kê')
      } catch (error) {
          this.logger.error(error.message)
          return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
      }
  }

    async downloadExcel() {
        try {
          const devices = await this.prismaService.device.findMany({
            where: {
              isDelete: false
            },
            include: {
              category: true,
              room: {
                include:{
                    deparment:{
                        select:{
                            deparmentName:true
                        }
                    }
                }
              },
            }
          });
    
          let rows: any[] = [];
          devices.forEach((device, index) => {
            rows.push([
              index + 1,   // STT
              device.name, // Tên thiết bị
              device.serialNumber, // Số serial
              device.manufacturer, // Nhà sản xuất
              device.purchaseDate, // Ngày mua
              device.expirationDate, // Ngày hết hạn
              device.price, // Giá
              device.category.categoryName, // Danh mục
              device.room?.roomName || "Trống", // Phòng (nếu có)
              device.room?.deparment.deparmentName || "Trống", // Phòng (nếu có)
              device.statusDevice, // Trạng thái thiết bị
              device.expired ? 'Đã hết hạn' : 'Chưa hết hạn' // Hết hạn
            ]);
          });
    
          let book = new Workbook();
            let sheet = book.addWorksheet(`DanhSach-Thiết bị`)
        
          sheet.getCell('A1').value = 'DANH SÁCH CÁC THIẾT BỊ';
          sheet.getCell('A1').font = { size: 16, bold: true };
          sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
          sheet.mergeCells('A1:G1');
    
          // Thêm tên các cột
          rows.unshift(['STT', 'Tên thiết bị', 'Số serial', 'Nhà sản xuất', 'Ngày mua', 'Ngày hết hạn', 'Giá', 'Danh mục', 'Phòng', 'Khoa','Trạng thái', 'Hết hạn']);
          sheet.addRows(rows);
          sheet.getColumn(1).width = 5;
          sheet.getColumn(2).width = 20;
          sheet.getColumn(3).width = 15;
          sheet.getColumn(4).width = 20;
          sheet.getColumn(5).width = 15;
          sheet.getColumn(6).width = 15;
          sheet.getColumn(7).width = 10;
          sheet.getColumn(8).width = 20;
          sheet.getColumn(9).width = 25;
          sheet.getColumn(10).width = 25;
          sheet.getColumn(11).width = 25;

          for (let i = 0; i < 12; i++) {
            let cell = sheet.getCell(2, i + 1);
            cell.font = { size: 12, bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
          return { data: book };
        } catch (error) {
          this.logger.error(error.message);
          throw new Error('Lỗi dịch vụ');
        }
      }
}
