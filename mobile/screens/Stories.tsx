import React from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Store } from '../store';
import * as WebBrowser from 'expo-web-browser';
import { INavProps, INews } from '../store/interfaces';
import { LoadingSpinner } from '../components';
import { Colors } from '../enums';
import { Header, Left, Icon, Body, Title, Right } from 'native-base';

import { scale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
const LazyStories = React.lazy((): any => import('../components/StoriesList'));
const isAndroid = Platform.OS === 'android';

const Stories = (props: INavProps): React.ReactElement<any> => {
  const navigation = useNavigation();
  // get the state data using react hooks (useContext)
  const {
    state: { news },
  } = React.useContext(Store);
  // set statusbar styling when the component first mounted
  React.useEffect((): any => {
    const navListener = navigation.addListener('focus', (): void => {
      StatusBar.setBarStyle('dark-content');
      isAndroid && StatusBar.setBackgroundColor(Colors.white);
    });
    return (): void => navigation.removeListener('focus', null); // cleanup
  }, []);
  // handling pressing on the news item by opening the link using WebBrowser
  const _handlePressNewsAsync = async (news: INews): Promise<any> => {
    await WebBrowser.openBrowserAsync(news.url);
  };
  // navigate back
  const goBack = () => navigation.goBack();
  // render header using native-base header component
  const renderHeader = (): any => (
    <Header>
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
        <Title style={{ color: Colors.black }}>News</Title>
      </Body>
      <Right />
    </Header>
  );
  // render component
  return (
    <View style={styles.container}>
      {renderHeader()}
      <React.Suspense fallback={<LoadingSpinner />}>
        <LazyStories items={news} onPress={_handlePressNewsAsync} />
      </React.Suspense>
    </View>
  );
};
// remove the react-navigation header
Stories.navigationOptions = {
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
export default Stories;
