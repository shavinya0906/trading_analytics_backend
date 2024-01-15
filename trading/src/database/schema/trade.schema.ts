import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const dynamicColumnSchema = new dynamoose.Schema({
  key: {
    type: String,
  },
  value: {
    type: String,
  },
});

export const TradeSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  asset_class: {
    type: String,
    // required: true,
  },
  position_size: {
    type: Number,
    // required: true,
  },
  points_captured: {
    type: Number,
    // required: true,
  },
  trade_pnl: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  buy_sell: {
    type: String,
    required: true,
  },
  trade_remark: {
    type: String,
    // required: true,
  },
  trade_karma: {
    type: String,
    // required: true,
  },
  trade_date: {
    type: String,
    required: true,
  },
  holding_trade_type: {
    type: String,
    // required: true,
  },
  trade_charges: {
    type: Number,
    // required: true,
  },
  trading_account: {
    type: String,
    // required: true,
  },
  stop_loss: {
    type: Number,
    // required: true,
  },
  trade_target: {
    type: Number,
    // required: true,
  },
  trade_conviction: {
    // required: true,
    type: String,
  },
  strategy_used: {
    // required: true,
    type: String,
  },
  trade_risk: {
    // required: true,
    type: String,
  },
  reason_for_trade: {
    // required: true,
    type: String,
  },
  percentage_of_account_risked: {
    // required: true,
    type: Number,
  },
  image: {
    // required: true,
    type: String,
  },
  trade_slippage: {
    // required: true,
    type: Number,
  },
  trade_penalties: {
    // required: true,
    type: Number,
  },
  net_roi: {
    // required: true,
    type: Number,
  },
  trade_customizable: {
    // required: true,
    type: String,
  },
  opening_balance: {
    required: true,
    type: Number,
  },
  trade_tags: {
    // required: true,
    type: String,
  },
  user_id: {
    required: true,
    type: String,
  },
  comment: {
    // required: true,
    type: String,
  },
  dynamicColumn: {
    required: false,
    type: Array,
    schema: [dynamicColumnSchema],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  emotion_influence: {
    type: String,
    required: false,
  },
  follow_plan: {
    type: String,
    required: false,
  },
  confidence_on_decisions: {
    type: String,
    required: false,
  },
  experience_regret: {
    type: String,
    required: false,
  },
  take_unnecessary_risks: {
    type: String,
    required: false,
  },
  feel_anxious_or_stressed: {
    type: String,
    required: false,
  },
  attached_or_averse_to_stocks: {
    type: String,
    required: false,
  },
  ideas_for_future_improvements: {
    type: String,
    required: false,
  },
});
