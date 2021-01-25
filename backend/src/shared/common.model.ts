import {registerEnumType, ObjectType, Field} from "type-graphql";

/**
 * Register enums from here
 */
export enum SymbolSecType {
  AI = "ai",
  CRYPTO = "crypto",
  STOCK = "crypto",
  FOREX = "forex",
};
registerEnumType(SymbolSecType, {
  name: "SymbolSecType", // this one is mandatory
  description: "The security type of the symbol/ticker ai e.g STQ, stock, crypto, stock, forex", // this one is optional
});

export enum TradingEnvType {
  LIVE = "live",
  PAPER = "paper",
};
registerEnumType(TradingEnvType, {
  name: "TradingEnvType", // this one is mandatory
  description: "The trading environment either live or paper", // this one is optional
});


export enum ActionType {
  BUY = "BUY",
  SELL = "SELL",
}
registerEnumType(ActionType, {
  name: "ActionType", // this one is mandatory
  description: "The action type, BUY or SELL", // this one is optional
});

export enum StatusType {
    PENDING = "pending",
    SUCCESS = "success",
    FAIL = "fail",
}
registerEnumType(StatusType, {
  name: "StatusType", // this one is mandatory
  description: "General status type, either pending, success, or fail", // this one is optional
});

export enum TradingStatusType {
    PENDING = "pending",
    LIVE = "live",
    COMPLETE = "complete",
    DRAFT = "draft",
    FAIL = "fail"
};
registerEnumType(TradingStatusType, {
  name: "TradingStatusType", // this one is mandatory
  description: "Trading status type, either pending, live, complete, or draft", // this one is optional
});

export enum WithdrawOrDeposit {
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit'
};

registerEnumType(WithdrawOrDeposit, {
  name: "WithdrawOrDeposit", // this one is mandatory
  description: "Transaction type withdraw or deposit", // this one is optional
});
@ObjectType()
export class CommonType {
  @Field(() => String)
  id?: string;

  @Field(type => TradingEnvType, { nullable: true })
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

export  const CommonSchema = {
  id: String,
  tradeEnv: String,
  owner: String,
  createdAt: Date,
  updatedAt: Date,
  deleted: Boolean,
}