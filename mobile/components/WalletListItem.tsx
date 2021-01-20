import numeral from 'numeral';
import React from 'react';
import { Colors, IS_ANDROID } from '../enums';
import { IWallet } from '../store/interfaces';
import { StyleSheet, Image, View } from 'react-native';
import { ListItem, Left, Body, Right, Text, Icon } from 'native-base';
import { scale } from 'react-native-size-matters';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const WalletListItem = ({ ...wallet }: IWallet): React.ReactElement<any> => {
  // handle item press
  const _onPress = (): void => onPress(wallet);
  // wallet prop destructuring
  const { symbol, name, balance, marketPrice, icon, style, onPress, withCheveron } = wallet;
  // render the item content
  const renderItem = (): React.ReactElement<any> => (
    <ListItem icon style={[styles.container, style]} noIndent onPress={_onPress}>
      <Left style={style}>
        {icon ? (
          <Image source={{ uri: icon }} style={{ height: 40, width: 40, borderRadius: 20 }} />
        ) : (
          <Text style={[styles.subTitle]}>——</Text>
        )}
      </Left>
      <Body style={style}>
        <Text numberOfLines={1} style={styles.title}>
          {name}
        </Text>
      </Body>
      <Right style={{ alignSelf: 'center', borderColor: Colors.transparent }}>
        <View style={styles.rightContent}>
          <Text style={[styles.title, { fontWeight: balance > 0 ? '700' : '500' }]}>
            {marketPrice ? numeral(numeral(marketPrice)._value * balance).format(`$0,0[.]0[0000]`) : '——'}
          </Text>
          <Text
            style={[
              styles.subTitle,
              { color: balance > 0 ? Colors.trueBlue : Colors.grayish, fontWeight: balance > 0 ? '700' : 'normal' },
            ]}>
            {`${numeral(balance).format(`0,0[.]0[0000]`)} ${symbol}`}
          </Text>
        </View>
        {withCheveron ? <Icon name="arrow-forward" /> : null}
      </Right>
    </ListItem>
  );
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return wallet && wallet.symbol ? (
    IS_ANDROID ? (
      <TouchableNativeFeedback onPress={_onPress}>{renderItem()}</TouchableNativeFeedback>
    ) : (
      renderItem()
    )
  ) : (
    <ListItem icon style={[styles.container, style]} noIndent>
      <Body style={style}>
        <Text numberOfLines={1} style={styles.alert}>
          This Asset is not supported by Stoqey
        </Text>
      </Body>
    </ListItem>
  );
};
WalletListItem.defaultProps = {
  props: {
    style: {},
    noBorder: true,
  },
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue,
  },
  rightContent: {
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    color: Colors.black,
    fontSize: scale(16),
  },
  subTitle: {
    color: Colors.grayish,
    fontSize: scale(12),
  },
  alert: {
    fontSize: scale(11),
    textAlign: 'center',
  },
});

export default WalletListItem;
