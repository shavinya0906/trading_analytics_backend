import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMarketDTO } from 'src/core/dto';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { MarketDataService } from './market-data.service';
import { CurrentUser } from 'src/core/decorator/user.decorator';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';

@ApiTags('market')
@Controller('market-data')
export class MarketDataController {
    constructor(private readonly marketService: MarketDataService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createMarketData(
    @Body(ValidationPipe) data: CreateMarketDTO,
  ): Promise<any> {
    return await this.marketService.createMarketData(data);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllMarketData(): Promise<any> {    
    return await this.marketService.getMarketData();
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteMarketData(
    @Param() id: GetByIdDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.marketService.deleteMarketData(id.id, user);
  }
}
