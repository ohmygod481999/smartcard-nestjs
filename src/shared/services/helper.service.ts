import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { customAlphabet } from 'nanoid'

@Injectable()
export class HelperService {
    private nanoid
    constructor(public configService: ConfigService) {
        this.nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
    }

    public swapArray(arr: any[], from: number, to: number): any[] {
        return arr.splice(to, 0, arr.splice(from, 1)[0]);
    }

    public generateNanoId() {
        return this.nanoid()
    }
}
