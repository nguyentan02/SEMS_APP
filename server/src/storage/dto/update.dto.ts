import { ActivityType, OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


export class UpdateStorageDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus?: OrderStatus;
}