import _ from 'lodash';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { INews } from '../store/interfaces';
import { Colors } from '../enums';
import NewsListItem from './NewsListItem';
const StoriesList = ({ items, onPress }: { items: Array<INews>; onPress: Function }): React.ReactElement<any> => {
  // define local state to hold the news object and list pagination object to increase rendering performance.
  const [state, setState] = React.useState({
    news: [],
    page: 1,
    loading: false,
    isRefreshing: false,
  });
  // render the seprator between items
  const renderFlatListItemSeparator = (): React.ReactElement<any> => (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grayish,
      }}
    />
  );
  // handle more to fetch more data from the news list and api
  const handleLoadMore = (): void => {
    if (items.length < state.page * 10) return;
    setState((prev): any => ({
      ...state,
      news: _.take(items, state.page * 10),
      page: prev.page + 1,
    }));
  };
  // giving keys for each item in the dynamic list
  const keyExtractor = (item: INews): string => item.id;
  // render the list item
  const renderItem = ({ item }: { item: INews }): React.ReactElement<any> => (
    <NewsListItem item={item} onPress={onPress} style={{ backgroundColor: Colors.white, borderColor: Colors.white }} />
  );
  // load the 1st 10 items when the component 1st mounted using useEffect hook
  React.useEffect((): void => {
    setState((prev): any => ({
      ...state,
      news: _.take(items, state.page * 10),
      page: prev.page + 1,
    }));
  }, []);
  // default return
  return (
    <FlatList
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={renderFlatListItemSeparator}
      data={state.news}
      onEndReachedThreshold={0.4}
      onEndReached={handleLoadMore}
    />
  );
};

export default StoriesList;
