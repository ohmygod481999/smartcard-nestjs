import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferralEntity, ReferralTypeEnum } from './referral.entity';
import { CreateReferralDto } from './dto/referralDto';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from '../account/account.service';
import {
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction/transaction.entity';
import { AgencyType } from '../agency/agency.entity';

@Injectable()
export class ReferralService {
    F1_NO_AGENCY_PERCENT = 0.2;
    F1_COLABORATOR_PERCENT = 0.25;
    CARD_PRICE = 300000;
    AGENCY_BASE_REWARD = 2000000;

    constructor(
        @InjectRepository(ReferralEntity)
        private referralRepository: Repository<ReferralEntity>,
        private transactionService: TransactionService,
        // @Inject(forwardRef(() => AccountService))
        private accountService: AccountService,
    ) {}

    getPercentAncestors(level: number): number {
        if (level < 1) {
            throw new Error('Level không được nhỏ hơn 1');
        }
        const percentMapping = {
            1: 0.25,
            2: 0.1,
            3: 0.05,
            4: 0.03,
            5: 0.02,
        };

        if (
            !Object.keys(percentMapping)
                .map((key: string) => parseInt(key))
                .includes(level)
        ) {
            return 0.01;
        }

        return percentMapping[level];
    }

    // thuởng cho cộng tác viên, phải duyệt !!!
    // async rewardCardReferer(referer_id: number, referee_id: number) {
    //     const ancestors = await this.accountService.getAncestors(referer_id);

    //     const rootAccount = await this.accountService.getRootAccount();

    //     await Promise.all(
    //         ancestors.map(async (ancestor, i) => {
    //             const { type, id, email } = ancestor;
    //             // level of ancestor
    //             const level = i + 1;

    //             let amount = 0;
    //             if (!agency && level === 1) {
    //                 amount = this.CARD_PRICE * this.F1_NO_AGENCY_PERCENT;
    //             } else if (agency) {
    //                 amount = this.CARD_PRICE * this.getPercentAncestors(level);
    //             }

    //             if (amount === 0) {
    //                 return;
    //             }

    //             const transaction = await this.transactionService.create({
    //                 amount: amount,
    //                 source_id: rootAccount.id,
    //                 status: TransactionStatusEnum.SUCCESS,
    //                 target_id: id,
    //                 type: TransactionTypeEnum.REWARD_REFER,
    //             });

    //             const createReferralDto: CreateReferralDto = {
    //                 level,
    //                 referee_id,
    //                 referer_id: referer_id,
    //                 transaction_id: transaction.id,
    //                 type: ReferralTypeEnum.CARD,
    //             };

    //             if (agency) {
    //                 createReferralDto.target_agency_id = agency.id;
    //             } else {
    //                 createReferralDto.target_id = id;
    //             }

    //             const referral = await this.create(createReferralDto);
    //         }),
    //     );
    // }

    // thưởng cho 10 tầng trên khi 1 đại lý hoặc cộng tác viên kích hoạt thành công
    async rewardAgencyReferer(
        referer_id: number,
        referee_id: number,
        agencyType: AgencyType,
    ) {
        const ancestors = await this.accountService.getAncestors(referer_id);

        const rootAccount = await this.accountService.getRootAccount();

        const baseReward =
            agencyType === AgencyType.AGENCY
                ? this.AGENCY_BASE_REWARD
                : this.CARD_PRICE;

        await Promise.all(
            ancestors.map(async (ancestor, i) => {
                const { type, agency_id, id, email } = ancestor;
                // level of ancestor
                const level = i + 1;

                if (level > 10) {
                    return;
                }

                let amount = 0;

                if (!type || !agency_id) return;

                // Thưởng nếu ng đó là cộng tác viên và ở tầng 1
                if (type === AgencyType.COLABORATOR && level === 1) {
                    amount = baseReward * this.F1_COLABORATOR_PERCENT;
                } else if (type === AgencyType.AGENCY) {
                    amount = baseReward * this.getPercentAncestors(level);
                }

                // if (!agency && level === 1) {
                //     amount =
                //         this.AGENCY_BASE_REWARD * this.F1_NO_AGENCY_PERCENT;
                // } else if (agency) {
                //     amount =
                //         this.AGENCY_BASE_REWARD *
                //         this.getPercentAncestors(level);
                // }

                if (amount === 0) {
                    return;
                }

                const transaction = await this.transactionService.create({
                    amount: amount,
                    status: TransactionStatusEnum.SUCCESS,
                    source_id: rootAccount.id,
                    target_id: id,
                    type:
                        agencyType === AgencyType.AGENCY
                            ? TransactionTypeEnum.REWARD_REFER_AGENCY
                            : TransactionTypeEnum.REWARD_REFER_COLABORATOR,
                });

                const createReferralDto: CreateReferralDto = {
                    level,
                    referee_id,
                    referer_id: referer_id,
                    transaction_id: transaction.id,
                    type:
                        agencyType === AgencyType.AGENCY
                            ? ReferralTypeEnum.AGENCY
                            : ReferralTypeEnum.COLABORATOR,
                    target_agency_id: agency_id,
                };

                // if (agency) {
                //     createReferralDto.target_agency_id = agency.id;
                // } else {
                //     createReferralDto.target_id = id;
                // }

                const referral = await this.create(createReferralDto);
            }),
        );
    }

    findAll(): Promise<ReferralEntity[]> {
        return this.referralRepository.find();
    }

    findOne(id: string): Promise<ReferralEntity> {
        return this.referralRepository.findOneBy({ id });
    }

    async create(
        createReferralDto: CreateReferralDto,
    ): Promise<ReferralEntity> {
        const referral = await ReferralEntity.create();
        referral.type = createReferralDto.type;
        referral.level = createReferralDto.level;
        if (createReferralDto.target_id) {
            referral.target_id = createReferralDto.target_id;
        }
        if (createReferralDto.target_agency_id) {
            referral.target_agency_id = createReferralDto.target_agency_id;
        }
        referral.referer_id = createReferralDto.referer_id;
        referral.referee_id = createReferralDto.referee_id;
        referral.transaction_id = createReferralDto.transaction_id;
        referral.save();
        return referral;
    }
}
