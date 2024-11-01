import { IsString, IsNotEmpty, MaxLength, MinLength, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CONSTANTS_MAX, CONSTANTS_MIN } from 'src/global';

export class UpdateAttributeDto {
    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.CATEGORY_LEN)
    @MinLength(CONSTANTS_MIN.CATEGORY_LEN)
    name: string;
}

export class UpdateCategory {
    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.CATEGORY_LEN)
    @MinLength(CONSTANTS_MIN.CATEGORY_LEN)
    categoryName: string;
    @IsString()
    @IsOptional()
    description: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAttributeDto)
    attributes: UpdateAttributeDto[];
}
