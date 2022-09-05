import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource } from 'typeorm';
import { AccountService } from '../account/account.service';
import { ProductService } from '../product/product.service';
import { SecondaryTransactionService } from '../secondary-transaction/secondary-transaction.service';
import { TransactionService } from '../transaction/transaction.service';
import { VendorService } from '../vendor/vendor.service';
import { WalletService } from '../wallet/wallet.service';
import { ApproveOrderDto } from './dto/approveOrderDto';
import { CreateOrderDto } from './dto/createOrderDto';
import { OrderPaymentType, OrderStatusEnum } from './order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly transactionService: TransactionService,
        private readonly dataSource: DataSource,
        private readonly helperService: HelperService,
        // @Inject(forwardRef(() => ReferralService))
        private readonly secondaryTransactionService: SecondaryTransactionService,
        private readonly walletService: WalletService,
        private readonly accountService: AccountService,
        private readonly productService: ProductService,
        private readonly vendorService: VendorService,
    ) {}

    @Post('/create')
    async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
        const rootAccount = await this.accountService.getRootAccount();

        if (createOrderDto.payment_type === OrderPaymentType.WALLET) {
            // tinh tien order
            const order_items = await Promise.all(
                createOrderDto.order_items.map(async (order_item) => {
                    const product = await this.productService.find(
                        order_item.product_id,
                    );
                    return {
                        quantity: order_item.quantity,
                        price: product.price,
                    };
                }),
            );
            console.log(order_items);
            let amount = 0;
            order_items.forEach((item) => {
                amount += item.price * item.quantity;
            });

            const order = await this.orderService.createOrder({
                ...createOrderDto,
                status: OrderStatusEnum.CREATED,
            });

            console.log(order);

            const rootVendor = await this.vendorService.getRootVendor();

            console.log(amount);
            // createOrderDto.order_items.forEach()
            await this.walletService.payment(
                createOrderDto.agency_id,
                rootAccount.id,
                amount,
                rootVendor.id,
                order.id,
            );

            order.status = OrderStatusEnum.PAID;
            await this.orderService.updateOrderStatus(
                order.id,
                OrderStatusEnum.PAID,
            );
            // await order.save()

            return new ResponseDto(order, true, 'Thành công');
        }
        const order = await this.orderService.createOrder({
            ...createOrderDto,
            status: OrderStatusEnum.CREATED,
        });

        return new ResponseDto(order, true, 'Thành công');
    }

    @Post('/approve')
    async approve(@Body() approveOrderDto: ApproveOrderDto) {
        const order = await this.orderService.findOneById(
            approveOrderDto.order_id,
        );

        if (!order) {
            throw new HttpException(
                'Mã đơn hàng không chính xác',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updatedOrder = await this.orderService.update(
            approveOrderDto.order_id,
            {
                status: OrderStatusEnum.SUCCESS,
            },
        );

        return new ResponseDto(updatedOrder, true, 'Thành công');
    }
}
