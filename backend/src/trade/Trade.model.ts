import { Model } from '@stoqey/sofa';
import { ObjectType, Field } from "type-graphql";
import { ActionType, CommonSchema, CommonType, SymbolSecType, TradingEnvType, TradingStatusType } from "../shared";

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
  @Field(type => SymbolSecType)
  secType: SymbolSecType;
  @Field(type => ActionType)
  action: ActionType;
  @Field(() => String)
  exchange?: string;

  @Field(type => TradingStatusType)
  status?: TradingStatusType;

  @Field(() => Number)
  size: number; // number of shares
  @Field({ nullable: true })
  filled?: number; // profit and loss
  @Field({ nullable: true })
  remaining?: number; // profit and loss

  @Field({ nullable: true })
  pnl?: number; // profit and loss

  @Field(() => Number)
  averageCost?: number;
  @Field({ nullable: true })
  marketPrice?: number;

  @Field(() => Date)
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
