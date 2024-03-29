import { Model } from '@stoqey/sofa';
import { ObjectType, Field } from "type-graphql";
import { isEmpty } from "lodash";
import { CommonType, StatusType, WithdrawOrDeposit } from "../shared";
import { log } from "../log";
import { UserModel } from "../user";
import WalletModel from "../wallet/Wallet.model";

const modelName = "Transaction";
/**
 * GraphQL Types start
 */

@ObjectType()
export class TransactionType extends CommonType {
  @Field(() => WithdrawOrDeposit, { nullable: true })
  type: string; // withdraw or deposit

  @Field(() => StatusType, { nullable: true })
  status: StatusType; //

  @Field({ nullable: true })
  source: string; // paypal, credit card, interact
  @Field({ nullable: true })
  sourceId?: string; // paypal, credit card, interact

  @Field({ nullable: true })
  currency: string;
  @Field({ nullable: true })
  amount: number;
}

/**
 * GraphQL Types end
 */


export const TransactionModel: Model = new Model(modelName);

interface MakeTrans {
  walletId: string;
  owner: string;
  amount: number;
  type: string;
}

interface MakeTransResponse {
  message: string;
  success: boolean;
}

export const makeTransaction = async (
  args: MakeTrans
): Promise<MakeTransResponse> => {
  try {
    const { walletId, owner, amount, type } = args;

    // check if wallet exits
    // check if funds are there
    // Create the transaction

    // Get User
    const existingUser = await UserModel.findById(owner);
    if (isEmpty(existingUser)) {
      throw new Error("user does not exist");
    }

    // Get the wallet
    const existingWallet = await WalletModel.findById(walletId);
    if (isEmpty(existingWallet)) {
      throw new Error("wallet does not exist");
    }

    const currentWalletBalance: number = existingWallet.balance || 0;

    /**
     * For withdraw
     * remove amount from wallet
     */
    if (type === "withdraw") {
      if (currentWalletBalance < amount) {
        throw new Error("not enough balance in wallet, please try again later");
      }

      const newWalletBalance = Math.round(currentWalletBalance - amount);

      existingWallet.balance = newWalletBalance;

      // Save wallet
      await WalletModel.save(existingWallet);

      return { message: "", success: true };
    }

    /**
     * For deposit
     * Add amount to wallet
     */
    if (type === "deposit") {
      const newWalletBalance = Math.round(currentWalletBalance + amount);

      existingWallet.balance = newWalletBalance;

      // Save wallet
      await WalletModel.save(existingWallet);

      // Do the transaction here

      return { message: "", success: true };
    }

    throw new Error('error please try again later');
    
  } catch (error) {
    log("error creating transaction", error);
    return { message: error && error.message, success: false };
  }
};

export default TransactionModel;
