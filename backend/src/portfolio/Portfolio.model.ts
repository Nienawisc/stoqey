import { Model } from '@stoqey/sofa';
import { CommonSchema, CommonType } from "../shared";
import { ActionType, SymbolSecType, TradingStatusType, TradingEnvType } from "@stoqey/client-graphql";
import { ObjectType, Field, Int } from "type-graphql";

const modelName = 'Portfolio';
/**
 * GraphQL Types start
 */
@ObjectType()
export class PortfolioType extends CommonType {

  @Field({ nullable: true })
  symbol: string;
  @Field(() => SymbolSecType)
  secType: SymbolSecType;
  @Field(() => ActionType)
  action: ActionType;
  @Field({ nullable: true })
  exchange: string;

  @Field(() => TradingStatusType)
  status: TradingStatusType;

  @Field({ nullable: true })
  size: number; // number of shares
  @Field({ nullable: true })

  @Field({ nullable: true })
  averageCost: number;
  @Field({ nullable: true })
  marketPrice?: number;

  @Field({ nullable: true })
  entryTime: Date; // time when entered trade
  @Field({ nullable: true })
  exitTime?: Date; // when closed

}


/**
 * GraphQL Types end
 */

export const PortfolioModel: Model = new Model(modelName);

export default PortfolioModel;