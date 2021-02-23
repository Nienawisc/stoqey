import {
  Resolver,
  Query,
  Mutation,
  Arg,
} from "type-graphql";
import {
  ActionType} from '@stoqey/client-graphql';
import {
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

  @Mutation(() => ResType)
  async createOrder(
    @Arg("symbol", { nullable: true }) symbol: string = "STQ",
    @Arg("owner") owner: string,
    @Arg("action") action: ActionType,
    @Arg("size") size: number,
    @Arg("type") type: IOrderType,
    @Arg("price", { nullable: true }) price: number = 0,
    @Arg("stopPrice", { nullable: true }) stopPrice: number = 0,
  ): Promise<ResType> {
    try {
      // TODO check user wallet

      // @ts-ignore
      let order: OrderType = { 
        symbol,
        action,
        // TODO
        gtc: true,
        gfd: true,
        gtd: false,
        // id: generateUUID,
        instrument: symbol,
        clientId: owner,
        type,
        price,
        qty: size,
        filledQty: 0,
        stopPrice: stopPrice,
        canceled: false,
        date: new Date()
      };

      if(type === IOrderType.LIMIT){
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

      const sendCancel = await diorApi.cancelOrder(id);

      if(!sendCancel){
        throw new Error('error sending cancel order');
      }

      return { success: true, data: id}

    } catch(error){
      console.error('error canceling order', error);
      return { success: false, message: error && error.message };
    }
    
  }


}

export default OrderResolver;
