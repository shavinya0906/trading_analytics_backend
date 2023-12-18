import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { TradeLogService } from './trade-log.service';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';

@Controller('trade-log')
export class TradeLogController {
    constructor(private readonly tradeLogService: TradeLogService) {}
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllTradeLog(): Promise<any> {
    return await this.tradeLogService.getAllTradeLog();
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteTrade(
    @Param() id: GetByIdDTO,
  ): Promise<any> {
    return await this.tradeLogService.deleteTradeLog(id.id);
  }
}
