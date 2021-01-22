import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import { View, InteractionManager } from 'react-native';
import { Colors, allRanges, MAXIMUM_CHART_HEIGHT } from '../../enums';
import { IChartProps, IRangeSwitcherProps, ICurrency, IPathValues } from '../../store/interfaces';
import { LoadingSpinner } from '../../components';
import { moderateScale } from 'react-native-size-matters';
import { log } from '../../config';
import styles from './stoqey.styles';
import { getMarketDataApi } from './marketdata.api';
import { useApolloClient } from '@apollo/react-hooks';
import { MarketDataType } from '../../graphql/marketdata';
import Switcher from '../../components/Switcher';
import Chart from '../../components/Chart';
interface STQChartProps {
  chartProps?: IChartProps;
  switcherProps?: IRangeSwitcherProps;
}
const STQChart: React.FC<STQChartProps> = ({ chartProps, switcherProps }) => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  // const _onInvestBtnPress = (): void => onInvestBtnPress();

  return (
    <View style={{ backgroundColor: Colors.white }}>
      {!chartProps.isLoading ? (
        <Chart {...{ ...chartProps }} withHeader />
      ) : (
        <LoadingSpinner containerStyle={{ height: MAXIMUM_CHART_HEIGHT }} />
      )}
      <Switcher {...switcherProps} />
    </View>
  );
};

const StoqeyChart = (props: any): React.ReactElement => {
  // Fetch market data from here
  // Fetch available wallets from here

  const route = props.route;
  const symbol = (route && route.params && route.params.symbol) || props.symbol || 'STQP';

  log.info(`the symbols is ${symbol}`);
  const stoqeyCurrency: ICurrency = {
    symbol,
    name: 'Stoqey',
    price: '0',
    change: 0,
    changePct: 0,
  };

  const [isLoading, setLoading] = React.useState<boolean>(true);

  const [selectedRange, setRange] = React.useState(allRanges[0]);

  const [marketData, setMarketData] = React.useState<IPathValues[]>([]);
  const setMarketDataValues = (data: MarketDataType[]) => {
    const dataToSave: IPathValues[] = data.map(i => ({ time: new Date(i.date).getTime() / 1000, value: i.close }));
    setMarketData(dataToSave);
  };

  const client = useApolloClient();

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
    InteractionManager.runAfterInteractions(async () =>
      getMarketDataApi({
        args: {
          symbol,
          range: selectedRange,
          limit: 600,
        },
        client,
        err: async () => {
          setLoading(false);
        },
        done: async (data: any[]) => {
          setLoading(false);
          if (data.length > 2) {
            return await setMarketDataValues(data);
          }
        },
      }),
    );
  }, [selectedRange]);

  // loading chartProps with data to pass to Chart component
  const chartProps: IChartProps = {
    fillColor: Colors.transparent,
    strokeColor: Colors.trueBlue,
    strokeWidth: moderateScale(4),
    coin: stoqeyCurrency,
    values: marketData,
    range: selectedRange,
    isLoading,
    change: numeral(stoqeyCurrency.change),
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
      <React.Suspense fallback={<LoadingSpinner />}>
        <STQChart switcherProps={switcherProps} chartProps={chartProps} />
      </React.Suspense>
    </View>
  );
};

export default StoqeyChart;
