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
import { StrategiesService } from './strategies.service';
import { CreateStrategiesDTO } from 'src/core/dto/strategies.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { CurrentUser } from 'src/core/decorator/user.decorator';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategieService: StrategiesService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createStrategies(
    @Body(ValidationPipe) data: CreateStrategiesDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.strategieService.createStrategies(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllaccount(
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.strategieService.getStrategies(user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteStrategies(@Param() id: GetByIdDTO): Promise<any> {
    return await this.strategieService.deleteStrategies(id.id);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Put('/update/:id')
  async updateTrade(
    @Param() id,
    @Body() data: any,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.strategieService.updateStrategies(id.id, data, user);
  }
}
