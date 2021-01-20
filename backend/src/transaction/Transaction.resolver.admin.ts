import {
  Resolver,
  Query,
  Mutation,
  Arg,
  // Int,
} from "type-graphql";
import { log } from "../log";
import { TransactionType } from "./Transaction.model";
import { ResType, TradingEnvType } from "../shared";
import { Pagination } from "../shared/common.pagination";

const transModelName = "Transaction";
@Resolver()
export class TransactionResolver {
  @Query(() => [TransactionType])
  async allTransactions(
    @Arg("search", { nullable: true }) search: string,
    @Arg("tradeEnv", { nullable: true }) tradeEnv: TradingEnvType,
    @Arg("owner", { nullable: true }) owner: number,
    @Arg("page", { nullable: true }) page: number,
    @Arg("limit", { nullable: true }) limit: number
  ): Promise<TransactionType[]> {
    try {

      const extraWhere: any = {};

      if(tradeEnv){
        extraWhere.tradeEnv = { $eq: tradeEnv }
      };

      if(owner){
        extraWhere.owner = { $eq: owner }
      };

      const data = await Pagination({
        where: {
          where: {
            _type: { $eq: transModelName },
            ...extraWhere,
          },
        },
        limit,
        page,
      });

      log(`all transactions returned ${data && data.length}`)
      return data;
    } catch (error) {
      log("error getting transactions", error);
      return [];
    }
  }
}

export default TransactionResolver;
