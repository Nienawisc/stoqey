import numeral from 'numeral';
import React from 'react';
import { Colors, IS_ANDROID } from '../enums';
import { ICoinListItem } from '../store/interfaces';
import { StyleSheet, Image, Platform } from 'react-native';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { scale, moderateScale } from 'react-native-size-matters';

const CoinListItem = ({ coin: item, style }: ICoinListItem): React.ReactElement<any> => {
  // handle onPress for item
  const _onItemPress = (): void => item.onPress();
  // render the item content
  const renderItem = (): React.ReactElement<any> => (
    <ListItem icon style={[styles.container, style]} noIndent onPress={_onItemPress}>
      <Left style={style}>
        {item.icon ? (
          <Image source={{ uri: item.icon }} style={styles.icon} />
        ) : (
          <Text style={[styles.subTitle, numeral(item.change) < 0 ? styles.down : styles.up]}>——</Text>
        )}
      </Left>
      <Body style={style}>
        <Text numberOfLines={1} style={styles.title}>
          {item.name}
        </Text>
        <Text style={styles.subTitle}>{item.symbol}</Text>
      </Body>
      <Right style={[style, styles.right]}>
        <Text style={styles.title}>{item.price ? numeral(item.price).format('$0,0[.]0[0000]') : '—'}</Text>
        <Text style={[styles.subTitle, item.change < 0 ? styles.down : styles.up]}>
          {item.change ? `${item.change < 0 ? '▼' : '▲'} ${Math.abs(item.change)}%` : '—'}
        </Text>
      </Right>
    </ListItem>
  );
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return IS_ANDROID ? (
    <TouchableNativeFeedback onPress={_onItemPress}>{renderItem()}</TouchableNativeFeedback>
  ) : (
    renderItem()
  );
};
CoinListItem.defaultProps = {
  props: {
    style: {},
    noBorder: true,
  },
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue,
  },
  title: {
    color: Colors.black,
    fontSize: scale(16),
  },
  subTitle: {
    color: Colors.grayish,
    fontSize: scale(12),
  },
  up: {
    color: Colors.green,
  },
  down: {
    color: Colors.red,
  },
  right: {
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  icon: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.gray + '40',
  },
});

export default CoinListItem;
