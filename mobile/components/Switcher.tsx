import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Range from './Range';
import { IRangeSwitcherProps } from '../store/interfaces';
import { Colors } from '../enums';

const Switcher: React.FC<IRangeSwitcherProps> = props => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  const { ranges, current, onSelectRange, containerStyle } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      {ranges.map((name, index) => (
        <Range key={index} name={name} active={current === name} onPress={onSelectRange} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
});

export default memo(Switcher);
