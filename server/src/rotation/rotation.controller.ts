import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RotationService } from './rotation.service';
import { CreateRotationDto } from './dto';
import { USER_TYPES } from '../global';
import { Roles } from '../auth/decoractor';
import { MyJWTGuard,RolesGuard } from '../auth/guard';

@Controller('rotation')
export class RotationController {
    constructor(private rotationService: RotationService) { }
    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    getRotation() {
        return this.rotationService.getRotationHistory()
    }
    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER)
    rotationDevice(
        @Body() createRotationDto: CreateRotationDto
    ) {
        return this.rotationService.rotationDevice(createRotationDto)
    }
    
}
