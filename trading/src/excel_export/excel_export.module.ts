import { Module } from '@nestjs/common';
import { ExcelExportService } from './excel_export.service';
import { ExcelExportController } from './excel_export.controller';

@Module({
  providers: [ExcelExportService],
  controllers: [ExcelExportController]
})
export class ExcelExportModule {}
