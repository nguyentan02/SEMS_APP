import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { MyJWTGuard, RolesGuard } from "../auth/guard";
import { Roles, GetUser } from "../auth/decoractor";
import { USER_TYPES } from "../global";
import { FileInterceptor } from "@nestjs/platform-express";
import { ForgotPasswordDto, UpdatePasswordDto, UpdateProfileDto, UpdateUserDto, VerifyCodeDto, } from "./dto";
import { number } from "joi";
import { User } from "@prisma/client";
import { BanUserDto } from "./dto/ban-user.dto";

@Controller('user')

export class UserController {
    constructor(private userService: UserService) { }

    @Get('profile/:id')
    getProfile(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getProfileUser(id)
    }
    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    getAllUser(@Query() option: { page: number, name: string, role: number, isBan: boolean }) {
        return this.userService.getAllUser(option)
    }
    @Patch('update-profile/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN, USER_TYPES.USER, USER_TYPES.TECHNICAL, USER_TYPES.WAREHOUSE)
    @UseInterceptors(FileInterceptor('user_avt'))
    updateProfile(@Param('id', ParseIntPipe) id: number, @Body() updateProfile: UpdateProfileDto, @UploadedFile() user_avt: Express.Multer.File) {
        return this.userService.updateProfile(id, updateProfile, user_avt)
    }
    @Patch('update-user/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('user_avt'))
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() user_avt: Express.Multer.File) {
        return this.userService.updateUser(id, updateUserDto, user_avt)
    }

    @Patch('update-password/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN, USER_TYPES.USER, USER_TYPES.TECHNICAL, USER_TYPES.WAREHOUSE)
    updatePassword(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        @Body() updatePasswordDto: UpdatePasswordDto
    ) {
        if (user.role
            != USER_TYPES.ADMIN)
            return this.userService.updatePassword(user.id, updatePasswordDto)
        return this.userService.updatePassword(id, updatePasswordDto)
    }
    @Patch('un-ban/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    unbanUser(
        @Param('id', ParseIntPipe) id: number
    ) { return this.userService.unbanUser(id) }

    @Patch('ban/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    banUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() banUserDto: BanUserDto
    ) { return this.userService.banUser(id, banUserDto) }

    @Patch('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.userService.forgotPassword(forgotPasswordDto)
    }
    @Post('send-verify-code')
    sendVerifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        return this.userService.sendVerifyCode(verifyCodeDto)
    }
}