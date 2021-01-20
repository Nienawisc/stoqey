import numeral from 'numeral';
import React from 'react';
import moment from 'moment';
import { Colors } from '../../enums';
import { IAssetTransaction } from '../../store/interfaces';
import { StyleSheet, Image } from 'react-native';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

const TransactionItem: React.FC<any> = ({ ...props }: IAssetTransaction) => {
  // handling item press
  const _onPress = (): void => props.onPress(props.transaction);

  const icon = '';

  const { type: transType, amount, createdAt, tradeEnv, status } = props.transaction || {};
  const time = moment(createdAt || new Date()).fromNow();

  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return (
    <ListItem icon style={[styles.container, props.style]} noIndent noBorder={false} onPress={_onPress}>
      <Left style={props.style}>
        <Image source={{ uri: icon }} style={styles.icon} />
      </Left>
      <Body style={props.style}>
        <Text numberOfLines={1} style={styles.title}>
          {amount + ' Transaction created'}
        </Text>
        <Text style={styles.subTitle}>{`${time}`}</Text>
      </Body>
      <Right style={[props.style, styles.right]}>
        <Text style={styles.title}>{amount ? numeral(amount).format('$0,0[.]0[0000]') : '—'}</Text>
        <Text style={[styles.subTitle, amount < 0 ? styles.down : styles.up]}>
          {amount ? `${amount < 0 ? '▼' : '▲'} ${Math.abs(amount)}%` : '—'}
        </Text>
      </Right>
    </ListItem>
  );
};
TransactionItem.defaultProps = {
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

export default TransactionItem;
