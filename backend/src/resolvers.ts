
import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";

import UserResolver from './user/User.resolver';
import UserResolverAdmin from './user/User.resolver.admin';
import UserResolverWeb from './user/User.resolver.web';
import WalletResolver from './wallet/Wallet.resolver';
import MarketDataResolver from './marketdata/Marketdata.resolver';
import TradeResolver from './trade/Trade.resolver';
import TransactionResolver from './transaction/Transaction.resolver';
import TransactionAdminResolver from './transaction/Transaction.resolver.admin';
import PaymentMethodResolver from './payment/PaymentMethod.resolver';
import PortfolioResolver from './portfolio/Portfolio.resolver';

export const Resolvers: NonEmptyArray<Function> | any = () => [UserResolver, UserResolverAdmin,UserResolverWeb, WalletResolver, MarketDataResolver, TradeResolver, TransactionResolver, TransactionAdminResolver, PaymentMethodResolver, PortfolioResolver]