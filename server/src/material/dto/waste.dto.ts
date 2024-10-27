import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class WasteMaterialDto {
    @IsNumber()
    @IsNotEmpty()
    materialId: number
    @IsNumber()
    @IsNotEmpty()
    wasteNumber: number
    @IsString()
    @IsOptional()
    scrapReason: string

}

export class UPWasteMaterialDto {
    @IsNumber()
    @IsOptional()
    materialId: number
    @IsNumber()
    @IsOptional()
    wasteNumber: number
    @IsDateString()
    @IsOptional()
    createdAt: string

}
export class ActualQuantityDto {
    @IsNumber()
    @IsNotEmpty()
    materialId: number
    @IsNumber()
    @IsNotEmpty()
    userId: number
    @IsNumber()
    @IsNotEmpty()
    quantity: number
}