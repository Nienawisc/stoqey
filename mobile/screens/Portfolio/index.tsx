import React from 'react';
import _ from 'lodash';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
// import { InnerLayout } from '../../layout/InnerLayout';
import { TabView, SceneMap } from 'react-native-tab-view';
import Dots from 'react-native-dots-pagination';
// import { ScrollView, StatusBar } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StoqeyChart from '../Stoqey/StoqeyChart';
import { Colors } from '../../enums';
import TransactionScreen from '../Transactions/Transactions';

// import { Chart } from './linechat';
// import { useSubscription } from '@apollo/react-hooks';
// import { SYMBOL_SUBSCRIPTION, COIN_SUBSCRIPTION } from '../../graphql/subscription/index';
// import { PortfolioPosition } from './PortfolioPosition';
// import { PortfolioTrades } from './PortfolioTrades';
// import { CoinHistoryChart } from '../coin/CoinHistoryChart';
// import { Colors } from 'react-native-paper';
// import { UserCash } from '../account/UserCash';
// import { CoinPosition } from '../coin/CoinPosition';

const { width, height } = Dimensions.get('window');
const initialLayout = { width };

interface Props {
  route?: {
    params: {
      showTransactions: boolean;
    };
  };
  showTransactions: boolean;
}

function PortfolioScreen(props: Props) {
  const shouldShowTransactions = _.get(
    props,
    'route.params.showTransactions',
    (props && props.showTransactions) || true,
  );

  const date = [{ name: 'Profit & Loss', value: '$0.00' }];

  const PerformanceSummary = () => {
    return (
      <View style={style.title}>
        <View style={style.titleWrapper}>
          {/* Header Performance */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'static',
            }}>
            <Text category="h5">Performance</Text>
          </View>

          {/* Other fields */}
          {/* Profit and Loss */}
          {date.map(d => {
            const { name, value } = d;
            return (
              <View
                key={d.name}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text category="s1">{name}</Text>
                <Text category="p2">{value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const SymbolPerformance = () => {
    return (
      <View style={style.title}>
        {/* Card: Performance and charts positions summary */}
        <View
          style={{
            width,
            height: 100,
            paddingVertical: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {/* Amount, plus change */}
          <View style={{ flex: 1 / 2, paddingLeft: 15 }}>
            {/* Amount + Arrow up or down */}
            <View style={{ flexDirection: 'row' }}>
              <Text style={style.h1}>{price}</Text>
              <Entypo name="arrow-long-down" size={30} color="green" />
            </View>

            {/* Amount plus percentage */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', paddingRight: 15 }}>
                <Text style={[style.h6, { marginRight: 5 }]}>$</Text>
                <Text style={style.h6}>{price}</Text>
              </View>

              <Text style={[style.h6, { color: 'green' }]}>+{changePercentage}%</Text>
            </View>
          </View>

          {/* Volume, High, Low */}
          <View style={{ flex: 1 / 3, marginRight: 15 }}>
            {volumeHighLow.map(vHl => {
              return (
                <View key={vHl.name} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ opacity: 1 / 1.9 }}>{vHl.name}</Text>
                  <Text>{`${vHl.value}`}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  // const { data } = useSubscription(COIN_SUBSCRIPTION, { variables: {}, shouldResubscribe: true });

  const price = '1000.3';
  const volume = '2';
  const changePercentage = '44';

  const volumeHighLow = [
    { name: 'Vol', value: volume },
    { name: 'High', value: '40' },
    { name: 'Low', value: '60' },
  ];

  const [indexTab, setIndexTab] = React.useState(0);
  const [routes] = React.useState([
    { key: 'performance', title: 'performance' },
    { key: 'chart', title: 'chart' },
  ]);

  const renderScene = SceneMap({
    performance: () => (
      <>
        <StoqeyChart />
        {shouldShowTransactions && <TransactionScreen />}
        {/* <Chart /> */}
      </>
    ),
    chart: () => (
      <>
        <SymbolPerformance />
        <StoqeyChart symbol="STQP" />
        {/* <Chart /> */}
      </>
    ),
  });

  return (
    <View style={style.container}>
      {/* Tab views = Chart + Performance */}
      <TabView
        navigationState={{ index: indexTab, routes }}
        renderScene={renderScene}
        onIndexChange={setIndexTab}
        initialLayout={initialLayout}
        renderTabBar={props => <View />}
      />
      <View style={{ justifyContent: 'center', width }}>
        <Dots length={routes.length} active={indexTab} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  h1: {
    fontSize: 30,
  },

  h2: {
    fontSize: 20,
  },
  h6: {
    fontSize: 15,
  },

  title: {
    backgroundColor: Colors.white,
  },
  titleWrapper: {
    marginHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardsWrapper: {
    backgroundColor: '#e5e4e9',
  },
});

export default PortfolioScreen;
