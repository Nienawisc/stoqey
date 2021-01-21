import _ from 'lodash';
import { ICoin, IAction, Dispatch, IWallet, IInvestInfo, IPathValues } from './interfaces';
import { Ranges, Transact, ActionType } from '../enums';
import { get } from '../api';
import numeral from 'numeral';
import { showMessage } from 'react-native-flash-message';
import { getRandomInt, getRandomDate } from './helpers';
//set state to current coin
export const setCurrentCoin = (coin: ICoin, dispatch: Dispatch): any =>
  dispatch({
    type: ActionType.COIN_EXTRA,
    payload: coin,
  });
// set isLoading before and after fetching data
export const setLoading = (dispatch: Dispatch, isLoading: boolean): any =>
  dispatch({
    type: ActionType.LOADING,
    payload: { isLoading },
  });
/**
|--------------------------------------------------
| Fetch Coins List from API 'https://www.cryptocompare.com'
|--------------------------------------------------
*/
export const fetchCoinListAction = async (limit: number, page: number, dispatch: Dispatch): Promise<IAction | any> => {
  const response = await get(`data/top/mktcapfull?limit=${limit}&page=${page}&tsym=USD`);
  return dispatch({
    type: ActionType.COINLISTS,
    payload: response,
  });
};
/**
|--------------------------------------------------
| Fetch Coins Latest News from API 'https://www.cryptocompare.com'
|--------------------------------------------------
*/
export const fetchLatestNewsAction = async (dispatch: Dispatch): Promise<IAction | any> => {
  setLoading(dispatch, true);
  const response = await get(`data/v2/news/?lang=EN`);
  return dispatch({
    type: ActionType.NEWS_ARTICLES,
    payload: response,
  });
};
/**
|--------------------------------------------------
| Update chart prices based on a single coin and a range
|--------------------------------------------------
*/
export const updateChartDataAction = async (
  coin: ICoin,
  range: string,
  period: number,
  dispatch: Dispatch,
): Promise<IAction | any> => {
  setLoading(dispatch, true); // loading indicator
  const response = await get(buildAPIQuery(coin.symbol, range));
  const change = await fetchPriodChange(coin.symbol, coin.price, period);

  console.log('updateChartDataAction', JSON.stringify({ response, change }));

  return dispatch({
    type: ActionType.UPDATE_COIN_PRICES,
    payload: { response, change },
  });
};
/**
|--------------------------------------------------
| update All Prices for All Coins
|--------------------------------------------------
*/
export const updateAllPricesAction = async (coins: Array<ICoin>, dispatch: Dispatch): Promise<any> => {
  setLoading(dispatch, true);
  const symbols = coinsToCommaSeparatedSymbolList(coins);
  const response = await get(`data/pricemultifull?fsyms=${symbols}&tsyms=USD`);
  dispatch({
    type: ActionType.UPDATE_ALL_PRICES,
    payload: response,
  });
};
// Convert coin array to a comma separated symbol list for the API calls
const coinsToCommaSeparatedSymbolList = (list: Array<ICoin>): string =>
  list.map((item): string => item.symbol).reduce((prev, current): string => prev + ',' + current);

