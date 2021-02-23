import { Model } from '@stoqey/sofa';
import { ObjectType, Field } from "type-graphql";
import { ActionType } from "@stoqey/client-graphql";
import { CommonType, IOrderType } from '../shared';

const modelName = "Order";

/**
 * GraphQL Types start
 */
@ObjectType()
export class OrderType extends CommonType {

  // Options
  @Field({ nullable: true })
  stop?: boolean;
  @Field(type => [IOrderType],{ nullable: true })
  params?: IOrderType[];
  @Field({ nullable: true })
  gtc?: boolean;
  @Field({ nullable: true })
  gfd?: boolean;
  @Field({ nullable: true })
  gtd?: boolean;

  // OrderObject
  @Field(() => ActionType)
  action: ActionType;

  @Field({ nullable: true })
  symbol?: string;

  @Field({ nullable: true })
  instrument: string;

  @Field({ nullable: true })
  clientId: string;

  @Field({ nullable: true })
  type: IOrderType;

  @Field({ nullable: true })
  qty: number;

  @Field({ nullable: true })
  filledQty: number;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  stopPrice?: number;

  @Field({ nullable: true })
  canceled?: boolean;

  @Field({ nullable: true })
  date: Date;

  @Field({ nullable: true })
  workedOn?: Date; // for any active orders
}

/**
 * GraphQL Types end
 */

export const OrderModel: Model = new Model(modelName, { schema: { date: 'date' }});

/**
 * Methods
 */
// TODO methods from here

export default OrderModel;
