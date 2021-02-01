import { Model } from '@stoqey/sofa';
import { ObjectType, Field, registerEnumType } from "type-graphql";
import { ActionType, TradingStatusType, SymbolSecType } from "@stoqey/client-graphql";
import { CommonType } from '../shared';

const modelName = "Trade";

/**
 * GraphQL Types start
 */
@ObjectType()
export class TradeType extends CommonType {

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  symbol: string;
  @Field(() => SymbolSecType)
  secType: SymbolSecType;
  @Field(() => ActionType)
  action: ActionType;

  @Field(() => ActionType)
  positionAction?: ActionType; // this is used for when closing portfolio
  
  @Field({ nullable: true })
  exchange?: string;

  @Field(() => TradingStatusType)
  status?: TradingStatusType;

  @Field({ nullable: true })
  size: number; // number of shares
  @Field({ nullable: true })
  filled?: number; // profit and loss
  @Field({ nullable: true })
  remaining?: number; // profit and loss

  @Field({ nullable: true })
  pnl?: number; // profit and loss

  @Field({ nullable: true })
  averageCost?: number;
  // @Field({ nullable: true })
  marketPrice?: number;

  @Field({ nullable: true })
  entryTime: Date; // time when entered trade
  @Field({ nullable: true })
  exitTime?: Date; // when closed

  // @Field({ nullable: true })
  // payment?: any; // for buying actualSymbol
}

/**
 * GraphQL Types end
 */

export const TradeModel: Model = new Model(modelName);

/**
 * Methods
 */
// TODO methods from here

export default TradeModel;
