import { Module } from '@nestjs/common';
import { RelationsService } from './relations.service';
import { RelationsController } from './relations.controller';

@Module({
  providers: [RelationsService],
  controllers: [RelationsController]
})
export class RelationsModule {}
