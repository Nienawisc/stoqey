import { Schema, model } from "ottoman";
import * as ottoman from 'ottoman';
import { ObjectType, Field, Int } from "type-graphql";
import { isEmpty } from "lodash";
import { CommonSchema, CommonType, ResType } from "../shared";
import { defineCouchbaseModel } from "../couchbase/models";

const modelName = "User";
/**
 * GraphQL Types start
 */
@ObjectType()
export class UserType extends CommonType {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  // Revoke accessToken
  @Field({ nullable: true })
  tokenVersion?: number;

  @Field({ nullable: true })
  fullname?: string;

  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  bio?: string;

  // Wallet here
  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  balance?: number;
}
@ObjectType()
export class LoginResponseType extends ResType {
  @Field({ nullable: true })
  refreshToken: string;

  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  user: UserType;
}

/**
 * GraphQL Types end
 */

// Couchbase schema start
const userSchema = new Schema({
  ...CommonSchema,
  email: String,
  password: String,
  tokenVersion: Number,

  fullname: String,
  firstname: String,
  lastname: String,
  phone: String,
  website: String,
  address: String,
  country: String,
  bio: String,

  currency: String,
  balance: Number,
});

userSchema.index.findByEmail = {
  by: "email",
  type: "refdoc",
};

export const UserModel = () => defineCouchbaseModel(modelName, userSchema);

/**
 * Methods
 */
export const incrementRefreshToken = async (
  userId: string
): Promise<boolean> => {
  const existing = await UserModel().findById(userId);
  if (!isEmpty(existing)) {
    const currentVersion = existing.tokenVersion || 0;
    existing.tokenVersion = currentVersion + 1;
    await existing.save();
    return true;
  }
  return false;
};

export default UserModel;
