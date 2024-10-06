import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class WasteMaterialDto {
    @IsNumber()
    @IsNotEmpty()
    wasteNumber: number
    @IsString()
    @IsOptional()
    scrapReason: string

}