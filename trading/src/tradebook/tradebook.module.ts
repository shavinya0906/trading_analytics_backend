import { Module } from '@nestjs/common';
import { TradeController } from './tradebook.controller';
import { TradeService } from './tradebook.service';

@Module({
  controllers: [TradeController],
  providers: [TradeService]
})
export class TradeBookModule {}
