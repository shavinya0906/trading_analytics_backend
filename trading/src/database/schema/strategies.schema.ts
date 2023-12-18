import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const StrategiesSchema = new dynamoose.Schema({
  strategies_Id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  strategies_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  }
});