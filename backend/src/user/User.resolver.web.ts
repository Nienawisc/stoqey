import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import isEmpty from "lodash/isEmpty";
import { UserModel, LoginResponseType } from "./User.model";
import { ContextType } from "../shared";
import { log } from "../log";

import { createNewUser, login } from "./User.methods";
import { FirebaseTokenVerify } from "../middlewares/firebaseToken.middleware";
import {
  sendRefreshToken,
} from "../auth";

@Resolver()
export class UserResolverWeb {
  @Mutation(() => LoginResponseType)
  @UseMiddleware(FirebaseTokenVerify)
  async phoneLogin(
    @Arg("phone") phone: string,
    @Arg("firebaseToken") _firebaseToken: string,
    @Arg("createNew") createNew: boolean,
    @Ctx() { res }: ContextType
  ): Promise<LoginResponseType> {
    try {
      const username = phone;

      console.log(`LOGIN: phone=${phone} _firebaseToken=${_firebaseToken}`);

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

      console.log(`users found are users=${users.length}`);

      // users are not found
      if (isEmpty(users)) {
        // should not create new user
        if (!createNew) {
          throw new Error("could not find user");
        } else {
          // create a new user here
          // else create new user from here
          const response = await createNewUser({
            email: "",
            fullname: "",
            phone,
            hashedPassword: "",
          });

          console.log(`creating new user =${JSON.stringify(response)}`);

          const { refreshToken } = response;

          sendRefreshToken(res, refreshToken);
    
          return response;
        }
      }

      // user is found
      let user = users[0]; // get first document

      const response = await login(user); // login user without password

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
