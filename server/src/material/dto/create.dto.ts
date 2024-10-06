import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateCategoryMaterialDto {
    @IsString()
    @IsNotEmpty()
    name: string
}
export class CreateMaterialDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    note: string

    @IsNumber()
    @IsNotEmpty()
    categoryId: number
}