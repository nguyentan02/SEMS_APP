import { IsNotEmpty, IsNumber } from "class-validator"


export class DeleteCateAttriDto {
    @IsNumber()
    @IsNotEmpty()
    categoryId: number
    @IsNumber()
    @IsNotEmpty()
    attributeId: number
}
