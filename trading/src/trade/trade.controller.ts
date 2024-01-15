import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from '../core/helper/auth.guard';
import { CurrentUser } from '../core/decorator/user.decorator';
import { CreateTradeDTO, UpdateTradeDTO } from 'src/core/dto';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';
import { MissedTradeService } from './missedTradeLog.service';

@ApiTags('trade')
@Controller('trade')
export class TradeController {
  constructor(
    private readonly tradeService: TradeService,
    private readonly missedTradeService: MissedTradeService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createTrade(
    @Body(ValidationPipe) data: any,
    @CurrentUser() user: any,
    @Query('filename') filename?: string,
  ): Promise<any> {
    if (filename == 'tools')
      return await this.missedTradeService.createMissedTrade(data, user);
    else return await this.tradeService.createTrade(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/createTrades')
  async createTrades(
    @Body(ValidationPipe) dataList: CreateTradeDTO[],
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.tradeService.createTrades(dataList, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Put('/update/:id')
  async updateTrade(
    @Param() id,
    @Body() data: UpdateTradeDTO,
    @CurrentUser() user: any,
    @Query('filename') filename?: string,
  ): Promise<any> {
    if (filename == 'tools')
      return await this.missedTradeService.updateMissedTrade(id.id, data, user);
    else return await this.tradeService.updateTrade(id.id, data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Put('/update')
  async updateTrades(
    @Body() trades: { id: string; data: UpdateTradeDTO }[],
    @CurrentUser() user: any,
    @Query('filename') filename?: string,
  ): Promise<any> {
    if (filename == 'tools')
      return await this.missedTradeService.updateTrades(trades, user);
    else
    return await this.tradeService.updateTrades(trades, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteTrade(
    @Param() id: GetByIdDTO,
    @CurrentUser() user: any,
    @Query('filename') filename?: string,
  ): Promise<any> {
    if (filename == 'tools')
      return await this.missedTradeService.deleteMissedTrade(id.id, user);
    else return await this.tradeService.deleteTrade(id.id, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllTrade(
    @CurrentUser() user: any,
    @Query() queries: any,
  ): Promise<any> {
    if (queries.filename && queries.filename == 'tools')
      return await this.missedTradeService.getMissedTrade(user, queries);
    else {
      return await this.tradeService.getTrade(user, queries);
    }
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/trade/:id')
  async getTradeById(
    @Param() id: string,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.tradeService.getTradeById(id, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/dashboard')
  async getTradeAvg(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return await this.tradeService.getTradeAvg(user, startDate, endDate);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/trade-analytics')
  async getTradeAnalytics(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return await this.tradeService.getTradeAnalytics(user, startDate, endDate);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/get-advanced-graph')
  async getAdvancedGraph(
    @CurrentUser() user: any,
    @Query('xAxis') xAxis: string,
    @Query('yAxis') yAxis: string,
  ): Promise<any> {
    return await this.tradeService.getAdvancedGraph(user, xAxis, yAxis);
  }

  // @ApiBearerAuth()
  // @UseGuards(ClientAuthGuard)
  // @Post('/advance')
  // async createTradeAdvance(
  //   @Body(ValidationPipe) data: CreateTradeAdvanceDTO,
  //   @CurrentUser() user: any,
  // ): Promise<any> {
  //   return await this.tradeService.createTradeAdvance(data, user);
  // }

  // @ApiBearerAuth()
  // @UseGuards(ClientAuthGuard)
  // @Put('/advance/:id')
  // async updateTradeAdvance(
  //   @Param() id: GetByIdDTO,
  //   @Body() data: UpdateTradeAdvanceDTO,
  //   @CurrentUser() user: any,
  // ): Promise<any> {
  //   return await this.tradeService.updateTradeAdvance(id.id, data, user);
  // }

  // @ApiBearerAuth()
  // @UseGuards(ClientAuthGuard)
  // @Delete('/advance/:id')
  // async deleteTradeAdvance(
  //   @Param() id: GetByIdDTO,
  //   @CurrentUser() user: any,
  // ): Promise<any> {
  //   return await this.tradeService.deleteTradeAdvance(id.id, user);
  // }

  // @ApiBearerAuth()
  // @UseGuards(ClientAuthGuard)
  // @Get('/advance')
  // async getAllTradeAdvance(@CurrentUser() user: any): Promise<any> {
  //   return await this.tradeService.getTradeAdvance(user);
  // }

  // @ApiBearerAuth()
  // @UseGuards(ClientAuthGuard)
  // @Get('/advance/:id')
  // async getTradeAdvanceById(
  //   @Param() id: GetByIdDTO,
  //   @CurrentUser() user: any,
  // ): Promise<any> {
  //   return await this.tradeService.getTradeAdvanceById(id.id, user);
  // }
}
