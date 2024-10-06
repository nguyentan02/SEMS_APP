import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUsageDto {


    @IsDateString()
    @IsOptional()
    usage_start: string

    @IsDateString()
    @IsOptional()
    usage_end: string

    @IsNumber()
    @IsOptional()
    roomId: number

    @IsString()
    @IsOptional()
    purpose: string

}