import { Model } from "@stoqey/sofa";
import isEmpty from "lodash/isEmpty";
import {
  ActionType,
  TradingStatusType,
  TradingEnvType,
  SymbolSecType
} from "@stoqey/client-graphql";
import { ObjectType, Field, Int } from "type-graphql";
import TradeModel, { TradeType } from "../trade/Trade.model";
import { CommonSchema, CommonType } from "../shared";
import MarketDataAPI from "../marketdata/marketdata.api";
import StoqeyStockExchangeApi from "../exchange/sse.api";
import { UserModel } from "../user";

const modelName = "Portfolio";
/**
 * GraphQL Types start
 */
@ObjectType()
export class PortfolioType extends CommonType {
  @Field({ nullable: true })
  symbol: string;
  @Field(type => SymbolSecType, { nullable: true })
  secType: SymbolSecType;
  @Field(() => ActionType, { nullable: true })
  action: ActionType;
  @Field({ nullable: true })
  exchange: string;

  @Field(() => TradingStatusType, { nullable: true })
  status: TradingStatusType;

  @Field({ nullable: true })
  size: number; // number of shares

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

export const PortfolioModel: Model = new Model(modelName, { schema: { entryTime: 'date', exitTime: 'date'  }});

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
        throw new Error("Cannot close this portfolio, not LIVE");
      }

      const {
        owner,
        symbol,
        secType,
        action,
        exchange = "SSE",
        size,
        averageCost,
        entryTime,
      } = existingPortfolio;

      // Get quote
      const gotQuote = await new MarketDataAPI().getQuote(symbol);
      if (!gotQuote) {
        throw new Error("Cannot close this portfolio, failed to get quote");
      }

      // TODO Add amount to user account
      // TODO close portfolio

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

      const processTrade = await new StoqeyStockExchangeApi().processTrade(
        createdClosingTrade.id,
        portfolioId,
        'exit'
      );

      if (!processTrade) {
        throw new Error(
          "Error processing trade from the stoqey stock exchange"
        );
      }

        // TODO Remove/Add amount from user's wallet and save

      return { trade: createdClosingTrade, position: existingPortfolio };
    }

    throw new Error("Error position not found, please try again later");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface StartPosition {
  size: number;
  owner: string;
  symbol?: string; // = 'STQ';
  action: ActionType;
}
export const startPortfolioPosition = async (args: StartPosition): Promise<{ position: PortfolioType; trade: TradeType }> => {
  const { owner, symbol = 'STQ', action, size } = args;
  try {
    // Get user
    const user = await UserModel.findById(owner);
    if (isEmpty(user)) {
      throw new Error("error user not found");
    }

    // Check if user has existing positions
    const existingPortfolio: PortfolioType[] = await PortfolioModel.pagination({
      where: { status: { $eq: TradingStatusType.LIVE }, owner: { $eq: owner } },
    });

    if (!isEmpty(existingPortfolio)) {
      throw new Error("error user already has positions opened");
    }

    // Create trade and portfolio
    // Get quote
    const gotQuote = await new MarketDataAPI().getQuote(symbol);
    if (!gotQuote) {
      throw new Error("Cannot close this portfolio, failed to get quote");
    }

    // TODO check if user has proper amount to run this trade
    // TODO Then remove amount from this user

    const newPortfolio: PortfolioType = {
      owner,
      symbol,
      secType: SymbolSecType.AI,
      action,
      exchange: 'SSE',
      status: TradingStatusType.PENDING,
      size,
      averageCost: gotQuote.close,
      entryTime: new Date(),
    };

    const createdPortfolio = await PortfolioModel.create(newPortfolio);

    // Create new trade and submit to processor
    const openingTrade: TradeType = {
      owner,
      symbol,
      secType: SymbolSecType.AI,
      positionAction: action, // either BUY or SELL
      action: ActionType.BUY, // always BUY for all starting positions
      exchange: 'SSE',
      status: TradingStatusType.PENDING,
      size: newPortfolio.size,
      averageCost: newPortfolio.averageCost,
      marketPrice: newPortfolio.averageCost,
      entryTime: newPortfolio.entryTime,
    };

    const createdTrade = await TradeModel.create(openingTrade);

    const processTrade = await new StoqeyStockExchangeApi().processTrade(
      createdTrade.id,
      createdPortfolio.id,
      'enter'
    );

    if (!processTrade) {
      throw new Error(
        "Error processing trade from the stoqey stock exchange"
      );
    }

       // TODO Remove/Add amount from user's wallet and save

    return { trade: createdTrade, position: createdPortfolio };
    // Send trade to Stoqey stock exchange
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const refundTransaction = (transactionId: string) => {
    // Find the transaction
    // update it false
    // add to user account
}

export default PortfolioModel;
