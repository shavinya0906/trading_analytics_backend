import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { CreateMonthlyQuestionnaireDTO } from 'src/core/dto/monthly.dto';
import { MonthlyQuestionnaireEntity } from 'src/database/entity/monthly.entity';
import { MonthlyQuestionnaireSchema } from 'src/database/schema/monthly.schema';
import * as dynamoose from 'dynamoose';

@Injectable()
export class MonthlyQuestionnaireService {
  private questionnaireInstance: Model<MonthlyQuestionnaireEntity>;

  constructor() {
    this.questionnaireInstance = dynamoose.model<MonthlyQuestionnaireEntity>(
      'monthly-questionnaire',
      MonthlyQuestionnaireSchema,
    );
  }

  async createMonthlyQuestionnaire(
    data: CreateMonthlyQuestionnaireDTO,
    user: any,
  ) {
    try {
      const currentMonth = new Date().toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const newQuestionnaire = await this.questionnaireInstance.create({
        ...data,
        user_id: user.id,
        month: currentMonth, // Assuming 'month' is a field in MonthlyQuestionnaireEntity
      });

      return newQuestionnaire;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getMonthlyQuestionnaires() {
    try {
      return await this.questionnaireInstance.scan().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateMonthlyQuestionnaire(id: string, data: any, user: any) {
    try {
      const questionnaireData = await this.questionnaireInstance.get(id);

      if (!questionnaireData || user.id !== questionnaireData.user_id) {
        return {
          status: 500,
          message: 'No questionnaire found',
        };
      }

      await this.questionnaireInstance.update({ id: id }, data);
      return await this.questionnaireInstance.get(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteMonthlyQuestionnaire(id: string) {
    try {
      const questionnaireData = await this.questionnaireInstance.get(id);

      if (!questionnaireData) {
        return {
          status: 500,
          message: 'No questionnaire found',
        };
      }

      await this.questionnaireInstance.delete(questionnaireData.id);
      return {
        status: 200,
        message: 'Questionnaire is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
