import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global"

export class CheckCodeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.EMAIL_LEN)
    email: string

    @IsNumber()
    @IsNotEmpty()
    code: number
}