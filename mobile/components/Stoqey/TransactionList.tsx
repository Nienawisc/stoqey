import React from 'react';
import { FlatList } from 'react-native';
import TransactionItem from './TransactionItem';
import { IAssetTransaction } from '../../store/interfaces';
import { Colors, IS_ANDROID } from '../../enums';
import { scale } from 'react-native-size-matters';
import { TransactionType } from '../../graphql/transactions';


interface IProps extends IAssetTransaction {
  handleLoadMore: (...arges: any) => any;
}
const TransactionList = ({ items, onPress, handleLoadMore }): React.ReactElement<IProps> => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  const onItemPress = (coin: TransactionType): void => onPress(coin);
  // giving keys for each item in the dynamic list
  const keyExtractor = (item: TransactionType): string => item.id;
  // render the list item
  const renderItem = ({ item }: { item: TransactionType }): React.ReactElement<any> => (
    <TransactionItem
      transaction={item}
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

export default TransactionList;
