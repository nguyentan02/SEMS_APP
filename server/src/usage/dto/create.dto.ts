import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUsageDto {

    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    deviceId: number[]

    @IsDateString()
    @IsNotEmpty()
    usage_start: string

    @IsDateString()
    @IsNotEmpty()
    usage_end: string
    @IsNumber()
    @IsNotEmpty()
    roomId: number
    @IsString()
    @IsOptional()
    purpose: string

}