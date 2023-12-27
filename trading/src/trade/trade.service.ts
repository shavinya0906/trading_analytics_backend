import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import * as dynamoose from 'dynamoose';
import { TradeSchema } from 'src/database/schema';
import { TradeAdvanceEntity, TradeEntity } from 'src/database/entity';
import { CreateTradeDTO, UpdateTradeDTO } from 'src/core/dto';
// import {
//   CreateTradeAdvanceDTO,
//   UpdateTradeAdvanceDTO,
// } from 'src/core/dto/trade-advance.dto';
// import { TradeAdvanceSchema } from 'src/database/schema/trade-advance.schema';

@Injectable()
export class TradeService {
  private tradeInstance: Model<TradeEntity>;
  // private tradeAdvanceInstance: Model<TradeAdvanceEntity>;
  constructor() {
    this.tradeInstance = dynamoose.model<TradeEntity>('trade', TradeSchema);
    // this.tradeAdvanceInstance = dynamoose.model<TradeAdvanceEntity>(
    //   'trade_advance',
    //   TradeAdvanceSchema,
    // );
  }

  async createTrades(dataList: CreateTradeDTO[], user: any) {
    try {
      const allTrades = await this.tradeInstance.scan().exec();
      const sortedTrades = allTrades.sort((a, b) =>
        a.trade_date > b.trade_date ? -1 : 1,
      );
      let opening_balance = dataList[0].opening_balance;
  
      if (sortedTrades.length > 0) {
        opening_balance =
          dataList[0].trade_pnl + sortedTrades[0].opening_balance;
      }
  
      const insertedTrades = [];
  
      for (const data of dataList) {
        const trade = await this.tradeInstance.create({
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
          percentage_of_account_risked:
            data.percentage_of_account_risked || 0,
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
  
        if (trade.id || data.dynamicColumn.length !== 0) {
          const tradeData = await this.tradeInstance.get(trade.id);
          const existingDynamicColumn = data.dynamicColumn || [];
          tradeData.dynamicColumn = existingDynamicColumn;
          await tradeData.save();
          insertedTrades.push(tradeData);
        } else {
          insertedTrades.push(trade);
        }
      }
  
      return insertedTrades;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  
  async createTrade(data: CreateTradeDTO, user: any) {
    try {
      const allTrades = await this.tradeInstance.scan().exec();
      const sortedTrades = allTrades.sort((a, b) =>
        a.trade_date > b.trade_date ? -1 : 1,
      );
      const lastTrade = sortedTrades[0];
      let opening_balance = data.opening_balance;
      if (lastTrade) {
        opening_balance = data.trade_pnl + lastTrade.opening_balance;
      }
      const trades = await this.tradeInstance.create({
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
      if (trades.id || data.dynamicColumn.length !== 0) {
        const tradeData = await this.tradeInstance.get(trades.id);
        const existingDynamicColumn = data.dynamicColumn || [];
        tradeData.dynamicColumn = existingDynamicColumn;
        await tradeData.save();
        return tradeData;
      } else {
        return trades;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateTrade(id: string, data: UpdateTradeDTO, user: any) {
    try {
      const tradeData = await this.tradeInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      const dataatAfterUpdate = await this.tradeInstance.update(
        { id: id },
        data,
      );
      return await this.tradeInstance.get(id);
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

  async getTrade(
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
    },
  ) {
    try {
      const query = this.tradeInstance.scan().where('user_id').eq(user.id);

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
      const sortedTradeData = this.sortByField(
        tradeData,
        filters.sortByField,
        filters.sortOrder === 'desc',
      );
      return sortedTradeData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getTradeById(id: string, user: any) {
    try {
      const tradeData = await this.tradeInstance.get(id);
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
  async deleteTrade(id: string, user: any) {
    try {
      const tradeData = await this.tradeInstance.get(id);
      if (!tradeData || user.id != tradeData.user_id) {
        return {
          status: 500,
          message: 'No trade found',
        };
      }
      await this.tradeInstance.delete(tradeData.id);
      return {
        status: 200,
        message: 'Trade is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  sortDataBy = (data:any[]) => {
    let sortedData;
    const arrayForSort = [...data];
    sortedData = arrayForSort.sort((a, b) => {
      let x = a?.trade_date;
      let y = b?.trade_date;
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
      return 0;
    });
    return sortedData;
  };

  async getTradeAvg(user: any, startDate?: string, endDate?: string) {

    try {

      let query = this.tradeInstance.scan().where('user_id').eq(user.id);
      if (startDate && endDate) {
        query = query.where('trade_date').between(startDate, endDate);
      }

      let tradeData = await query.exec();
      tradeData = this.sortDataBy(tradeData);

      if (tradeData?.length > 0) {
        // Function to calculate Net PNL and Avg Return/Day
        function calculatePNLAndAvgReturn(trades: any[]) {
          let totalPNL = 0;
          let totalDays = 0;

          for (const trade of trades) {
            totalPNL += trade.trade_pnl; // Assuming trade_pnl is in the format "$500.23"
            totalDays++;
          }

          const netPNL = totalPNL;
          const avgReturnPerDay = totalPNL / totalDays;

          return { netPNL, avgReturnPerDay };
        }

        // Function to calculate Karma Factor
        function calculateKarmaFactor(trades: any[]) {
          let positiveSum = 0;
          let negativeSum = 0;

          for (const trade of trades) {
            if (trade.trade_karma === 'Satisfied') {
              positiveSum += 1;
            } else {
              negativeSum += 1;
            }
          }

          const karmaFactor = positiveSum / negativeSum;

          return [!Number.isNaN(karmaFactor) ? karmaFactor : 0 ,positiveSum,negativeSum];
        }

        // Function to calculate Max DD
        function calculateMaxDD(trades: any[]) {
          let cumulativePnl=[0];
          let hightWaterMark=[0];
          let drawDown=[0];

          //Calculate cumulative Pnl
          for (const trade of trades) {
            const pnl = trade.trade_pnl;
            cumulativePnl.push(cumulativePnl[cumulativePnl.length-1]+pnl);
          }

          //Calculate high water mark and drawdown
          for (let i=1;i<cumulativePnl.length;i++){
            hightWaterMark.push(Math.max(hightWaterMark[i-1],cumulativePnl[i]));
            drawDown.push(cumulativePnl[i]-hightWaterMark[i]);
          }

          //Find the maximum drawdown
          const maxDD=Math.max(...drawDown);

          return !Number.isNaN(maxDD) ? maxDD : 0;
        }

        // Function to calculate Win%
        function calculateWinPercentage(trades: any[]) {
          let profitableDays = 0;
          let totalDays = trades.length;

          for (const trade of trades) {
            const pnl = trade.trade_pnl;

            if (pnl > 0) {
              profitableDays++;
            }
          }

          const winPercentage = (profitableDays / totalDays) * 100;

          return !Number.isNaN(winPercentage) ? winPercentage : 0;
        }

        // Function to calculate R:R Ratio
        function calculateRRRatio(trades: any[]) {
          if (trades.length === 0) {
            return 0;
          }
          const sum = trades.reduce((accumulator, trade) => {
            const tradeRisk = trade.trade_risk;
            const [a, b] = tradeRisk.split(' : ').map(Number);
            return accumulator + a / b;
          }, 0);
          const average = sum / trades.length;
          return !Number.isNaN(average) ? average : 0;
        }

        // Function to calculate Avg Winning and Losing Trade
        function calculateAvgWinningAndLosingTrade(trades: any[]) {
          let totalWinningTrade = 0;
          let totalLosingTrade = 0;
          let winningCount = 0;
          let losingCount = 0;

          for (const trade of trades) {
            const pnl = trade.trade_pnl;

            if (pnl > 0) {
              totalWinningTrade += pnl;
              winningCount++;
            } else {
              totalLosingTrade += pnl;
              losingCount++;
            }
          }

          const avgWinningTrade = totalWinningTrade / winningCount;
          const avgLosingTrade = totalLosingTrade / losingCount;

          const percentageWinningTrades = (winningCount / trades.length) * 100;
          const percentageLosingTrades = (losingCount / trades.length) * 100;

          return { percentageWinningTrades, percentageLosingTrades,avgLosingTrade,avgWinningTrade };
        }

        function calculateEquityCurve(tradeData) {
          const equityCurveData = [];
          tradeData.forEach(
            (trade: {
              opening_balance: any;
              trade_date: string | number | Date;
              trade_pnl: any;
            }) => {
              let openingBalance = trade.opening_balance;
              const tradeDate = new Date(trade.trade_date);
              const tradePNL = trade.trade_pnl;
              openingBalance += tradePNL;

              equityCurveData.push({
                date: tradeDate,
                equity: openingBalance,
              });
            },
          );

          return equityCurveData;
        }

        function calculateTradeCharges(tradeData){
          let totalTradeCharges=0;
          tradeData.forEach((trade)=>{
            totalTradeCharges+=trade.trade_charges;
          });
          return totalTradeCharges;
        }

        function calculateTradePenalties(tradeData){
          let totalTradePenalties=0;
          tradeData.forEach((trade)=>{
            totalTradePenalties+=trade.trade_penalties;
          });
          return totalTradePenalties;
        }

        const uniqueMonths = new Set();
        const uniqueStrategies = new Set();
        tradeData.forEach((trade) => {
          const tradeDate = new Date(trade.trade_date);
          const tradeMonth = tradeDate.toLocaleString('default', {
            month: 'short',
          });
          const strategy = trade.strategy_used;

          uniqueMonths.add(tradeMonth);
          uniqueStrategies.add(strategy);
        });
        const monthsArray = [...uniqueMonths];
        const strategiesArray = [...uniqueStrategies];
        const strategyData = [];
        for (const strategy of strategiesArray) {
          for (const month of monthsArray) {
            const dataForStrategyAndMonth = {
              strategy: strategy,
              month: month,
              profitInMonth: 0,
            };
            for (const trade of tradeData) {
              const tradeMonth = new Date(trade.trade_date).toLocaleString(
                'default',
                { month: 'short' },
              );
              if (tradeMonth === month && trade.strategy_used === strategy) {
                dataForStrategyAndMonth.profitInMonth += trade.trade_pnl;
              }
            }
            if (dataForStrategyAndMonth.profitInMonth !== 0) {
              strategyData.push(dataForStrategyAndMonth);
            }
          }
        }
        const { netPNL, avgReturnPerDay } = calculatePNLAndAvgReturn(tradeData);
        const karmaFactor = calculateKarmaFactor(tradeData);
        const maxDD = calculateMaxDD(tradeData);
        const winPercentage = calculateWinPercentage(tradeData);
        const avgRRRatio = calculateRRRatio(tradeData);
        const { percentageWinningTrades, percentageLosingTrades,avgLosingTrade,avgWinningTrade } =
          calculateAvgWinningAndLosingTrade(tradeData);
        const transformedData = tradeData.map((trade) => ({
          trade_date: trade.trade_date,
          trade_pnl: trade.trade_pnl,
        }));
        const equityCurveData = calculateEquityCurve(tradeData);
        const totalTradeCharges=calculateTradeCharges(tradeData);
        const totalTradePenalties=calculateTradePenalties(tradeData);

        const data = {
          netPNL: netPNL,
          avgReturnPerDay: avgReturnPerDay,
          karmaFactor: karmaFactor,
          winPercentage: winPercentage,
          RRratio: avgRRRatio,
          avgWinningTrade: avgWinningTrade,
          avgLosingTrade: avgLosingTrade,
          maxDD: maxDD,
          dailyPnL: transformedData,
          strategies: strategyData,
          equityCurveData: equityCurveData,
          startDate:tradeData[0].trade_date,
          endDate:tradeData[tradeData.length-1].trade_date,
          totalTradeCharges:totalTradeCharges,
          openingBalance:tradeData[0].opening_balance,
          totalTradePenalties:totalTradePenalties,
        };
        return data;
      }
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
