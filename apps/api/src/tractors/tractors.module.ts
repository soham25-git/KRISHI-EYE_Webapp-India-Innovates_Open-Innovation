import { Module } from '@nestjs/common';
import { TractorsController } from './tractors.controller';
import { TractorsService } from './tractors.service';

@Module({
  controllers: [TractorsController],
  providers: [TractorsService],
  exports: [TractorsService],
})
export class TractorsModule { }
