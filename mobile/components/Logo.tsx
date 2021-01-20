import React from 'react';
import { View, StyleSheet, Image, StyleProp, ImageStyle } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

interface IProps {
  noText?: boolean;
  style?: StyleProp<ImageStyle>;
}

const Logo: React.FC<IProps> = props => {
  return (
    <View style={[styles.container]}>
      <Image source={require('../assets/stoqey_robot.png')} style={[styles.logo, props.style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: moderateScale(40),
    width: moderateScale(40),
  },
  text: {
    fontSize: scale(14),
    fontWeight: '800',
  },
});
export default React.memo(Logo);
