import { PriorityLevel, StatusMaintenance } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateMaintenanceDto {
    @IsOptional()
    @IsString()
    title: string;
    @IsOptional()
    @IsNumber()
    deviceId: number;
    @IsOptional()
    @IsNumber()
    userId: number;
    @IsOptional()
    @IsEnum(PriorityLevel)
    priority?: PriorityLevel;
    @IsDateString()
    @IsOptional()
    startDate: string;
    @IsDateString()
    @IsOptional()
    endDate: string;
    @IsString()
    descriptionPlan?: string;
  }
  