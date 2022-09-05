import { IsEmail, IsNumber, IsUUID } from "class-validator";

export class CreateAgencyDto {
    @IsNumber()
    account_id: number
}