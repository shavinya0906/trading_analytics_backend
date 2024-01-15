import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const MantrasSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  mantras_desc: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});
