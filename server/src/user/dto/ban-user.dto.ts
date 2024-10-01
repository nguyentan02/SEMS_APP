import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { CONSTANTS_MAX } from "../../global";

export class BanUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.FEEDBACK_LEN)
    feedback: string

    @IsNumber()
    @IsOptional()
    time: number
}