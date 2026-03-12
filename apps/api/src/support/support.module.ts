import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { SupportTicket } from '../database/entities/support-ticket.entity';
import { SupportOrganization, SupportContact, KnowledgeSource, KnowledgeChunk } from '../database/entities/other.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { Field } from '../database/entities/field.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { OperationJob } from '../database/entities/operation-job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportTicket,
      SupportOrganization,
      SupportContact,
      KnowledgeSource,
      KnowledgeChunk,
      FarmMember,
      Field,
      Tractor,
      OperationJob
    ]),
  ],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule { }
