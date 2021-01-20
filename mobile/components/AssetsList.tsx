import React from 'react';
import { FlatList } from 'react-native';
import AssetItem from './AssetItem';
import { ICoin, IAssetCoin } from '../store/interfaces';
import { Colors, IS_ANDROID } from '../enums';
import { scale } from 'react-native-size-matters';

interface IProps extends IAssetCoin {
  handleLoadMore: (...arges: any) => any;
}
const AssetsList = ({ withAction, items, onPress, onFollow, handleLoadMore }): React.ReactElement<IProps> => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  const onItemPress = (coin: ICoin): void => onPress(coin);
  const onItemFollow = (coin: ICoin): void => onFollow(coin);
  // giving keys for each item in the dynamic list
  const keyExtractor = (item: ICoin): string => item.symbol;
  // render the list item
  const renderItem = ({ item }: { item: ICoin }): React.ReactElement<any> =>
    withAction ? (
      <AssetItem
        withAction
        coin={item}
        onFollow={onItemFollow}
        onPress={onItemPress}
        style={{ backgroundColor: Colors.white, paddingBottom: IS_ANDROID ? scale(10) : scale(5) }}
      />
    ) : (
      <AssetItem
        coin={item}
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

export default AssetsList;
