import { IsNumber, IsString } from 'class-validator';

export class CreateResumeDto {
    @IsNumber()
    account_id: number;

    @IsString()
    path: string;
}
