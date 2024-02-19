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
      if (lastTrade && !data.opening_balance) {
        //Opening balance = prev opening balance +pnl - charges - penalties
        opening_balance =
          data.trade_pnl +
          lastTrade.opening_balance -
          data.trade_charges -
          data.trade_penalties;
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

      const updatedData = { ...tradeData, ...data };
      delete updatedData.id;
      const dataAfterUpdate = await this.tradeInstance.update(
        { id: id },
        updatedData,
      );

      return await this.tradeInstance.get(id);
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
        const tradeData = await this.tradeInstance.get(trade.id);

        if (!tradeData || user.id !== tradeData.user_id) {
          updatedTrades.push({
            status: 500,
            message: `No trade found for trade with ID: ${trade.id}`,
          });
          continue;
        }

        const updatedData = { ...tradeData, ...trade.data };
        delete updatedData.id;

        await this.tradeInstance.update({ id: trade.id }, updatedData);
        updatedTrades.push(await this.tradeInstance.get(trade.id));
      }

      return updatedTrades;
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
      page?: number;
      pageSize?: number;
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
      let paginatedTradeData: TradeEntity[] = tradeData.sort((a, b) =>
        a.trade_date > b.trade_date ? -1 : 1,
      );
      const pageNumberr=filters.page||1;
      const pageSize=filters.pageSize||10;
        const startIndex = (pageNumberr - 1) * pageSize;
        const endIndex = Math.min(
          pageNumberr * pageSize,
          tradeData.length,
        );

        paginatedTradeData = tradeData.slice(startIndex, endIndex);

      const dataToReturn = {
        totalRecords: tradeData.length, 
        data: paginatedTradeData
      };

      //if paginatedTradeData.length >0 sending last added trade opening_balance also
      if (paginatedTradeData.length > 0) {
        dataToReturn['lastAddedTradeOpeningBalance'] = paginatedTradeData[0].opening_balance;
      }

      return dataToReturn;
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

  sortDataBy = (data: any[]) => {
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

          return [
            !Number.isNaN(karmaFactor) ? karmaFactor : 0,
            positiveSum,
            negativeSum,
          ];
        }

        // Function to calculate Max DD
        function calculateMaxDD(trades: any[]) {
          let cumulativePnl = [0];
          let hightWaterMark = [0];
          let drawDown = [0];

          //Calculate cumulative Pnl
          for (const trade of trades) {
            const pnl = trade.trade_pnl;
            cumulativePnl.push(cumulativePnl[cumulativePnl.length - 1] + pnl);
          }

          //Calculate high water mark and drawdown
          for (let i = 1; i < cumulativePnl.length; i++) {
            hightWaterMark.push(
              Math.max(hightWaterMark[i - 1], cumulativePnl[i]),
            );
            drawDown.push(cumulativePnl[i] - hightWaterMark[i]);
          }

          //Find the maximum drawdown
          const maxDD = Math.min(...drawDown);

          return !Number.isNaN(maxDD) ? -1 * maxDD : 0;
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
            if (tradeRisk) {
              const [a, b] = tradeRisk.split(' : ').map(Number);
              if (!isNaN(a) && !isNaN(b)) {
                return accumulator + a / b;
              }
            }
            return accumulator;
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

          return {
            percentageWinningTrades,
            percentageLosingTrades,
            avgLosingTrade,
            avgWinningTrade,
          };
        }

        function dailyPnlGraph(tradeData) {
          //summing up pnl values for the same day
          const dailyPnl = new Map();
          tradeData.forEach((trade) => {
            const tradeDate = new Date(trade.trade_date);
            const date = tradeDate.toLocaleDateString('en-CA');
            const pnl = trade.trade_pnl;
            if (!dailyPnl.has(date)) {
              dailyPnl.set(date, 0);
            }
            dailyPnl.set(date, dailyPnl.get(date) + pnl);
          });
          let arr = Array.from(dailyPnl).map(([k, v]) => ({
            trade_date: k,
            trade_pnl: v,
          }));
          arr.sort(
            (a, b) =>
              new Date(a.trade_date).getTime() -
              new Date(b.trade_date).getTime(),
          );
          return arr;
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

        function calculateTradeCharges(tradeData) {
          let totalTradeCharges = 0;
          tradeData.forEach((trade) => {
            totalTradeCharges += trade.trade_charges;
          });
          return totalTradeCharges;
        }

        function calculateTradePenalties(tradeData) {
          let totalTradePenalties = 0;
          tradeData.forEach((trade) => {
            totalTradePenalties += trade.trade_penalties;
          });
          return totalTradePenalties;
        }

        function strategyGraphData(tradeData) {
          const strategyTotals = new Map();

          let type = 'month';
          if (
            hasYearGap(
              new Date(tradeData[0].trade_date),
              new Date(tradeData[tradeData.length - 1].trade_date),
            )
          ) {
            type = 'year';
          } else {
            type = 'month';
          }

          tradeData.forEach((trade) => {
            const tradeDate = new Date(trade.trade_date);
            const year = tradeDate.getFullYear(); // Get the year
            const month = tradeDate.toLocaleString('default', {
              month: 'short',
            });

            const strategy = trade.strategy_used || 'NoStrategy';
            const tradeROI = trade.net_roi || 0;
            const key = `${year}_${month}_${strategy}`;
            const year_key = `${year}_${strategy}`;
            if (type == 'month') {
              if (!strategyTotals.has(key)) {
                strategyTotals.set(key, { total: 0, count: 0 });
              }

              const currentTotal = strategyTotals.get(key).total;
              const currentCount = strategyTotals.get(key).count;

              strategyTotals.set(key, {
                total: currentTotal + tradeROI,
                count: currentCount + 1,
              });
            } else if (type == 'year') {
              if (!strategyTotals.has(year_key)) {
                strategyTotals.set(year_key, { total: 0, count: 0 });
              }

              const currentTotal = strategyTotals.get(year_key).total;
              const currentCount = strategyTotals.get(year_key).count;

              strategyTotals.set(year_key, {
                total: currentTotal + tradeROI,
                count: currentCount + 1,
              });
            }
          });

          // Step 3: Calculate ROI for each strategy in each month and year
          const newStrategyROI = new Map();

          if (type == 'month') {
            strategyTotals.forEach((value, key) => {
              const [year, month, strategy] = key.split('_');
              const total = value.total;
              const count = value.count;
              const roi = total / count;

              if (!newStrategyROI.has(strategy)) {
                newStrategyROI.set(strategy, { data: [], label: strategy });
              }

              newStrategyROI
                .get(strategy)
                .data.push({ x: `${month} ${year}`, y: roi });
            });
          } else if (type == 'year') {
            strategyTotals.forEach((value, key) => {
              const [year, strategy] = key.split('_');
              const total = value.total;
              const count = value.count;
              const roi = total / count;

              if (!newStrategyROI.has(strategy)) {
                newStrategyROI.set(strategy, { data: [], label: strategy });
              }

              newStrategyROI.get(strategy).data.push({ x: `${year}`, y: roi });
            });
          }
          return newStrategyROI;
        }

        function convertMapToJson(object) {
          const json = {};
          object.forEach((value, key) => {
            json[key] = value;
          });
          return json;
        }
        function hasYearGap(date1, date2) {
          // Convert dates to milliseconds
          const time1 = date1.getTime();
          const time2 = date2.getTime();

          // Calculate the difference in milliseconds
          const timeDiff = Math.abs(time1 - time2);

          // Convert milliseconds to years
          const yearsDiff = timeDiff / (1000 * 60 * 60 * 24 * 365.25);

          // Check if the year gap is more than 1.5 years
          return yearsDiff > 1.5;
        }

        function convictionType(tradeData) {
          //finding maximum occuring conviction type from tradeData
          const convictionTypeMap = new Map();
          tradeData.forEach((trade) => {
            const convictionType = trade.trade_conviction;
            if (!convictionTypeMap.has(convictionType)) {
              convictionTypeMap.set(convictionType, 0);
            }
            convictionTypeMap.set(
              convictionType,
              convictionTypeMap.get(convictionType) + 1,
            );
          });
          const convictionTypeArray = [...convictionTypeMap];
          let maxConvictionType = convictionTypeArray[0][0];
          let maxConvictionTypeCount = convictionTypeArray[0][1];
          for (let i = 1; i < convictionTypeArray.length; i++) {
            if (convictionTypeArray[i][1] > maxConvictionTypeCount) {
              maxConvictionType = convictionTypeArray[i][0];
              maxConvictionTypeCount = convictionTypeArray[i][1];
            }
          }
          return maxConvictionType;
        }

        //% of account risked (top 5) + pnl - if (Summation of PNL for top 5 % of account risked days < 0)
        function topFivePercentAccountLessThanZero(tradeData) {
          const topFivePercentAccountRisked = [];
          tradeData.forEach((trade) => {
            const percentageOfAccountRisked =
              trade.percentage_of_account_risked;
            const pnl = trade.trade_pnl;
            topFivePercentAccountRisked.push({
              percentageOfAccountRisked,
              pnl,
            });
          });
          const sortedTopFivePercentAccountRisked =
            topFivePercentAccountRisked.sort((a, b) =>
              a.percentageOfAccountRisked > b.percentageOfAccountRisked
                ? -1
                : 1,
            );
          let sumOfPnl = 0;
          for (let i = 0; i < sortedTopFivePercentAccountRisked.length; i++) {
            if (i < 5) {
              sumOfPnl += sortedTopFivePercentAccountRisked[i].pnl;
            }
          }
          if (sumOfPnl < 0) {
            return true;
          } else {
            return false;
          }
        }
        function totalSlippage(tradeData) {
          let totalSlippage = 0;
          tradeData.forEach((trade) => {
            totalSlippage += trade.trade_slippage;
          });
          return !isNaN(totalSlippage) ? totalSlippage : 0;
        }

        function isNetROI3Percent(tradeData) {
          let netROI = 0;
          let count = 0;
          tradeData.forEach((trade) => {
            if (trade.net_roi) {
              netROI += trade.net_roi;
              count++;
            }
          });
          if (netROI / count >= 0.03 * tradeData[0].opening_balance) {
            return true;
          } else {
            return false;
          }
        }

        function maxConsecutiveLosses(tradeData) {
          let maxConsecutiveLosses = 0;
          let currentConsecutiveLosses = 0;
          let dailyPnl = dailyPnlGraph(tradeData);
          //calculating number of consecutive days on which loss happened given that on same day many trades are possible
          for (let i = 1; i < dailyPnl.length; i++) {
            if (dailyPnl[i].trade_pnl < 0) {
              currentConsecutiveLosses++;
            } else {
              if (currentConsecutiveLosses > maxConsecutiveLosses) {
                maxConsecutiveLosses = currentConsecutiveLosses;
              }
              currentConsecutiveLosses = 0;
            }
          }
          return maxConsecutiveLosses;
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
        const {
          percentageWinningTrades,
          percentageLosingTrades,
          avgLosingTrade,
          avgWinningTrade,
        } = calculateAvgWinningAndLosingTrade(tradeData);
        const transformedData = dailyPnlGraph(tradeData);
        const equityCurveData = calculateEquityCurve(tradeData);
        const totalTradeCharges = calculateTradeCharges(tradeData);
        const totalTradePenalties = calculateTradePenalties(tradeData);
        const strategyGraph = strategyGraphData(tradeData);
        const convictionTypee = convictionType(tradeData);
        const topFivePercentAccountLessThanZeroo =
          topFivePercentAccountLessThanZero(tradeData);
        const totalSlippagee = totalSlippage(tradeData);
        const isNetROI3Percentt = isNetROI3Percent(tradeData);
        const maxConsecutiveLossess = maxConsecutiveLosses(tradeData);

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
          startDate: tradeData[0].trade_date,
          endDate: tradeData[tradeData.length - 1].trade_date,
          totalTradeCharges: totalTradeCharges,
          openingBalance: tradeData[0].opening_balance,
          totalTradePenalties: totalTradePenalties,
          strategyGraph: convertMapToJson(strategyGraph),
          convictionType: convictionTypee,
          topFivePercentAccountLessThanZero: topFivePercentAccountLessThanZeroo,
          totalSlippage: totalSlippagee,
          isNetROI3Percent: isNetROI3Percentt,
          maxConsecutiveLosses: maxConsecutiveLossess,
        };
        return data;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getTradeAnalytics(user: any, startDate?: string, endDate?: string) {
    try {
      let query = this.tradeInstance.scan().where('user_id').eq(user.id);
      if (startDate && endDate) {
        query = query.where('trade_date').between(startDate, endDate);
      }

      let tradeData = await query.exec();
      tradeData = this.sortDataBy(tradeData);
      // console.log(tradeData);
      if (tradeData?.length > 0) {
        //function to calculate best month,lowest month acc to trade_pnl
        function bestAndWorstMonth(tradeData) {
          const monthlyPnl = new Map();

          tradeData.forEach((trade) => {
            const tradeDate = new Date(trade.trade_date);
            const month = tradeDate.toLocaleString('default', {
              month: 'short',
            });
            const year = tradeDate.getFullYear(); // Add this line to get the year
            const monthWithYear = `${month} ${year}`;

            const pnl = trade.trade_pnl;

            if (!monthlyPnl.has(monthWithYear)) {
              monthlyPnl.set(monthWithYear, 0);
            }

            monthlyPnl.set(monthWithYear, monthlyPnl.get(monthWithYear) + pnl);
          });

          const monthlyPnlArray = [...monthlyPnl];
          let bestMonth = monthlyPnlArray[0][0];
          let bestMonthPnl = monthlyPnlArray[0][1];
          let worstMonth = monthlyPnlArray[0][0];
          let worstMonthPnl = monthlyPnlArray[0][1];
          let totalMonthPnl = 0;

          for (let i = 1; i < monthlyPnlArray.length; i++) {
            if (monthlyPnlArray[i][1] > bestMonthPnl) {
              bestMonth = monthlyPnlArray[i][0];
              bestMonthPnl = monthlyPnlArray[i][1];
            }

            if (monthlyPnlArray[i][1] < worstMonthPnl) {
              worstMonth = monthlyPnlArray[i][0];
              worstMonthPnl = monthlyPnlArray[i][1];
            }

            totalMonthPnl += monthlyPnlArray[i][1];
          }

          let avgMonthPnl = totalMonthPnl / monthlyPnlArray.length;

          return [
            bestMonth,
            worstMonth,
            bestMonthPnl,
            worstMonthPnl,
            avgMonthPnl,
            totalMonthPnl,
          ];
        }

        //function to calculate winning rate and losing rate
        function winningAndLosingRate(tradeData) {
          let winningRate = 0;
          let losingRate = 0;
          let winningCount = 0;
          let losingCount = 0;
          tradeData.forEach((trade) => {
            const pnl = trade.trade_pnl;
            if (pnl > 0) {
              winningCount++;
            } else {
              losingCount++;
            }
          });
          winningRate = (winningCount / tradeData.length) * 100;
          losingRate = (losingCount / tradeData.length) * 100;
          return [winningRate, losingRate];
        }

        //function to calculate break even trades
        function breakEvenTrades(tradeData) {
          let breakEvenTrades = 0;
          tradeData.forEach((trade) => {
            const pnl = trade.trade_pnl;
            if (pnl == 0) {
              breakEvenTrades++;
            }
          });
          return breakEvenTrades;
        }

        //function to calculate avg risk per trade ,avg reward per trade and avg risk:reward ratio
        function avgRiskAndReward(tradeData) {
          let avgRiskPerTrade = 0;
          let avgRewardPerTrade = 0;
          let avgRiskRewardRatio = 0;
          let count = 0;
          tradeData.forEach((trade) => {
            //each trade have risk:reward ratio under name trade_risk as "2 : 3"
            const tradeRisk = trade.trade_risk;
            if (tradeRisk) {
              const [a, b] = tradeRisk.split(' : ').map(Number);
              if (!isNaN(a) && !isNaN(b)) {
                avgRiskPerTrade += a;
                avgRewardPerTrade += b;
                count++;
              }
            }
          });
          avgRiskPerTrade = avgRiskPerTrade / count;
          avgRewardPerTrade = avgRewardPerTrade / count;
          avgRiskRewardRatio = avgRiskPerTrade / avgRewardPerTrade;
          return [avgRiskPerTrade, avgRewardPerTrade, avgRiskRewardRatio];
        }

        //function to calculate avg profit/loss per trade
        function avgProfitLossPerTrade(tradeData) {
          let avgProfitLossPerTrade = 0;
          let count = 0;
          tradeData.forEach((trade) => {
            const pnl = trade.trade_pnl;
            if (pnl) {
              avgProfitLossPerTrade += pnl;
              count++;
            }
          });
          avgProfitLossPerTrade = avgProfitLossPerTrade / count;
          return avgProfitLossPerTrade;
        }

        //function to calculate return on investment
        function calculateROI(tradeData) {
          let totalInvestment = 0;
          let totalPnl = 0;
          tradeData.forEach((trade) => {
            const pnl = trade.trade_pnl;
            const investment = trade.position_size;
            totalInvestment += investment;
            totalPnl += pnl;
          });
          const roi = (totalPnl / totalInvestment) * 100;
          return roi;
        }

        //function to find largest winning/losing trade
        function largestWinningLosingTrade(tradeData) {
          let largestWinningTrade = 0;
          let largestLosingTrade = 0;
          tradeData.forEach((trade) => {
            const pnl = trade.trade_pnl;
            if (pnl > largestWinningTrade) {
              largestWinningTrade = pnl;
            }
            if (pnl < largestLosingTrade) {
              largestLosingTrade = pnl;
            }
          });
          return [largestWinningTrade, largestLosingTrade];
        }

        //function to calculate total cost of trade
        function calculateTotalCostOfTrade(tradeData) {
          let totalCostOfTrade = 0;
          tradeData.forEach((trade) => {
            totalCostOfTrade += trade.trade_charges;
          });
          return totalCostOfTrade;
        }

        //function to calculate opening balance and closing balance
        function calculateOpeningAndClosingBalance(tradeData) {
          let openingBalance = tradeData[0].opening_balance;
          let closingBalance =
            tradeData[tradeData.length - 1].opening_balance +
            tradeData[tradeData.length - 1].trade_pnl;
          return [openingBalance, closingBalance];
        }

        //function to calculate max consecutive wins and losses
        function maxConsecutiveWinsAndLosses(tradeData) {
          let maxConsecutiveWins = 0;
          let maxConsecutiveLosses = 0;
          let currentConsecutiveWins = 0;
          let currentConsecutiveLosses = 0;
          for (let i = 0; i < tradeData.length; i++) {
            if (tradeData[i].trade_pnl > 0) {
              currentConsecutiveWins++;
              if (currentConsecutiveLosses > maxConsecutiveLosses) {
                maxConsecutiveLosses = currentConsecutiveLosses;
              }
              currentConsecutiveLosses = 0;
            } else {
              currentConsecutiveLosses++;
              if (currentConsecutiveWins > maxConsecutiveWins) {
                maxConsecutiveWins = currentConsecutiveWins;
              }
              currentConsecutiveWins = 0;
            }
          }
          return [maxConsecutiveWins, maxConsecutiveLosses];
        }

        function dailyPnlGraph(tradeData) {
          //summing up pnl values for the same day
          const dailyPnl = new Map();
          tradeData.forEach((trade) => {
            const tradeDate = new Date(trade.trade_date);
            const date = tradeDate.toLocaleDateString('en-CA');
            const pnl = trade.trade_pnl;
            if (!dailyPnl.has(date)) {
              dailyPnl.set(date, 0);
            }
            dailyPnl.set(date, dailyPnl.get(date) + pnl);
          });
          let arr = Array.from(dailyPnl).map(([k, v]) => ({
            trade_date: k,
            trade_pnl: v,
          }));
          arr.sort(
            (a, b) =>
              new Date(a.trade_date).getTime() -
              new Date(b.trade_date).getTime(),
          );
          return arr;
        }

        //function to calculate total trading days ,winning days and losing days on same day multiple trades may be done
        function calculateTotalTradingDays(tradeData) {
          let totalTradingDays = 0;
          let winningDays = 0;
          let losingDays = 0;
          let avgDailyPnl = 0;
          let avgWinningDayPnl = 0;
          let avgLosingDayPnl = 0;
          const dailyPnl = dailyPnlGraph(tradeData);
          for (let i = 0; i < dailyPnl.length; i++) {
            if (dailyPnl[i].trade_pnl != 0) {
              totalTradingDays++;
              if (dailyPnl[i].trade_pnl > 0) {
                winningDays++;
                avgWinningDayPnl += dailyPnl[i].trade_pnl;
              } else {
                losingDays++;
                avgLosingDayPnl += dailyPnl[i].trade_pnl;
              }
              avgDailyPnl += dailyPnl[i].trade_pnl;
            }
          }
          avgWinningDayPnl = avgWinningDayPnl / winningDays;
          avgLosingDayPnl = avgLosingDayPnl / losingDays;
          avgDailyPnl = avgDailyPnl / totalTradingDays;
          return [
            totalTradingDays,
            winningDays,
            losingDays,
            avgDailyPnl,
            avgWinningDayPnl,
            avgLosingDayPnl,
          ];
        }

        function calculateMaxDD(trades: any[]) {
          let cumulativePnl = [0];
          let hightWaterMark = [0];
          let drawDown = [0];

          //Calculate cumulative Pnl
          for (const trade of trades) {
            const pnl = trade.trade_pnl;
            cumulativePnl.push(cumulativePnl[cumulativePnl.length - 1] + pnl);
          }

          //Calculate high water mark and drawdown
          for (let i = 1; i < cumulativePnl.length; i++) {
            hightWaterMark.push(
              Math.max(hightWaterMark[i - 1], cumulativePnl[i]),
            );
            drawDown.push(cumulativePnl[i] - hightWaterMark[i]);
          }

          //Find the maximum drawdown
          const maxDD = Math.min(...drawDown);

          return !Number.isNaN(maxDD) ? -1 * maxDD : 0;
        }

        //function to calculate calmar ratio
        function calculateCalmarRatio(tradeData) {
          let calmarRatio = 0;
          let maxDD = 0;
          let totalPnl = 0;
          tradeData.forEach((trade) => {
            const pnl = trade.trade_pnl;
            totalPnl += pnl;
          });
          maxDD = calculateMaxDD(tradeData);
          calmarRatio = totalPnl / maxDD;
          return calmarRatio;
        }
        //function to find tradeAnalysis Graphs
        function getTradeAnalysisGraphs(tradeData) {
          const holdingTradeTypeMap = new Map();
          const monthlyTradeMap = new Map();
          const convictionTypeMap = new Map();
          const strategyMap = new Map();
          const assetClassMap = new Map();
          const tradingAccountMap = new Map();

          tradeData.forEach((trade) => {
            // Holding Trade Type
            const holdingTradeType = trade.holding_trade_type;
            holdingTradeType &&
              holdingTradeTypeMap.set(
                holdingTradeType,
                (holdingTradeTypeMap.get(holdingTradeType) || 0) + 1,
              );

            // Monthly Trade with year also mentinoed like Jan 2023
            const tradeDate = new Date(trade.trade_date);
            const year = tradeDate.getFullYear(); // Get the year
            const month = tradeDate.toLocaleString('default', {
              month: 'short',
            });
            const monthlyTrade = `${month} ${year}`;
            monthlyTradeMap.set(
              monthlyTrade,
              (monthlyTradeMap.get(monthlyTrade) || 0) + 1,
            );

            // Conviction Type
            const convictionType = trade.trade_conviction;
            convictionType &&
              convictionTypeMap.set(
                convictionType,
                (convictionTypeMap.get(convictionType) || 0) + 1,
              );

            // Strategy
            const strategy = trade.strategy_used;
            strategy &&
              strategyMap.set(strategy, (strategyMap.get(strategy) || 0) + 1);

            // Asset Class
            const assetClass = trade.asset_class;
            assetClass &&
              assetClassMap.set(
                assetClass,
                (assetClassMap.get(assetClass) || 0) + 1,
              );

            // Trading Account
            const tradingAccount = trade.trading_account;
            tradingAccount &&
              tradingAccountMap.set(
                tradingAccount,
                (tradingAccountMap.get(tradingAccount) || 0) + 1,
              );
          });

          // Convert maps to arrays
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          const titlesArray = [
            {
              x: 'Month',
              y: 'No. of Trades',
            },
            {
              x: 'Holding Trade Type',
              y: 'No. of Trades',
            },
            {
              x: 'Conviction',
              y: 'No. of Trades',
            },
            {
              x: 'Strategy',
              y: 'No. of Trades',
            },
            {
              x: 'Asset Class',
              y: 'No. of Trades',
            },
            {
              x: 'Trading Account',
              y: 'No. of Trades',
            },
          ];

          // Return all data
          return {
            holdingTradeTypeData: mapToArray(holdingTradeTypeMap),
            monthlyTradeData: mapToArray(monthlyTradeMap),
            convictionTypeData: mapToArray(convictionTypeMap),
            strategyData: mapToArray(strategyMap),
            assetClassData: mapToArray(assetClassMap),
            tradingAccountData: mapToArray(tradingAccountMap),
            titlesArray: titlesArray,
          };
        }

        //function to calculate performance analysis graphs data

        function getPerformanceAnalysisGraphsData(tradeData) {
          const pnlsByMonth = new Map();
          const pnlsByHoldingTradeType = new Map();
          const pnlsByConviction = new Map();
          const pnlsBySetup = new Map();
          const pnlsByAssetClass = new Map();
          const pnlsByTradingAccount = new Map();

          tradeData.forEach((trade) => {
            // PnLs by month
            const tradeDate = new Date(trade.trade_date);
            const year = tradeDate.getFullYear(); // Get the year
            const month = tradeDate.toLocaleString('default', {
              month: 'short',
            });
            const monthlyTrade = `${month} ${year}`;
            pnlsByMonth.set(
              monthlyTrade,
              (pnlsByMonth.get(monthlyTrade) || 0) + trade.trade_pnl,
            );

            // PnLs by holding trade type
            const holdingTradeType = trade.holding_trade_type;
            holdingTradeType &&
              pnlsByHoldingTradeType.set(
                holdingTradeType,
                (pnlsByHoldingTradeType.get(holdingTradeType) || 0) +
                  trade.trade_pnl,
              );

            // PnLs by conviction
            const conviction = trade.trade_conviction;
            conviction &&
              pnlsByConviction.set(
                conviction,
                (pnlsByConviction.get(conviction) || 0) + trade.trade_pnl,
              );

            // PnLs by setup
            const setup = trade.strategy_used;
            setup &&
              pnlsBySetup.set(
                setup,
                (pnlsBySetup.get(setup) || 0) + trade.trade_pnl,
              );

            // PnLs by asset class
            const assetClass = trade.asset_class;
            assetClass &&
              pnlsByAssetClass.set(
                assetClass,
                (pnlsByAssetClass.get(assetClass) || 0) + trade.trade_pnl,
              );

            // PnLs by trading account
            const tradingAccount = trade.trading_account;
            tradingAccount &&
              pnlsByTradingAccount.set(
                tradingAccount,
                (pnlsByTradingAccount.get(tradingAccount) || 0) +
                  trade.trade_pnl,
              );
          });

          // Convert maps to arrays
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          const titlesArray = [
            {
              x: 'Month',
              y: 'PnL',
            },
            {
              x: 'Holding Trade Type',
              y: 'PnL',
            },
            {
              x: 'Conviction Type',
              y: 'PnL',
            },
            {
              x: 'Strategy',
              y: 'PnL',
            },
            {
              x: 'Asset Class',
              y: 'PnL',
            },
            {
              x: 'Trading Account',
              y: 'PnL',
            },
          ];
          return {
            pnlsByMonth: mapToArray(pnlsByMonth),
            pnlsByHoldingTradeType: mapToArray(pnlsByHoldingTradeType),
            pnlsByConviction: mapToArray(pnlsByConviction),
            pnlsBySetup: mapToArray(pnlsBySetup),
            pnlsByAssetClass: mapToArray(pnlsByAssetClass),
            pnlsByTradingAccount: mapToArray(pnlsByTradingAccount),
            titlesArray: titlesArray,
          };
        }

        //function to calculate effort analysis graph data
        function getEffortAnalysisGraphsData(tradeData) {
          const daysByMonth = new Map();
          const daysByHoldingTradeType = new Map();
          const daysByConviction = new Map();
          const daysBySetup = new Map();
          const daysByAssetClass = new Map();
          const daysByTradingAccount = new Map();
          const uniqueDaysSet = new Set();

          tradeData.forEach((trade) => {
            // Days by month
            const tradeDate = new Date(trade.trade_date);
            const year = tradeDate.getFullYear(); // Get the year
            const month = tradeDate.toLocaleString('default', {
              month: 'short',
            });
            const day = tradeDate.getDate();
            const dayMonthKey = `${day} ${month} ${year}`;
            //month year key
            const monthYearKey = `${month} ${year}`;

            if (!uniqueDaysSet.has(dayMonthKey)) {
              daysByMonth.set(
                monthYearKey,
                (daysByMonth.get(monthYearKey) || 0) + 1,
              );
              uniqueDaysSet.add(dayMonthKey);
            }

            // Days by holding trade type
            const holdingTradeType = trade.holding_trade_type;
            holdingTradeType &&
              daysByHoldingTradeType.set(
                holdingTradeType,
                (daysByHoldingTradeType.get(holdingTradeType) || 0) + 1,
              );

            // Days by conviction
            const conviction = trade.trade_conviction;
            conviction &&
              daysByConviction.set(
                conviction,
                (daysByConviction.get(conviction) || 0) + 1,
              );

            // Days by setup
            const setup = trade.strategy_used;
            setup && daysBySetup.set(setup, (daysBySetup.get(setup) || 0) + 1);

            // Days by asset class
            const assetClass = trade.asset_class;
            assetClass &&
              daysByAssetClass.set(
                assetClass,
                (daysByAssetClass.get(assetClass) || 0) + 1,
              );

            // Days by trading account
            const tradingAccount = trade.trading_account;
            tradingAccount &&
              daysByTradingAccount.set(
                tradingAccount,
                (daysByTradingAccount.get(tradingAccount) || 0) + 1,
              );
          });

          // Convert maps to arrays
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          const titlesArray = [
            {
              x: 'Month',
              y: 'No. of Days',
            },
            {
              x: 'Holding Trade Type',
              y: 'No. of Days',
            },
            {
              x: 'Conviction Type',
              y: 'No. of Days',
            },
            {
              x: 'Strategy',
              y: 'No. of Days',
            },
            {
              x: 'Asset Class',
              y: 'No. of Days',
            },
            {
              x: 'Trading Account',
              y: 'No. of Days',
            },
          ];
          return {
            daysByMonth: mapToArray(daysByMonth),
            daysByHoldingTradeType: mapToArray(daysByHoldingTradeType),
            daysByConviction: mapToArray(daysByConviction),
            daysBySetup: mapToArray(daysBySetup),
            daysByAssetClass: mapToArray(daysByAssetClass),
            daysByTradingAccount: mapToArray(daysByTradingAccount),
            titlesArray: titlesArray,
          };
        }

        //function to calculate return analysis graphs data
        function getReturnAnalysisGraphsData(tradeData) {
          const roiByMonth = new Map();
          const roiByHoldingTradeType = new Map();
          const roiByConviction = new Map();
          const roiBySetup = new Map();
          const roiByAssetClass = new Map();
          const roiByTradingAccount = new Map();

          const countByMonth = new Map();
          const countByHoldingTradeType = new Map();
          const countByConviction = new Map();
          const countBySetup = new Map();
          const countByAssetClass = new Map();
          const countByTradingAccount = new Map();

          tradeData.forEach((trade) => {
            const tradeDate = new Date(trade.trade_date);
            const year = tradeDate.getFullYear();
            const month = tradeDate.toLocaleString('default', {
              month: 'short',
            });
            const monthlyTrade = `${month} ${year}`;

            // ROI by month
            roiByMonth.set(
              monthlyTrade,
              (roiByMonth.get(monthlyTrade) || 0) + trade.net_roi,
            );
            countByMonth.set(
              monthlyTrade,
              (countByMonth.get(monthlyTrade) || 0) + 1,
            );

            // ROI by holding trade type
            const holdingTradeType = trade.holding_trade_type;
            if (holdingTradeType) {
              roiByHoldingTradeType.set(
                holdingTradeType,
                (roiByHoldingTradeType.get(holdingTradeType) || 0) +
                  trade.net_roi,
              );
              countByHoldingTradeType.set(
                holdingTradeType,
                (countByHoldingTradeType.get(holdingTradeType) || 0) + 1,
              );
            }

            // ROI by conviction
            const conviction = trade.trade_conviction;
            if (conviction) {
              roiByConviction.set(
                conviction,
                (roiByConviction.get(conviction) || 0) + trade.net_roi,
              );
              countByConviction.set(
                conviction,
                (countByConviction.get(conviction) || 0) + 1,
              );
            }

            // ROI by setup
            const setup = trade.strategy_used;
            if (setup) {
              roiBySetup.set(
                setup,
                (roiBySetup.get(setup) || 0) + trade.net_roi,
              );
              countBySetup.set(setup, (countBySetup.get(setup) || 0) + 1);
            }

            // ROI by asset class
            const assetClass = trade.asset_class;
            if (assetClass) {
              roiByAssetClass.set(
                assetClass,
                (roiByAssetClass.get(assetClass) || 0) + trade.net_roi,
              );
              countByAssetClass.set(
                assetClass,
                (countByAssetClass.get(assetClass) || 0) + 1,
              );
            }

            // ROI by trading account
            const tradingAccount = trade.trading_account;
            if (tradingAccount) {
              roiByTradingAccount.set(
                tradingAccount,
                (roiByTradingAccount.get(tradingAccount) || 0) + trade.net_roi,
              );
              countByTradingAccount.set(
                tradingAccount,
                (countByTradingAccount.get(tradingAccount) || 0) + 1,
              );
            }
          });

          // Calculate averages
          const calculateAverage = (roiMap, countMap) => {
            const result = new Map();
            roiMap.forEach((value, key) => {
              const count = countMap.get(key) || 1; // Avoid division by zero
              result.set(key, (value / count).toFixed(2));
            });
            return result;
          };

          // Convert maps to arrays
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          const titlesArray = [
            {
              x: 'Month',
              y: 'ROI',
            },
            {
              x: 'Holding Trade Type',
              y: 'ROI',
            },
            {
              x: 'Conviction Type',
              y: 'ROI',
            },
            {
              x: 'Strategy',
              y: 'ROI',
            },
            {
              x: 'Asset Class',
              y: 'ROI',
            },
            {
              x: 'Trading Account',
              y: 'ROI',
            },
          ];

          return {
            roiByMonth: mapToArray(calculateAverage(roiByMonth, countByMonth)),
            roiByHoldingTradeType: mapToArray(
              calculateAverage(roiByHoldingTradeType, countByHoldingTradeType),
            ),
            roiByConviction: mapToArray(
              calculateAverage(roiByConviction, countByConviction),
            ),
            roiBySetup: mapToArray(calculateAverage(roiBySetup, countBySetup)),
            roiByAssetClass: mapToArray(
              calculateAverage(roiByAssetClass, countByAssetClass),
            ),
            roiByTradingAccount: mapToArray(
              calculateAverage(roiByTradingAccount, countByTradingAccount),
            ),
            titlesArray: titlesArray,
          };
        }

        //function to calculate drawdown analysis graphs data

        function calculateDrawdownAnalysisGraphs(tradeData) {
          const losingTradeDaysByMonth = new Map();
          const losingTradeDaysByHoldingTradeType = new Map();
          const losingTradeDaysByConviction = new Map();
          const losingTradeDaysBySetup = new Map();
          const losingTradeDaysByAssetClass = new Map();
          const losingTradeDaysByTradingAccount = new Map();

          const losingTradePnlsByMonth = new Map();
          const losingTradePnlsByHoldingTradeType = new Map();
          const losingTradePnlsByConviction = new Map();
          const losingTradePnlsBySetup = new Map();
          const losingTradePnlsByAssetClass = new Map();
          const losingTradePnlsByTradingAccount = new Map();

          const uniqueDaysSet = new Set();

          tradeData.forEach((trade) => {
            const tradeDate = new Date(trade.trade_date);
            const year = tradeDate.getFullYear();
            const month = tradeDate.toLocaleString('default', {
              month: 'short',
            });
            const day = tradeDate.getDate();
            const monthlyTrade = `${month} ${year}`;
            const dayMonthKey = `${day} ${month} ${year}`;

            // Losing trade days by month
            if (trade.trade_pnl < 0) {
              if (!uniqueDaysSet.has(dayMonthKey)) {
                losingTradeDaysByMonth.set(
                  monthlyTrade,
                  (losingTradeDaysByMonth.get(monthlyTrade) || 0) + 1,
                );
                uniqueDaysSet.add(dayMonthKey);
              }
              losingTradePnlsByMonth.set(
                monthlyTrade,
                (losingTradePnlsByMonth.get(monthlyTrade) || 0) +
                  trade.trade_pnl,
              );
            }

            // Losing trade days by holding trade type
            const holdingTradeType = trade.holding_trade_type;
            if (holdingTradeType && trade.trade_pnl < 0) {
              losingTradeDaysByHoldingTradeType.set(
                holdingTradeType,
                (losingTradeDaysByHoldingTradeType.get(holdingTradeType) || 0) +
                  1,
              );
              losingTradePnlsByHoldingTradeType.set(
                holdingTradeType,
                (losingTradePnlsByHoldingTradeType.get(holdingTradeType) || 0) +
                  trade.trade_pnl,
              );
            }

            // Losing trade days by conviction
            const conviction = trade.trade_conviction;
            if (conviction && trade.trade_pnl < 0) {
              losingTradeDaysByConviction.set(
                conviction,
                (losingTradeDaysByConviction.get(conviction) || 0) + 1,
              );
              losingTradePnlsByConviction.set(
                conviction,
                (losingTradePnlsByConviction.get(conviction) || 0) +
                  trade.trade_pnl,
              );
            }

            // Losing trade days by setup
            const setup = trade.strategy_used;
            if (setup && trade.trade_pnl < 0) {
              losingTradeDaysBySetup.set(
                setup,
                (losingTradeDaysBySetup.get(setup) || 0) + 1,
              );
              losingTradePnlsBySetup.set(
                setup,
                (losingTradePnlsBySetup.get(setup) || 0) + trade.trade_pnl,
              );
            }

            // Losing trade days by asset class
            const assetClass = trade.asset_class;
            if (assetClass && trade.trade_pnl < 0) {
              losingTradeDaysByAssetClass.set(
                assetClass,
                (losingTradeDaysByAssetClass.get(assetClass) || 0) + 1,
              );
              losingTradePnlsByAssetClass.set(
                assetClass,
                (losingTradePnlsByAssetClass.get(assetClass) || 0) +
                  trade.trade_pnl,
              );
            }

            // Losing trade days by trading account
            const tradingAccount = trade.trading_account;
            if (tradingAccount && trade.trade_pnl < 0) {
              losingTradeDaysByTradingAccount.set(
                tradingAccount,
                (losingTradeDaysByTradingAccount.get(tradingAccount) || 0) + 1,
              );
              losingTradePnlsByTradingAccount.set(
                tradingAccount,
                (losingTradePnlsByTradingAccount.get(tradingAccount) || 0) +
                  trade.trade_pnl,
              );
            }
          });
          // Convert maps to arrays
          const mapToArrayNegative = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: -1 * entry[1] }));
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          const titlesArray = [
            {
              x: 'Month',
              y: 'No. of Losing Trades',
            },
            {
              x: 'Holding Trade Type',
              y: 'No. of Losing Trades',
            },
            {
              x: 'Conviction Type',
              y: 'No. of Losing Trades',
            },
            {
              x: 'Strategy',
              y: 'No. of Losing Trades',
            },
            {
              x: 'Asset Class',
              y: 'No. of Losing Trades',
            },
            {
              x: 'Trading Account',
              y: 'No. of Losing Trades',
            },
            {
              x: 'Month',
              y: 'PnL',
            },
            {
              x: 'Holding Trade Type',
              y: 'PnL',
            },
            {
              x: 'Conviction Type',
              y: 'PnL',
            },
            {
              x: 'Strategy',
              y: 'PnL',
            },
            {
              x: 'Asset Class',
              y: 'PnL',
            },
            {
              x: 'Trading Account',
              y: 'PnL',
            },
          ];
          return {
            losingTradeDaysByMonth: mapToArray(losingTradeDaysByMonth),
            losingTradeDaysByHoldingTradeType: mapToArray(
              losingTradeDaysByHoldingTradeType,
            ),
            losingTradeDaysByConviction: mapToArray(
              losingTradeDaysByConviction,
            ),
            losingTradeDaysBySetup: mapToArray(losingTradeDaysBySetup),
            losingTradeDaysByAssetClass: mapToArray(
              losingTradeDaysByAssetClass,
            ),
            losingTradeDaysByTradingAccount: mapToArray(
              losingTradeDaysByTradingAccount,
            ),
            losingTradePnlsByMonth: mapToArrayNegative(losingTradePnlsByMonth),
            losingTradePnlsByHoldingTradeType: mapToArrayNegative(
              losingTradePnlsByHoldingTradeType,
            ),
            losingTradePnlsByConviction: mapToArrayNegative(
              losingTradePnlsByConviction,
            ),
            losingTradePnlsBySetup: mapToArrayNegative(losingTradePnlsBySetup),
            losingTradePnlsByAssetClass: mapToArrayNegative(
              losingTradePnlsByAssetClass,
            ),
            losingTradePnlsByTradingAccount: mapToArrayNegative(
              losingTradePnlsByTradingAccount,
            ),
            titlesArray: titlesArray,
          };
        }

        const [
          bestMonth,
          worstMonth,
          bestMonthPnl,
          worstMonthPnl,
          avgMonthPnl,
          totalMonthPnl,
        ] = bestAndWorstMonth(tradeData);
        const [winningRate, losingRate] = winningAndLosingRate(tradeData);
        const breakEvenTradesCount = breakEvenTrades(tradeData);
        const [avgRiskPerTrade, avgRewardPerTrade, avgRiskRewardRatio] =
          avgRiskAndReward(tradeData);
        const avgProfitLossPerTradee = avgProfitLossPerTrade(tradeData);
        const roi = calculateROI(tradeData);
        const [largestWinningTrade, largestLosingTrade] =
          largestWinningLosingTrade(tradeData);
        const totalCostOfTrade = calculateTotalCostOfTrade(tradeData);
        const [openingBalance, closingBalance] =
          calculateOpeningAndClosingBalance(tradeData);
        const [maxConsecutiveWins, maxConsecutiveLosses] =
          maxConsecutiveWinsAndLosses(tradeData);
        const [
          totalTradingDays,
          winningDays,
          losingDays,
          avgDailyPnl,
          avgWinningDayPnl,
          avgLosingDayPnl,
        ] = calculateTotalTradingDays(tradeData);
        const calmarRatio = calculateCalmarRatio(tradeData);
        const tradeAnalysisGraphs = getTradeAnalysisGraphs(tradeData);
        const performanceAnalysisGraphsData =
          getPerformanceAnalysisGraphsData(tradeData);
        const effortAnalysisGraphsData = getEffortAnalysisGraphsData(tradeData);
        const roiAnalysisGraphs = getReturnAnalysisGraphsData(tradeData);
        const drawDownAnalysisGraphsData =
          calculateDrawdownAnalysisGraphs(tradeData);

        const data = {
          bestMonth: bestMonth,
          worstMonth: worstMonth,
          bestMonthPnl: bestMonthPnl,
          worstMonthPnl: worstMonthPnl,
          avgMonthPnl: avgMonthPnl,
          totalMonthPnl: totalMonthPnl,
          totalTrades: tradeData.length,
          winningRate: winningRate,
          losingRate: losingRate,
          breakEvenTrades: breakEvenTradesCount,
          avgRiskPerTrade: avgRiskPerTrade,
          avgRewardPerTrade: avgRewardPerTrade,
          avgRiskRewardRatio: avgRiskRewardRatio,
          avgProfitLossPerTrade: avgProfitLossPerTradee,
          roi: roi,
          largestWinningTrade: largestWinningTrade,
          largestLosingTrade: largestLosingTrade,
          totalCostOfTrade: totalCostOfTrade,
          openingBalance: openingBalance,
          closingBalance: closingBalance,
          maxConsecutiveWins: maxConsecutiveWins,
          maxConsecutiveLosses: maxConsecutiveLosses,
          totalTradingDays: totalTradingDays,
          winningDays: winningDays,
          losingDays: losingDays,
          avgDailyPnl: avgDailyPnl,
          avgWinningDayPnl: avgWinningDayPnl,
          avgLosingDayPnl: avgLosingDayPnl,
          calmarRatio: calmarRatio,
          graphs: {
            tradeAnalysisGraphs: tradeAnalysisGraphs,
            performanceAnalysisGraphsData: performanceAnalysisGraphsData,
            effortAnalysisGraphsData: effortAnalysisGraphsData,
            roiAnalysisGraphs: roiAnalysisGraphs,
            drawDownAnalysisGraphsData: drawDownAnalysisGraphsData,
          },
        };
        return data;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAdvancedGraph(user: any, xAxis: string, yAxis: string) {
    //according to xAxis and yAxis calculate the data required to draw graph between x and y
    // following graphs are possible only
    //     Asset class vs Position Size,
    // Asset class vs conviction (3splitted bar graph),
    // asset class vs PNL,
    // Asset class vs percentage of account risked,
    // Asset class vs karma (2 splitted bar graph),
    // Asset vs net ROI,
    // Asset class vs charges,

    // strategy used vs conviction (3splitted bar graph),
    // strategy used vs risk:reward,
    // Strategy used vs PnL
    // Strategy used vs Karma (2splitted bar graph),
    // Strategy used vs Net RoI,
    // Strategy used vs Charges,

    // conviction vs pnl,
    // conviction vs karma (2 splitted bar graph),
    // conviction vs Net ROI

    // karma vs PnL,
    // Karma vs Net RoI,

    // holding trade type vs Pnl,
    // holding trade type vs Karma (2splitted bar graph),
    // holding trade type vs conviction (3 splitted bar graph),
    // Holding trade type vs Net RoI,
    // Holding trade type vs charges

    // percentage of account risked vs Pnl (20%-100% ranged bar graph),
    // percentage of account risked vs Karma  (2 splitted 20%-100% ranged bar graph),
    // percentage of account risked vs Net RoI  (20%-100% ranged bar graph),

    //only one of the above written pairs are expected to come as parameter for x and y axis now calculate the graph data for plotting graphs
    try {
      let query = this.tradeInstance.scan().where('user_id').eq(user.id);

      let tradeData = await query.exec();
      tradeData = this.sortDataBy(tradeData);
      if (tradeData?.length > 0) {
        if (xAxis === 'AssetClass' && yAxis === 'PositionSize') {
          const assetClassMap = new Map();

          tradeData.forEach((trade) => {
            const assetClass = trade.asset_class || 'NoAssetClass';
            const positionSize = trade.position_size;

            // Check if assetClass is present
            assetClassMap.set(
              assetClass,
              (assetClassMap.get(assetClass) || 0) + positionSize,
            );
          });

          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(assetClassMap);
        } else if (xAxis === 'AssetClass' && yAxis === 'PNL') {
          const assetClassMap = new Map();

          tradeData.forEach((trade) => {
            const assetClass = trade.asset_class || 'NoAssetClass';
            const pnl = trade.trade_pnl;
            assetClassMap.set(
              assetClass,
              (assetClassMap.get(assetClass) || 0) + pnl,
            );
          });

          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(assetClassMap);
        } else if (xAxis === 'AssetClass' && yAxis === 'Conviction') {
          const assetConvictionTotals = new Map();

          tradeData.forEach((trade) => {
            const assetClass = trade.asset_class || 'NoAssetClass';
            const conviction = trade.trade_conviction || 'NoConviction'; // Assuming 'conviction' is a property in your data
            const key = `${assetClass}_${conviction}`;

            if (!assetConvictionTotals.has(key)) {
              assetConvictionTotals.set(key, { count: 0 });
            }

            const currentCount = assetConvictionTotals.get(key).count;

            assetConvictionTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph
          const datasets = [];

          assetConvictionTotals.forEach((value, key) => {
            const [assetClass, conviction] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === conviction)) {
              datasets.push({ label: conviction, data: [] });
            }

            const dataset = datasets.find(
              (dataset) => dataset.label === conviction,
            );
            dataset.data.push({ x: assetClass, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        } else if (
          xAxis == 'AssetClass' &&
          yAxis == 'PercentageOfAccountRisked'
        ) {
          const assetClassMap = new Map();
          tradeData.forEach((trade) => {
            const assetClass = trade.asset_class || 'NoAssetClass';
            const percentage_of_account_risked =
              trade.percentage_of_account_risked;
            assetClassMap.set(
              assetClass,
              (assetClassMap.get(assetClass) || 0) +
                percentage_of_account_risked,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(assetClassMap);
        } else if (xAxis == 'AssetClass' && yAxis == 'Karma') {
          const assetKarmaTotals = new Map();

          tradeData.forEach((trade) => {
            const assetClass = trade.asset_class || 'NoAssetClass';
            const karma = trade.trade_karma || 'NoKarma';
            const key = `${assetClass}_${karma}`;

            if (!assetKarmaTotals.has(key)) {
              assetKarmaTotals.set(key, { count: 0 });
            }

            const currentCount = assetKarmaTotals.get(key).count;

            assetKarmaTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph
          const datasets = [];

          assetKarmaTotals.forEach((value, key) => {
            const [assetClass, karma] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === karma)) {
              datasets.push({ label: karma, data: [] });
            }

            const dataset = datasets.find((dataset) => dataset.label === karma);
            dataset.data.push({ x: assetClass, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        } else if (xAxis == 'AssetClass' && yAxis == 'NetROI') {
          const assetClassMap = new Map();
          tradeData.forEach((trade) => {
            const assetClass = trade.asset_class || 'NoAssetClass';
            const net_roi = trade.net_roi;
            assetClassMap.set(
              assetClass,
              (assetClassMap.get(assetClass) || 0) + net_roi,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(assetClassMap);
        } else if (xAxis == 'AssetClass' && yAxis == 'Charges') {
          const assetClassMap = new Map();
          tradeData.forEach((trade) => {
            const assetClass = trade.asset_class || 'NoAssetClass';
            const charges = trade.trade_charges;
            assetClassMap.set(
              assetClass,
              (assetClassMap.get(assetClass) || 0) + charges,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(assetClassMap);
        } else if (xAxis === 'StrategyUsed' && yAxis === 'Conviction') {
          const strategyConvictionTotals = new Map();

          tradeData.forEach((trade) => {
            const strategy = trade.strategy_used || 'NoStrategy';
            const conviction = trade.trade_conviction || 'NoConviction'; // Assuming 'conviction' is a property in your data
            const key = `${strategy}_${conviction}`;

            if (!strategyConvictionTotals.has(key)) {
              strategyConvictionTotals.set(key, { count: 0 });
            }

            const currentCount = strategyConvictionTotals.get(key).count;

            strategyConvictionTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph
          const datasets = [];

          strategyConvictionTotals.forEach((value, key) => {
            const [strategy, conviction] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === conviction)) {
              datasets.push({ label: conviction, data: [] });
            }

            const dataset = datasets.find(
              (dataset) => dataset.label === conviction,
            );
            dataset.data.push({ x: strategy, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        } else if (xAxis == 'StrategyUsed' && yAxis == 'RiskReward') {
          const strategyMap = new Map();

          tradeData.forEach((trade) => {
            const strategy = trade.strategy_used || 'No Strategy Used';
            const trade_risk_reward = trade.trade_risk;

            // Check if trade_risk is present
            if (trade_risk_reward) {
              // Extracting risk and reward from the string
              const [risk, reward] = trade_risk_reward.split(':').map(Number);

              // Calculating the risk:reward ratio
              const riskRewardRatio = reward !== 0 ? risk / reward : 0;

              // Updating the strategyMap with the calculated ratio
              strategyMap.set(
                strategy,
                (strategyMap.get(strategy) || []).concat(riskRewardRatio),
              );
            }
          });

          // Calculating average risk:reward ratio for each strategy
          strategyMap.forEach((ratios, strategy) => {
            const averageRatio =
              ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
            strategyMap.set(strategy, averageRatio);
          });

          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(strategyMap);
        } else if (xAxis === 'StrategyUsed' && yAxis === 'Karma') {
          const strategyKarmaTotals = new Map();

          tradeData.forEach((trade) => {
            const strategy = trade.strategy_used || 'No Strategy';
            const karma = trade.trade_karma || 'No Karma';
            const key = `${strategy}_${karma}`;

            if (!strategyKarmaTotals.has(key)) {
              strategyKarmaTotals.set(key, { count: 0 });
            }

            const currentCount = strategyKarmaTotals.get(key).count;

            strategyKarmaTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph
          const datasets = [];

          strategyKarmaTotals.forEach((value, key) => {
            const [strategy, karma] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === karma)) {
              datasets.push({ label: karma, data: [] });
            }

            const dataset = datasets.find((dataset) => dataset.label === karma);
            dataset.data.push({ x: strategy, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        } else if (xAxis == 'StrategyUsed' && yAxis == 'NetROI') {
          const strategyMap = new Map();
          tradeData.forEach((trade) => {
            const strategy = trade.strategy_used || 'No Strategy';
            const net_roi = trade.net_roi;
            strategyMap.set(
              strategy,
              (strategyMap.get(strategy) || 0) + net_roi,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(strategyMap);
        } else if (xAxis == 'StrategyUsed' && yAxis == 'PNL') {
          const strategyMap = new Map();

          tradeData.forEach((trade) => {
            const strategy = trade.strategy_used || 'NoStrategy';
            const pnl = trade.trade_pnl;

            // Updating the strategyMap with the PNL for each strategy
            strategyMap.set(strategy, (strategyMap.get(strategy) || 0) + pnl);
          });

          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(strategyMap);
        } else if (xAxis == 'StrategyUsed' && yAxis == 'Charges') {
          const strategyMap = new Map();
          tradeData.forEach((trade) => {
            const strategy = trade.strategy_used || 'No Strategy';
            const charges = trade.trade_charges;
            strategyMap.set(
              strategy,
              (strategyMap.get(strategy) || 0) + charges,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(strategyMap);
        } else if (xAxis == 'Conviction' && yAxis == 'PNL') {
          const convictionMap = new Map();
          tradeData.forEach((trade) => {
            const conviction = trade.trade_conviction || 'No Conviction';
            const pnl = trade.trade_pnl;
            convictionMap.set(
              conviction,
              (convictionMap.get(conviction) || 0) + pnl,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(convictionMap);
        } else if (xAxis === 'Conviction' && yAxis === 'Karma') {
          const convictionKarmaTotals = new Map();

          tradeData.forEach((trade) => {
            const conviction = trade.trade_conviction || 'NoConviction'; // Assuming 'conviction' is a property in your data
            const karma = trade.trade_karma || 'NoKarma';
            const key = `${conviction}_${karma}`;

            if (!convictionKarmaTotals.has(key)) {
              convictionKarmaTotals.set(key, { count: 0 });
            }

            const currentCount = convictionKarmaTotals.get(key).count;

            convictionKarmaTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph
          const datasets = [];

          convictionKarmaTotals.forEach((value, key) => {
            const [conviction, karma] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === karma)) {
              datasets.push({ label: karma, data: [] });
            }

            const dataset = datasets.find((dataset) => dataset.label === karma);
            dataset.data.push({ x: conviction, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        } else if (xAxis == 'Conviction' && yAxis == 'NetROI') {
          const convictionMap = new Map();
          tradeData.forEach((trade) => {
            const conviction = trade.trade_conviction || 'No Conviction';
            const net_roi = trade.net_roi;
            convictionMap.set(
              conviction,
              (convictionMap.get(conviction) || 0) + net_roi,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(convictionMap);
        } else if (xAxis == 'Karma' && yAxis == 'PNL') {
          const karmaMap = new Map();
          tradeData.forEach((trade) => {
            const karma = trade.trade_karma || 'No Karma';
            const pnl = trade.trade_pnl;
            karmaMap.set(karma, (karmaMap.get(karma) || 0) + pnl);
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(karmaMap);
        } else if (xAxis == 'Karma' && yAxis == 'NetROI') {
          const karmaMap = new Map();
          tradeData.forEach((trade) => {
            const karma = trade.trade_karma || 'No Karma';
            const net_roi = trade.net_roi;
            karmaMap.set(karma, (karmaMap.get(karma) || 0) + net_roi);
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(karmaMap);
        } else if (xAxis == 'HoldingTradeType' && yAxis == 'PNL') {
          const holdingTradeTypeMap = new Map();
          tradeData.forEach((trade) => {
            const holding_trade_type =
              trade.holding_trade_type || 'No Holding Trade Type';
            const pnl = trade.trade_pnl;
            holdingTradeTypeMap.set(
              holding_trade_type,
              (holdingTradeTypeMap.get(holding_trade_type) || 0) + pnl,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));
          return mapToArray(holdingTradeTypeMap);
        } else if (xAxis === 'HoldingTradeType' && yAxis === 'Conviction') {
          const holdingTradeConvictionTotals = new Map();

          tradeData.forEach((trade) => {
            const holdingTradeType =
              trade.holding_trade_type || 'NoHoldingTradeType'; // Assuming 'holding_trade_type' is a property in your data
            const conviction = trade.trade_conviction || 'NoConviction'; // Assuming 'trade_conviction' is a property in your data
            const key = `${holdingTradeType}_${conviction}`;

            if (!holdingTradeConvictionTotals.has(key)) {
              holdingTradeConvictionTotals.set(key, { count: 0 });
            }

            const currentCount = holdingTradeConvictionTotals.get(key).count;

            holdingTradeConvictionTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph
          const datasets = [];

          holdingTradeConvictionTotals.forEach((value, key) => {
            const [holdingTradeType, conviction] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === conviction)) {
              datasets.push({ label: conviction, data: [] });
            }

            const dataset = datasets.find(
              (dataset) => dataset.label === conviction,
            );
            dataset.data.push({ x: holdingTradeType, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        } else if (xAxis === 'HoldingTradeType' && yAxis === 'Karma') {
          const holdingTradeKarmaTotals = new Map();

          tradeData.forEach((trade) => {
            const holdingTradeType =
              trade.holding_trade_type || 'NoHoldingTradeType'; // Assuming 'holding_trade_type' is a property in your data
            const karma = trade.trade_karma || 'NoKarma';
            const key = `${holdingTradeType}_${karma}`;

            if (!holdingTradeKarmaTotals.has(key)) {
              holdingTradeKarmaTotals.set(key, { count: 0 });
            }

            const currentCount = holdingTradeKarmaTotals.get(key).count;

            holdingTradeKarmaTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph
          const datasets = [];

          holdingTradeKarmaTotals.forEach((value, key) => {
            const [holdingTradeType, karma] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === karma)) {
              datasets.push({ label: karma, data: [] });
            }

            const dataset = datasets.find((dataset) => dataset.label === karma);
            dataset.data.push({ x: holdingTradeType, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        } else if (xAxis == 'HoldingTradeType' && yAxis == 'NetROI') {
          const holdingTradeTypeMap = new Map();
          tradeData.forEach((trade) => {
            const holding_trade_type =
              trade.holding_trade_type || 'No Holding Trade Type';
            const net_roi = trade.net_roi;
            holdingTradeTypeMap.set(
              holding_trade_type,
              (holdingTradeTypeMap.get(holding_trade_type) || 0) + net_roi,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(holdingTradeTypeMap);
        } else if (xAxis === 'PercentageOfAccountRisked' && yAxis === 'PNL') {
          const percentageOfAccountRiskedMap = new Map();

          // Define the range buckets
          const rangeBuckets = [
            { min: 20, max: 30 },
            { min: 30, max: 40 },
            { min: 40, max: 50 },
            { min: 50, max: 60 },
            { min: 60, max: 70 },
            { min: 70, max: 80 },
            { min: 80, max: 90 },
            { min: 90, max: 100 },
          ];

          tradeData.forEach((trade) => {
            const percentage_of_account_risked =
              trade.percentage_of_account_risked;
            const pnl = trade.trade_pnl;

            // Find the bucket for the current percentage_of_account_risked
            const bucket = rangeBuckets.find(
              (range) =>
                percentage_of_account_risked >= range.min &&
                percentage_of_account_risked < range.max,
            );

            // Update the map with the pnl based on the bucket
            if (bucket) {
              const bucketKey = `${bucket.min}-${bucket.max}%`;
              percentageOfAccountRiskedMap.set(
                bucketKey,
                (percentageOfAccountRiskedMap.get(bucketKey) || 0) + pnl,
              );
            }
          });

          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(percentageOfAccountRiskedMap);
        } else if (xAxis == 'HoldingTradeType' && yAxis == 'Charges') {
          const holdingTradeTypeMap = new Map();
          tradeData.forEach((trade) => {
            const holding_trade_type =
              trade.holding_trade_type || 'No Holding Trade Type';
            const charges = trade.trade_charges;
            holdingTradeTypeMap.set(
              holding_trade_type,
              (holdingTradeTypeMap.get(holding_trade_type) || 0) + charges,
            );
          });
          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(holdingTradeTypeMap);
        } else if (
          xAxis === 'PercentageOfAccountRisked' &&
          yAxis === 'NetROI'
        ) {
          const percentageOfAccountRiskedMap = new Map();

          // Define the range buckets
          const rangeBuckets = [
            { min: 20, max: 30 },
            { min: 30, max: 40 },
            { min: 40, max: 50 },
            { min: 50, max: 60 },
            { min: 60, max: 70 },
            { min: 70, max: 80 },
            { min: 80, max: 90 },
            { min: 90, max: 100 },
          ];

          tradeData.forEach((trade) => {
            const percentage_of_account_risked =
              trade.percentage_of_account_risked;
            const net_roi = trade.net_roi;

            // Find the bucket for the current percentage_of_account_risked
            const bucket = rangeBuckets.find(
              (range) =>
                percentage_of_account_risked >= range.min &&
                percentage_of_account_risked < range.max,
            );

            // Update the map with the net_roi based on the bucket
            if (bucket) {
              const bucketKey = `${bucket.min}-${bucket.max}%`;
              percentageOfAccountRiskedMap.set(
                bucketKey,
                (percentageOfAccountRiskedMap.get(bucketKey) || 0) + net_roi,
              );
            }
          });

          const mapToArray = (map) =>
            [...map].map((entry) => ({ x: entry[0], y: entry[1] }));

          return mapToArray(percentageOfAccountRiskedMap);
        } else if (xAxis === 'PercentageOfAccountRisked' && yAxis === 'Karma') {
          const filteredTradeData = tradeData.filter((trade) => {
            const percentage = trade.percentage_of_account_risked || 0;
            return percentage >= 20 && percentage <= 90;
          });

          const percentageKarmaTotals = new Map();

          filteredTradeData.forEach((trade) => {
            const percentage = trade.percentage_of_account_risked;
            const karma = trade.trade_karma || 'NoKarma';

            // Cap the upper limit at 100%
            const cappedPercentage = Math.min(percentage, 100);

            // Calculate the range based on the percentage
            const rangeStart = Math.floor(cappedPercentage / 10) * 10;
            const rangeEnd = rangeStart + 10;

            const key = `${rangeStart}-${rangeEnd}%_${karma}`;

            if (!percentageKarmaTotals.has(key)) {
              percentageKarmaTotals.set(key, { count: 0 });
            }

            const currentCount = percentageKarmaTotals.get(key).count;

            percentageKarmaTotals.set(key, {
              count: currentCount + 1,
            });
          });

          // Prepare data for splitted bar graph, sorted by percentage range start
          const datasets = [];

          percentageKarmaTotals.forEach((value, key) => {
            const [percentageRange, karma] = key.split('_');
            const count = value.count;

            if (!datasets.find((dataset) => dataset.label === karma)) {
              datasets.push({ label: karma, data: [] });
            }

            const dataset = datasets.find((dataset) => dataset.label === karma);
            dataset.data.push({ x: percentageRange, y: count });
          });

          return { type: 'splittedBarGraph', datasets: datasets };
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  //making separate function to extract graph related data

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
