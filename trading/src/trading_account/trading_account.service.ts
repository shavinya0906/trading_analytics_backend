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
      const tradeData = await this.tradingAccountInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      const dataatAfterUpdate = await this.tradingAccountInstance.update(
        { account_Id: id },
        data,
      );
      return await this.tradingAccountInstance.get(id);
    } catch (error) {
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
