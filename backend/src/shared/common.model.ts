import { registerEnumType, ObjectType, Field } from "type-graphql";

import {
  StatusType,
  SymbolSecType,
  ActionType,
  TradingStatusType,
  TradingEnvType,
  WithdrawOrDeposit,
  OrderType as IOrderType,
} from "@stoqey/client-graphql";

/**
 * Register enums from here
 */

registerEnumType(IOrderType, {
  name: "IOrderType",
  description: "The order type of the order, either market or limit",
});

registerEnumType(SymbolSecType, {
  name: "SymbolSecType", // this one is mandatory
  description:
    "The security type of the symbol/ticker ai e.g STQ, stock, crypto, stock, forex", // this one is optional
});
registerEnumType(TradingEnvType, {
  name: "TradingEnvType", // this one is mandatory
  description: "The trading environment either live or paper", // this one is optional
});
registerEnumType(ActionType, {
  name: "ActionType", // this one is mandatory
  description: "The action type, BUY or SELL", // this one is optional
});
registerEnumType(StatusType, {
  name: "StatusType", // this one is mandatory
  description: "General status type, either pending, success, or fail", // this one is optional
});
registerEnumType(TradingStatusType, {
  name: "TradingStatusType", // this one is mandatory
  description: "Trading status type, either pending, live, complete, or draft", // this one is optional
});
registerEnumType(WithdrawOrDeposit, {
  name: "WithdrawOrDeposit", // this one is mandatory
  description: "Transaction type withdraw or deposit", // this one is optional
});

export {
  IOrderType,
  StatusType,
  SymbolSecType,
  ActionType,
  TradingStatusType,
  TradingEnvType,
  WithdrawOrDeposit,
};

@ObjectType()
export class CommonType {
  @Field(() => String)
  id?: string;

  @Field((type) => TradingEnvType, { nullable: true })
  tradeEnv?: TradingEnvType;

  @Field({ nullable: true })
  owner?: string;

  @Field({ nullable: true })
  createdAt?: Date;
  @Field({ nullable: true })
  updatedAt?: Date;
  @Field({ nullable: true })
  deleted?: boolean;
}

export const CommonSchema = {
  id: String,
  tradeEnv: String,
  owner: String,
  createdAt: Date,
  updatedAt: Date,
  deleted: Boolean,
};
