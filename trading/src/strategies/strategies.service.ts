import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { CreateStrategiesDTO } from 'src/core/dto/strategies.dto';
import { StrategiesEntity } from 'src/database/entity/strategies.entity';
import { StrategiesSchema } from 'src/database/schema/strategies.schema';
import * as dynamoose from 'dynamoose';

@Injectable()
export class StrategiesService {
  private strategiesInstance: Model<StrategiesEntity>;
  constructor() {
    this.strategiesInstance = dynamoose.model<StrategiesEntity>(
      'strategies',
      StrategiesSchema,
    );
  }
  async createStrategies(data: CreateStrategiesDTO, user: any) {
    try {
      return await this.strategiesInstance.create({
        // strategies_name: data.strategies_name,
        ...data,
        user_id: user.id,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getStrategies(user:any) {
    try {
      return await this.strategiesInstance.scan().where('user_id').eq(user.id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateStrategies(id: string, data: any, user: any) {
    try {
      const tradeData = await this.strategiesInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      const dataatAfterUpdate = await this.strategiesInstance.update(
        { id: id },
        data,
      );
      return await this.strategiesInstance.get(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteStrategies(id: string) {
    try {
      const accountData = await this.strategiesInstance.get(id);
      if (!accountData) {
        return {
          status: 500,
          message: 'No order found',
        };
      }
      await this.strategiesInstance.delete(accountData.id);
      return {
        status: 200,
        message: 'order is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
