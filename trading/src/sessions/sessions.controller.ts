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
import { SessionsService } from './sessions.service';
import { CreateSessionsDTO } from 'src/core/dto/sessions.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { CurrentUser } from 'src/core/decorator/user.decorator';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createsessions(
    @Body(ValidationPipe) data: CreateSessionsDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.sessionService.createsessions(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllaccount(@CurrentUser() user: any): Promise<any> {
    return await this.sessionService.getsessions(user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deletesessions(@Param('id') id: string): Promise<any> {
    return await this.sessionService.deletesessions(id);
  }


  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Put('/update/:id')
  async updateTrade(
    @Param() id,
    @Body() data: any,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.sessionService.updatesessions(id.id, data, user);
  }
}
