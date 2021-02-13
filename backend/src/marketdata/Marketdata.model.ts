import { Model } from '@stoqey/sofa';
import { ObjectType, Field, Float} from "type-graphql";

const modelName = 'Marketdata';
/**
 * GraphQL Types start
 */
@ObjectType()
export class MarketDataType {
  @Field(() => String)
  id?: string;

  @Field(() => String, { nullable: true })
  symbol: string;

  @Field(() => Float, { nullable: true })
  volume: number;

  @Field(() => Float, { nullable: true })
  open: number;

  @Field(() => Float, { nullable: true })
  close: number;

  @Field(() => Float, { nullable: true })
  high: number;

  @Field(() => Float, { nullable: true })
  low: number;

  @Field(() => Date, { nullable: true })
  date: Date;
}

@ObjectType()
export class MarketSymbolInfo {
  @Field(() => String)
  id?: string;

  @Field(() => String)
  symbol: string;

  @Field(() => String)
  name: string; // 'Stoqey';

  @Field(() => Float)
  change: number;

  @Field(() => Float)
  changePct: number;

  @Field(() => String)
  icon: string;
  
  @Field(() => String)
  supply: string; 

  @Field(() => String)
  totalVol: string; // '1M',

  @Field(() => String)
  mktCap: string; // '300M'
}


/**
 * GraphQL Types end
 */

export const MarketDataModel: Model = new Model(modelName);


export default MarketDataModel;