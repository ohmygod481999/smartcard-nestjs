import { IsEmail, IsNumber, IsUUID } from "class-validator";
import { AccountEntity } from "../account.entity";

export class CreateAccountDto {
    @IsUUID()
    ory_id: string

    referer?: AccountEntity

    @IsEmail()
    email: string
}