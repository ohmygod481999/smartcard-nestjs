import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { SecondaryTransactionService } from '../secondary-transaction/secondary-transaction.service';
import {
    TransactionEntity,
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { VendorService } from '../vendor/vendor.service';
import { TransferMoneyDto } from './dto/transferMoneyDto';

@Injectable()
export class WalletService {
    constructor(
        private transactionService: TransactionService,
        private secondaryTransactionService: SecondaryTransactionService,
        private accountService: AccountService,
        private vendorService: VendorService,
        private dataSource: DataSource,
        private readonly helperService: HelperService,
    ) {}

    async calculateBalance(account_id: number): Promise<number> {
        const account = await this.accountService.findOne(account_id);

        const transactions = await this.transactionService.findByAccountId(
            account.id,
        );

        let balance = 0;

        transactions.forEach((transaction) => {
            if (transaction.source_id === transaction.target_id) {
                // root admin gioi thieu
                balance += 0;
            } else if (transaction.source_id === account_id) {
                balance -= transaction.amount;
            } else {
                balance += transaction.amount;
            }
        });

        return balance;
    }

    async calculateSecondaryBalance(account_id: number): Promise<number> {
        const account = await this.accountService.findOne(account_id);

        const transactions =
            await this.secondaryTransactionService.findByAccountId(account.id);

        let balance = 0;

        transactions.forEach((transaction) => {
            balance += transaction.amount;
        });

        return balance;
    }

    async payment(
        from_account_id: number,
        target_account_id: number,
        amount: number,
        vendor_id: number,
        order_id: string,
    ) {
        const fromAccount = await this.accountService.findOne(from_account_id);
        const targetAccount = await this.accountService.findOne(
            target_account_id,
        );
        if (!fromAccount || !targetAccount) {
            throw new HttpException(
                'Tài khoản không hợp lệ',
                HttpStatus.BAD_REQUEST,
            );
        }
        const vendor = await this.vendorService.findById(vendor_id);
        if (!vendor) {
            throw new HttpException(
                'Vendor không hợp lệ',
                HttpStatus.BAD_REQUEST,
            );
        }

        // if (account_id === vendor.account_id) {
        //     throw new HttpException(
        //         'Bạn không thể mua sản phẩm của chính mình',
        //         HttpStatus.BAD_REQUEST,
        //     );
        // }

        // check amout with balance
        const balance = await this.calculateBalance(from_account_id);
        console.log(balance);
        if (amount > balance - 50000) {
            throw new HttpException(
                'Số tiền trong tài khoản không đủ',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.transactionService.create({
            amount: amount,
            source_id: from_account_id,
            status: TransactionStatusEnum.SUCCESS,
            target_id: target_account_id,
            type: TransactionTypeEnum.PAYMENT,
            vendor_id,
            order_id,
        });
    }

    async checkValidAmountTransaction(
        account_id: number,
        amount: number,
    ): Promise<boolean> {
        const currentBalance = await this.calculateBalance(account_id);

        console.log(currentBalance);

        if (amount > currentBalance - 50000) {
            return false;
        }

        return true;
    }

    async transferMoney(
        transferMoneyDto: TransferMoneyDto,
    ): Promise<TransactionEntity> {
        const { source_id, target_id, amount, note } = transferMoneyDto;
        const sourceAccount = await this.accountService.findOne(source_id);

        if (!sourceAccount) {
            throw new HttpException(
                'Tài khoản nguồn không tồn tại',
                HttpStatus.BAD_REQUEST,
            );
        }

        const targetAccount = await this.accountService.findOne(target_id);
        if (!targetAccount) {
            throw new HttpException(
                'Tài khoản đích không tồn tại',
                HttpStatus.BAD_REQUEST,
            );
        }

        const amountValid = await this.checkValidAmountTransaction(
            sourceAccount.id,
            amount,
        );

        console.log(amountValid);

        if (!amountValid) {
            throw new HttpException(
                'Số tiền trong tài khoản không đủ để thực hiện giao dịch',
                HttpStatus.BAD_REQUEST,
            );
        }

        const transaction = await this.transactionService.create({
            amount,
            source_id,
            target_id,
            type: TransactionTypeEnum.TRANSFER,
            status: TransactionStatusEnum.SUCCESS,
            note,
        });

        return transaction;
    }

    async recharge(
        account_id: number,
        amount: number,
    ): Promise<TransactionEntity> {
        const transaction = await this.transactionService.create({
            amount,
            source_id: null,
            target_id: account_id,
            type: TransactionTypeEnum.RECHARGE,
            status: TransactionStatusEnum.SUCCESS,
        });

        return transaction;
    }
}
