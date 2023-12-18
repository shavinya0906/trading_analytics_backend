import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import * as dynamoose from 'dynamoose';
import { OrderSchema } from 'src/database/schema';
import { CreateOrderDTO } from 'src/core/dto';
import { OrderEntity } from 'src/database/entity';

@Injectable()
export class OrderService {
    private orderInstance: Model<OrderEntity>;
  constructor() {
    this.orderInstance = dynamoose.model<OrderEntity>('order', OrderSchema);
  }
  async createOrder(data: CreateOrderDTO, user: any) {
    try {
      return await this.orderInstance.create({
        userId: user.id,
        orderType: data.orderType,
        tradingType: data.tradingType,
        quantity: data.quantity,
        priceType: data.priceType,
        price: data.price,
        stopLossType: data.stopLossType,
        stopLossPrice: data.stopLossPrice,
        triggerPrice: data.triggerPrice,
        time: data.time,
        instrument: data.instrument,
        LTP: data.LTP,
        product: data.product, 						
        status: data.status,
        tradingStyle: data.tradingStyle
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getOrder(user: any) {
    try {
      return await this.orderInstance
        .scan()
        .where('userId')
        .eq(user.id)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getOrderById(id: string, user: any) {
    try {
      const orderData = await this.orderInstance.get(id);
      if (!orderData || user.id !== orderData.userId) {
        throw new InternalServerErrorException('Order not found');
      }
      return orderData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteOrder(id: string, user: any) {
    try {
      const orderData = await this.orderInstance.get(id);
      if (!orderData || user.id != orderData.userId) {
        return {
          status: 500,
          message: 'No order found',
        };
      }
      await this.orderInstance.delete(orderData.orderId);
      return {
        status: 200,
        message: 'order is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
 }
}
