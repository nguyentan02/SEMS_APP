import { IsDate, IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

    // @IsNumber()
    // @IsNotEmpty()
    // roomId: number;
}