

import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "src/global"

export class UpdateProfileDto {


    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.NAME_LEN)
   
    name: string


}