import _ from 'lodash';
import React from 'react';
import { Image, StyleSheet, Text, View, Modal, TouchableOpacity, StatusBar, Platform } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { Colors, Screen } from '../enums';
import { ICoin, INews, IWallet } from '../store/interfaces';
import Invest from './Invest';
import LoadingSpinner from './Spinner';
import Animated from 'react-native-reanimated';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
const LazyCoins = React.lazy((): any => import('./CoinList'));
const LazyTopCoins = React.lazy((): any => import('./TopList'));
const LazyStoqey = React.lazy((): any => import('./Stoqey/StoqeyList'));
// const LazyTopCoins = React.lazy((): Promise<any> => import('./TopList'));

const PANEL_MINIMUM_HEIGHT = Screen.height * 0.35 - Screen.panelTopPadding;
const bottomSheetSnapPoints = Array(101)
  .fill(0.02, 0, 101)
  .map((val, index): number => PANEL_MINIMUM_HEIGHT * (1 + val * index));

interface IProps {
  onBuyBtnPress: (...args: any) => any;
  onSellBtnPress: (...args: any) => any;
  onNewsPress: (...args: any) => any;
  onRefresh: (...args: any) => any;
  onRefreshPrices: (...args: any) => any;
  navigateToScreen: (...args: any) => any;
  populateCoin: (...args: any) => any;
  wallets: IWallet[];
  toplist: ICoin[];
  favourites: ICoin[];
  news: INews[];
  isRefreshingPrice: boolean;
}

const Main: React.FC<IProps> = ({
  onBuyBtnPress,
  onSellBtnPress,
  onNewsPress,
  onRefresh, // fetch and refresh all coins
  onRefreshPrices, // refresh the new prices for the favourated coins
  navigateToScreen,
  populateCoin,
  wallets,
  favourites,
  news,
  toplist,
  isRefreshingPrice,
}) => {
  // reference to the bottom sheet to be able to manipulate programatically
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  // define local state to hold the visibility of the modal
  // const [modalVisible, setModalVisible] = React.useState(false);
  //toggle the modal and refesh coins list if it wasn't previously loaded.
  const onInvestBtnPress = (): void => {
    navigateToScreen('Transact', { backTo: 'Home' });
  };
  // dismiss the investment modal
  // const onInvestDismiss = (): void => {
  //   setModalVisible(!modalVisible);
  // };
  // // handle the status bar when modal show
  // const onModalShowOrClose = (): void => {
  //   StatusBar.setBarStyle('light-content');
  //   Platform.OS === 'android' && StatusBar.setBackgroundColor(Colors.white);
  // };
  //rendering the bottom sheet inner component
  const renderInner = (): React.ReactElement<any> => {
    return (
      <View style={[styles.panel]}>
        <View
          style={[
            styles.panel,
            {
              minHeight: Screen.height,
              backgroundColor: Colors.ghostwhite,
              marginTop: Screen.panelTopPadding,
            },
          ]}>
          <View
            style={{
              marginTop: -Screen.panelTopPadding,
              width: Screen.width - 40,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              overflow: 'hidden',
              backgroundColor: Colors.white,
            }}>
            <React.Suspense fallback={<LoadingSpinner />}>
              {/* Stoqey list here */}
              <LazyStoqey
                items={favourites}
                onPress={populateCoin}
                navigateTo={navigateToScreen}
                itemStyle={{ height: verticalScale(60) }}
              />

              <LazyTopCoins
                items={_.take(toplist, 5)}
                onPress={populateCoin}
                navigateTo={navigateToScreen}
                itemStyle={{ height: verticalScale(60) }}
                isLoading={isRefreshingPrice}
              />
            </React.Suspense>
          </View>
        </View>
      </View>
    );
  };
  // dummy rendering for props received from Home Screen
  return (
    <View style={styles.container}>
      <View style={styles.welcome}>
        {!isRefreshingPrice ? (
          <Image
            source={require('../assets/STQ_light.png')}
            style={{ height: moderateScale(100), width: moderateScale(100), paddingVertical: verticalScale(10) }}
          />
        ) : (
          <LoadingSpinner color={Colors.white} />
        )}

        <Text style={styles.title}>Welcome to Stoqey!</Text>
        <Text style={[styles.subTitle, { paddingBottom: verticalScale(20) }]}>Invest with us today</Text>
        <View>
          <TouchableOpacity
            style={{
              zIndex: -1,
              backgroundColor: Colors.green,
              width: Screen.width - 42,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              height: moderateScale(45),
            }}
            onPress={onInvestBtnPress}>
            <Text style={[styles.title, { fontSize: scale(16), fontWeight: '600' }]}>Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[PANEL_MINIMUM_HEIGHT, Screen.height / 2, Screen.height - PANEL_MINIMUM_HEIGHT, Screen.height]}
        renderContent={renderInner}
        onCloseEnd={onRefreshPrices}
        initialSnap={0}
      />
    </View>
  );
};
// styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGrayish,
  },
  panel: {
    backgroundColor: Colors.transparent,
    width: Screen.width,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  welcome: {
    paddingTop: Screen.height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
  },
  title: {
    color: Colors.white,
    fontSize: scale(18),
    paddingVertical: verticalScale(10),
    fontWeight: '600',
  },
  subTitle: {
    color: Colors.lightGray,
    fontSize: scale(14),
  },
  list: {
    flex: 1,
    marginTop: verticalScale(-60),
    backgroundColor: Colors.transparent,
  },
});

export default Main;
