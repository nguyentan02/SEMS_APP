import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { CONSTANTS_MIN } from "../../global";


export class UpdatePasswordDto {

    @IsString()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN, {
        message: `Mật khẩu ít nhất ${CONSTANTS_MIN.PASSWORD_LEN} ký tự`,
    })
    @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
    oldPassword: string


    @IsString()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN, {
        message: `Mật khẩu ít nhất ${CONSTANTS_MIN.PASSWORD_LEN} ký tự`,
    })
    @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
    newPassword: string
}