/**
|--------------------------------------------------
| react reducers for state management
|--------------------------------------------------
*/
import numeral from 'numeral';
import _ from 'lodash';
import { IState } from './interfaces';
import { ActionType, Transact } from '../enums';
import { showMessage } from 'react-native-flash-message';

function reducer(state: IState, { type, payload }: any): object {
  switch (type) {
    // updating current coin
    case ActionType.COIN_EXTRA:
      return { ...state, currentCoin: payload };

    // you can set any state loading var here
    case ActionType.LOADING:
      return { ...state, ...payload }; // make sure payload object matches the IState definition
    // top cryptocurrencies list based on the last 24h
    case ActionType.TOPLIST:
      const { Data: toplist } = payload;
      let _coins = _.uniqBy(
        [
          ...state.coins,
          ...toplist.map(({ CoinInfo, DISPLAY: { USD: volume } }): object => ({
            symbol: CoinInfo.Name,
            name: CoinInfo.FullName,
            price: volume.PRICE,
            change: volume.CHANGEPCT24HOUR,
            // and the change compared to current price
            icon: CoinInfo.ImageUrl
              ? `https://www.cryptocompare.com${CoinInfo.ImageUrl}`
              : 'https://mhcd.org/wp-content/uploads/2017/12/placeholder-man.png',
            supply: volume.SUPPLY,
            totalVol: volume.TOTALVOLUME24HTO,
            mktCap: volume.MKTCAP,
          })),
        ],
        'symbol',
      );
      return {
        ...state,
        toplist: [
          ...toplist.map(({ CoinInfo, DISPLAY: { USD: volume } }): object => ({
            symbol: CoinInfo.Name,
            name: CoinInfo.FullName,
            price: volume.PRICE,
            change: volume.CHANGEPCT24HOUR,
            changePct: volume.CHANGEPCTDAY,
            // and the change compared to current price
            icon: CoinInfo.ImageUrl
              ? `https://www.cryptocompare.com${CoinInfo.ImageUrl}`
              : 'https://mhcd.org/wp-content/uploads/2017/12/placeholder-man.png',
            supply: volume.SUPPLY,
            totalVol: volume.TOTALVOLUME24HTO,
            mktCap: volume.MKTCAP,
          })),
        ],
        // with every coin/asset loaded/added we open a wallet for the user with 0 balance
        coins: _coins,
        isLoading: false,
      };
    //list of coins fetched from thr API
    case ActionType.COINLISTS:
      const { Data } = payload;
      _coins = _.uniqBy(
        [
          ...state.coins,
          ...Data.map(({ CoinInfo, DISPLAY: { USD: volume } }): object => ({
            symbol: CoinInfo.Name,
            name: CoinInfo.FullName,
            price: volume.PRICE,
            change: volume.CHANGEPCT24HOUR,
            changePct: volume.CHANGEPCTDAY,
            // and the change compared to current price
            icon: CoinInfo.ImageUrl
              ? `https://www.cryptocompare.com${CoinInfo.ImageUrl}`
              : 'https://mhcd.org/wp-content/uploads/2017/12/placeholder-man.png',
            supply: volume.SUPPLY,
            totalVol: volume.TOTALVOLUME24HTO,
            mktCap: volume.MKTCAP,
          })),
        ],
        'symbol',
      );
      return {
        ...state,
        // map through each coin
        coins: _coins, // with every coin/asset loaded/added we open a wallet for the user with 0 balance
        wallets: [
          ...Data.map(({ CoinInfo, DISPLAY: { USD: volume } }): object => ({
            symbol: CoinInfo.Name,
            name: `${CoinInfo.FullName} Wallet`,
            marketPrice: volume.PRICE,
            balance: 0,
            // and the change compared to current price
            icon: CoinInfo.ImageUrl
              ? `https://www.cryptocompare.com${CoinInfo.ImageUrl}`
              : 'https://mhcd.org/wp-content/uploads/2017/12/placeholder-man.png',
          })),
        ],
      };

    // add/remove to and from favourites state
    case ActionType.TOGGLE_FAVOURITE:
      const favourites = state.favourites.find((c): boolean => c.symbol === payload.symbol)
        ? state.favourites.filter((fav): boolean => fav.symbol !== payload.symbol)
        : [...state.favourites, { ...payload, faved: true }]; //if found? remove! otherwise add
      const coins = [...state.coins]; //coins state clone
      coins[coins.findIndex((e): boolean => e.symbol === payload.symbol)] = {
        // update coins state at the exact position.
        ...payload,
        faved: favourites.find((c): boolean => c.symbol === payload.symbol) ? true : false,
      };
      return {
        ...state,
        favourites,
        coins,
        currentCoin: {
          ...payload,
          faved: favourites.find((c): boolean => c.symbol === payload.symbol) ? true : false,
        },
      };

    //news articles
    case ActionType.NEWS_ARTICLES:
      return { ...state, news: payload.Data, isLoading: false };

    //updating the chart that repesents the coin prices over a period of time 1H, 1D, 1W ...etc
    case ActionType.UPDATE_COIN_PRICES: {
      const {
        response: { Data },
        change,
      } = payload;

      return {
        ...state,
        isLoading: false,
        chartValues: !!Data ? Data.map((item): any => ({ value: item.close, time: item.time })) : [], // use closing prices becuase that what matters
        currentCoin: {
          ...state.currentCoin,
          change,
        },
      };
    }

    // update all prices for a bulk of coins list
    case ActionType.UPDATE_ALL_PRICES: {
      const { DISPLAY: data } = payload;
      return {
        ...state,
        // map through each coin
        favourites: state.favourites.map((coin): object => ({
          ...coin,
          // update the prices
          price: data[coin.symbol] ? data[coin.symbol].USD.PRICE : undefined,
          // update the prices change from now to the last 24 hours closing
          change: data[coin.symbol] ? data[coin.symbol].USD.CHANGEPCT24HOUR : undefined,
        })),
        //the same with coins list
        coins: state.coins.map((coin): object => ({
          ...coin,
          // update the prices
          price: data[coin.symbol] ? data[coin.symbol].USD.PRICE : undefined,
          // update the prices change from now to the last 24 hours closing
          change: data[coin.symbol] ? data[coin.symbol].USD.CHANGEPCT24HOUR : undefined,
        })),
        isLoading: false,
      };
    }

    //investment buy | Sell ==> the validation for balance and insufficincy is done in the actions.tsx file.
    case ActionType.TRANSACT: {
      const { wallet, investmentInfo, type } = payload;
      const wallets = [...state.wallets];
      const _index = wallets.findIndex((e): boolean => e.symbol === investmentInfo.currency);
      if (type === Transact.BUY) {
        wallets[_index] = {
          ...wallet,
          balance: wallet.balance + numeral(investmentInfo.input)._value,
        };
      } else if (type === Transact.SELL) {
        wallets[_index] = {
          ...wallet,
          balance: wallet.balance - numeral(investmentInfo.input)._value,
        };
      }
      showMessage({
        message: 'Yay congrats!',
        description: 'Transaction has successfuly gone through',
        type: 'success',
        duration: 5000,
      });
      return {
        ...state,
        wallets,
      };
    }
    // return the state is no action or invalid action type has been sent to the reducer
    default:
      return state;
  }
}

export default reducer;
