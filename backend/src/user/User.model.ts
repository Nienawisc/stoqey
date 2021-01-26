import { Model } from '@stoqey/sofa';
import { ObjectType, Field, Int } from "type-graphql";
import { isEmpty } from "lodash";
import { CommonSchema, CommonType, ResType } from "../shared";

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

export const UserModel: Model = new Model(modelName);

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
