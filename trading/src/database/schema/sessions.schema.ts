import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const SessionsSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  session_startDate: {
    type: String,
    required: true,
  },
  session_endDate: {
    type: String,
    required: true,
  },
  session_rating: {
    type: String,
    required: true,
  },
  session_category: {
    type: String,
    required: true,
  },
  session_lessonsLearned: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  }
});