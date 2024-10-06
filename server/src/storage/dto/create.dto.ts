import { ActivityType, OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateOrderItemDto {
    @IsNotEmpty()
    @IsNumber()
    materialId: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    totalPrice?: number;
}
export class CreateStorageDto {
    @IsString()
    @IsNotEmpty()
    source: string
    @IsString()
    @IsOptional()
    notes: string

    @IsNotEmpty()
    @IsEnum(ActivityType)
    activityType: ActivityType

    @IsOptional()
    @IsDateString()
    orderDateEnd?: string;

    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus?: OrderStatus;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    orderItems: CreateOrderItemDto[];
}
