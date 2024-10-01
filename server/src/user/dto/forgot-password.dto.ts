import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global"

export class ForgotPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.EMAIL_LEN)
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    newPassword: string

    @IsNumber()
    @IsNotEmpty()
    code: number
}