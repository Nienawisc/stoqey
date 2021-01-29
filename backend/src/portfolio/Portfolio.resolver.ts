import {
  Resolver,
  Query,
  Mutation,
  Arg,
} from "type-graphql";
import isEmpty from "lodash/isEmpty";
import TradeModel, {
  TradeType,
} from "./Trade.model";
import {
  ResType,
  SymbolSecType,
  ActionType,
  TradingEnvType,
} from "../shared";
import { log } from "../log";
import PortfolioModel, { PortfolioType } from "./Portfolio.model";

@Resolver()
export class TradeResolver {

  @Query(() => [PortfolioModel])
  async portfolios(
    @Arg("owner") userId: string,
    @Arg("page") page: number,
    @Arg("limit") limit: number,
  ): Promise<PortfolioType[]> {
    try {
      const data = await PortfolioModel.pagination({
        select: ['id', 'owner', 'symbol','status', 'secType','exchange', 'action','size','entryTime', 'averageCost', 'createdAt'],
        where:  { owner: { $eq: userId } },
        limit,
        page
      });
      
      console.log(`portfolios returned are ${data && data.length}`);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  @Mutation(() => ResType)
  async closePortfolio(
    @Arg("id") portfolioId: string,
  ): Promise<ResType> {
    try {
      // If updating
      if (!isEmpty(portfolioId)) {
        // update trade now
        const existing = await PortfolioModel.findById(portfolioId);
        if (!isEmpty(existing)) {
          existing.action = action;
          existing.size = size;
          existing.execNow = execNow;
          await TradeModel.save(existing);
          return { success: true, data: existing };
        }
      }

      //   create new trade
      const newTrade: TradeType = {
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
