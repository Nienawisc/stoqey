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

  @Field(() => String)
  symbol: string;

  @Field(() => Float)
  volume: number;

  @Field(() => Float)
  open: number;

  @Field(() => Float)
  close: number;

  @Field(() => Float)
  high: number;

  @Field(() => Float)
  low: number;

  @Field(() => Date)
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