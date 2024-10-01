import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global";

export class UpdateDeparmentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.DEPARMENT_LEN)
    @MinLength(CONSTANTS_MIN.DEPARMENT_LEN)
    deparmentName: string
}