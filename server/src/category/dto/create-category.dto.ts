import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { CONSTANTS_MAX, CONSTANTS_MIN } from "src/global";


export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.CATEGORY_LEN)
    @MinLength(CONSTANTS_MIN.CATEGORY_LEN)
    categoryName: string

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    attribyuteId: number[];
}
export class CreateAttribyutesDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.CATEGORY_LEN)
    @MinLength(CONSTANTS_MIN.CATEGORY_LEN)
    name: string
}
export class CreateCategoryAttribyute {
    @IsNumber()
    @IsNotEmpty()
    categoryId: number

    @IsNumber()
    @IsNotEmpty()
    attributeId: number
}