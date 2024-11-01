import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { USER_TYPES } from '../global';
import {  CreateCategoryDto, UpdateCategory } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decoractor';


@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }
    @Get()
    getAllCategory(@Query() option: { page: number, name: string }) {
        return this.categoryService.getCategory(option)
    }

    @Get('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    getCategoryById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getCategoryById(id)
    }
    @Post('create-category')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto)
    }
    // @Post('create-attribyute')
    // @UseGuards(MyJWTGuard, RolesGuard)
    // @Roles(USER_TYPES.ADMIN)
    // createAttribyute(@Body() createAttribyuteDto: CreateAttribyutesDto) {
    //     return this.categoryService.createAttribute(createAttribyuteDto)
    // }
    // @Post('add-attribyute')
    // @UseGuards(MyJWTGuard, RolesGuard)
    // @Roles(USER_TYPES.ADMIN)
    // createCategoryAtt(@Body() createCategoryAttDto: CreateCategoryAttribyute) {
    //     return this.categoryService.createCategoryAttribute(createCategoryAttDto)
    // }

    @Patch('update/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    updateCategory(
        @Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategory
    ) {
        return this.categoryService.updateCategory(id, updateCategoryDto)
    }
    @Delete('/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    deleteCategory(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categoryService.deleteCategory(id)
    }
    // @Patch('update-attri/:id')
    // @UseGuards(MyJWTGuard, RolesGuard)
    // @Roles(USER_TYPES.ADMIN)
    // updateAttribyute(
    //     @Param('id', ParseIntPipe) id: number, @Body() updateAttribyuteDto: UpdateAttribyutesDto
    // ) {
    //     return this.categoryService.updateAttribyute(id, updateAttribyuteDto)
    // }
    // @Delete('attribyute/:id')
    // @UseGuards(MyJWTGuard, RolesGuard)
    // @Roles(USER_TYPES.ADMIN)
    // deleteAttri(
    //     @Param('id', ParseIntPipe) id: number,
    // ) {
    //     return this.categoryService.deleteAttribyute(id)
    // }

}

