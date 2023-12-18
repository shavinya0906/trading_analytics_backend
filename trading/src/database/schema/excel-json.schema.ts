import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const ExcelSchema = new dynamoose.Schema({
  tradeLogId: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  date: {
    type: String,
    required: false,
  },
  close: {
    type: Number,
    required: false,
  },
  high: {
    type: Number,
    required: false,
  },
  low: {
    type: Number,
    required: false,
  },
  open: {
    type: Number,
    required: false,
  },
  volume: {
    type: Number,
    required: false,
  },
  sma5: {
    type: Number,
    required: false,
  },
  sma10: {
    type: Number,
    required: false,
  },
  sma15: {
    type: Number,
    required: false,
  },
  sma20: {
    type: Number,
    required: false,
  },
  ema5: {
    type: Number,
    required: false,
  },
  ema10: {
    type: Number,
    required: false,
  },
  ema15: {
    type: Number,
    required: false,
  },
  ema20: {
    type: Number,
    required: false,
  },
  upperband: {
    type: Number,
    required: false,
  },
  middleband: {
    type: Number,
    required: false,
  },
  lowerband: {
    type: Number,
    required: false,
  },
  HT_TRENDLINE: {
    type: Number,
    required: false,
  },
  KAMA10: {
    type: Number,
    required: false,
  },
  KAMA20: {
    type: Number,
    required: false,
  },
  KAMA30: {
    type: Number,
    required: false,
  },
  SAR: {
    type: Number,
    required: false,
  },
  TRIMA5: {
    type: Number,
    required: false,
  },
  TRIMA10: {
    type: Number,
    required: false,
  },
  TRIMA20: {
    type: Number,
    required: false,
  },
  ADX5: {
    type: Number,
    required: false,
  },
  ADX10: {
    type: Number,
    required: false,
  },
  ADX20: {
    type: Number,
    required: false,
  },
  APO: {
    type: Number,
    required: false,
  },
  CCI5: {
    type: Number,
    required: false,
  },
  CCI10: {
    type: Number,
    required: false,
  },
  CCI15: {
    type: Number,
    required: false,
  },
  macd510: {
    type: Number,
    required: false,
  },
  macd520: {
    type: Number,
    required: false,
  },
  macd1020: {
    type: Number,
    required: false,
  },
  macd1520: {
    type: Number,
    required: false,
  },
  macd1226: {
    type: Number,
    required: false,
  },
  MFI: {
    type: Number,
    required: false,
  },
  MOM10: {
    type: Number,
    required: false,
  },
  MOM15: {
    type: Number,
    required: false,
  },
  MOM20: {
    type: Number,
    required: false,
  },
  ROC5: {
    type: Number,
    required: false,
  },
  ROC10: {
    type: Number,
    required: false,
  },
  ROC20: {
    type: Number,
    required: false,
  },
  PPO: {
    type: Number,
    required: false,
  },
  RSI14: {
    type: Number,
    required: false,
  },
  RSI8: {
    type: Number,
    required: false,
  },
  slowk: {
    type: Number,
    required: false,
  },
  slowd: {
    type: Number,
    required: false,
  },
  fastk: {
    type: Number,
    required: false,
  },
  fastd: {
    type: Number,
    required: false,
  },
  fastksr: {
    type: Number,
    required: false,
  },
  fastdsr: {
    type: Number,
    required: false,
  },
  ULTOSC: {
    type: Number,
    required: false,
  },
  WILLR: {
    type: Number,
    required: false,
  },
  ATR: {
    type: Number,
    required: false,
  },
  Trange: {
    type: Number,
    required: false,
  },
  TYPPRICE: {
    type: Number,
    required: false,
  },
  HT_DCPERIOD: {
    type: Number,
    required: false,
  },
  BETA: {
    type: Number,
    required: false,
  },
  instrument: {
    type: String,
    required: false,
  },
});
