import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global";

export class UpdateRoomDto {
    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.DEPARMENT_LEN)
    @MinLength(CONSTANTS_MIN.DEPARMENT_LEN)
    roomName: string
    @IsNumber()
    @IsOptional()
    deparmentId: number
}