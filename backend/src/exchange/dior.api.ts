import axios, { AxiosInstance } from "axios";
import _ from "lodash";
import { OrderType } from "../order";

/**
 * Stoqey Stock Exchange api
 */
export class DiorExchangeApi {
  public token: string;

  public api: AxiosInstance;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: _.get(
        process.env,
        "DIOR_HTTP",
        "https://dior.cloudaxe.co"
      ),
    });
    this.token = token
      ? token
      : (process && process.env && process.env.DIOR_KEY) || "";
  }

  /**
   * Get all orders
   * @param clientId 
   */
  public async getOrders(clientId: string): Promise<boolean> {
    try {
      const { status } = await this.api.get(`orders/clientId=${clientId}`);
      if(status === 200){
        return true;
      }
      throw new Error('Error sending ')
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * cancelOrder
   */
  public async cancelOrder(orderId: string) {
    try {
      const { status } = await this.api.get(`cancel/orderId=${orderId}`);
      if(status === 200){
        return true;
      }
      throw new Error('Error sending ')
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * addOrder
   */
  public async addOrder(order: OrderType) {
    try {
      const { status } = await this.api.post(`add`, order);
      if(status === 200){
        return true;
      }
      throw new Error('Error adding order')
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}

export default DiorExchangeApi;
