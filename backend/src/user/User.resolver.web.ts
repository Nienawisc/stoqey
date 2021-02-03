import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import isEmpty from "lodash/isEmpty";
import { UserType, UserModel, LoginResponseType } from "./User.model";
import { ContextType, ResType } from "../shared";
import { log } from "../log";

import { createNewUser, login, updateUserWallet } from "./User.methods";
import { FirebaseTokenVerify } from "src/middlewares/firebaseToken.middleware";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "src/auth";

@Resolver()
export class UserResolverWeb {
  @Mutation(() => LoginResponseType)
  @UseMiddleware(FirebaseTokenVerify)
  async phoneLogin(
    @Arg("phone") phone: string,
    @Arg("firebaseToken") token: string,
    @Arg("createNew") createNew: boolean,
    @Ctx() { res }: ContextType
  ): Promise<LoginResponseType> {
    try {
      let response: LoginResponseType;
      const username = phone;

      log(`LOGIN: phone=${phone}`);

      const users = await UserModel.pagination({
        select: "*",
        where: {
          $or: [
            { email: { $eq: username } },
            { phone: username },
            { phone: `+1${username}` },
          ],
        },
      });

      const user = users[0]; // get first document

      // user is not found
      if (isEmpty(user)) {
        // should not create new user
        if (!createNew) {
          throw new Error("could not find user");
        } else {
          // create a new user here
          // else create new user from here
          response = await createNewUser({
            email: "",
            fullname: "",
            phone,
            hashedPassword: "",
          });
        }
      }

      response = await login(user); // login user without password

      const { refreshToken } = response;

      sendRefreshToken(res, refreshToken);

      return response;

    } catch (error) {
      console.error(error);
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
