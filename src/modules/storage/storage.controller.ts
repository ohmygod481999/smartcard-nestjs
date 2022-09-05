import {
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Authentication } from 'src/decorators/Authentication';
import { AuthGuard } from 'src/guards/auth.guard';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { AccountInfoService } from '../account-info/account-info.service';
import { AccountEntity } from '../account/account.entity';
import { StorageService } from './storage.service';

@Controller('storage')
@UseGuards(AuthGuard)
export class StorageController {
    constructor(
        private readonly storageService: StorageService,
        private readonly accountInfoService: AccountInfoService,
    ) {}

    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Authentication() account: AccountEntity,
    ) {
        if (file.size > 1000 * 1000) {
            throw new HttpException(
                'File không được lớn hơn 1MB',
                HttpStatus.PAYLOAD_TOO_LARGE,
            );
        }

        const accountInfo = await this.accountInfoService.findOneByAccountId(
            account.id,
        );

        if (!accountInfo) {
            throw new HttpException('Có lỗi xảy ra', HttpStatus.BAD_REQUEST);
        }

        const location = await this.storageService.uploadFile(file, 'avatar');

        accountInfo.avatar = location;

        await accountInfo.save();

        return new ResponseDto(
            {
                location: location,
            },
            true,
        );
    }
}
