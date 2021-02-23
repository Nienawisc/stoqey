import {
  Resolver,
  Query,
  Mutation,
  Arg,
} from "type-graphql";
import isEmpty from "lodash/isEmpty";
import {
  SymbolSecType,
  ActionType,
  TradingEnvType
} from '@stoqey/client-graphql'
import TradeModel, {
  OrderType,
} from "./Order.model";
import {
  IOrderType,
  ResType,
} from "../shared";
import DiorExchangeApi from "../exchange/dior.api";

const diorApi = new DiorExchangeApi();

@Resolver()
export class OrderResolver {

  /**
   * Only my orders
   * @param owner 
   * @param page 
   * @param limit 
   */
  @Query(() => [OrderType])
  async myOrders(
    @Arg("owner") owner: string,
    @Arg("page", { nullable: true }) page: number,
    @Arg("limit", { nullable: true }) limit: number,
  ): Promise<OrderType[]> {
    try {
      const {success, data } = await diorApi.getOrders(owner);

      if(!success) {
        throw new Error('error getting orders');
      };

      console.log(`order data returned ${data && data.length}`);
      return data;

    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * All orders
   * @param page 
   * @param limit 
   */
  @Query(() => [OrderType])
  async orders(
    @Arg("page", { nullable: true }) page: number,
    @Arg("limit", { nullable: true }) limit: number,
  ): Promise<OrderType[]> {
    try {
      const {success, data } = await diorApi.getOrders();

      if(!success) {
        throw new Error('error getting all orders');
      };

      console.log(`order data returned ${data && data.length}`);
      return data;

    } catch (error) {
      console.log(error);
      return [];
    }
  }

  @Mutation(() => ResType)
  async createOrder(
    @Arg("owner") symbol: string = "STQ",
    @Arg("owner") owner: string,
    @Arg("action") action: ActionType,
    @Arg("size") size: number,
    @Arg("type") type: IOrderType,
    @Arg("price", { nullable: true }) price?: number,
    @Arg("stopPrice", { nullable: true }) stopPrice?: number,
  ): Promise<ResType> {
    try {
      // TODO check user wallet

      // @ts-ignore
      let order: OrderType = { 
        symbol,
        action,
        // TODO
        params: [],
        gtc: true,
        gfd: true,
        gtd: false,
        // id: generateUUID,
        instrument: symbol,
        clientId: owner,
        type,
        qty: size,
        filledQty: 0,
        stopPrice: stopPrice,
        canceled: false,
        date: new Date()
      };

      if(type === "limit"){
        order.stop = true;
        order.stopPrice = price;
      };

      const submited = await diorApi.addOrder(order);

      if(!submited){
        throw new Error('order not added')
      }

      // If updating
      // TODO Socket
      return { success: true, data: order };
    } catch (err) {
      console.log(err);
      return { success: false, message: err && err.message };
    }
  }

  @Mutation(() => ResType)
  async cancelOrder(
    @Arg("id") id: string
  ) : Promise<ResType> {
    try { 

    } catch(error){
      console.log('error canceling order', error);
    }
    
  }


}

export default TradeResolver;
