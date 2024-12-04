import { Body, Controller, Post,UseGuards } from '@nestjs/common';
import { USER_TYPES } from '../global';
import { MyJWTGuard, RolesGuard } from "../auth/guard";
import { Roles, GetUser } from "../auth/decoractor";
import { RegisterDto, LoginDto } from './dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('register')

    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }
}
