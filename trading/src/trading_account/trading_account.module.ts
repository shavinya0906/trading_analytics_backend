import { Module } from '@nestjs/common';
import { TradingAccountController } from './trading_account.controller';
import { TradingAccountService } from './trading_account.service';

@Module({
  controllers: [TradingAccountController],
  providers: [TradingAccountService]
})
export class TradingAccountModule {}
