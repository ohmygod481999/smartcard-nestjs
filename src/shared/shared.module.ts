import { Global, Module } from '@nestjs/common';
import { HelperService } from './services/helper.service';
import { KratosService } from './services/kratos.service';


const providers = [
  KratosService,
  HelperService
  // {
  //   provide: 'NATS_SERVICE',
  //   useFactory: (configService: ApiConfigService) => {
  //     const natsConfig = configService.natsConfig;
  //     return ClientProxyFactory.create({
  //       transport: Transport.NATS,
  //       options: {
  //         name: 'NATS_SERVICE',
  //         url: `nats://${natsConfig.host}:${natsConfig.port}`,
  //       },
  //     });
  //   },
  //   inject: [ApiConfigService],
  // },
];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
