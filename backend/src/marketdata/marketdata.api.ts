import axios, { AxiosInstance } from "axios";
import { isEmpty } from "lodash";
import _ from "lodash";
import {
  Candles,
  Quote,
  Resolution,
  MarketDataItem,
  TickData,
} from "./marketdata.interfaces";
import { log } from "../log";
import { MarketDataType, MarketSymbolInfo } from "./Marketdata.model";

const round = (num: number) => Math.round(num);

/**
 * Stoqey market data api
 */
export class MarketDataAPI {
  public token: string;

  public api: AxiosInstance;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: _.get(
        process.env,
        "STQNETWORK",
        "https://marketdata.cloudaxe.co"
      ),
    });
    this.token = token
      ? token
      : (process && process.env && process.env.STQNETWORK_KEY) || "";
  }

  /**
   * Get candlestick data for stocks.
   * @param symbol
   * @param start
   * @param end
   * @param resolution
   */
  public async getCandles(
    symbol: string,
    start: Date = new Date(),
    end?: Date,
    resolution?: string,
    limit?: number,
  ): Promise<MarketDataType[]> {
    const token = this.token;
    // const to = end.getTime() / 1000;
    // const from = start.getTime() / 1000;

    // https://marketdata.cloudaxe.co/v1/query?endDate=2021-01-04T22:30:33.161Z&startDate=2021-01-04T22:30:33.161Z&symbol=STQP&token=&range=1
    const params: any = {
      endDate: end,
      startDate: start,
      symbol,
      limit: limit || 100,
      range: resolution || '1',
    };

    // if(resolution && end){
    //   params.range = resolution;
    //   params.endDate = end;
    // }

    // if (isNaN(from) || isNaN(to)) {
    //   console.log("error with parameters", { from, to });
    //   return [];
    // }

    try {
      // TODO check lastime we pulled this symbol, else fetch it's data again
      const candles = await this.api.get(`v1/query`, {
        method: "GET",
        params,
      });

      const marketDataItems: MarketDataItem[] = candles.data;

      const data = marketDataItems;

      log(`marketdata items are ${data && data.length}`)

      return data.map((da) => {
        const { close, open, date, volume, high, low } = da;
        return {
          id: `${symbol}_${new Date(date).getTime()}`,
          close,
          date: new Date(date),
          volume,
          open,
          high,
          low,
          symbol,
        };
      });
    } catch (error) {
      console.log("error getting candles", error && error.message);
      return [];
    }
  }

  /**
   * GetQuote
   * Get real-time quote data for US stocks. Constant polling is not recommended. Use websocket if you need real-time update.
   * @param symbol
   */
  public async getQuote(symbol: string): Promise<Quote | null> {
    try {
      const quote = await this.api.get(`quote`, {
        method: "GET",
        params: { symbol },
      });

      const quoteData: Quote = quote && quote.data;
      return quoteData;
    } catch (error) {
      log("error getting quote data", error);
      return null;
    }
  }

  /**
   * Get company info
   * @param symbol 
   */
  public async getInfo(symbol: string): Promise<MarketSymbolInfo | null> {
    try {
      const quote = await this.api.get(`info`, {
        method: "GET",
        params: { symbol },
      });

      const quoteData: MarketSymbolInfo = quote && quote.data;
      return quoteData;
    } catch (error) {
      log("error getting symbol info data", error);
      return null;
    }
  }

  /**
   * Save marketdata into influxdb
   * @param MarketDataItem data 
   */
  public async saveMarketdata(data: MarketDataItem): Promise<boolean> {
    try {
      const { status } = await this.api.post(`v1/insert`,data);

      if(_.includes(`${status}`, '20')){
        return true;
      }
      throw new Error('error saving marketdata, please try again later');
    } catch (error) {
      log("error getting symbol info data", error);
      return false;
    }
  }
}

export default MarketDataAPI;
