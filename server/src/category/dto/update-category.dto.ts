import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CONSTANTS_MAX, CONSTANTS_MIN } from "src/global";


export class UpdateCategory {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.CATEGORY_LEN)
    @MinLength(CONSTANTS_MIN.CATEGORY_LEN)
    categoryName: string

    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    attribyuteId?: number[];
}
export class UpdateAttribyutesDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.CATEGORY_LEN)
    @MinLength(CONSTANTS_MIN.CATEGORY_LEN)
    name: string
}
