import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global";

export class UpdateDeparmentDto {
    @IsString()
    @IsOptional()
    deparmentName: string
    @IsString()
    @IsOptional()
    symbol:string
    @IsArray()
    @IsOptional()
    @IsString( { each: true })
    roomName: string[];
}