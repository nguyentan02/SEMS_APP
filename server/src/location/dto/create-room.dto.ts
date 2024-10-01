import { IsNotEmpty, IsNumber, IsString, MAX_LENGTH, MaxLength, MinLength } from "class-validator";
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global";


export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.DEPARMENT_LEN)
    @MinLength(CONSTANTS_MIN.DEPARMENT_LEN)
    roomName: string

    @IsNumber()
    @IsNotEmpty()
    deparmentId: number
}