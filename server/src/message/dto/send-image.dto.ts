
import { IsNotEmpty, IsNumber } from "class-validator";

export class SendImageDto {
    @IsNotEmpty()
    @IsNumber()
    conversationId: number
}
