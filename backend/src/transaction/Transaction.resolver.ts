import {
  Resolver,
  Query,
  Mutation,
  Arg,
  // Int,
} from "type-graphql";
import isEmpty from "lodash/isEmpty";
import { log } from "../log";
import { TransactionType } from "./Transaction.model";
import { TradeModel, TradeType } from "../trade";

import { ResType, TradingEnvType } from "../shared";
import { Pagination } from "../shared/common.pagination";

const transModelName = "Transaction";
@Resolver()
export class TransactionResolver {
  @Query(() => [TransactionType])
  async transactions(
    @Arg("tradeEnv", { nullable: true }) tradeEnv: TradingEnvType,
    @Arg("owner") owner: string,
    @Arg("page", { nullable: true }) page: number,
    @Arg("limit", { nullable: true }) limit: number
  ): Promise<TransactionType[]> {
    try {
      const data = await Pagination({
        where: {
          where: {
            _type: { $eq: transModelName },
            // tradeEnv: { $eq: tradeEnv || TradingEnvType.LIVE },
            owner: { $eq: owner },
          },
        },
        limit,
        page,
      });

      return data;
    } catch (error) {
      log("error getting transactions", error);
      return [];
    }
  }

  // @Mutation(() => ResType)
  // async createWithdraw(
  //   @Arg("paymentMethod") paymentMethodId: string,
  //   @Arg("wallet") walletId: string,
  //   @Arg("owner") ownerId: string,
  //   @Arg("amount") amount: number,
  // ): Promise<ResType> {
  //   try {
  //     // If updating
  //     if (!isEmpty(id)) {
  //       // update trade now
  //       const existing = await TradeModel().findById(id);
  //       if (!isEmpty(existing)) {
  //         existing.action = action;
  //         existing.size = size;
  //         existing.execNow = execNow;
  //         await existing.save();
  //         return { success: true, data: existing };
  //       }
  //     }

  //     //   create new trade
  //     const newTrade: TradeType = {
  //       symbol,
  //       secType,
  //       action,
  //       size,
  //       owner: "",
  //       tradeEnv,
  //       entryTime: new Date(),
  //     };

  //     const created = await TradeModel().create(newTrade);

  //     //   TODO submit if execNow
  //     return { success: true, data: created };
  //   } catch (err) {
  //     console.log(err);
  //     return { success: false, message: err && err.message };
  //   }
  // }
}

export default TransactionResolver;
