import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { TradeAccountEntity } from 'src/database/entity/trading_account.entity';
import { TradeAccountSchema } from 'src/database/schema/trading_account.schema';
import * as dynamoose from 'dynamoose';
import { CreateTradeAccountDTO } from 'src/core/dto/trade-account.dto';

@Injectable()
export class TradingAccountService {
  private tradingAccountInstance: Model<TradeAccountEntity>;
  constructor() {
    this.tradingAccountInstance = dynamoose.model<TradeAccountEntity>(
      'trading_account',
      TradeAccountSchema,
    );
  }
  async createTradeAccount(data: CreateTradeAccountDTO, user: any) {
    try {
      return await this.tradingAccountInstance.create({
        ...data,
        user_id: user.id,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getTradeAccount(user:any) {
    try {
      return await this.tradingAccountInstance.scan().where('user_id').eq(user.id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateTradeAccount(id: string, data: any, user: any) {
    try {
      // Fetch the trade data from the database
      const tradeData = await this.tradingAccountInstance.get(id);
  
      // Check if the trade exists
      if (!tradeData) {
        // If the trade does not exist, return a 404 response
        return {
          status: 404,
          message: 'Trade not found',
        };
      }
  
      // Check if the authenticated user has permission to update the trade
      if (user.id !== tradeData.user_id) {
        // If the user is not authorized, return a 403 response
        return {
          status: 403,
          message: 'Unauthorized to update the trade',
        };
      }
  
      // Update the trade data
      const updatedTrade = await this.tradingAccountInstance.update({ id: id }, data);
  
      // Return the updated trade data
      return updatedTrade;
    } catch (error) {
      // Handle any errors that occur during the update operation
      throw new InternalServerErrorException(error);
    }
  }
  

  async deleteTradeAccount(id: string) {
    try {
      const accountData = await this.tradingAccountInstance.get(id);
      if (!accountData) {
        return {
          status: 500,
          message: 'No order found',
        };
      }
      await this.tradingAccountInstance.delete(accountData.id);
      return {
        status: 200,
        message: 'order is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
