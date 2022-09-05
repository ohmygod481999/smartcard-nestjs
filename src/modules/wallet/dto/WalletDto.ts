export class WalletDto {
    account_id: number;

    balance: number;
    secondary_balance: number;

    constructor(account_id: number, balance: number, secondary_balance: number) {
        this.account_id = account_id;
        this.balance = balance;
        this.secondary_balance = secondary_balance;
        
    }
}