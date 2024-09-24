import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { ResponseData } from "../global/globalClass";
import { PAGE_SIZE } from "src/global";
import { not, number } from "joi";

@Injectable()

export class UserService {

    constructor(private prismaService: PrismaService) { }

    private readonly logger = new Logger(UserService.name);

    async getUser(user: User) {
        try {
            return new ResponseData<User>(user, 200, 'Tài khoản tồn tại')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getProfileUser(id: number) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: id
                },
                include: {
                    Postion: true
                }
            })
            if (!user) return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            delete user.password
            delete user.role
            delete user.updatedAt
            delete user.isDelete
            delete user.isBan
            return new ResponseData<User>(user, 200, 'Tài khoản tồn tại')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<User>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async getAllUser(option: { page: number, name: string, role: number, isBan: boolean }) {
        let pageSize = PAGE_SIZE.PAGE_USER
        try {
            let { page } = option
            const totalCount = await this.prismaService.user.count({
                where: {
                    name: {
                        contains: option.name,
                        mode: 'insensitive'
                    },
                    isDelete: false,
                    role: {
                        not: 0
                    },
                    isBan: typeof option.isBan === 'string' ? (option.isBan === 'false' ? false : true) : option.isBan
                }
            })
            const totalPages = totalCount == 0 ? 1 : Math.ceil(totalCount / pageSize)
            if (!page || page < 1) page = 1
            if (page > totalPages) page = totalPages
            let next = (page - 1) * pageSize
            const data = await this.prismaService.user.findMany({
                where: {
                    name: {
                        contains: option.name,
                        mode: 'insensitive'
                    },
                    isDelete: false,
                    role: {
                        not: 0
                    },
                    isBan: typeof option.isBan === 'string' ? (option.isBan === 'false' ? false : true) : option.isBan
                },
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data: data, totalPages, total: totalCount }, 200, "Tìm thấy các người dùng")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<User>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
}