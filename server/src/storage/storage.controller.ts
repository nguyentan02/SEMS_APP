import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { MyJWTGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decoractor';
import { USER_TYPES } from 'src/global';
import { JwtStrategy } from 'src/auth/strategy';
import { CreateStorageDto } from './dto/create.dto';
import { UpdateStorageDto } from './dto/update.dto';

@Controller('storage')
export class StorageController {
    constructor(private storageService: StorageService) { }


    @Post()
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    createStorage(
        @Body() createStorageDto: CreateStorageDto
    ) {
        return this.storageService.createStorage(createStorageDto)
    }
    @Patch('/:id')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    updateStorage(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStorageDto: UpdateStorageDto
    ) {
        return this.storageService.updateStatus(id, updateStorageDto)
    }
}
