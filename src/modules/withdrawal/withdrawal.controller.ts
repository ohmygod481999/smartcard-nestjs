import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { AccountService } from '../account/account.service';
import { ReferralService } from '../referral/referral.service';
import {
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { WalletService } from '../wallet/wallet.service';
import { AcceptWithdrawalDto } from './dto/acceptWithdrawalDto';
import { CreateWithdrawalDto } from './dto/createWithdrawalDto';
import { RegisterWithdrawalDto } from './dto/registerWithdrawalDto';
import { WithdrawalStatus } from './withdrawal.entity';
import { WithdrawalService } from './withdrawal.service';

@Controller('withdrawal')
export class WithdrawalController {
    constructor(
        private readonly withdrawalService: WithdrawalService,
        private readonly walletService: WalletService,
        private readonly transactionService: TransactionService,
    ) {}

    @Post('/register-withdraw')
    async register(@Body() registerWithdrawalDto: RegisterWithdrawalDto) {
        // check user has registerd
        const pendingWithdrawal =
            await this.withdrawalService.findPendingWithdrawal(
                registerWithdrawalDto.account_id,
            );

        if (pendingWithdrawal) {
            throw new HttpException(
                'Bạn đang có một lệnh rút đang xử lý, vui lòng đợi chúng tôi xử lý trước khi tiếp tục rút tiền',
                HttpStatus.BAD_REQUEST,
            );
        }

        // check balance
        const balance = await this.walletService.calculateBalance(
            registerWithdrawalDto.account_id,
        );

        console.log(balance);

        if (registerWithdrawalDto.amount > balance) {
            throw new HttpException(
                'Số tiền rút không được vượt quá số dư',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (balance - registerWithdrawalDto.amount < 50000) {
            throw new HttpException(
                'Số tiền rút còn lại không được nhỏ hơn 50,000đ',
                HttpStatus.BAD_REQUEST,
            );
        }

        // create
        const agencyRegister = await this.withdrawalService.create({
            ...registerWithdrawalDto,
            status: WithdrawalStatus.PENDING,
        });

        return new ResponseDto(agencyRegister, true, "Thành công");
    }

    @Post('/accept')
    async accept(@Body() acceptWithdrawalDto: AcceptWithdrawalDto) {
        // check user has registerd
        const withdrawal = await this.withdrawalService.findOne(
            acceptWithdrawalDto.withdrawal_id,
        );

        if (!withdrawal) {
            throw new HttpException(
                'Mã rút tiền không hợp lệ',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (withdrawal.status === WithdrawalStatus.SUCCESS) {
            throw new HttpException(
                'Mã rút tiền đã được xử lý',
                HttpStatus.BAD_REQUEST,
            );
        }

        // check balance
        const balance = await this.walletService.calculateBalance(
            withdrawal.account_id,
        );

        if (withdrawal.amount > balance) {
            throw new HttpException(
                'Số tiền rút không được vượt quá số dư',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (balance - withdrawal.amount < 50000) {
            throw new HttpException(
                'Số tiền rút còn lại không được nhỏ hơn 50,000đ',
                HttpStatus.BAD_REQUEST,
            );
        }

        // create transaction
        const transaction = await this.transactionService.create({
            amount: withdrawal.amount,
            source_id: withdrawal.account_id,
            target_id: null,
            status: TransactionStatusEnum.SUCCESS,
            type: TransactionTypeEnum.WITHDRAW,
        });

        await this.withdrawalService.updateStatus(
            withdrawal.id,
            WithdrawalStatus.SUCCESS,
        );
        return new ResponseDto({}, true, 'Thành công');
    }
}
