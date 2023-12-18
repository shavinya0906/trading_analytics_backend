import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const MarketSchema = new dynamoose.Schema({
    MarketDataID: {
        type: String,
        hashKey: true, // Primary Key
        default: uuidv4,
      },
      Instrument: {
        type: String,
        required: true,
      },
      Timestamp: {
        type: Date,
        required: true,
      },
      MarketPrice: {
        type: Number,
        required: true,
      },
      Volume: {
        type: Number,
        required: true,
      },
      BidPrice: {
        type: Number,
        required: true,
      },
      AskPrice: {
        type: Number,
        required: true,
      },
      HighPrice: {
        type: Number,
        required: true,
      },
      LowPrice: {
        type: Number,
        required: true,
      },
      OpenPrice: {
        type: Number,
        required: true,
      },
      ClosePrice: {
        type: Number,
        required: true,
      },
      Spread: {
        type: Number,
        required: true,
      },
      MarketDataStatus: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: () => new Date(),
      },
})