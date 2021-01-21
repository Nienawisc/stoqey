import React from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity, Platform, InteractionManager } from 'react-native';
import { Store } from '../store';
import { setCurrentCoin, toggleFavouriteAction, fetchCoinListAction } from '../store/actions';
import { INavProps, ICoin, Dispatch } from '../store/interfaces';
import { LoadingSpinner, AssetsList } from '../components';
import { Colors, API } from '../enums';
import { Header, Left, Icon, Body, Title, Right } from 'native-base';

import { scale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
const isAndroid = Platform.OS === 'android';

const Assets = (props: INavProps): React.ReactElement => {
  const navigation = useNavigation();
  // get the state data using react hooks (useContext)
  const {
    state: { coins },
    dispatch,
  } = React.useContext(Store);
  // define local state to hold the values of page for list pagination purpose
  const [page, setPage] = React.useState(1); // default is 1
  // fetch the first page of coins list with predefined limit when the component first mounted
  React.useEffect((): any => {
    const navListener = navigation.addListener('focus', (): void => {
      StatusBar.setBarStyle('dark-content');
      isAndroid && StatusBar.setBackgroundColor(Colors.white);
    });
    // run the fetching after navigation completely animate.
    InteractionManager.runAfterInteractions(() => {
      //fetch assets
      if (coins.length === 0) {
        fetchCoinListAction(API.LIMIT, 0, dispatch); // fetch at page 0 ==> the api pages starts from 0
      }
    });

    return (): void => navigation.removeListener('focus', null); // cleanup
  }, []);
  //fetch pagination
  const handleLoadMore = (): void => {
    if (page < API.MAXIMUM_FETCH / API.LIMIT && coins.length <= page * API.LIMIT && coins.length < API.MAXIMUM_FETCH) {
      // making sure we don't load the same data twice.
      fetchCoinListAction(API.LIMIT, page, dispatch);
      setPage(page + 1);
    }
  };
  // navigate to coin details
  const navigateToDetail = (coin: ICoin) => {
    //setCurrentCoin(coin, dispatch);
    return navigation.navigate('Coin', { coin });
  };
  // handling adding/removing from/to favourites
  const onAddToFavourite = (coin: ICoin): Dispatch => toggleFavouriteAction(coin, dispatch);
  // navigate back to previous screen
  const goBack = () => navigation.goBack();
  // header rendering using Header from native-base
  const renderHeader = (): any => (
    <Header style={{ backgroundColor: Colors.transparent, elevation: 0 }}>
      <Left>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
          }}
          onPress={goBack}>
          <Icon name={'md-arrow-back'} color={Colors.black} type="Ionicons" fontSize={scale(32)} />
        </TouchableOpacity>
      </Left>
      <Body>
        <Title style={{ color: Colors.black }}>All Assets</Title>
      </Body>
      <Right />
    </Header>
  );
  // default rendering
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      {renderHeader()}
      <React.Suspense fallback={<LoadingSpinner />}>
        {coins.length ? (
          <AssetsList
            withAction={true}
            items={coins}
            onPress={navigateToDetail}
            onFollow={onAddToFavourite}
            handleLoadMore={handleLoadMore}
          />
        ) : (
          <LoadingSpinner />
        )}
      </React.Suspense>
    </View>
  );
};
Assets.navigationOptions = {
  header: null,
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
export default Assets;
