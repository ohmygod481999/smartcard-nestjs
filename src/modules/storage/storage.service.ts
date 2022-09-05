import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountInfoService } from '../account-info/account-info.service';

@Injectable()
export class StorageService {
    s3Client: S3Client;
    constructor(
        public configService: ConfigService,
        public accountInfoService: AccountInfoService,
    ) {
        this.s3Client = new S3Client({
            endpoint: configService.get('S3_ENDPOINT'), // Find your endpoint in the control panel, under Settings. Prepend "https://".
            region: configService.get('S3_REGION'), // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
            // endpoint: "https://long-space.sgp1.digitaloceanspaces.com",

            credentials: {
                accessKeyId: configService.get('S3_ACCESS_KEY_ID'), // Access key pair. You can create access key pairs using the control panel or API.
                secretAccessKey: configService.get('S3_SECRET_ACCESS_KEY'), // Secret access key defined through an environment variable.
            },
        });
    }

    private getLocationFromKey(key) {
        return `https://${this.configService.get(
            'S3_BUCKET',
        )}.${this.configService.get(
            'S3_REGION',
        )}.digitaloceanspaces.com/${key}`;
    }

    async uploadFile(
        file: Express.Multer.File,
        folder: string,
    ): Promise<string> {
        console.log(file.originalname);

        const newFileName = Date.now() + '-' + file.originalname;
        const key = `smartcard/${folder}/` + newFileName;
        const putObjectCmd = new PutObjectCommand({
            Bucket: this.configService.get('S3_BUCKET'),
            Key: key,
            Body: file.buffer,
            ACL: 'public-read',
        });

        await this.s3Client.send(putObjectCmd);

        const location = this.getLocationFromKey(key);
        
        return location;
    }
}
