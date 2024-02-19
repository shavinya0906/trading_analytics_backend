import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { UserColumnService } from './user_column.service';
import { CreateColumnDTO } from 'src/core/dto/user_column.dto';
import { CurrentUser } from 'src/core/decorator/user.decorator';

@ApiTags('user_column')
@Controller('user_column')
export class UserColumnController {
    constructor(private readonly userColumnService: UserColumnService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createNews(
    @Body(ValidationPipe) data: CreateColumnDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.userColumnService.createNewColumn(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getColumn(@CurrentUser() user: any,): Promise<any> {
    return await this.userColumnService.getColumn(user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteColumn(@Param() id:any, @CurrentUser() user: any): Promise<any> {
    return await this.userColumnService.deleteColumn(id, user);
  }
}
