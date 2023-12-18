import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ExcelExportService } from './excel_export.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { TradeEntity } from 'src/database/entity';
import { Model } from 'dynamoose/dist/Model';
import { TradeSchema } from 'src/database/schema';
import * as dynamoose from 'dynamoose';
import { CurrentUser } from 'src/core/decorator/user.decorator';
import { Response } from 'express';

@Controller('excel-export')
export class ExcelExportController {
  private tradeInstance: Model<TradeEntity>;
  constructor(private excelExportService: ExcelExportService) {
    this.tradeInstance = dynamoose.model<TradeEntity>('trade', TradeSchema); 
  }
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('excel')
  async exportToExcel(@CurrentUser() user: any, @Res() res: Response) {
    const data = await this.tradeInstance.scan().where('user_id').eq(user.id).exec();
    const excelBuffer = await this.excelExportService.exportToExcel(data);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
    res.send(excelBuffer);
  }
}
