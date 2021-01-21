import _ from 'lodash';
import React, { useEffect, useContext } from 'react';
import { Container, Header, ScrollableTab, Tab, Tabs, Title, Body } from 'native-base';
import Tab1 from './Assets';
import Tab2 from './Assets';
import Tab3 from './Assets';
import Tab4 from './Assets';
const LazyCoins = React.lazy((): any => import('../components/AssetsList'));
import { Store } from '../store';

import { INavProps, ICoin, IWallet } from '../store/interfaces';
import { LoadingSpinner } from '../components';
import { API, Colors, IS_ANDROID } from '../enums';
import { fetchCoinListAction } from '../store/actions';
import { InteractionManager, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Prices: React.FC<INavProps> = props => {
  const navigation = useNavigation();
  const {
    state: { coins, wallets },
    dispatch,
  } = useContext(Store);
  // define local state to hold the values of page for list pagination purpose
  const [page, setPage] = React.useState<number>(1); // default is 1
  // rearrange coins and wallets to see which coins are tradable.
  const [assets, setAssets] = React.useState<ICoin[]>([]);
  const [isAssetLoading, setLoading] = React.useState<boolean>(true);
  //navigate to coin details.
  const navigateToDetail = (coin: ICoin): boolean => props.navigation.navigate('Coin', { coin });
  //fetch pagination
  const handleLoadMore = (): void => {
    if (page < API.MAXIMUM_FETCH / API.LIMIT && coins.length <= page * API.LIMIT && coins.length < API.MAXIMUM_FETCH) {
      // making sure we don't load the same data twice.
      fetchCoinListAction(API.LIMIT, page, dispatch);
      setPage(page + 1);
    }
  };
  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const arrangedCoins = coins.map((c: ICoin) =>
        wallets.find((w: IWallet): boolean => w.symbol === c.symbol)
          ? { ...c, tradable: true }
          : { ...c, tradable: false },
      );
      await setAssets(arrangedCoins);
      setLoading(false);
    });
    const sbListener = navigation.addListener('focus', (): void => {
      StatusBar && StatusBar.setBarStyle('light-content');
      IS_ANDROID && StatusBar && StatusBar.setBackgroundColor(Colors.trueBlue);
    });
    return (): void => navigation.removeListener('focus', null); // cleanup
  }, []);
  return (
    <Container>
      {!isAssetLoading && coins.length ? (
        <Tabs
          tabContainerStyle={{ backgroundColor: Colors.lightGray }}
          renderTabBar={() => (
            <ScrollableTab underlineStyle={{ backgroundColor: Colors.black }} backgroundColor={Colors.lightGray} />
          )}>
          <Tab
            tabStyle={{ backgroundColor: Colors.lightGray }}
            activeTabStyle={{ backgroundColor: Colors.lightGray }}
            activeTextStyle={{ color: Colors.black }}
            textStyle={{ color: Colors.black + '50' }}
            heading="All Assets">
            <React.Suspense fallback={<LoadingSpinner />}>
              <LazyCoins withAction={false} items={assets} onPress={navigateToDetail} handleLoadMore={handleLoadMore} />
            </React.Suspense>
          </Tab>
          <Tab
            tabStyle={{ backgroundColor: Colors.lightGray }}
            activeTabStyle={{ backgroundColor: Colors.lightGray }}
            activeTextStyle={{ color: Colors.black }}
            textStyle={{ color: Colors.black + '50' }}
            heading="Tradable Assets">
            <React.Suspense fallback={<LoadingSpinner />}>
              <LazyCoins
                withAction={false}
                items={assets.filter((c: ICoin): boolean => c.tradable === true)}
                onPress={navigateToDetail}
                handleLoadMore={handleLoadMore}
              />
            </React.Suspense>
          </Tab>
          <Tab
            tabStyle={{ backgroundColor: Colors.lightGray }}
            activeTabStyle={{ backgroundColor: Colors.lightGray }}
            activeTextStyle={{ color: Colors.black }}
            textStyle={{ color: Colors.black + '50' }}
            heading="Top Gainers">
            <React.Suspense fallback={<LoadingSpinner />}>
              <LazyCoins
                withAction={false}
                items={_.orderBy(assets, (c: ICoin) => Number(c.change), 'desc')}
                onPress={navigateToDetail}
                handleLoadMore={handleLoadMore}
              />
            </React.Suspense>
          </Tab>
          <Tab
            tabStyle={{ backgroundColor: Colors.lightGray }}
            activeTabStyle={{ backgroundColor: Colors.lightGray }}
            activeTextStyle={{ color: Colors.black }}
            textStyle={{ color: Colors.black + '50' }}
            heading="Top Losers">
            <React.Suspense fallback={<LoadingSpinner />}>
              <LazyCoins
                withAction={false}
                items={_.orderBy(assets, (c: ICoin) => Number(c.change), 'asc')}
                onPress={navigateToDetail}
                handleLoadMore={handleLoadMore}
              />
            </React.Suspense>
          </Tab>
        </Tabs>
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
};

export default Prices;
