import React from 'react';
import { Colors } from '../enums';
import { StyleSheet, Text } from 'react-native';
import { IRangeProps } from '../store/interfaces';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scale, moderateScale } from 'react-native-size-matters';

const Ranges: React.FC<IRangeProps> = props => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  const onPress = (): void => {
    const { name, onPress } = props;
    onPress(name);
  };

  const { name, active } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={[styles.text, active ? styles.active : {}]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(15),
  },
  text: {
    color: Colors.grayish,
    fontSize: scale(13),
  },
  active: {
    color: Colors.black,
    fontWeight: 'bold',
  },
});

export default React.memo(Ranges);
