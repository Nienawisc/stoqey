import {
  Resolver,
  Query,
  Arg,
  // Int,
} from "type-graphql";
import { log } from "../log";
import TransactionModel, { TransactionType } from "./Transaction.model";

import { TradingEnvType, WithdrawOrDeposit } from "../shared";

@Resolver()
export class TransactionResolver {
  @Query(() => [TransactionType])
  async transactions(
    @Arg("filter", { nullable: true }) filter: WithdrawOrDeposit,
    @Arg("owner") owner: string,
    @Arg("page", { nullable: true }) page: number,
    @Arg("limit", { nullable: true }) limit: number
  ): Promise<TransactionType[]> {
    try {
      const wheres: any = {
        owner: { $eq: owner },
      }

      // If filter by status
      if(filter){
        wheres.type = { $eq: filter }
      };

      const data = await TransactionModel.pagination({
        where: wheres,
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
