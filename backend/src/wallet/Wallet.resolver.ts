import {
  Resolver,
  Query,
  Mutation,
  Arg,
  // ObjectType,
  // Field,
  Ctx,
  UseMiddleware,
  // Int,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import {
  UserType,
  UserModel,
} from "../user/User.model";
import { ContextType, ResType, TradingEnvType } from "../shared";
import { isAuth } from "../auth";
import isEmpty from "lodash/isEmpty";
import { verify } from "jsonwebtoken";
import WalletModel, { WalletType } from "./Wallet.model";

import { log } from '../log';

@Resolver()
export class WalletResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: ContextType) {
    console.log(payload);
    return `This is user ${JSON.stringify(payload)}`;
  }

  @Query(() => UserType, { nullable: true })
  @UseMiddleware(isAuth)
  async meWallet(@Ctx() context: ContextType, @Arg("tradeEnv") tradeEnv: TradingEnvType): Promise<WalletType | null> {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const verified: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

      const owner = verified.userId;

      const { rows: findIfExits } = await WalletModel().find({ owner, tradeEnv });
      if (isEmpty(findIfExits)) {
        const createdNewWallet = await createMeWallet(owner, tradeEnv);
        return createdNewWallet;
      }

      return findIfExits;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

}


export const createMeWallet = async (owner:  string, tradeEnv: TradingEnvType): Promise<WalletType | null> => {
  try {

    const newWallet: WalletType = {
      owner,
      currency: 'USD',
      balance: 0,
      tradeEnv,
    }

    await WalletModel().create(newWallet);

    return newWallet;

  }catch(error){
    log('error creating wallet', error);
    return null;
  }
}

// TODO record wallet activity
export default WalletResolver;
