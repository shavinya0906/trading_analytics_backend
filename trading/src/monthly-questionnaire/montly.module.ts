import { Module } from '@nestjs/common';
import { MonthlyQuestionnaireController } from './monthly.controller';
import { MonthlyQuestionnaireService } from './monthly.service';

@Module({
  controllers: [MonthlyQuestionnaireController],
  providers: [MonthlyQuestionnaireService]
})
export class MonthlyQuestionnaireModule {}
