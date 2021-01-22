import { Schema, model } from "ottoman";
import { ObjectType, Field, Int } from "type-graphql";
import { isEmpty } from "lodash";
import { CommonSchema, CommonType, ResType, StatusType } from "../shared";
import { log } from "../log";
import { UserModel } from "../user";
import WalletModel, { WalletType } from "../wallet/Wallet.model";
import { defineCouchbaseModel } from "../couchbase/models";

const modelName = "Transaction";
/**
 * GraphQL Types start
 */

@ObjectType()
export class TransactionType extends CommonType {
  @Field({ nullable: true })
  type?: string; // withdraw or deposit

  @Field(type => StatusType, { nullable: true })
  status?: StatusType; //

  @Field({ nullable: true })
  source?: string; // paypal, credit card, interact
  @Field({ nullable: true })
  sourceId?: string; // paypal, credit card, interact

  @Field({ nullable: true })
  currency?: string;
  @Field({ nullable: true })
  amount?: number;
}

/**
 * GraphQL Types end
 */

// Couchbase schema start
const transactionSchema = new Schema({
  ...CommonSchema,
  type: String, // add type
  status: String,
  source: String, // paypal, credit card, interac
  sourceId: String, // paypal, credit card, interac
  currency: String,
  amount: Number,
});

export const TransactionModel = () => defineCouchbaseModel(modelName, transactionSchema);

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
    const { rows: existingUser } = await UserModel().findById(owner);
    if (isEmpty(existingUser)) {
      throw new Error("user does not exist");
    }

    // Get the wallet
    const {
      rows: existingWallet,
    }: { rows: WalletType & any } = await WalletModel().findById(walletId);
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
      await existingWallet.save();

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
      await existingWallet.save();

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
