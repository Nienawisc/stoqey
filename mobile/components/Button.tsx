import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from 'native-base';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../enums';

interface Props {
  text: string;
  onPress: () => any;
  style?: any;
}
export const ButtonComponent = (props: Props) => {
  const { text, onPress, style } = props;
  return (
    <View style={styles.buttonContainer}>
      <Button onPress={() => onPress()} style={[styles.button, style]} block>
        <Text style={styles.buttonText}>{text}</Text>
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  button: { flex: 1, marginHorizontal: moderateScale(10), backgroundColor: Colors.green },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    alignSelf: 'center',
    fontSize: scale(13),
  },
});

export default ButtonComponent;
