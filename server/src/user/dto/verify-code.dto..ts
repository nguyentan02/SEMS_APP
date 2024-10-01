import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CONSTANTS_MAX } from "../../global";


export class VerifyCodeDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.EMAIL_LEN)
    email: string
}