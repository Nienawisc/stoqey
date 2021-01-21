import React, { useContext, useState } from 'react';
import { Store } from '../../store';
import { updateChartDataAction, toggleFavouriteAction, setCurrentCoin } from '../../store/actions';
import numeral from 'numeral';
import { INavProps, Dispatch, IWallet, CoinRouteProp, IPathValues } from '../../store/interfaces';
import { StatusBar, View, InteractionManager } from 'react-native';
import { Colors, Periods, Ranges, IS_ANDROID, allRanges } from '../../enums';
import { IChartProps, IRangeSwitcherProps } from '../../store/interfaces';
import { Header, CoinInfo, LoadingSpinner } from '../../components';
import StoqeyInfo from '../../components/Stoqey/StoqeyInfo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';

import styles from './stoqey.styles';
import { getMarketDataApi } from './marketdata.api';
import { useApolloClient } from '@apollo/react-hooks';
import { MarketDataType } from '../../graphql/marketdata';

const stoqeyCurrency: ICoin = {
  symbol: 'STQP',
  name: 'Stoqey',
  price: '0',
  change: 0,
  changePct: 0,
  icon: 'https://firebasestorage.googleapis.com/v0/b/crypsey-01.appspot.com/o/symbols%2FSTQ.png?alt=media',
  supply: '',
  totalVol: '1M',
  mktCap: '300M',
  faved: true,
  tradable: true,
  onPress: () => {}, // null on click new stoqey buy screen
};

const StoqeyScreen = (props: INavProps): React.ReactElement => {
  // Fetch market data from here
  // Fetch available wallets from here

  const [currentCoin, setCurrentCoin] = React.useState<ICoin>(stoqeyCurrency);
  const [isLoading, setLoading] = React.useState<boolean>(true);

  const [selectedRange, setRange] = React.useState(allRanges[0]);

  const [marketData, setMarketData] = React.useState<IPathValues[]>([]);
  const setMarketDataValues = (data: MarketDataType[]) => {
    const dataToSave: IPathValues[] = data.map(i => ({ time: new Date(i.date).getTime() / 1000, value: i.close }));
    setMarketData(dataToSave);
  };

  const client = useApolloClient();
  const navigation = useNavigation();

  // const {
  //   state: { ranges, wallets, chartValues, isLoading, currentCoin: storedCurrentCoin },
  //   dispatch,
  // } = useContext(Store);

  // const route = useRoute<CoinRouteProp>();
  // const currentCoin = route.params ? route.params.coin : null;

  // define local state to hold the values and changes on chart ranges and visibility of the modal
  // const [selectedRange, setRange] = React.useState(ranges[0]); //using react hooks: useState
  // const [currentWallet, setCurrentWallet] = useState(null);
  // update the chart when the component first mounted based on the default range and selected coin
  // React.useEffect((): any => {
  //   // run the fetching after navigation completely animate.
  //   InteractionManager.runAfterInteractions(() => {
  //     setCurrentCoin(currentCoin, dispatch);
  //     setCurrentWallet([...wallets.filter((w: IWallet): boolean => w.symbol === currentCoin.symbol)]);
  //     updateChartDataAction(
  //       currentCoin,
  //       selectedRange,
  //       Periods[Object.values(Ranges).indexOf(selectedRange)],
  //       dispatch,
  //     );
  //   });
  //   const navListener = navigation.addListener('focus', (): void => {
  //     StatusBar.setBarStyle('dark-content');
  //     IS_ANDROID && StatusBar.setBackgroundColor(Colors.white);
  //   });
  //   return (): void => navigation.removeListener('focus', null); // cleanup
  // }, []);

  React.useEffect((): any => {
    // run the fetching after navigation completely animate.
    InteractionManager.runAfterInteractions(() => {
      getMarketDataApi({
        args: {
          symbol: 'STQP',
          range: selectedRange,
          limit: 600,
        },
        client,
        err: async (error: Error) => {
          setLoading(false);
        },
        done: async (data: any[]) => {
          setLoading(false);
          if (data.length > 2) {
            return await setMarketDataValues(data);
          }
        },
      });
    });
    const navListener = navigation.addListener('focus', (): void => {
      StatusBar.setBarStyle('dark-content');
      IS_ANDROID && StatusBar.setBackgroundColor(Colors.white);
    });
    return (): void => navigation.removeListener('focus', navListener); // cleanup
  }, [selectedRange]);

  // loading chartProps with data to pass to Chart component
  const chartProps: IChartProps = {
    fillColor: Colors.transparent,
    strokeColor: Colors.trueBlue,
    strokeWidth: moderateScale(4),
    coin: currentCoin,
    values: marketData,
    range: selectedRange,
    isLoading,
    change: numeral(currentCoin.change),
  };
  // loading SwitcherProps with data to pass to Switcher component (1H, 1D, 1W ... etc)
  const switcherProps: IRangeSwitcherProps = {
    ranges: allRanges,
    current: selectedRange,
    onSelectRange: (range): void => {
      setLoading(true);
      setRange(range);
    },
  };
  //handling components actions --------
  // const onBackPress = () => navigation.goBack(); // navigate back
  // // press on the star icon on the right top corner to add/remove to/from favourites list
  // const favBtnPress = (): Dispatch => toggleFavouriteAction(currentCoin, dispatch);

  // // handling sell/buy press button press
  // const onInvestBtnPress = (): void => {
  //   navigation.navigate('Transact', { wallet: currentWallet });
  // };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <Header
        faved={true}
        currentCoin={stoqeyCurrency}
        goBack={() => {}}
        onPress={() => {}}
        style={{
          backgroundColor: Colors.transparent,
          elevation: 0,
        }}
      />
      <React.Suspense fallback={<LoadingSpinner />}>
        <StoqeyInfo
          faved={true}
          switcherProps={switcherProps}
          coin={currentCoin}
          chartProps={chartProps}
          onInvestBtnPress={() => {}}
        />
      </React.Suspense>
    </View>
  );
};

export default StoqeyScreen;
