import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUsageDto {

    @IsArray()
    @IsNumber({}, { each: true })
    deviceId: number[] 
    @IsNumber()
    @IsNotEmpty()
    roomId: number
    @IsString()
    @IsOptional()
    purpose: string

}