import { Model } from '@stoqey/sofa';
import { CommonSchema, CommonType, TradingEnvType } from "../shared";
import { ObjectType, Field, Int } from "type-graphql";

const modelName = 'Wallet';
/**
 * GraphQL Types start
 */
@ObjectType()
export class WalletType extends CommonType {

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  balance?: number;

}

@ObjectType()
export class WalletActivityType {
  @Field(() => String)
  id: string;

  @Field({ nullable: true })
  owner?: string;

  @Field({ nullable: true })
  walletId?: string;

  @Field({ nullable: true })
  prevBalance?: number;

  @Field({ nullable: true })
  closeBalance?: number;

}

/**
 * GraphQL Types end
 */

export const WalletModel: Model = new Model(modelName);

export default WalletModel;