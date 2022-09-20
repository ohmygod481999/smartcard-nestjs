import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { AccountService } from '../account/account.service';
import { SecondaryTransactionService } from '../secondary-transaction/secondary-transaction.service';
import { TransactionService } from '../transaction/transaction.service';
import { ApproveRechargeMoneyDto } from './dto/approveRechargeMoneyDto';
import { RechargeMoneyDto } from './dto/rechargeMoneyDto';
import { TransferMoneyDto } from './dto/transferMoneyDto';
import { WalletDto } from './dto/WalletDto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(
        private readonly walletService: WalletService,
        private readonly transactionService: TransactionService,
        private readonly accountService: AccountService,
    ) {}

    @Get('/:account_id')
    async getWalletBalance(
        @Param('account_id') account_id,
    ): Promise<WalletDto> {
        account_id = parseInt(account_id);
        const balance = await this.walletService.calculateBalance(account_id);

        const secondaryBalance =
            await this.walletService.calculateSecondaryBalance(account_id);

        return new WalletDto(account_id, balance, secondaryBalance);
    }

    @Post('/transfer')
    async createPayment(@Body() transferMoneyDto: TransferMoneyDto) {
        const transaction = await this.walletService.transferMoney(
            transferMoneyDto,
        );

        return new ResponseDto(transaction, true, 'Thành công');
    }

    @Post('/recharge')
    async recharge(@Body() rechargeMoneyDto: RechargeMoneyDto) {
        const transaction = await this.walletService.recharge(
            rechargeMoneyDto.account_id,
            rechargeMoneyDto.amount,
        );

        return new ResponseDto(transaction, true, 'Thành công');
    }

    @Post('/approve-recharge')
    async approveRecharge(@Body() approveRechargeDto: ApproveRechargeMoneyDto) {
        const transaction = await this.walletService.approveRecharge(
            approveRechargeDto.recharge_register_id
        );

        return new ResponseDto(transaction, true, 'Thành công');
    }
}
