import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { StorageModule } from '../storage/storage.module';
import { ResumeController } from './resume.controller';
import { ResumeEntity } from './resume.entity';
import { ResumeService } from './resume.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeEntity]), StorageModule, AccountModule],
  providers: [ResumeService],
  controllers: [ResumeController],
  exports: [ResumeService]
})
export class ResumeModule {}