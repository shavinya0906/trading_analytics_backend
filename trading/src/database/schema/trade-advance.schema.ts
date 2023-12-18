import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const TradeAdvanceSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  trade_conviction: {
    required: true,
    type: String,
  },
  strategy_used: {
    required: true,
    type: String,
  },
  trade_risk: {
    required: true,
    type: String,
  },
  reason_for_trade: {
    required: true,
    type: String,
  },
  percentage_of_account_risked: {
    required: true,
    type: Number,
  },
  image: {
    required: true,
    type: String,
  },
  trade_slippage: {
    required: true,
    type: Number,
  },
  trade_penalties: {
    required: true,
    type: Number,
  },
  net_roi: {
    required: true,
    type: Number,
  },
  trade_customizable: {
    required: true,
    type: String,
  },
  opening_balance: {
    required: true,
    type: Number,
  },
  trade_tags: {
    required: true,
    type: String,
  },
  user_id: {
    required: true,
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});
