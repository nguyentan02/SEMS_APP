import { IsEmail, isInt, IsNotEmpty, isNumber, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "src/global"

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.EMAIL_LEN)
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.EMPLOYEE_ID_LEN)
    employeeId: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.NAME_LEN)
    @MinLength(CONSTANTS_MIN.NAME_LEN)
    name: string


    role?: number


    @IsString()
    @IsNotEmpty()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    password: string

}