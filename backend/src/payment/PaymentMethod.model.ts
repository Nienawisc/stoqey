import { Schema, model } from "ottoman";
import { ObjectType, Field, Int } from "type-graphql";
import { isEmpty } from "lodash";
import { CommonSchema, CommonType, ResType, TradingEnvType } from "../shared";
import { defineCouchbaseModel } from "../couchbase/models";

const modelName = 'PaymentMethod';
/**
 * GraphQL Types start
 */

@ObjectType()
export class PaymentMethodType extends CommonType {

  @Field({ nullable: true })
  name: string; // paypal, credit card, interact

  @Field({ nullable: true })
  type: string; // paypal, credit card, interact

  @Field({ nullable: true })
  info: string; // paypal, credit card, interact

}
 

/**
 * GraphQL Types end
 */

// Couchbase schema start
const paymentMethodSchema = new Schema({
  ...CommonSchema,
  name: String,
  type: String,
  info: String,
});

export const PaymentMethodModel = () => defineCouchbaseModel(modelName, paymentMethodSchema);

export default PaymentMethodModel;