import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateCategoryMaterialDto {
    @IsString()
    @IsNotEmpty()
    name: string
}
export class UpdateMaterialDto {
    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    note: string

    @IsNumber()
    @IsOptional()
    categoryId: number
}