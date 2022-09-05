import {
    Body,
    Controller,
    forwardRef,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Authentication } from 'src/decorators/Authentication';
import { AuthGuard } from 'src/guards/auth.guard';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource } from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { StorageService } from '../storage/storage.service';
import { ResumeService } from './resume.service';

@Controller('resume')
@UseGuards(AuthGuard)
export class ResumeController {
    constructor(
        private readonly accountService: AccountService,
        private readonly resumeService: ResumeService,
        private readonly storageService: StorageService,
        private readonly helperService: HelperService,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadResume(
        @UploadedFile() file: Express.Multer.File,
        @Authentication() account: AccountEntity,
    ): Promise<any> {
        if (file.size > 1000 * 1000) {
            throw new HttpException(
                'File không được lớn hơn 1MB',
                HttpStatus.PAYLOAD_TOO_LARGE,
            );
        }

        const fileLocation = await this.storageService.uploadFile(
            file,
            'resume',
        );
        console.log(fileLocation);

        const resume = await this.resumeService.create({
            account_id: account.id,
            path: fileLocation,
        });

        console.log(resume);

        return new ResponseDto(resume, true, 'Thành công');
    }
}
