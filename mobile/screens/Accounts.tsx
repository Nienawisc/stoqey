/**
 * Portfolio Screen Design and Implementation
 */
import numeral from 'numeral';
import _ from 'lodash';
import React from 'react';
import { StatusBar, StyleSheet, FlatList, View, InteractionManager, Text } from 'react-native';

import { Store } from '../store';
import { INavProps, ICoin, IWallet, IPathValues } from '../store/interfaces';
import { WalletListItem, LoadingSpinner, Switcher, Chart } from '../components';
import { Colors, API, IS_ANDROID, Screen } from '../enums';
import { fetchCoinListAction, getWalletTxsAction } from '../store/actions';

import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Title, Header, Container, Subtitle, Body } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const Accounts = (props): React.ReactElement => {
  // get the state data using react hooks (useContext)
  const {
    state: { wallets, coins, ranges },
    dispatch,
  } = React.useContext(Store);

  const navigation = useNavigation();
  // define local state to hold the values of page for list pagination purpose
  const [page, setPage] = React.useState(1); // our state paging starts from 1
  const [selectedRange, setRange] = React.useState(ranges[0]); //using react hooks: useState
  const [txsValues, setTxsValues] = React.useState<IPathValues[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true); // for chart
  // handle range change
  const onRangeChange = (range: any): void => {
    setIsLoading(true);
    setRange(range);
    getWalletTxsAction(10).then((values: IPathValues[]) => {
      setTxsValues(values);
      setIsLoading(false);
    });
  };
  //build the path of chart based on chart values
  const drawChart = (height: number, width: number, strokeWidth: number) => null;
  //buildPathAction(txsValues, height, width, strokeWidth);
  // fetch the first page of coins list to create wallet to each coin with predefined limit when the component first mounted
  React.useEffect((): any => {
    // run the fetching after navigation completely animate.
    InteractionManager.runAfterInteractions(() => {
      if (coins.length === 0) {
        fetchCoinListAction(API.LIMIT, 0, dispatch); // we open wallet based on coins (fetch at page 0 ==> the api pages starts from 0)
      }
      getWalletTxsAction(10).then((values: IPathValues[]) => {
        setTxsValues(values);
        setIsLoading(false);
      });
    });
    const sbListener = navigation.addListener('focus', (): void => {
      StatusBar && StatusBar.setBarStyle('light-content');
      IS_ANDROID && StatusBar && StatusBar.setBackgroundColor(Colors.trueBlue);
    });
    return (): void => navigation.removeListener('focus', null); // cleanup
  }, []);

  //fetch pagination
  const handleLoadMore = (): void => {
    // to prevent relaoding the same data
    if (page < API.MAXIMUM_FETCH / API.LIMIT && coins.length <= page * API.LIMIT && coins.length < API.MAXIMUM_FETCH) {
      fetchCoinListAction(API.LIMIT, page, dispatch);
      setPage(page + 1);
    }
  };
  // handling when pressing on wallet item
  const onPress = (wallet: Partial<IWallet>): void => {
    const _coin: Array<ICoin> = coins.filter((e): boolean => e.symbol === wallet.symbol);
    //setCurrentCoin(_coin[0], dispatch);
    navigation.navigate('Coin', { coin: _coin[0] });
  };
  // render separator between items
  const _renderFlatListItemSeparator = (): React.ReactElement<any> => (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grayish,
      }}
    />
  );
  // total balance
  const totalBalance = _.reduce(
    wallets,
    (total: number, w: IWallet) => {
      return total + w.balance * numeral(w.marketPrice)._value;
    },
    0,
  );
  // giving keys for each item in the dynamic list
  const keyExtractor = (item: IWallet): string => item.symbol;
  // render the list item
  const renderItem = ({ item, index }: { item: IWallet; index: number }): React.ReactElement<any> =>
    index === 0 ? (
      <>
        {!isLoading && wallets.length && txsValues.length ? (
          <Chart
            // withHeader
            range={selectedRange}
            coin={coins[0]}
            strokeColor={Colors.trueBlue}
            strokeWidth={scale(3)}
            values={txsValues}
            defaultChartValue={totalBalance}
            style={{ backgroundColor: Colors.gray + '40' }}
          />
        ) : (
          <LoadingSpinner containerStyle={{ height: Screen.chartHeight + verticalScale(64) }} />
        )}
        <Switcher
          ranges={ranges}
          current={selectedRange}
          onSelectRange={onRangeChange}
          containerStyle={{
            backgroundColor: Colors.gray + '40',
          }}
        />
      </>
    ) : (
      <WalletListItem
        withCheveron
        {...item}
        onPress={onPress}
        style={{
          height: 70,
          backgroundColor: Colors.white,
          borderBottomWidth: 0,
          borderColor: Colors.white,
        }}
      />
    );
  return (
    <Container>
      {wallets.length ? (
        <FlatList
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={_renderFlatListItemSeparator}
          data={[
            {
              symbol:
                'we added this object to render the chart inside of  flatlist to move it with items when scrolling',
            },
            ...wallets,
          ]}
          onEndReachedThreshold={0.4}
          onEndReached={handleLoadMore}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
};
Accounts.navigationOptions = {
  title: 'Accounts',
  headerTintColor: Colors.black,
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
export default Accounts;
