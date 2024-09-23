import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseData } from 'src/global';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) { }
    private readonly logger = new Logger(AuthService.name);


    async register(registerDto: RegisterDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    OR: [
                        {
                            email: registerDto.email
                        },
                        { employeeId: registerDto.employeeId.toLowerCase() }
                    ]
                }
            })
            if (user) {
                return new ResponseData<User>(null, 400, "Email hoặc Mã nhân viên đã được sử dụng")
            }
            const hashPassword = await argon2.hash(registerDto.password)
            const newAccount = await this.prismaService.user.create({
                data: {
                    employeeId: registerDto.employeeId.toLowerCase(),
                    email: registerDto.email,
                    name: registerDto.name,
                    password: hashPassword,
                    role: registerDto?.role
                }
            })
            delete newAccount.password
            delete newAccount.id
            const data = { ...newAccount }
            return new ResponseData<any>(data, 200, "Tạo tài khoản thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }


}
