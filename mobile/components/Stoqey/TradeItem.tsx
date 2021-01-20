import numeral from 'numeral';
import React from 'react';
import { Colors } from '../../enums';
import { IAssetTrade } from '../../store/interfaces';
import { StyleSheet, Image } from 'react-native';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

const TradeItem: React.FC<any> = ({ ...props }: IAssetTrade) => {
  // handling item press
  const _onPress = (): void => props.onPress(props.trade);
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return (
    <ListItem icon style={[styles.container, props.style]} noIndent noBorder={false} onPress={_onPress}>
      <Left style={props.style}>
        {props.trade.icon ? (
          <Image source={{ uri: props.trade.icon }} style={styles.icon} />
        ) : (
          <Text style={[styles.subTitle, numeral(props.trade.change) < 0 ? styles.down : styles.up]}>——</Text>
        )}
      </Left>
      <Body style={props.style}>
        <Text numberOfLines={1} style={styles.title}>
          {props.trade.symbol}
        </Text>
        <Text style={styles.subTitle}>{`${props.trade.time}`}</Text>
      </Body>
      <Right style={[props.style, styles.right]}>
        <Text style={styles.title}>
          {props.trade.price ? numeral(props.trade.price).format('$0,0[.]0[0000]') : '—'}
        </Text>
        <Text style={[styles.subTitle, props.trade.change < 0 ? styles.down : styles.up]}>
          {props.trade.change ? `${props.trade.change < 0 ? '▼' : '▲'} ${Math.abs(props.trade.change)}%` : '—'}
        </Text>
      </Right>
    </ListItem>
  );
};
TradeItem.defaultProps = {
  props: {
    style: {},
    noBorder: true,
  },
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue,
    height: verticalScale(64),
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

export default TradeItem;
