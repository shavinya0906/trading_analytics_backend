import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { TradeModule } from './trade/trade.module';
import { MarketDataModule } from './market-data/market-data.module';
import { OrderModule } from './order/order.module';
import { ExcelJsonModule } from './excel-json/excel-json.module';
import { TradeLogModule } from './trade-log/trade-log.module';
import { NewsModule } from './news/news.module';
import { UserColumnModule } from './user_column/user_column.module';
import { TradingAccountModule } from './trading_account/trading_account.module';
import { StrategiesModule } from './strategies/strategies.module';
import { SessionsModule } from './sessions/sessions.module';
import { ExcelExportModule } from './excel_export/excel_export.module';
import { TradeBookModule } from './tradebook/tradebook.module';
import { MantrasModule } from './mantras/mantras.module';
import { MonthlyQuestionnaireModule } from './monthly-questionnaire/montly.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TradeModule,
    MarketDataModule,
    OrderModule,
    ExcelJsonModule,
    TradeLogModule,
    NewsModule,
    UserColumnModule,
    TradingAccountModule,
    StrategiesModule,
    SessionsModule,
    ExcelExportModule,
    TradeBookModule,
    MantrasModule,
    MonthlyQuestionnaireModule,
  ],
})
export class AppModule {}
