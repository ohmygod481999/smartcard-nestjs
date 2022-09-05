import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from './card.entity';
import { ConnectCardWithAccountDto } from './cardDto';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(CardEntity)
        private cardRepository: Repository<CardEntity>,
    ) {}

    findAll(): Promise<CardEntity[]> {
        return this.cardRepository.find();
    }

    findOne(id: number): Promise<CardEntity> {
        return this.cardRepository.findOneBy({ id });
    }

    async connectCardWithAccount(connectCardWithAccountDto: ConnectCardWithAccountDto): Promise<CardEntity> {
        console.log("card_id", connectCardWithAccountDto.card_id)
        const card: CardEntity = await this.findOne(connectCardWithAccountDto.card_id)
        
        console.log(card)
        if (card.account_id) {
            console.log("this card is connected before")
            throw new HttpException("Thẻ đã kết nối với 1 tài khoản rồi", HttpStatus.BAD_REQUEST)
        }

        card.account_id = connectCardWithAccountDto.account_id

        await CardEntity.update(card.id, card)

        return card;
    }

    async remove(id: number): Promise<void> {
        await this.cardRepository.delete(id);
    }
}
