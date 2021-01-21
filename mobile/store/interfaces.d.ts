import * as React from 'react';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import * as ReactNative from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { TransactionType } from '../graphql/transactions';
/**
|--------------------------------------------------
| shortcut the Dispatch from React.Dispatch<any> to just Dispatch
|--------------------------------------------------
*/
export type Dispatch = React.Dispatch<any>;
/**
|--------------------------------------------------
| State Items to manage
|--------------------------------------------------
*/
// route params
type RouteParams = {
  Coin: { coin: ICoin };
  Transact: { wallet?: Partial<IWallet>; backTo?: string };
};
export type CoinRouteProp = RouteProp<RouteParams, 'Coin'>;
export type TransactRouteProp = RouteProp<RouteParams, 'Transact'>;
// news data interface
export interface INews {
  id: string;
  guid: string;
  published_on: number;
  imageurl: string;
  title: string;
  url: string;
  source: string;
  body: string;
  tags: string;
  categories: string;
  upvotes: string;
  downvotes: string;
  lang: string;
  source_info: {
    name: string;
    lang: string;
    img: string;
  };
}
//state data interface
export interface IState {
  coins: Array<ICoin>;
  toplist: Array<ICoin>;
  wallets: Array<IWallet>;
  favourites: Array<ICoin>;
  currentCoin: ICoin;
  ranges: Array<string>;
  chartValues: IPathValues[];
  news: Array<INews>;
  isLoading: boolean;
}
//action data
export interface IAction {
  type: number;
  payload: Array<ICoin> | Array<IPriceResponse> | ICoin;
}
/**
|--------------------------------------------------
| props to be passed to Chart component
|--------------------------------------------------
*/
export interface IChartProps {
  color?: string;
  coin: ICoin;
  change: number;
  values: IPathValues[];
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  range: any;
  isLoading: boolean;
  withHeader?: boolean;
}
/**
|--------------------------------------------------
| props to pass to Range Component
|--------------------------------------------------
 */
export interface IStatInfo {
  icon: string;
  iconType: any;
  title: string;
  stat: string;
  content: string;
}
/**
|--------------------------------------------------
| chart path type
|--------------------------------------------------
*/
export interface IPathValues {
  value: number;
  time: number | string;
}
/**
|--------------------------------------------------
| props to pass to Range Component
|--------------------------------------------------
*/
export interface IRangeProps {
  name: string;
  active: boolean;
  onPress: (...args: any) => any;
}
/**
 * chart range
 */
export interface IRange {
  range: string;
  period: number;
}
/**
|--------------------------------------------------
| props passed to Range Switcher component
|--------------------------------------------------
*/
export interface IRangeSwitcherProps {
  ranges: Array<string>;
  current: string;
  onSelectRange: (...args: any) => any;
  containerStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
}
/**
|--------------------------------------------------
| Coin Data interface
|--------------------------------------------------
*/
export interface ICoin {
  id?: string;
  symbol: string;
  name: string;
  price?: string;
  change?: number;
  changePct: number;
  icon?: string;
  supply?: string;
  totalVol?: string;
  mktCap?: string;
  faved?: boolean;
  tradable?: boolean;
  onPress?: (...args: any) => any;
}


export interface ICurrency {
  id?: string;
  symbol: string;
  name: string;
  price?: string;
  change?: number;
  changePct: number;
}

/**
 * Trade
 */
export interface ITrade {
  id?: string;
  symbol: string;
  time: string;
  price?: string;
  change?: number;
  changePct: number;
  icon?: string;
}

/**
|--------------------------------------------------
| props to pass to Header component
|--------------------------------------------------
*/
export interface ICoinHeaderProps {
  faved: boolean;
  currentCoin: ICoin;
  goBack: (...args: any) => any;
  onPress: (...args: any) => any;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
}
/**
|--------------------------------------------------
| API Chart Response data Interface
|--------------------------------------------------
*/
export interface IPriceResponse {
  Data: Array<{
    close: number;
    high: number;
    low: number;
    open: number;
    time: number;
    volumefrom: number;
    volumeto: number;
  }>;
  TimeFrom: number;
  TimeTo: number;
}
/**
|--------------------------------------------------
| navigation props
|--------------------------------------------------
*/
export interface INavProps {
  navigation: NavigationScreenProp<NavigationState>;
  banner?: string; // we haven't used the banner but it could really be useful in the long run
}
/**
|--------------------------------------------------
| Main Component Props
|--------------------------------------------------
*/
export interface IMainProps {
  children?: React.ReactElement<any>;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  coins: Array<ICoin>;
  navigateToDetail: (...args: any) => any;
  onUpdatePrice: (...args: any) => any;
  navigateTo: (...args: any) => any;
  onNewsPress: (...args: any) => any;
  news: Array<INews>;
  hideBackground?: (...args: any) => any; //for android only
}
// TabBarIcon component props interface
export interface ITabBarIcon {
  withStyle?: boolean;
  tintColor?: string;
  focused: boolean;
  horizontal?: boolean;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  name: string;
  type?:
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Zocial';
}
// Coin List Item interface to represent the (favourites)
export interface ICoinListItem extends ReactNative.ViewProps {
  coin: ICoin;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
}
// Coin/Asset Item to represent Account with more actions
export interface IAssetCoin extends ReactNative.ViewProps {
  withAction: boolean;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  onFollow?: (...args: any) => any;
  onPress?: (...args: any) => any;
  noBorder?: boolean;
  coin: ICoin;
}

export interface IAssetTrade extends ReactNative.ViewProps {
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  onPress?: (...args: any) => any;
  noBorder?: boolean;
  trade: ITrade;
}

export interface IAssetTransaction extends ReactNative.ViewProps {
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  onPress?: (...args: any) => any;
  noBorder?: boolean;
  transaction: TransactionType;
}

//news/stories list item
export interface INewsListItem extends ReactNative.ViewProps {
  item: INews;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  onPress: (...args: any) => any;
}
//Wallet data interface
export interface IWallet {
  symbol: string;
  name: string;
  balance?: number;
  marketPrice?: string;
  icon?: string;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  onPress?: (...args: any) => any;
  withCheveron?: boolean;
}
//investment data
export interface IInvestInfo {
  currency: string;
  input: string;
  amountInUSD: 0;
}
