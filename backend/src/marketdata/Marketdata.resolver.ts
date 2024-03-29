import _ from "lodash";
import { Resolver, Query, Subscription, Ctx, Root, Arg } from "type-graphql";
import { MarketDataType as IMarketDataType } from "@stoqey/client-graphql";
import { MarketDataType, MarketSymbolInfo } from "./Marketdata.model";
import { TOPICS } from "../topics";
import { Resolution } from "./marketdata.interfaces";
import { log } from "../log";
import MarketDataAPI from "./marketdata.api";
import { ContextType } from "src/shared";

@Resolver()
export class MarketDataResolver {
  @Query(() => Boolean)
  async marketData(@Ctx() ctx: any): Promise<Boolean> {
    return true;
  }

  @Subscription(() => MarketDataType, {
    topics: TOPICS.STQ_QUOTE,
  })
  onCurrency(
    @Root() quote: MarketDataType & any,
    @Arg("symbol") symbol: string
  ): MarketDataType {

    const dataToReturn: any = {
      id: (quote && quote.symbol) || (quote && quote.instrument) || "",
      ...quote,
      date: new Date(quote.date)
    };

    return dataToReturn;
  }

  @Query(() => [MarketDataType])
  async getMarketData(
    @Arg("symbol") symbol: string,
    @Arg("start", { nullable: true }) start?: Date,
    @Arg("end", { nullable: true }) end?: Date,
    @Arg("range", { nullable: true }) range?: Resolution,
    @Arg("limit", { nullable: true }) limit?: number
  ): Promise<MarketDataType[]> {
    try {
      log("getMarketData", { symbol, start, end, range, limit });
      const mkdapi = new MarketDataAPI();
      const gotCandles = await mkdapi.getCandles(
        symbol,
        start || new Date(),
        end,
        range || "1m",
        limit
      );
      log("response", gotCandles && gotCandles.length);
      return gotCandles;
    } catch (error) {
      log("error gettingMarketData", error);
      return [];
    }
  }

  @Query(() => MarketDataType)
  async getQuote(
    @Arg("symbol") symbol: string
  ): Promise<MarketDataType | null> {
    try {
      const mkdapi = new MarketDataAPI();
      const gotQuote: any = await mkdapi.getQuote(symbol);

      if (!gotQuote) {
        throw new Error("error getting quote data");
      }

      return { id: symbol, ...gotQuote };
    } catch (error) {
      log("error gettingMarketData", error);
      return null;
    }
  }

  @Query(() => MarketSymbolInfo)
  async getInfo(
    @Arg("symbol") symbol: string
  ): Promise<MarketSymbolInfo | null> {
    try {
      const mkdapi = new MarketDataAPI();
      const gotInfo: any = await mkdapi.getInfo(symbol);

      if (!gotInfo) {
        throw new Error("error getting quote data");
      }

      return { id: symbol, ...gotInfo };
    } catch (error) {
      log("error gettingMarketData", error);
      return null;
    }
  }

  //   Get current quote
  // Get historical data
}

export default MarketDataResolver;
