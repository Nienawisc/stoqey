import { isEmpty } from "lodash";
import { log } from "../log";
import { ResType, StatusType, TradingEnvType } from "@stoqey/client-graphql";
import { TransactionModel, TransactionType } from "../transaction";
import UserModel from "./User.model";

export const updateUserWallet = async (
  userId: string,
  amount: number,
  source: string,
  sourceId?: string
): Promise<ResType> => {
  try {
    log(
      "updateUserWallet",
      JSON.stringify({ userId, amount, source, sourceId })
    );

    const existingUser = await UserModel.findById(userId);

    if (!isEmpty(existingUser)) {
      const currentBalance = existingUser.balance || 0;

      const transType = amount > 0 ? "deposit" : "withdraw";
      // Create a transaction

      const newTransaction: TransactionType = {
        tradeEnv: TradingEnvType.LIVE,
        owner: userId,
        type: transType, // withdraw or deposit
        source: source || "", // paypal, credit card, interact
        sourceId: sourceId || "", // paypal, credit card, interact
        currency: "USD",
        amount,
        createdAt: new Date(),
        status: StatusType.SUCCESS,
      };

      // TODO create marketdata for this wallet
      existingUser.balance = currentBalance + amount;
      await UserModel.save(existingUser);
      await TransactionModel.create(newTransaction);

      return { message: "successfully update user balance", success: true };
    }

    throw new Error("error getting user");
  } catch (error) {
    log("error updating user wallet", error);
    return { message: error && error.message, success: false };
  }
};
