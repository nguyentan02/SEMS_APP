import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateRotationDto {
    @IsArray()
    @IsNumber({}, { each: true })
    deviceId: number[]
    @IsNumber()
    @IsNotEmpty()
    newLocationId: number
    @IsString()
    @IsOptional()
    reason: string
}
