import React from 'react';
import { Icon } from 'native-base';
import { scale } from 'react-native-size-matters';

import { Colors } from '../enums';
import { ITabBarIcon } from '../store/interfaces';
import { View } from 'react-native';

const TabBarIcon: React.FC<ITabBarIcon> = ({ name, focused, type, style, withStyle }) => {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return (
    <View style={style}>
      <Icon
        name={name}
        type={type ? type : 'Ionicons'}
        style={{
          fontSize: scale(20),
          color: focused ? Colors.trueBlue : withStyle ? Colors.white : Colors.grayish,
        }}
      />
    </View>
  );
};

export default TabBarIcon;
