import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const UserSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  auth_token: {
    type: String,
    required: false,
  },
  is_third_party_login: {
    type: String,
    required: false,
  },
  third_party_token: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});
