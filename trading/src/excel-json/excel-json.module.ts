import { Module } from '@nestjs/common';
import { ExcelJsonController } from './excel-json.controller';
import { ExcelJsonService } from './excel-json.service';

@Module({
  controllers: [ExcelJsonController],
  providers: [ExcelJsonService]
})
export class ExcelJsonModule {}
