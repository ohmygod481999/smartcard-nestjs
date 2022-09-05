import { IsNumber, IsString, IsUUID } from "class-validator";
import { ReferralTypeEnum } from "../referral.entity";

export class CreateReferralDto {
    @IsNumber()
    level: number
    
    type: ReferralTypeEnum

    @IsNumber()
    target_id?: number

    @IsString()
    target_agency_id?: string

    @IsNumber()
    referer_id: number

    @IsNumber()
    referee_id: number

    @IsUUID()
    transaction_id: string
}