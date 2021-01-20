import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';

import { Screen, Colors, IS_IPHONE_X } from '../enums';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IProps {
  inputChange?: (...args: any) => any;
}

const keys: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];

const Keyboard: React.FC<IProps> = props => {
  const renderKeys = (): React.ReactElement[] =>
    keys.map(
      (key: string, i: number): React.ReactElement => (
        <TouchableOpacity key={i} style={styles.key} onPressOut={(): void => props.inputChange(key)}>
          <Text style={styles.text}>{key}</Text>
        </TouchableOpacity>
      ),
    );
  return (
    <View style={styles.container}>
      {/* <TextInput value={amount} onChangeText={props.inputChange} /> */}
      <View style={styles.keyboard}>{renderKeys()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: (keys.length / 3) * verticalScale(45),
    width: Screen.width,
    bottom: IS_IPHONE_X ? verticalScale(30) : verticalScale(20),
    borderTopColor: Colors.grayish,
    borderTopWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  key: {
    width: Screen.width / 3,
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: scale(28),
    fontWeight: '600',
    color: Colors.trueBlue,
  },
});

export default Keyboard;
