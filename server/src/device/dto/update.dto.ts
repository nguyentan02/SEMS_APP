import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
class DeviceAttributeValueDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsOptional()
    value?: string;
}
export class UpdateDeviceDto {
    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    serialNumber: string

    @IsString()
    @IsOptional()
    manufacturer: string

    @IsDateString()
    @IsOptional()
    purchaseDate: string

    @IsDateString()
    @IsOptional()
    expirationDate: string

    @IsDecimal()
    @IsOptional()
    price: string;

    // @IsString()
    // @IsOptional()
    // qrCode?: string;

    // @IsDateString()
    // @IsOptional()
    // lastMaintenanceDate?: Date;
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => DeviceAttributeValueDto)
    attributes?: DeviceAttributeValueDto[];
}