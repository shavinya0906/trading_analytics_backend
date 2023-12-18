import { Item } from 'dynamoose/dist/Item';

export class TradeAdvanceEntity extends Item {
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
  id: string;
  user_id: string;
}
