import numeral from 'numeral';
import React from 'react';
import { Colors } from '../enums';
import { IAssetCoin } from '../store/interfaces';
import { View, StyleSheet, Image } from 'react-native';
import { ListItem, Left, Body, Right, Text, Button } from 'native-base';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

const AssetItem: React.FC<any> = ({ ...props }: IAssetCoin) => {
  // handling the item Follow/unfollow button
  const _onFollow = (): void => props.onFollow(props.coin);
  // handling item press
  const _onPress = (): void => props.onPress(props.coin);
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return props.withAction ? (
    <ListItem icon style={[styles.container, props.style]} noIndent noBorder={false} onPress={_onPress}>
      <Left style={props.style}>
        {props.coin.icon ? (
          <Image source={{ uri: props.coin.icon }} style={styles.icon} />
        ) : (
          <Text style={[styles.subTitle, numeral(props.coin.change) < 0 ? styles.down : styles.up]}>——</Text>
        )}
      </Left>
      <Body style={props.style}>
        <Text numberOfLines={1} style={styles.title}>
          {props.coin.name}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.subTitle}>
            {props.coin.price ? numeral(props.coin.price).format('$0,0[.]0[0000]') : '—'}
          </Text>
          <Text style={[styles.subTitle, props.coin.change < 0 ? styles.down : styles.up]}>
            {props.coin.change ? `${props.coin.change < 0 ? '▼' : '▲'} ${Math.abs(props.coin.change)}%` : '—'}
          </Text>
        </View>
      </Body>
      <Right style={[props.style, styles.right]}>
        {props.coin.faved ? (
          <Button small transparent bordered light onPress={_onFollow}>
            <Text style={[styles.subTitle, { color: Colors.black }]}>Following</Text>
          </Button>
        ) : (
          <Button
            onPress={_onFollow}
            color={Colors.white}
            small
            style={{
              backgroundColor: Colors.trueBlue,
            }}>
            <Text style={[styles.subTitle, { color: Colors.white }]}>Follow</Text>
          </Button>
        )}
      </Right>
    </ListItem>
  ) : (
    <ListItem icon style={[styles.container, props.style]} noIndent noBorder={false} onPress={_onPress}>
      <Left style={props.style}>
        {props.coin.icon ? (
          <Image source={{ uri: props.coin.icon }} style={styles.icon} />
        ) : (
          <Text style={[styles.subTitle, numeral(props.coin.change) < 0 ? styles.down : styles.up]}>——</Text>
        )}
      </Left>
      <Body style={props.style}>
        <Text numberOfLines={1} style={styles.title}>
          {props.coin.name}
        </Text>
        <Text style={styles.subTitle}>{`${props.coin.symbol}${props.coin.tradable ? ' • Tradable' : ''}`}</Text>
      </Body>
      <Right style={[props.style, styles.right]}>
        <Text style={styles.title}>{props.coin.price ? numeral(props.coin.price).format('$0,0[.]0[0000]') : '—'}</Text>
        <Text style={[styles.subTitle, props.coin.change < 0 ? styles.down : styles.up]}>
          {props.coin.change ? `${props.coin.change < 0 ? '▼' : '▲'} ${Math.abs(props.coin.change)}%` : '—'}
        </Text>
      </Right>
    </ListItem>
  );
};
AssetItem.defaultProps = {
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

export default AssetItem;
