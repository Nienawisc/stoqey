import { Model } from '@stoqey/sofa';
import { ObjectType, Field } from "type-graphql";
import { CommonType } from "../shared";

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

export const PaymentMethodModel: Model = new Model(modelName)

export default PaymentMethodModel;