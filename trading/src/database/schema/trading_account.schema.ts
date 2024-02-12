import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const TradeAccountSchema = new dynamoose.Schema({
  id: {
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
  },
  account_client_id: {
    type: String,
  },
  account_email: {
    type: String,
  },
  account_mobile: {
    type: String,
  },
  account_name: {
    type: String,
  },
  purpose: {
    type: String,
  }
});
