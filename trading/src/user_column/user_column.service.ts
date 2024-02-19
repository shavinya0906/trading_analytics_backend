import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { Model } from 'dynamoose/dist/Model';
import { CreateColumnDTO } from 'src/core/dto/user_column.dto';
import { TradeEntity } from 'src/database/entity';
import { UserColumnEntity } from 'src/database/entity/user-column.entity';
import { TradeSchema } from 'src/database/schema';
import { UserColumnSchema } from 'src/database/schema/user-column.schema';

@Injectable()
export class UserColumnService {
  private columnInstance: Model<UserColumnEntity>;
  private tradeInstance: Model<TradeEntity>;

  constructor() {
    this.columnInstance = dynamoose.model<UserColumnEntity>(
      'user_column',
      UserColumnSchema,
    );
    this.tradeInstance = dynamoose.model<TradeEntity>('trade', TradeSchema);
  }
  async createNewColumn(data: CreateColumnDTO, user: any) {
    try {
      const columnData = await this.columnInstance.create({
        user_id: user.id,
        column_name: data?.column_name,
      });
      const column_id = columnData?.id;
      const tradeLogData = await this.tradeInstance
        .scan('user_id')
        .eq(user.id)
        .exec();
      for (let index = 0; index < tradeLogData.length; index++) {
        const tradeData = await this.tradeInstance.get(tradeLogData[index].id);
        const existingDynamicColumn = tradeData.dynamicColumn || [];
        existingDynamicColumn.push({ key: column_id, value: '' });
        tradeData.dynamicColumn = existingDynamicColumn;
        await tradeData.save();
      }
      return {
        id:column_id,
        user_id:user.id,
        column_name: data?.column_name,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An error occurred',
        cause: error,
      });
    }
  }

  async getColumn(user: any) {
    try {
      return await this.columnInstance.scan('user_id').eq(user.id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //delete column?
  async deleteColumn(column_id: string, user: any) {
    try {
      const columnData = await this.columnInstance.get(column_id);
      if (columnData.user_id === user.id) {
        const tradeLogData = await this.tradeInstance
          .scan('user_id')
          .eq(user.id)
          .exec();
        for (let index = 0; index < tradeLogData.length; index++) {
          const tradeData = await this.tradeInstance.get(tradeLogData[index].id);
          const existingDynamicColumn = tradeData.dynamicColumn || [];
          const newDynamicColumn = existingDynamicColumn.filter(
            (item) => item.key !== column_id,
          );
          tradeData.dynamicColumn = newDynamicColumn;
          await tradeData.save();
        }
        await this.columnInstance.delete(column_id);
        return {
          message: 'Column deleted successfully',
        };
      } else {
        return {
          message: 'Column not found',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
