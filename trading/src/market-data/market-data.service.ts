import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { Model } from 'dynamoose/dist/Model';
import { CreateMarketDTO } from 'src/core/dto';
import { MarketEntity } from 'src/database/entity';
import { MarketSchema } from 'src/database/schema';

@Injectable()
export class MarketDataService {
    private marketDataInstance: Model<MarketEntity>;
  constructor() {
    this.marketDataInstance = dynamoose.model<MarketEntity>('marketData', MarketSchema);
  }
  async createMarketData(data: CreateMarketDTO) {
    try {
      return await this.marketDataInstance.create({
        Instrument: data.Instrument,
        Timestamp: data.Timestamp,
        MarketPrice: data.MarketPrice,
        Volume: data.Volume,
        BidPrice: data.BidPrice,
        AskPrice: data.AskPrice,
        HighPrice: data.HighPrice,
        LowPrice: data.LowPrice,
        OpenPrice: data.OpenPrice,
        ClosePrice: data.ClosePrice,
        Spread: data.Spread,
        MarketDataStatus: data.MarketDataStatus,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getMarketData() {
    try {
      return await this.marketDataInstance.scan().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteMarketData(id: string, user: any) {
    try {
      const marketData = await this.marketDataInstance.get(id);
      if (!marketData) {
        return {
          status: 500,
          message: 'No data found',
        };
      }
      await this.marketDataInstance.delete(marketData.MarketDataID);
      return {
        status: 200,
        message: 'data is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
}
}
