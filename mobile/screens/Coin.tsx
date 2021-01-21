import React, { useContext, useState } from 'react';
import { Store } from '../store';
import { updateChartDataAction, toggleFavouriteAction, setCurrentCoin } from '../store/actions';
import numeral from 'numeral';
import { INavProps, Dispatch, IWallet, CoinRouteProp } from '../store/interfaces';
import { StyleSheet, StatusBar, View, InteractionManager } from 'react-native';
import { Colors, Periods, Ranges, IS_ANDROID } from '../enums';
import { IChartProps, IRangeSwitcherProps } from '../store/interfaces';
import { Header, CoinInfo, LoadingSpinner } from '../components';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';

const Coin = (props: INavProps): React.ReactElement => {
  // get the state data using react hooks (useContext)
  const navigation = useNavigation();
  const {
    state: { ranges, wallets, chartValues, isLoading, currentCoin: storedCurrentCoin },
    dispatch,
  } = useContext(Store);

  const route = useRoute<CoinRouteProp>();
  const currentCoin = route.params ? route.params.coin : null;

  // define local state to hold the values and changes on chart ranges and visibility of the modal
  const [selectedRange, setRange] = React.useState(ranges[0]); //using react hooks: useState
  const [currentWallet, setCurrentWallet] = useState(null);
  // update the chart when the component first mounted based on the default range and selected coin
  React.useEffect((): any => {
    // run the fetching after navigation completely animate.
    InteractionManager.runAfterInteractions(() => {
      setCurrentCoin(currentCoin, dispatch);
      setCurrentWallet([...wallets.filter((w: IWallet): boolean => w.symbol === currentCoin.symbol)]);
      updateChartDataAction(
        currentCoin,
        selectedRange,
        Periods[Object.values(Ranges).indexOf(selectedRange)],
        dispatch,
      );
    });
    const navListener = navigation.addListener('focus', (): void => {
      StatusBar.setBarStyle('dark-content');
      IS_ANDROID && StatusBar.setBackgroundColor(Colors.white);
    });
    return (): void => navigation.removeListener('focus', null); // cleanup
  }, []);
  // loading chartProps with data to pass to Chart component
  const chartProps: IChartProps = {
    fillColor: Colors.transparent,
    strokeColor: Colors.trueBlue,
    strokeWidth: moderateScale(4),
    coin: currentCoin,
    values: chartValues,
    range: selectedRange,
    isLoading,
    change: numeral(currentCoin.change),
  };
  // loading SwitcherProps with data to pass to Switcher component (1H, 1D, 1W ... etc)
  const switcherProps: IRangeSwitcherProps = {
    ranges,
    current: selectedRange,
    onSelectRange: (range: any): void => {
      setRange(range);
      updateChartDataAction(currentCoin, range, Periods[Object.values(Ranges).indexOf(range)], dispatch);
    },
  };
  //handling components actions --------
  const onBackPress = () => navigation.goBack(); // navigate back
  // press on the star icon on the right top corner to add/remove to/from favourites list
  const favBtnPress = (): Dispatch => toggleFavouriteAction(currentCoin, dispatch);

  // handling sell/buy press button press
  const onInvestBtnPress = (): void => {
    navigation.navigate('Transact', { wallet: currentWallet });
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <Header
        faved={storedCurrentCoin ? storedCurrentCoin.faved : false}
        currentCoin={currentCoin}
        goBack={onBackPress}
        onPress={favBtnPress}
        style={{
          backgroundColor: Colors.transparent,
          elevation: 0,
        }}
      />
      <React.Suspense fallback={<LoadingSpinner />}>
        <CoinInfo
          faved={storedCurrentCoin ? storedCurrentCoin.faved : false}
          switcherProps={switcherProps}
          coin={currentCoin}
          wallet={wallets.filter((e): boolean => e.symbol === currentCoin.symbol)[0]}
          chartProps={chartProps}
          onInvestBtnPress={onInvestBtnPress}
          onFollow={favBtnPress}
        />
      </React.Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.white, flex: 1 },
  contentContainer: {
    flex: 60,
  },
  list: {
    flexWrap: 'wrap', // allow multiple rows
    paddingHorizontal: moderateScale(10),
  },
});
export default Coin;
