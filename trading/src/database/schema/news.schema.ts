import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const NewsSchema = new dynamoose.Schema({
  news_Id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  publish_date: {
    type: Date,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});
