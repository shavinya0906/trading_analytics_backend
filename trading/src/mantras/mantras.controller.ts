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
import { MantrasService } from './mantras.service';
import { CreateMantrasDTO } from 'src/core/dto/mantras.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { CurrentUser } from 'src/core/decorator/user.decorator';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';

@Controller('mantras')
export class MantrasController {
  constructor(private readonly MantraService: MantrasService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createMantras(
    @Body(ValidationPipe) data: CreateMantrasDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.MantraService.createMantras(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllaccount(): Promise<any> {
    return await this.MantraService.getMantras();
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteMantras(@Param() id:any): Promise<any> {
    return await this.MantraService.deleteMantras(id);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Put('/update/:id')
  async updateTrade(
    @Param() id:any,
    @Body() data: any,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.MantraService.updateMantras(id, data, user);
  }
}
