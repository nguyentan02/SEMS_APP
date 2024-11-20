import { PriorityLevel, StatusMaintenance } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMaintenancePlanDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsNumber()
    deviceId: number;
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsEnum(PriorityLevel)
    priority?: PriorityLevel;
    @IsDateString()
    @IsNotEmpty()
    startDate: string;
    @IsDateString()
    @IsNotEmpty()
    endDate: string;
    @IsString()
    descriptionPlan?: string;
  }
  