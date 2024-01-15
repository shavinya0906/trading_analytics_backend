import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateMonthlyQuestionnaireDTO {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  totalProfitLoss: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  mostProfitableTrades: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  leastProfitableTrades: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  commonReasonsForTrades: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  marketConditionsImpact: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  changesToTradingPlan: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  riskManagementConsistency: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  emotionsAndBiases: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  lessonsLearned: string= '';

  @ApiProperty({
    required: false,
  })
  @IsString()
  goalsForUpcomingMonth: string= '';

  //adding the month in which he added the data
    @ApiProperty({
        required: false,
    })
    @IsString()
    month: string= '';
}
