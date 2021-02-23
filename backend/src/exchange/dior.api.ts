import axios, { AxiosInstance } from "axios";
import _ from "lodash";
import { ResType } from "src/shared";
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
        "localhost:6660"
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
  public async getOrders(clientId?: string): Promise<ResType> {
    try {
      const query = clientId? `orders/clientId=${clientId}` : 'orders';
      const { status, data } = await this.api.get(query);
      if(status === 200){
        return { success: true, data: data.data }
      }
      throw new Error('Error sending ')
    } catch (error) {
      console.error(error);
      return { success: false, message: error && error.message }
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
