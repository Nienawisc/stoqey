import {
  Resolver,
  Query,
} from "type-graphql";
import {
  OrderType,
} from "./Order.model";
import DiorExchangeApi from "../exchange/dior.api";

const diorApi = new DiorExchangeApi();

@Resolver()
export class OrderResolverAdmin {

  /**
   * All orders
   * @param page 
   * @param limit 
   */
  @Query(() => [OrderType])
  async orders(): Promise<OrderType[]> {
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

}

export default OrderResolverAdmin;
