import { IsArray, IsNotEmpty, IsOptional, IsString, MAX_LENGTH, MaxLength, MinLength } from "class-validator";
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global";


export class CreateDeparmentDto {
    @IsString()
    @IsNotEmpty()
    deparmentName: string
    @IsString()
    @IsNotEmpty()
    symbol:string
    
    @IsArray()
    @IsOptional()
    @IsString( { each: true })
    roomName: string[];
}