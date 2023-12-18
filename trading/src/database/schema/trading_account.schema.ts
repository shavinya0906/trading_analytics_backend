import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const TradeAccountSchema = new dynamoose.Schema({
  account_Id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  trading_account: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  }
});