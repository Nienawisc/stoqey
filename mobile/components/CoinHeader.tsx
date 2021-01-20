import React from 'react';
import { Header, Left, Body, Right, Icon, Title } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Colors } from '../enums';
import { ICoinHeaderProps } from '../store/interfaces';
import { scale } from 'react-native-size-matters';
export default function CoinHeader({
  faved,
  currentCoin,
  goBack,
  onPress,
  style,
}: ICoinHeaderProps): React.ReactElement<any> {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  const _goBack = (): void => goBack();
  const _onPress = (): void => onPress();
  return (
    <Header androidStatusBarColor={Colors.white} style={style}>
      <Left>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
          }}
          onPress={_goBack}>
          <Icon name={'md-arrow-back'} color={Colors.black} type="Ionicons" fontSize={scale(32)} />
        </TouchableOpacity>
      </Left>
      <Body>
        <Title style={{ color: Colors.black, fontSize: scale(15) }}>{`${currentCoin.name}`}</Title>
        <Title
          style={{ color: Colors.grayish, fontWeight: '400', fontSize: scale(12) }}>{`${currentCoin.symbol}`}</Title>
      </Body>
      <Right>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
          }}
          onPress={_onPress}>
          <Icon
            name={faved ? 'ios-star' : 'ios-star-outline'}
            color={Colors.black}
            type="Ionicons"
            fontSize={scale(32)}
          />
        </TouchableOpacity>
      </Right>
    </Header>
  );
}
