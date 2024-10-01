
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "src/global"

export class UpdateUserDto {


    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.NAME_LEN)
    @MinLength(CONSTANTS_MIN.NAME_LEN)
    name: string

    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.EMPLOYEE_ID_LEN)
    employeeId: string

    @IsNumber()
    @IsOptional()
    role: number

}