/**
|--------------------------------------------------
| Fetch Fav Coins List
|--------------------------------------------------
*/
export const fetchFavouriteAction = async (favourites: Array<ICoin>, dispatch: Dispatch): Promise<any> => {
  return dispatch({
    type: ActionType.FAVOURITE,
    payload: favourites,
  });
};
/**
|--------------------------------------------------
| Fetch Top Coins List
|--------------------------------------------------
*/
export const fetchTopListtAction = async (dispatch: Dispatch): Promise<IAction | any> => {
  setLoading(dispatch, true);
  const response = await get(`data/top/totalvolfull?limit=10&tsym=USD`);
  return dispatch({
    type: ActionType.TOPLIST,
    payload: response,
  });
};
/**
|--------------------------------------------------
| Add/Remove coins/assets from favourite
|--------------------------------------------------
*/
export const toggleFavouriteAction = (coin: ICoin, dispatch: Dispatch): IAction | any => {
  return dispatch({
    type: ActionType.TOGGLE_FAVOURITE,
    payload: coin,
  });
};
/**
|--------------------------------------------------
| Get price change between current and previous prices per period (hour, day ...etc)
|--------------------------------------------------
*/
const fetchPriodChange = async (symbol: string, price: string, period: number): Promise<any> => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const periodTimestamps = timestamp - period * 3600;
  const response: any = await get(`data/histohour?fsym=${symbol}&tsym=USD&limit=1&toTs=${periodTimestamps}`);
  if (response.Data.length > 0) {
    // Get last entry's close price in Data array since the API returns two entries
    const previousPrice = response.Data.slice(-1).pop().close;
    const change = getPriceChange(numeral(price)._value, previousPrice);
    return change;
  } else return 0;
};
const getPriceChange = (currentPrice, previousPrice): number => {
  if (!previousPrice) {
    return 0;
  }
  return parseFloat(((currentPrice / previousPrice - 1) * 100).toFixed(2));
};
/**
|--------------------------------------------------
| Wallet and transactions // you can use smartcontracts api (e.g. web3) here to transact
|--------------------------------------------------
*/
export const transactAction = async (
  investmentInfo: IInvestInfo,
  type: number,
  wallets: Array<IWallet>,
  dispatch: Dispatch,
): Promise<any> => {
  const _index: number = wallets.findIndex((e): boolean => e.symbol === investmentInfo.currency); // current Wallet
  if (type === Transact.BUY) {
    // you can do validation for bank account balance here. we won't do this here
    const _bankBalanceValid = true; // will go with assumption that your bank has suffucient balance
    if (_bankBalanceValid) {
      return dispatch({
        type: ActionType.TRANSACT,
        payload: { wallet: wallets[_index], type, investmentInfo },
      });
    }
  } else if (type === Transact.SELL) {
    // check the wallet balance
    if (wallets[_index].balance < numeral(investmentInfo.input)._value)
      return showMessage({
        message: 'Oops Sorry!',
        description: `insufficient balance in your ${investmentInfo.currency} wallet`,
        type: 'danger',
        duration: 5000,
      });
    else
      return dispatch({
        type: ActionType.TRANSACT,
        payload: { wallet: wallets[_index], type, investmentInfo },
      });
  }
};
/**
|--------------------------------------------------
| Get Dummy wallets txs history
|--------------------------------------------------
 */
/**
 * return all the transactions history of a wallet
 * @param address wallet addess
 * @param period the period in minutes/hour/days as per range (1H, 1D, 1W, 1M, 1Y, ALL)
 */
export const getDummyWalletTxs = async (limit: number, tsx: IPathValues[]): Promise<IPathValues[]> => {
  // the production api must use the wallet address to pull transactions from the blockchain
  // start simulation
  if (limit > 0) {
    const randDate = getRandomDate(new Date(2019, 0, 1), new Date()); // starts 01/01/2019
    const cryptoTxList: IPathValues = {
      time: Math.floor(randDate.getTime() / 1000),
      value: Math.random() + getRandomInt(6, 6),
    };
    tsx.push(cryptoTxList);
    return getDummyWalletTxs(--limit, tsx); // recursion to get tsx based on the limit specified -- for simuation only (on bc api would much easier than that)
  } else {
    return tsx;
  }
};
export const getWalletTxsAction = async (limit: number): Promise<any> => {
  const txs: IPathValues[] = await getDummyWalletTxs(limit, []);
  return Promise.resolve(txs);
};
/**
|--------------------------------------------------
| Build API query based on symbol of interest and current date range
|--------------------------------------------------
*/
const buildAPIQuery = (symbol: string, range: string): string => {
  let endpoint = 'histominute';
  let aggregate = 1;
  let limit = 60;
  switch (range) {
    case Ranges.HOUR:
      endpoint = 'histominute';
      aggregate = 1;
      limit = 60;
      break;
    case Ranges.DAY:
      endpoint = 'histohour';
      aggregate = 1;
      limit = 24;
      break;
    case Ranges.WEEK:
      endpoint = 'histoday';
      aggregate = 1;
      limit = 7;
      break;
    case Ranges.MONTH:
      endpoint = 'histoday';
      aggregate = 1;
      limit = 30;
      break;
    case Ranges.YEAR:
      endpoint = 'histoday';
      aggregate = 12;
      limit = 30;
      break;
    case Ranges.ALL:
      endpoint = 'histoday';
      aggregate = 30; // Max allowed limit
      limit = 2000; // Max allowed limit
      break;
  }

  return `data/${endpoint}?fsym=${symbol}&tsym=USD&limit=${limit}&aggregate=${aggregate}`;
};
