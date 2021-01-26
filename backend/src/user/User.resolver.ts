import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  // Int,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import {
  UserType,
  UserModel,
  LoginResponseType,
  incrementRefreshToken,
} from "./User.model";
import { ContextType, ResType } from "../shared";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../auth";
import { isAuth } from "../auth";
import { log } from "../log";
import isEmpty from "lodash/isEmpty";
import _ from 'lodash'
import { verify } from "jsonwebtoken";
import { FirebaseTokenVerify } from "../middlewares/firebaseToken.middleware";

@InputType()
class RegisterArgs {
  @Field(() => String)
  firebaseToken: string;

  @Field(() => String)
  fullname: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  phone: string;
  @Field(() => String)
  password: string;
}
@Resolver()
export class UserResolver {
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
  async me(@Ctx() context: ContextType): Promise<UserType | null> {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const verified: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const { rows } = await UserModel().findById(verified.userId);
      const user = rows[0];
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(() => LoginResponseType)
  @UseMiddleware(FirebaseTokenVerify)
  async register(
    @Arg("user") user: RegisterArgs,
    @Ctx() { res }: ContextType
  ): Promise<LoginResponseType> {
    const { password, email: ogEmail, phone, firebaseToken, fullname } = user;
    const email = ogEmail.toLocaleLowerCase();
    const hashedPassword = await hash(password, 12);
    try {
      // TODO find phone and email
      const { rows: findIfExits } = await UserModel().find({ email });
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
        createdAt: new Date()
      };

      log('New user account', JSON.stringify(user));

      const userItem = _.pickBy(user, _.identity);
      // Create the user
      const createdUser = await UserModel().create(userItem);

      const refreshToken = createRefreshToken(createdUser);
      const accessToken = createAccessToken(createdUser);
      sendRefreshToken(res, refreshToken);

      return {
        success: true,
        data: createdUser,
        user: createdUser,
        refreshToken,
        accessToken,
      };
    } catch (err) {
      console.log(err);
      return ({
        success: false,
        message: err && err.message,
        user: null,
        accessToken: null,
        refreshToken: null,
      } as unknown) as LoginResponseType;
    }
  }

  @Mutation(() => LoginResponseType)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: ContextType
  ): Promise<LoginResponseType> {
    try {
      const username = email.toLowerCase();
      log(`LOGIN: username=${email} -> ${(password || "").slice(0, 2)}`);
      const { rows } = await UserModel().find({ email: username });
      const user = rows[0];
      if (!user) {
        throw new Error("could not find user");
      }

      const valid = await compare(password, user.password);
      if (!valid) {
        throw new Error("password not valid");
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

  @Mutation(() => ResType)
  async revokeRefreshTokenForUser(
    @Arg("userId", () => String) userId: string
  ): Promise<ResType> {
    try {
      const updated = await incrementRefreshToken(userId);
      if (!updated) {
        throw new Error("error revokeRefreshTokenForUser");
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err && err.message };
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: ContextType) {
    sendRefreshToken(res, "");
    return true;
  }
}

export default UserResolver;
