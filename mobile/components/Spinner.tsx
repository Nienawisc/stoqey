import React from 'react';
import { View, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../enums';

export default function Spinner({
  color,
  containerStyle,
}: {
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
}): React.ReactElement<any> {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  // render centered spinner any where
  return (
    <View style={[styles.centered, containerStyle]}>
      <ActivityIndicator color={color ? color : Colors.trueBlue} size={'large'} />
    </View>
  );
}
Spinner.defaultProps = {
  containerStyle: {},
};
const styles = StyleSheet.create({
  centered: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
});
