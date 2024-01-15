import { Item } from 'dynamoose/dist/Item';

export class MonthlyQuestionnaireEntity extends Item {
  id: string;
  user_id: string; // Assuming 'user_id' is changed to 'userId' for consistency
  totalProfitLoss: number; // What was the total profit or loss for the month compared to previous months?
  mostProfitableTrades: string; // What were the most profitable trades and what strategies were used?
  leastProfitableTrades: string; // What were the least profitable trades and what went wrong?
  commonReasonsForTrades: string; // What were the most common reasons for entering and existing trades and were they successful?
  marketConditionsImpact: string; // How did market conditions and news events affect trading performance?
  changesToTradingPlan: string; // What changes were made to the trading plan or strategies and how did they impact performance?
  riskManagementConsistency: string; // Were the risk management positions sizing strategies followed consistently, and were they effective?
  emotionsAndBiases: string; // Were emotions and biases a factor in trading decision and if so how can they be addressed?
  lessonsLearned: string; // What lessons were learned from month’s trading and how can they be applied in future trading?
  goalsForUpcomingMonth: string; // What were the goals for the upcoming month and what steps will be taken to achieve them?
  month:string;
}