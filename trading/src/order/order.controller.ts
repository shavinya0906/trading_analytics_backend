import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { CreateOrderDTO } from 'src/core/dto/order.dto';
import { CurrentUser } from 'src/core/decorator/user.decorator';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createMarketData(
    @Body(ValidationPipe) data: CreateOrderDTO,
    @CurrentUser() user: any
  ): Promise<any> {
    return await this.orderService.createOrder(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllOrder(@CurrentUser() user: any): Promise<any> {
    return await this.orderService.getOrder(user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/:id')
  async getOrderById(
    @Param() id: GetByIdDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.orderService.getOrderById(id.id, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteTrade(
    @Param() id: GetByIdDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.orderService.deleteOrder(id.id, user);
  }
}
