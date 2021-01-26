import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { log } from "../log";
import PaymentMethodModel, { PaymentMethodType } from "./PaymentMethod.model";
import { ResType, StatusType, TradingEnvType } from "../shared";
import { TransactionModel, TransactionType } from "../transaction";
import { UserModel, UserType } from "../user";

const paymentMethodname = "PaymentMethod";

@Resolver()
export class PaymentMethodResolver {
  @Query(() => [PaymentMethodType])
  async paymentMethods(
    // @Arg("tradeEnv") tradeEnv: TradingEnvType,
    @Arg("owner") owner: string,
    @Arg("page") page: number,
    @Arg("limit") limit: number
  ): Promise<PaymentMethodType[]> {
    try {
      // TODO add not deleted
      const data = await PaymentMethodModel.pagination({
        select: ["id", "owner", "name", "info", "type", "createdAt"],
        where: {
          owner: { $eq: owner },
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
    @Arg("info") info: string
  ): Promise<ResType> {
    try {
      // If updating
      const newPaymentMethod: PaymentMethodType = {
        name,
        type,
        info,
        owner
      };
      const created = await PaymentMethodModel.create(newPaymentMethod);
      return { success: true, data: created };
    } catch (err) {
      console.log(err);
      return { success: false, message: err && err.message };
    }
  }

  @Mutation(() => ResType)
  async createWithdrawPayment(
    @Arg("paymentMethodId") paymentMethodId: string,
    @Arg("owner") owner: string,
    @Arg("amount") amount: number
  ): Promise<ResType> {
    try {
      // Create payment
      // make it pending
      // confirm from admin that's when we run updateUserWallet

      const thisPaymentMethod: PaymentMethodType = await PaymentMethodModel.findById(
        paymentMethodId
      );
      if (!thisPaymentMethod) {
        throw new Error("payment method not found");
      }

      const thisUser: UserType = await UserModel.findById(owner) as UserType;
      if (!thisUser) {
        throw new Error("user not found");
      }

      // Check if user has enough money on account
      if (thisUser.balance ?? 0 < amount) {
        throw new Error("Not enough fund in the account");
      }

      const createdPaymentTransaction: TransactionType = {
        type: "withdraw", // withdraw or deposit
        status: StatusType.PENDING,
        source: thisPaymentMethod.type, // paypal, credit card, interact
        sourceId: thisPaymentMethod.id, // paypal, credit card, interact
        currency: "USD",
        amount,
      };

      const created = await TransactionModel.create(
        createdPaymentTransaction
      );
      return { success: true, data: created };
    } catch (err) {
      console.log(err);
      return { success: false, message: err && err.message };
    }
  }
}

export default PaymentMethodResolver;
