import { Module } from '@nestjs/common';
import { MantrasController } from './mantras.controller';
import { MantrasService } from './mantras.service';

@Module({
  controllers: [MantrasController],
  providers: [MantrasService]
})
export class MantrasModule {}
