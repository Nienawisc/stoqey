import { Model } from "@stoqey/sofa";
import isEmpty from "lodash/isEmpty";
import {
  ActionType,
  SymbolSecType,
  TradingStatusType,
  TradingEnvType,
} from "@stoqey/client-graphql";
import { ObjectType, Field, Int } from "type-graphql";
import TradeModel, { TradeType } from "../trade/Trade.model";
import { CommonSchema, CommonType } from "../shared";
import MarketDataAPI from "src/marketdata/marketdata.api";
import StoqeyStockExchangeApi from "src/exchange/sse.api";

const modelName = "Portfolio";
/**
 * GraphQL Types start
 */
@ObjectType()
export class PortfolioType extends CommonType {
  @Field({ nullable: true })
  symbol: string;
  @Field(() => SymbolSecType)
  secType: SymbolSecType;
  @Field(() => ActionType)
  action: ActionType;
  @Field({ nullable: true })
  exchange: string;

  @Field(() => TradingStatusType)
  status: TradingStatusType;

  @Field({ nullable: true })
  size: number; // number of shares
  @Field({ nullable: true })
  @Field({ nullable: true })
  averageCost: number;
  @Field({ nullable: true })
  marketPrice?: number;

  @Field({ nullable: true })
  entryTime: Date; // time when entered trade
  @Field({ nullable: true })
  exitTime?: Date; // when closed
}

/**
 * GraphQL Types end
 */

export const PortfolioModel: Model = new Model(modelName);

/**
 * Methods
 */

export const closePortfolioPosition = async (
  portfolioId: string
): Promise<{ position: PortfolioType; trade: TradeType }> => {
  try {
    // If updating
    if (!isEmpty(portfolioId)) {
      // Portfolio
      const existingPortfolio: PortfolioType = await PortfolioModel.findById(
        portfolioId
      );
      if (isEmpty(existingPortfolio)) {
        throw new Error("Portfolio does not exist");
      }
      if (existingPortfolio.status !== TradingStatusType.LIVE) {
        throw new Error("Cannot close this portfolio");
      }

      const {
        owner,
        symbol,
        secType,
        action,
        exchange = "SSE",
        size,
        averageCost,
        entryTime
      } = existingPortfolio;

      // Get quote
      const gotQuote = await new MarketDataAPI().getQuote(symbol);
      if (!gotQuote) {
        throw new Error("Cannot close this portfolio, failed to get quote");
      }

      // Create new trade and submit to processor
      const closingTrade: TradeType = {
        owner,
        symbol,
        secType,
        positionAction: action, //
        action: ActionType.SELL, // always SELL for all close positions
        exchange,
        status: TradingStatusType.PENDING,
        size,
        averageCost,
        marketPrice: gotQuote.close,
        entryTime,
        exitTime: new Date(),
      };

      // Create the trade
      const createdClosingTrade = await TradeModel.create(closingTrade);
      if (!createdClosingTrade) {
        throw new Error("Cannot create closing trade");
      }

      const processTrade = new StoqeyStockExchangeApi().processTrade(createdClosingTrade.id);

      if(!processTrade){
        throw new Error('Error processing trade from the stoqey stock exchange');
      }

      return { trade: createdClosingTrade, position: existingPortfolio };
    }

    throw new Error('Error position not found, please try again later');

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default PortfolioModel;
