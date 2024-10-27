import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MyJWTGuard } from '../auth/guard';
import { JwtStrategy } from '../auth/strategy';
import { Roles } from '../auth/decoractor';
import { USER_TYPES } from '../global';
import { ActualQuantityDto, CreateCategoryMaterialDto, CreateMaterialDto, UpdateCategoryMaterialDto, UpdateMaterialDto, WasteMaterialDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('material')
export class MaterialController {
    constructor(private materialService: MaterialService) { }

    @Get()
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    getAllUsage(
        @Query() option: { page: number, name: string, categoryId: number }
    ) {
        return this.materialService.getAllMaterial(option)
    }
    @Get('/:id')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    getAllMaterialById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.materialService.getAllMaterialById(id)
    }

    @Post('ct-material')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    createCateMaterial(
        @Body() createCategoryMaterialDto: CreateCategoryMaterialDto,

    ) {
        return this.materialService.createCategoryMaterial(createCategoryMaterialDto)
    }
    @Patch('up-material/:id')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    updateCateMaterial(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryMaterialDto: UpdateCategoryMaterialDto,

    ) {
        return this.materialService.updateCategoryMaterial(id, updateCategoryMaterialDto)
    }
    @Post()
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    createMaterial(
        @Body() createMaterialDto: CreateMaterialDto,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.materialService.createMaterial(createMaterialDto, image)
    }

    @Patch('/:id')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    updateMaterial(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMaterialDto: UpdateMaterialDto,
        @UploadedFile() image: Express.Multer.File

    ) {
        return this.materialService.updateMaterial(id, updateMaterialDto, image)
    }
    @Post('waste')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    wasteMaterial(
        @Body() wasteMaterialDto: WasteMaterialDto

    ) {
        return this.materialService.waste(wasteMaterialDto)
    }
    @Post('actual')
    @UseGuards(MyJWTGuard, JwtStrategy)
    @Roles(USER_TYPES.ADMIN)
    actualQuantity(
        @Body() actualQuantityDto: ActualQuantityDto

    ) {
        return this.materialService.actualQuantity(actualQuantityDto)
    }
}
