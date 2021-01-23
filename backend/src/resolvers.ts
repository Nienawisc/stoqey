import UserResolver from './user/User.resolver';
import UserResolverAdmin from './user/User.resolver.admin';
import WalletResolver from './wallet/Wallet.resolver';
import MarketDataResolver from './marketdata/marketdata.resolver';
import TradeResolver from './trade/trade.resolver';
import TransactionResolver from './transaction/Transaction.resolver';
import TransactionAdminResolver from './transaction/Transaction.resolver.admin';
import PaymentMethodResolver from './payment/PaymentMethod.resolver';

import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";


export const Resolvers: NonEmptyArray<Function> | any = () => [UserResolver, UserResolverAdmin, WalletResolver, MarketDataResolver, TradeResolver, TransactionResolver, TransactionAdminResolver, PaymentMethodResolver]