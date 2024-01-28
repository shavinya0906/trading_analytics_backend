import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTradeAccountDTO } from 'src/core/dto/trade-account.dto';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { TradingAccountService } from './trading_account.service';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';
import { CurrentUser } from 'src/core/decorator/user.decorator';

@Controller('trading-account')
export class TradingAccountController {
  constructor(private readonly accountService: TradingAccountService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createTradeAccount(
    @Body(ValidationPipe) data: CreateTradeAccountDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.accountService.createTradeAccount(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllaccount(@CurrentUser() user:any): Promise<any> {
    return await this.accountService.getTradeAccount(user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteTradeAccount(@Param() id: GetByIdDTO): Promise<any> {
    return await this.accountService.deleteTradeAccount(id.id);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Put('/update/:id')
  async updateTrade(
    @Param() id,
    @Body() data: any,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.accountService.updateTradeAccount(id.id, data, user);
  }
}
