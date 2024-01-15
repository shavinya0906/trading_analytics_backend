import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { CreateMantrasDTO } from 'src/core/dto/mantras.dto';
import { MantrasEntity } from 'src/database/entity/mantras.entity';
import { MantrasSchema } from 'src/database/schema/mantras.schema';
import * as dynamoose from 'dynamoose';

@Injectable()
export class MantrasService {
  private MantrasInstance: Model<MantrasEntity>;
  constructor() {
    this.MantrasInstance = dynamoose.model<MantrasEntity>(
      'mantras',
      MantrasSchema,
    );
  }
  async createMantras(data: CreateMantrasDTO, user: any) {
    try {
      return await this.MantrasInstance.create({
        ...data,
        user_id: user.id,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getMantras() {
    try {
      return await this.MantrasInstance.scan().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateMantras(id: string, data: CreateMantrasDTO, user: any) {
    try {
      const tradeData = await this.MantrasInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      const updatedData = { ...tradeData, ...data };
      delete updatedData.id;
      const dataAfterUpdate = await this.MantrasInstance.update(
        { id: id },
        updatedData,
      );
  
      return await this.MantrasInstance.get(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteMantras(id: string) {
    try {
      const accountData = await this.MantrasInstance.get(id);
      if (!accountData) {
        return {
          status: 500,
          message: 'No order found',
        };
      }
      await this.MantrasInstance.delete(accountData.id);
      return {
        status: 200,
        message: 'order is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
