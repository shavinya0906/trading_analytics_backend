import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { CreateSessionsDTO } from 'src/core/dto/sessions.dto';
import { SessionsEntity } from 'src/database/entity/sessions.entity';
import { SessionsSchema } from 'src/database/schema/sessions.schema';
import * as dynamoose from 'dynamoose';

@Injectable()
export class SessionsService {
  private sessionsInstance: Model<SessionsEntity>;
  constructor() {
    this.sessionsInstance = dynamoose.model<SessionsEntity>(
      'sessions',
      SessionsSchema,
    );
  }
  async createsessions(data: CreateSessionsDTO, user: any) {
    try {
      return await this.sessionsInstance.create({
        // sessions_name: data.sessions_name,
        ...data,
        user_id: user.id,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getsessions(user:any) {
    try {
      return await this.sessionsInstance.scan().where('user_id').eq(user.id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updatesessions(id: string, data: any, user: any) {
    try {
      const tradeData = await this.sessionsInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      const dataatAfterUpdate = await this.sessionsInstance.update(
        { sessions_Id: id },
        data,
      );
      return await this.sessionsInstance.get(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deletesessions(id: string) {
    try {
      const accountData = await this.sessionsInstance.get(id);
      if (!accountData) {
        return {
          status: 500,
          message: 'No order found',
        };
      }
      await this.sessionsInstance.delete(accountData.id);
      return {
        status: 200,
        message: 'order is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
