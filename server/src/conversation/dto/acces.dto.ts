import { IsNotEmpty, IsNumber } from "class-validator";

export class AccessConversationDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number
}