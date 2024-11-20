import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RotationService } from './rotation.service';
import { CreateRotationDto } from './dto';
import { USER_TYPES } from '../global';
import { Roles } from '../auth/decoractor';
import { JwtStrategy } from '../auth/strategy';
import { MyJWTGuard } from '../auth/guard';

@Controller('rotation')
export class RotationController {
    constructor(private rotationService: RotationService) { }
    @Get()
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    getRotation() {
        return this.rotationService.getRotationHistory()
    }
    @Post()
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    rotationDevice(
        @Body() createRotationDto: CreateRotationDto
    ) {
        return this.rotationService.rotationDevice(createRotationDto)
    }
    
}
