import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import * as dynamoose from 'dynamoose';
import { ExcelEntity } from 'src/database/entity';
import { ExcelSchema } from 'src/database/schema';

@Injectable()
export class TradeLogService {
    private tradeLogInstance: Model<ExcelEntity>;
  constructor() {
    this.tradeLogInstance = dynamoose.model<ExcelEntity>('trade-log', ExcelSchema);
  }
    async getAllTradeLog() {
        try {
          return await this.tradeLogInstance.scan().exec();
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      }

      async deleteTradeLog(id: string) {
        try {
          const orderData = await this.tradeLogInstance.get(id);
          if (!orderData) {
            return {
              status: 500,
              message: 'No log found',
            };
          }
          await this.tradeLogInstance.delete(orderData.tradeLogId);
          return {
            status: 200,
            message: 'order is deleted',
          };
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
     }
}
