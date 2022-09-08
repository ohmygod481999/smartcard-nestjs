import { IsEmail, IsEnum, IsNumber, IsUUID } from "class-validator";
import { AgencyType } from "../agency.entity";

export class CreateAgencyDto {
    @IsNumber()
    account_id: number

    @IsEnum(AgencyType)
    type: AgencyType
}