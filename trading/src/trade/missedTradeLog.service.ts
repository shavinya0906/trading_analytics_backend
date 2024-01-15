import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import * as dynamoose from 'dynamoose';
import { TradeSchema } from 'src/database/schema';
import { TradeEntity } from 'src/database/entity';
import { CreateTradeDTO, UpdateTradeDTO } from 'src/core/dto';
// import {
//   CreateTradeAdvanceDTO,
//   UpdateTradeAdvanceDTO,
// } from 'src/core/dto/trade-advance.dto';
// import { TradeAdvanceSchema } from 'src/database/schema/trade-advance.schema';

@Injectable()
export class MissedTradeService {
  private missedTradeInstance: Model<TradeEntity>;
  // private MissedTradeAdvanceInstance: Model<MissedTradeAdvanceEntity>;
  constructor() {
    this.missedTradeInstance = dynamoose.model<TradeEntity>(
      'missed-trade-log',
      TradeSchema,
    );
    // this.MissedTradeAdvanceInstance = dynamoose.model<MissedTradeAdvanceEntity>(
    //   'MissedTrade_advance',
    //   MissedTradeAdvanceSchema,
    // );
  }
  async createMissedTrade(data: CreateTradeDTO, user: any) {
    try {
      const allMissedTrades = await this.missedTradeInstance.scan().exec();
      const sortedMissedTrades = allMissedTrades.sort((a, b) =>
        a.trade_date > b.trade_date ? -1 : 1,
      );
      const lastMissedTrade = sortedMissedTrades[0];
      let opening_balance = data.opening_balance;
      if (lastMissedTrade) {
        opening_balance = data.trade_pnl + lastMissedTrade.opening_balance;
      }
      const missedTrades = await this.missedTradeInstance.create({
        asset_class: data.asset_class,
        position_size: data.position_size,
        points_captured: data.points_captured,
        trade_pnl: data.trade_pnl,
        position: data.position,
        buy_sell: data.buy_sell,
        trade_remark: data.trade_remark,
        trade_karma: data.trade_karma,
        trade_date: data.trade_date,
        holding_trade_type: data.holding_trade_type,
        trade_charges: data.trade_charges || 0,
        trading_account: data.trading_account,
        stop_loss: data.stop_loss,
        trade_target: data.trade_target,
        user_id: user.id,
        trade_conviction: data.trade_conviction,
        strategy_used: data.strategy_used,
        trade_risk: data.trade_risk,
        reason_for_trade: data.reason_for_trade,
        percentage_of_account_risked: data.percentage_of_account_risked || 0,
        image: data.image,
        trade_slippage: data.trade_slippage,
        trade_penalties: data.trade_penalties,
        net_roi: data.net_roi,
        trade_customizable: data.trade_customizable,
        opening_balance: opening_balance,
        trade_tags: data.trade_tags,
        comment: data.comment,
        dynamicColumn: [],
      });
      if (missedTrades.id || data.dynamicColumn.length !== 0) {
        const tradeData = await this.missedTradeInstance.get(missedTrades.id);
        const existingDynamicColumn = data.dynamicColumn || [];
        tradeData.dynamicColumn = existingDynamicColumn;
        await tradeData.save();
        return tradeData;
      } else {
        return missedTrades;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateTrades(
    trades: { id: string; data: UpdateTradeDTO }[],
    user: any,
  ) {
    try {
      const updatedTrades = [];

      for (const trade of trades) {
        const tradeData = await this.missedTradeInstance.get(trade.id);

        if (!tradeData || user.id !== tradeData.user_id) {
          updatedTrades.push({
            status: 500,
            message: `No trade found for trade with ID: ${trade.id}`,
          });
          continue;
        }

        const updatedData = { ...tradeData, ...trade.data };
        delete updatedData.id;

        await this.missedTradeInstance.update({ id: trade.id }, updatedData);
        updatedTrades.push(await this.missedTradeInstance.get(trade.id));
      }

      return updatedTrades;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateMissedTrade(id: string, data: UpdateTradeDTO, user: any) {
    try {
      const tradeData = await this.missedTradeInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      const dataatAfterUpdate = await this.missedTradeInstance.update(
        { id: id },
        data,
      );
      return await this.missedTradeInstance.get(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sortByField(data: any[], field: string, reverse = false) {
    return data.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) => {
        if (field === 'trade_date') {
          // Sort by date (convert to timestamps for comparison)
          const dateA = new Date(a[field]).getTime();
          const dateB = new Date(b[field]).getTime();
          return reverse ? dateB - dateA : dateA - dateB;
        } else {
          // Sort by other fields
          if (a[field] < b[field]) {
            return reverse ? 1 : -1;
          }
          if (a[field] > b[field]) {
            return reverse ? -1 : 1;
          }
          return 0;
        }
      },
    );
  }

  async getMissedTrade(
    user: any,
    filters: {
      sortOrder: any;
      sortByField: any;
      assetClass: any;
      conviction: any;
      strategyUsed: any;
      minPnL: any;
      maxPnL: any;
      holdingTradeType: any;
      tradingAccount: any;
      startDate: string;
      endDate: string;
      date: string;
      page: number;
      pageSize: number;
    },
  ) {
    try {
      const query = this.missedTradeInstance
        .scan()
        .where('user_id')
        .eq(user.id);

      if (filters.assetClass) {
        const assetClasses = filters.assetClass.split(',');
        query.where('asset_class').in(assetClasses);
      }

      if (filters.conviction) {
        const convictions = filters.conviction.split(',');
        query.where('trade_conviction').in(convictions);
      }

      if (filters.strategyUsed) {
        const strategyUseds = filters.strategyUsed.split(',');
        query.where('strategy_used').in(strategyUseds);
      }

      if (filters.minPnL && filters.maxPnL) {
        query.where('trade_pnl').between(filters.minPnL, filters.maxPnL);
      }

      if (filters.holdingTradeType) {
        const holdingTradeTypes = filters.holdingTradeType.split(',');
        query.where('holding_trade_type').in(holdingTradeTypes);
      }

      if (filters.tradingAccount) {
        const tradingAccounts = filters.tradingAccount.split(',');
        query.where('trading_account').in(tradingAccounts);
      }

      if (filters.startDate && filters.endDate) {
        query.where('trade_date').between(filters.startDate, filters.endDate);
      } else if (filters.date) {
        query.where('trade_date').eq(filters.date);
      }

      const tradeData = await query.exec();
      let paginatedTradeData: TradeEntity[] = tradeData.sort((a, b) =>
        a.trade_date > b.trade_date ? -1 : 1,
      );

      if (filters.page && filters.pageSize) {
        const startIndex = (filters.page - 1) * filters.pageSize;
        const endIndex = Math.min(
          filters.page * filters.pageSize,
          tradeData.length,
        );

        paginatedTradeData = tradeData.slice(startIndex, endIndex);
      }

      const dataToReturn = {
        totalRecords: tradeData.length,
        data: paginatedTradeData,
      };

      //if paginatedTradeData.length >0 sending last added trade opening_balance also
      if (paginatedTradeData.length > 0) {
        dataToReturn['lastAddedTradeOpeningBalance'] =
          paginatedTradeData[0].opening_balance;
      }

      return dataToReturn;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getMissedTradeById(id: string, user: any) {
    try {
      const tradeData = await this.missedTradeInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      return tradeData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteMissedTrade(id: string, user: any) {
    try {
      const tradeData = await this.missedTradeInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      await this.missedTradeInstance.delete(tradeData.id);
      return {
        status: 200,
        message: 'Trade is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async createTradeAdvance(data: CreateTradeAdvanceDTO, user: any) {
  //   try {
  //     return await this.tradeAdvanceInstance.create({
  //       trade_conviction: data.trade_conviction,
  //       strategy_used: data.strategy_used,
  //       trade_risk: data.trade_risk,
  //       reason_for_trade: data.reason_for_trade,
  //       percentage_of_account_risked: data.percentage_of_account_risked,
  //       image: data.image,
  //       trade_slippage: data.trade_slippage,
  //       trade_penalties: data.trade_penalties,
  //       net_roi: data.net_roi,
  //       trade_customizable: data.trade_customizable,
  //       opening_balance: data.opening_balance,
  //       trade_tags: data.trade_tags,
  //       user_id: user.id,
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  // async updateTradeAdvance(id: string, data: UpdateTradeAdvanceDTO, user: any) {
  //   try {
  //     const tradeData = await this.tradeAdvanceInstance.get(id);
  //     if (!tradeData || user.id != tradeData.user_id) {
  //       return {
  //         status: 500,
  //         message: 'No trade found',
  //       };
  //     }
  //     const dataatAfterUpdate = await this.tradeAdvanceInstance.update(
  //       { id: id },
  //       data,
  //     );
  //     return await this.tradeAdvanceInstance.get(id);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
  // async getTradeAdvance(user: any) {
  //   try {
  //     return await this.tradeAdvanceInstance
  //       .scan()
  //       .where('user_id')
  //       .eq(user.id)
  //       .exec();
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
  // async getTradeAdvanceById(id: string, user: any) {
  //   try {
  //     const tradeData = await this.tradeAdvanceInstance.get(id);
  //     if (!tradeData || user.id != tradeData.user_id) {
  //       return {
  //         status: 500,
  //         message: 'No trade found',
  //       };
  //     }
  //     return tradeData;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
  // async deleteTradeAdvance(id: string, user: any) {
  //   try {
  //     const tradeData = await this.tradeAdvanceInstance.get(id);
  //     if (!tradeData || user.id != tradeData.user_id) {
  //       return {
  //         status: 500,
  //         message: 'No trade found',
  //       };
  //     }
  //     await this.tradeAdvanceInstance.delete(tradeData.id);
  //     return {
  //       status: 200,
  //       message: 'Trade is deleted',
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
}
