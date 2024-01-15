import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const MonthlyQuestionnaireSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  user_id: {
    type: String,
    required: true,
  },
  totalProfitLoss: {
    type: Number,
    required: false,
  },
  mostProfitableTrades: {
    type: String,
    required: false,
  },
  leastProfitableTrades: {
    type: String,
    required: false,
  },
  commonReasonsForTrades: {
    type: String,
    required: false,
  },
  marketConditionsImpact: {
    type: String,
    required: false,
  },
  changesToTradingPlan: {
    type: String,
    required: false,
  },
  riskManagementConsistency: {
    type: String,
    required: false,
  },
  emotionsAndBiases: {
    type: String,
    required: false,
  },
  lessonsLearned: {
    type: String,
    required: false,
  },
  goalsForUpcomingMonth: {
    type: String,
    required: false,
  },
  month: {
    type: String,
    required: false,
  },
});
