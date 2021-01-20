import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';

import About from '../About';
import MarketStats from '../MarketStats';
import { Colors, Screen, MAXIMUM_CHART_HEIGHT, CHART_HEADER_HEIGHT } from '../../enums';
import { ICoin, IChartProps, IRangeSwitcherProps, IWallet } from '../../store/interfaces';

import { Button, Icon } from 'native-base';
import { verticalScale, scale } from 'react-native-size-matters';
import LoadingSpinner from '../Spinner';
import Switcher from '../Switcher';
import Chart from '../Chart';

interface IProps {
  coin: ICoin;
  chartProps?: IChartProps;
  switcherProps?: IRangeSwitcherProps;
  onInvestBtnPress: (...args: any) => any;
  faved: boolean;
}

const StoqeyInfo: React.FC<IProps> = ({ coin, chartProps, switcherProps, onInvestBtnPress, faved }) => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  const _onInvestBtnPress = (): void => onInvestBtnPress();

  return (
    <ScrollView style={{ backgroundColor: Colors.white }} showsVerticalScrollIndicator={false}>
      {!chartProps.isLoading ? (
        <Chart {...{ ...chartProps }} withHeader />
      ) : (
        <LoadingSpinner containerStyle={{ height: MAXIMUM_CHART_HEIGHT }} />
      )}
      <Switcher {...switcherProps} />
      {/* <WalletListItem
        {...wallet}
        onPress={(): void => {}}
        style={{
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: Colors.gray,
          height: 65,
        }}
      /> */}

      {/* BUY | SELL */}
      <View style={styles.buttonContainer}>
        <Button
          style={{ flex: 1, marginHorizontal: 10, backgroundColor: Colors.trueBlue }}
          block
          onPress={_onInvestBtnPress}>
          <Text style={styles.buttonText}>{`BUY | SELL ${coin.symbol}`}</Text>
        </Button>
      </View>

      {/* Unfollow / Follow */}
      <View style={styles.buttonContainer}>
        <Button
          iconLeft
          bordered
          style={{ flex: 1, marginHorizontal: 10, borderColor: Colors.trueBlue }}
          block
          onPress={() => {}}>
          <Icon
            name={faved ? 'star' : 'star-outline'}
            style={{ marginLeft: scale(-15), paddingHorizontal: scale(10), color: Colors.black }}
          />
          <Text style={[styles.buttonText, { color: faved ? Colors.black : Colors.trueBlue }]}>
            {faved ? 'Unfollow' : `Follow`}
          </Text>
        </Button>
      </View>

      <MarketStats coin={coin} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    alignSelf: 'center',
    fontSize: scale(13),
  },
});

export default React.memo(StoqeyInfo);
