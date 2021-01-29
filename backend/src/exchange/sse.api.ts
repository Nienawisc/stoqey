import axios, { AxiosInstance } from "axios";
import _ from "lodash";

/**
 * Stoqey Stock Exchange api
 */
export class StoqeyStockExchangeApi {
  public token: string;

  public api: AxiosInstance;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: _.get(
        process.env,
        "SSE",
        "https://sse.cloudaxe.co"
      ),
    });
    this.token = token
      ? token
      : (process && process.env && process.env.SSE_KEY) || "";
  }

  /**
   * processTrade
   */
  public async processTrade(tradeId: string): Promise<boolean> {
    try {
      const { status } = await this.api.post(`process`, { tradeId });
      if(status === 200){
        return true;
      }
      throw new Error('Error sending ')
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}

export default StoqeyStockExchangeApi;
