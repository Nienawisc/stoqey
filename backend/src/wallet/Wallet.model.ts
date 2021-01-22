import { Schema, model } from "ottoman";
import { CommonSchema, CommonType, TradingEnvType } from "../shared";
import { ObjectType, Field, Int } from "type-graphql";
import { defineCouchbaseModel } from "../couchbase/models";

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

// Couchbase schema start
const walletSchema = new Schema({
  ...CommonSchema,
  currency: String,
  balance: Number,
});

export const WalletModel = () => defineCouchbaseModel(modelName, walletSchema);

export default WalletModel;