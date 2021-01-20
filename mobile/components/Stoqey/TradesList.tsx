import React from 'react';
import { FlatList } from 'react-native';
import TradeItem from './TradeItem';
import { IAssetTrade, ITrade } from '../../store/interfaces';
import { Colors, IS_ANDROID } from '../../enums';
import { scale } from 'react-native-size-matters';

interface IProps extends IAssetTrade {
  handleLoadMore: (...arges: any) => any;
}
const TradesList = ({ items, onPress, handleLoadMore }): React.ReactElement<IProps> => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  const onItemPress = (coin: ITrade): void => onPress(coin);
  // giving keys for each item in the dynamic list
  const keyExtractor = (item: ITrade): string => item.id;
  // render the list item
  const renderItem = ({ item }: { item: ITrade }): React.ReactElement<any> => (
    <TradeItem
      trade={item}
      onPress={onItemPress}
      style={{ backgroundColor: Colors.white, paddingBottom: IS_ANDROID ? scale(10) : scale(5) }}
    />
  );
  // handle more to fetch more data from the coins/assets list api
  const _handleLoadMore = (): void => {
    handleLoadMore();
  };

  return (
    <FlatList
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      data={items}
      onEndReachedThreshold={0.4}
      onEndReached={_handleLoadMore}
    />
  );
};

export default TradesList;
