import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
class DeviceAttributeValueDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    value: string;
}
export class CreateDeviceDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    serialNumber: string

    @IsString()
    @IsNotEmpty()
    manufacturer: string

    @IsDateString()
    @IsNotEmpty()
    purchaseDate: string

    @IsDateString()
    @IsNotEmpty()
    expirationDate: string

    @IsDecimal()
    @IsNotEmpty()
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
    @ValidateNested({ each: true })
    @Type(() => DeviceAttributeValueDto)
    attributes: DeviceAttributeValueDto[];
}