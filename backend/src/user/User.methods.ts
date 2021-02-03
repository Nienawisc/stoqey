import _, { isEmpty } from "lodash";
import { log } from "../log";
import { ResType, StatusType, TradingEnvType } from "@stoqey/client-graphql";
import { TransactionModel, TransactionType } from "../transaction";
import UserModel, { LoginResponseType, UserType } from "./User.model";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "../auth";

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


interface CreateNewUser {
  email: string;
  fullname: string;
  phone: string;
  hashedPassword: string;
};

/**
 * Create new user method
 * @param args 
 */
export const createNewUser = async (args: CreateNewUser): Promise<LoginResponseType> => {
  const { email, fullname, phone, hashedPassword } = args;
  try {
    const findIfExits = await UserModel.pagination({
      where: {
        $or: [{ email: { $eq: email } }, { phone: phone }],
      },
    });

    if (!isEmpty(findIfExits)) {
      throw new Error("user already exists");
    }

    const names = (fullname || "").split(" ");
    const firstname = names.length ? names[0] : null;
    const lastname = names.length ? names[1] : null;

    const user: UserType = {
      fullname,
      // @ts-ignore
      firstname,
      // @ts-ignore
      lastname,
      phone,
      email,
      password: hashedPassword,
      balance: 0,
      currency: "USD",
    };

    log("New user account", JSON.stringify(user));

    const userItem = _.pickBy(user, _.identity);
    // Create the user
    const createdUser: UserType = (await UserModel.create(
      userItem
    )) as UserType;

    const refreshToken = createRefreshToken(createdUser);
    const accessToken = createAccessToken(createdUser);

    return {
      success: true,
      data: createdUser,
      user: createdUser,
      refreshToken,
      accessToken,
    };
  } catch (err) {
    console.error(err);
    return ({
      success: false,
      message: err && err.message,
      user: null,
      accessToken: null,
      refreshToken: null,
    } as unknown) as LoginResponseType;
  }
}

// TODO update user account