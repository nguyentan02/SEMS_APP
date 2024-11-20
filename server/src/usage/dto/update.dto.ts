import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUsageDto {


    @IsDateString()
    @IsOptional()
    usage_start: string

    @IsDateString()
    @IsOptional()
    usage_end: string
    @IsString()
    @IsOptional()
    purpose: string

}