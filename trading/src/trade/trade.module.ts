import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { MissedTradeService } from './missedTradeLog.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [TradeController],
  providers: [TradeService,MissedTradeService]
})
export class TradeModule {}
