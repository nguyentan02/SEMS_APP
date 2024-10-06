import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateRotationDto {
    @IsNumber()
    @IsNotEmpty()
    deviceId: number

    // @IsNumber()
    // @IsNotEmpty()
    // oldLocationId: number

    @IsNumber()
    @IsNotEmpty()
    newLocationId: number

    @IsString()
    @IsNotEmpty()
    reason: string
}
