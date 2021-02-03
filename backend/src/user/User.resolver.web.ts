import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware
} from "type-graphql";
import {
  UserType,
  UserModel,
  LoginResponseType,
} from "./User.model";
import { ContextType, ResType } from "../shared";
import { log } from '../log';

import { updateUserWallet } from './User.methods'
import { FirebaseTokenVerify } from "src/middlewares/firebaseToken.middleware";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "src/auth";

@Resolver()
export class UserResolverWeb {

  @Mutation(() => LoginResponseType)
  @UseMiddleware(FirebaseTokenVerify)
  async webPhoneLogin(
    @Arg("phone") email: string,
    @Arg("firebaseToken") token: string,
    @Arg("createNew") createNew: boolean,
    @Ctx() { res }: ContextType
  ): Promise<LoginResponseType> {

    try {
      const username = email.toLowerCase();
  
      log(`LOGIN: username=${email}`);

      const users = await UserModel.pagination({
        select: "*",
        where: {
          $or: [{ email: { $eq: username } }, { phone: username }, { phone: `+1${username}` }],
        },
      });

      const user = users[0]; // get first document

      if (!user && !createNew) { // should not create new user
        throw new Error("could not find user");
      }

      const refreshToken = createRefreshToken(user);
      const accessToken = createAccessToken(user);

      sendRefreshToken(res, refreshToken);

      return {
        success: true,
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      console.log("error login in", error);
      return ({
        success: false,
        message: error && error.message,
        accessToken: null,
        refreshToken: null,
        user: null,
      } as unknown) as LoginResponseType;
    }
  }
}

export default UserResolverWeb;
