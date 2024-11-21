import { Injectable, Logger, Res } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { ResponseData } from "../global/globalClass";
import { PAGE_SIZE } from "src/global";


import * as argon2 from 'argon2';
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UpdatePasswordDto, UpdateUserDto, UpdateProfileDto, ForgotPasswordDto, VerifyCodeDto, CheckCodeDto } from "./dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()

export class UserService {

    constructor(private prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService, private readonly mailerService: MailerService) { }

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
                }
            })
            if (!user) return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            delete user.password
            delete user.updatedAt
            delete user.isDelete
            delete user.isBan
            return new ResponseData<User>(user, 200, 'Tài khoản tồn tại')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<User>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async getAllUser(option: { page: number, name: string, role?: number, isBan: boolean }) {
        let pageSize = PAGE_SIZE.PAGE_USER
        try {
            let { page,role} = option
            let where:any ={}
            if (role !== undefined) {
                where.role = Number(role) !== 0 ? Number(role) : { not: 0 };
            } else {
                where.role = { not: 0 };
            }
            const totalCount = await this.prismaService.user.count({
                where: {
                    name: {
                        contains: option.name,
                        mode: 'insensitive'
                    },
                    isDelete: false,
                    role: where.role, 
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
                    role: where.role, 
                    isBan: typeof option.isBan === 'string' ? (option.isBan === 'false' ? false : true) : option.isBan
                },
                orderBy: {
                    id: 'asc'
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId:true,
                    user_avt: true,
                    isBan: true,
                    createdAt: true,
                    Feedback: true,
                
                    role: true
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
    async getTechnical(){
        try {
            const user = await this.prismaService.user.findMany({
                where:{
                    role:2,
                    isBan:false
                },
                select:{
                    id:true,
                    name:true,
                    employeeId:true,
                    email:true
                }
            })
            if(user.length === 0){
                return new ResponseData<any>(null,501,"Không tìm thấy dữ liệu")
            }
            return new ResponseData<any>(user,200,"Tìm thấy các người dùng")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<User>(null, 500, "Lỗi dịch vụ, thử lại sau")
        }
    }
    async updateAvatar(userId: number, user_avt: Express.Multer.File){
        try {

            const user = await this.getUserById(userId)

            if (!user) {
                return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            }
            const img = await this.cloudinaryService.uploadFile(user_avt)
            await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: {
                    user_avt:img.url
                }
            })
            return new ResponseData<any>(null, 200, "Cập nhật thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateProfile(userId: number, updateProfile: UpdateProfileDto, user_avt: Express.Multer.File) {
        try {
            const data: { name?: string, user_avt?: string } = {}
            const user = await this.getUserById(userId)
            if (!user) {
                return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            }
            if (updateProfile.name) {
                data.name = updateProfile.name
            }
            if (user_avt) {
                const img = await this.cloudinaryService.uploadFile(user_avt)
                data.user_avt = img.url
               
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: data
            })
            return new ResponseData<any>(null, 200, "Cập nhật thông tin thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
        try {
            const user = await this.getUserById(id)
            if (!user) {
                return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            }
            console.log(user);
            const passwordMather = await argon2.verify(user.password, updatePasswordDto.oldPassword)
            if (!passwordMather) return new ResponseData<string>(null, 400, "Mật khẩu hiện tại không chính xác")
            const hashedPassword = await argon2.hash(updatePasswordDto.newPassword)
            await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: {
                    password: hashedPassword
                }
            }
            )
            return new ResponseData<any>(null, 200, "Cập nhật mật khẩu thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async updateUser(userId: number, updateUserDto: UpdateUserDto, user_avt: Express.Multer.File) {
        try {
            const data: { name?: string, employeeId?: string, role?: number, user_avt?: string } = {}
            const user = await this.getUserById(userId)
            if (!user) {
                return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            }
            if (updateUserDto.name) {
                data.name = updateUserDto.name
            }
            if (updateUserDto.employeeId) {
                data.employeeId = updateUserDto.employeeId
            }
            if (updateUserDto.role) {
                data.role = updateUserDto.role
            }
            if (user_avt) {
                const img = await this.cloudinaryService.uploadFile(user_avt)
                data.user_avt = img.url
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: data
            })
            return new ResponseData<any>(null, 200, "Cập nhật thông tin thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async banUser(id: number, banUserDto: BanUserDto) {
        const now = new Date()
        try {
            const user = await this.getUserById(id)
            if (!user) return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            if (user.isBan) return new ResponseData<string>(null, 400, "Tài khoản đang bị khoá")
            await this.prismaService.feedback.create({
                data: {
                    description: banUserDto.feedback,
                    userId: user.id,
                    time: banUserDto.time
                }
            })

            let lockUntil: Date = null

            if (banUserDto.time && banUserDto.time != -1) {
                lockUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000 * banUserDto.time)
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: {
                    isBan: true,
                    banUntil: lockUntil
                }
            })
            return new ResponseData<string>(null, 200, "Khoá tài khoản thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }

    }
    async unbanUser(id: number) {
        try {
            const user = await this.getUserById(id)
            if (!user) return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            if (!user.isBan) return new ResponseData<string>(null, 400, "Tài khoản không bị khoá")


            await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: {
                    isBan: false,
                    banUntil: null
                }
            })
            return new ResponseData<string>(null, 200, "Mở khoá tài khoản thành công")
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }

    }
    async getUserById(id: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })
    }
    async checkVerifyCode(checkCodeDto:CheckCodeDto) {
        const currentDate = new Date()
        try {
            const verifyCode = await this.prismaService.verifyCode.findFirst({
                where: {
                    email: checkCodeDto.email, 
                    code: checkCodeDto.code   
                }
            });
            console.log(verifyCode);
            if (!verifyCode)  return new ResponseData<string>(null, 400, "Mã xác minh không đúng");
            const createAt = new Date(verifyCode.createdAt)
            createAt.setMinutes(createAt.getMinutes() + 5)
            if (createAt <= currentDate) return new ResponseData<string>(null, 400, "Quá thời gian của mã xác minh")
            return new ResponseData<string>("Mã xác minh hợp lệ", 200, "Mã xác minh đúng");
        } catch (error) {
            this.logger.error(error.message);
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau');
        }
    }
    
    async forgotPassword(forgotPassword: ForgotPasswordDto) {
        const currentDate = new Date()
        try {
            const verifyCode = await this.prismaService.verifyCode.findFirst({
                where: {
                    email: forgotPassword.email,
                    code: forgotPassword.code
                }
            })
            if (!verifyCode) return new ResponseData<string>(null, 400, "Mã xác minh không tồn tại")
            const createAt = new Date(verifyCode.createdAt)
            createAt.setMinutes(createAt.getMinutes() + 5)
            if (createAt <= currentDate) return new ResponseData<string>(null, 400, "Quá thời gian của mã xác minh")

            const user = await this.prismaService.user.findFirst({
                where: {
                    email: forgotPassword.email
                }
            })
            if (!user) return new ResponseData<User>(null, 400, "Tài khoản không tồn tại")
            const hashedPassword = await argon2.hash(forgotPassword.newPassword)
            const newPassword = await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: {
                    password: hashedPassword
                }
            })
            if (!newPassword) {
                return new ResponseData<string>(null, 400, 'Đổi mật khẩu thất bại, thử lại')
            }
            await this.prismaService.verifyCode.deleteMany({
                where: {
                    email: user.email
                }
            })
            return new ResponseData<string>(null, 200, 'Đổi mật khẩu thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    async sendVerifyCode(verifyCodeDto: VerifyCodeDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: verifyCodeDto.email
                }
            })
            if (!user) {
                return new ResponseData<any>(null, 400, 'Tài khoản không tồn tại')
            }
            await this.prismaService.verifyCode.deleteMany({
                where: {
                    email: user.email
                }
            })
            const code = this.random6DigitNumber()
            await this.prismaService.verifyCode.create({
                data: {
                    email: user.email,
                    code: parseInt(code)
                }
            })
            await this.mailerService.sendMail({
                to: verifyCodeDto.email,
                subject: 'Mã OTP để xác nhận đổi mật khẩu tài khoản cho Ứng dụng quản lý thiết bị',
                template: './verifycode',
                context: {
                    name: user.name,
                    code: code
                }
            })
            return new ResponseData<string>(null, 200, 'Gửi mã thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
    random6DigitNumber() {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const paddedNumber = randomNumber.toString().padStart(6, '0');
        return paddedNumber;
    }
}