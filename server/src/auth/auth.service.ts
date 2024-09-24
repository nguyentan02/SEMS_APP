import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { ResponseData } from 'src/global';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {


    constructor(private readonly prismaService: PrismaService, private jwtService: JwtService, private configService: ConfigService) { }
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
                    role: registerDto.role
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

    async login(loginDto: LoginDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: loginDto.email,
                    isDelete: false
                }
            })
            if (!user) return new ResponseData<string>(null, 400, "Tài khoản không tồn tại")
            const passwordMathed = await argon2.verify(user.password, loginDto.password)
            if (!passwordMathed) return new ResponseData<string>(null, 400, "Mật khẩu không chính xác")

            if (user.isBan) return new ResponseData<string>(null, 400, "Tài khoản đã bị khoá")
            const data = await this.signJwtToken(user.id, user.email)
            return new ResponseData<any>(data, 400, "Đăng nhập thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async signJwtToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email: email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '24h',
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: jwtString
        }
    }
}
