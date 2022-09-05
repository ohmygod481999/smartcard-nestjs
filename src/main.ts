import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  // global middlewares
  app.use(cookieParser());
  app.enableCors({
    origin: [configService.get("CORS_ORIGINS").split(",")],
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter())
  
  await app.listen(configService.get("PORT"));
}
bootstrap();
