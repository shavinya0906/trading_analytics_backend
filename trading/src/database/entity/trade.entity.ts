import { Item } from 'dynamoose/dist/Item';

export class TradeEntity extends Item {
  asset_class: string;
  position_size: number;
  points_captured: number;
  trade_pnl: number;
  position: string;
  buy_sell: string;
  trade_remark: string;
  trade_karma: string;
  trade_date: string;
  holding_trade_type: string;
  trade_charges: number;
  trading_account: string;
  stop_loss: number;
  trade_target: string;
  id: string;
  trade_conviction: string;
  strategy_used: string;
  trade_risk: string;
  reason_for_trade: string;
  percentage_of_account_risked: number;
  image: string;
  trade_slippage: number;
  trade_penalties: number;
  net_roi: number;
  trade_customizable: string;
  opening_balance: number;
  trade_tags: string;
  user_id: string;
  comment: string;
  dynamicColumn: any[];
}
