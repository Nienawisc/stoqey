import {
  Resolver,
  Query,
  Mutation,
  Arg,
} from "type-graphql";
import { log } from "../log";
import PaymentMethodModel, { PaymentMethodType } from "./PaymentMethod.model";
import { ResType, TradingEnvType } from "../shared";
import { Pagination } from "../shared/common.pagination";

const transModelName = "PaymentMethod";

@Resolver()
export class TransactionResolver {

  @Query(() => [PaymentMethodType])
  async paymentMethods(
    // @Arg("tradeEnv") tradeEnv: TradingEnvType,
    @Arg("owner") owner: number,
    @Arg("page") page: number,
    @Arg("limit") limit: number
  ): Promise<PaymentMethodType[]> {
    try {
      // TODO add not deleted
      const data = await Pagination({
        where: {
          where: {
            _type: { $eq: transModelName },
            // tradeEnv: { $eq: tradeEnv },
            owner: { $eq: owner },
            
          },
        },
        limit,
        page,
      });

      return data;
    } catch (error) {
      log("error getting payment methods", error);
      return [];
    }
  }

    @Mutation(() => ResType)
  async createPaymentMethod(
    @Arg("type") type: string,
    @Arg("name") name: string,
    @Arg("owner") owner: string,
    @Arg("info") info: string,
  ): Promise<ResType> {
    try {
      // If updating
      const newPaymentMethod: PaymentMethodType = {
        name, type, info, owner,
      };
      const created = await PaymentMethodModel().create(newPaymentMethod);
      return { success: true, data: created };
    } catch (err) {
      console.log(err);
      return { success: false, message: err && err.message };
    }
  }
  
}

export default TransactionResolver;
