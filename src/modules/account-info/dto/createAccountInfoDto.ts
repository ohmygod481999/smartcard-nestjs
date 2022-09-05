import { IsEmail, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateAccountInfoDto {
    @IsString()
    name?: string

    @IsString()
    phone?: string

    @IsString()
    description?: string

    @IsString()
    avatar?: string

    @IsString()
    facebook?: string

    @IsString()
    zalo?: string

    @IsString()
    slide_text?: string

    @IsString()
    website?: string
}