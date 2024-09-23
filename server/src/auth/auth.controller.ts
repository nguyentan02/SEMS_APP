import { Body, Controller, Post } from '@nestjs/common';
import { USER_TYPES } from '../global';

import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('register')
    createUser(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }
}
