import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const UserColumnSchema = new dynamoose.Schema({
  column_id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  user_id: {
    required: true,
    type: String,
  },
  column_name: {
    type: String,
    required: true,
  },
});
