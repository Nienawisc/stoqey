import React from 'react';
import { View } from 'react-native';
import { Separator, Text } from 'native-base';
import { Colors } from '../enums';
import { ICoin } from '../store/interfaces';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

export default function About({ coin }: { coin: ICoin }): React.ReactElement<any> {
  // dummy rendering. all the logic is in the component under screens folder (screens/coin.tsx)
  return (
    <View style={{ marginTop: 0 }}>
      <Separator style={{ backgroundColor: Colors.transparent, height: verticalScale(40) }} bordered>
        <Text style={{ fontSize: scale(13), color: Colors.black, fontWeight: '600' }}>About {coin.name}</Text>
      </Separator>
      <Text
        style={{
          padding: moderateScale(10),
          fontSize: scale(13),
          lineHeight: 17,
        }}>
        {coin.name} ({coin.symbol}) is a consensus network that enables a new payment system and a completely digital
        currency. Powered by its users, it is a peer to peer payment network that requires no central authority to
        operate.
      </Text>
    </View>
  );
}
