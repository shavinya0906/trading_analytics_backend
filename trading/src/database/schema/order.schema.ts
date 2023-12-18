import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const OrderSchema = new dynamoose.Schema({
    orderId: {
    type: String,
    hashKey: true,
    default: uuidv4,
    },
    userId: {
        type: String,
        required: true
    },
    orderType: {
        type: String,
        required: true
    },
    tradingType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    priceType: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    stopLossType: {
        type: String,
        required: false
    },
    stopLossPrice: {
        type: Number,
        required: false
    },
    triggerPrice: {
        type: Number,
        required: false
    },
    time: {
        type: Date,
        required: true
    },
    instrument: {
        type: String,
        required: true
    },
    LTP: {
        type: Number,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tradingStyle: {
        type: String,
        required: true
    }
  });