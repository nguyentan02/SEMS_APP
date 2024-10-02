import { IsDate, IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsOptional()
    categoryId: number;

    // @IsNumber()
    // @IsNotEmpty()
    // roomId: number;
}