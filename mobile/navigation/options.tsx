import React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import { Colors } from '../enums';
import { moderateScale } from 'react-native-size-matters';
import HeaderLeft from './HeaderLeft';
import { MaterialBottomTabNavigationOptions } from '@react-navigation/material-bottom-tabs';
type IconType =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';
/**
 * render screen without header bar.
 */
export const screenWithoutHeader = (props?: any) => ({ headerShown: false, ...props });

export const screenWithHeader = (props, title?: string) => {
  const { route } = props;

  const _title = title ? title : route.name;
  return {
    headerLeft: () => <HeaderLeft {...props} />,
    ...props,
    title: route.name === 'Shared' ? (title === 'Comments' ? 'Comments' : 'Profile') : _title,
    headerRight: () => null,
  };
};

// bottom navigation option
export const bottomNavigationOptions = (
  iconName: string,
  iconType: IconType,
  barLabel?: string,
  withStyle?: boolean,
): MaterialBottomTabNavigationOptions => {
  return {
    tabBarLabel: barLabel,
    tabBarIcon: ({ focused }): React.ReactNode =>
      withStyle ? (
        <TabBarIcon
          withStyle
          focused={false}
          name={iconName}
          type={iconType}
          style={{
            backgroundColor: Colors.green,
            height: moderateScale(36),
            width: moderateScale(36),
            borderRadius: moderateScale(18),
            marginTop: moderateScale(-7),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      ) : (
        <TabBarIcon focused={focused} name={iconName} type={iconType} />
      ),
  };
};
