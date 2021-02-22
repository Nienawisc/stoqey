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
  ResType,
} from "../shared";

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
    @Arg("page") page: number,
    @Arg("limit") limit: number,
  ): Promise<OrderType[]> {
    try {
      const data = await TradeModel.pagination({
        select: ['id', 'owner', 'symbol','status', 'secType','exchange', 'action', 'averageCost', 'marketPrice', 'createdAt'],
        where:  { owner: { $eq: owner } },
        limit,
        page
      });
      
      console.log(`trades data returned ${data && data.length}`);
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
    @Arg("page") page: number,
    @Arg("limit") limit: number,
  ): Promise<OrderType[]> {
    try {
      const data = await TradeModel.pagination({
        select: ['id', 'owner', 'symbol','status', 'secType','exchange', 'action', 'averageCost', 'marketPrice', 'createdAt'],
        // where:  { where: { _type: { $eq: "Trade" } } },
        limit,
        page
      });
      
      console.log(`trades data returned ${data && data.length}`);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  @Mutation(() => ResType)
  async createOrder(
    @Arg("id") id: string,
    @Arg("symbol") symbol: string,
    @Arg("secType") secType: SymbolSecType,
    @Arg("action") action: ActionType,
    @Arg("size") size: number,
    @Arg("execNow") execNow: boolean,
    @Arg("tradeEnv") tradeEnv: TradingEnvType
  ): Promise<ResType> {
    try {
      // If updating
      if (!isEmpty(id)) {
        // update trade now
        const existing = await TradeModel.findById(id);
        if (!isEmpty(existing)) {
          existing.action = action;
          existing.size = size;
          existing.execNow = execNow;
          await TradeModel.save(existing);
          return { success: true, data: existing };
        }
      }

      //   create new trade
      const newTrade: OrderType = {
        symbol,
        secType,
        action,
        size,
        owner: "",
        tradeEnv,
        entryTime: new Date(),
      };

      const created = await TradeModel.create(newTrade);

      //   TODO submit if execNow
      return { success: true, data: created };
    } catch (err) {
      console.log(err);
      return { success: false, message: err && err.message };
    }
  }

  //   TODO
  // Exec trade
  // Delete trade
  // Get my trades, active and not active, using time and date

//   @Mutation(() => LoginResponseType)
//   async execTrade(
//     @Arg("tradeId") email: string,
//     @Ctx() { res }: ContextType
//   ): Promise<LoginResponseType> {
//     const { rows } = await UserModel().find({ email });
//     const user = rows[0];
//     if (!user) {
//       throw new Error("could not find user");
//     }

//     const valid = await compare(password, user.password);
//     if (!valid) {
//       throw new Error("password not valid");
//     }

//     sendRefreshToken(res, createRefreshToken(user));

//     return {
//       accessToken: createAccessToken(user),
//       user,
//     };
//   }
}

export default TradeResolver;
