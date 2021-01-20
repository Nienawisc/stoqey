import Constants from 'expo-constants';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Dimensions, Platform } from 'react-native';

// screen height
const SCREEN_HEIGHT = Dimensions.get('window').height;
// screen width
const SCREEN_WIDTH = Dimensions.get('window').width;

// is android device
export const IS_ANDROID = Platform.OS === 'android';
// is ios device
export const IS_iOS = Platform.OS === 'ios';
// is iphone x
export const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;

/**
|--------------------------------------------------
| Device static screen values and props
|--------------------------------------------------
*/
export enum Screen {
  statusBar = Constants.statusBarHeight,
  tabBarHeight = 49,
  height = SCREEN_HEIGHT,
  width = SCREEN_WIDTH,
  fontScale = Dimensions.get('window').fontScale,
  scale = Dimensions.get('window').scale,
  chartHeight = SCREEN_HEIGHT / 4,
  chartHeaderHeight = verticalScale(64),
  panelTopPadding = moderateScale(50),
}

//chart
export const CHART_HEADER_HEIGHT = verticalScale(60);
export const MAXIMUM_CHART_HEIGHT = moderateScale(200);

/**
|--------------------------------------------------
| APP THEME COLORS
|--------------------------------------------------
*/
export enum Colors {
  tintColor = '#fff',
  tabIconDefault = '#ccc',
  tabIconSelected = '#000',
  tabBar = '#fefefe',
  errorBackground = 'red',
  white = '#ffffff',
  ghostwhite = '#f6f7fc',
  black = '#000000',
  gray = '#cccccc',
  green = '#5cb85c',
  red = '#E74C3C',
  blue = '#EBF5FB70',
  trueBlue = '#251278',
  trueYellow = '#bb9600',
  grayish = '#85929E',
  darkGrayish = '#3c4a56',
  lightGray = '#f8f8f8',
  panel = '#f7f5eee8',
  warningBackground = '#EAEB5E',
  warningText = '#666804',
  noticeBackground = '#2f95dc',
  noticeText = '#fff',
  transparent = '#00000000',
}
/**
|--------------------------------------------------
| invest enum
|--------------------------------------------------
*/
export enum Transact {
  BUY = 0,
  SELL,
}
/**
|--------------------------------------------------
| API FETCH
|--------------------------------------------------
*/
export enum API {
  LIMIT = 10,
  MAXIMUM_FETCH = 20,
}
/**
|--------------------------------------------------
| The Market Price Within a period of time
|--------------------------------------------------
*/
export enum Ranges {
  HOUR = '1H',
  DAY = '1D',
  WEEK = '1W',
  MONTH = '1M',
  YEAR = '1Y',
  ALL = 'ALL',
}

export const allRanges: string[] = ['15m', '1h', '1d', '7d', '30d', '60d', '1y'];

// each range matching number per hour [HOUR:1, DAY:24, WEEK:168, MONTH: 730,8760,87600]
export const Periods: Array<number> = [1, 24, 168, 730, 8760, 17520];
/**
|--------------------------------------------------
| Charts Actions Types that can be used by the reducer
|--------------------------------------------------
*/
export enum ActionType {
  COIN_EXTRA,
  LOADING,
  FAVOURITE,
  TOGGLE_FAVOURITE,
  COINLISTS,
  TOPLIST,
  CHARTPATH,
  UPDATE_COIN_PRICES,
  UPDATE_ALL_PRICES,
  NEWS_ARTICLES,
  TRANSACT,
}
