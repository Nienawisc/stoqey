import {
  Resolver,
  Query,
  Mutation,
  Arg,
  // Int,
} from "type-graphql";
import {
  UserType,
  UserModel,
} from "./User.model";
import { ResType } from "../shared";
import { Pagination } from "../shared/common.pagination";
import { log } from '../log';

import { updateUserWallet } from './User.methods'

@Resolver()
export class UserResolverAdmin {
  @Query(() => [UserType])
  async users(
    @Arg("search", { nullable: true }) search: string,
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("page", { nullable: true }) page: number
  ): Promise<UserType[]> {
    try {
      const data = await Pagination({
        select: ["id", "email", "phone","fullname", "balance"],
        where: { where: { _type: { $eq: "User" } } },
        limit,
        page,
      });

      log(`users data returned ${data && data.length}`);
      return data;
    } catch (error) {
      log(error);
      return [];
    }
  }

  @Mutation(() => ResType)
  async updateUserWallet(
    @Arg("userId") userId: string,
    @Arg("amount") amount: number,
    @Arg("source", { nullable: true }) source: string,
  ):Promise<ResType> {

    try {

      const updatedWallet = await updateUserWallet(userId, amount, source);

      if(updatedWallet.success){
        return updatedWallet;
      }

      throw new Error('error getting user')

    }
    catch(error){;
      log('error updating user wallet',  error);
      return { message: error && error.message, success: false}
    }

  }
}

export default UserResolverAdmin;
