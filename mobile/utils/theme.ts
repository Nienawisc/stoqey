import { StatusBar, Platform } from 'react-native';
import { Colors } from '../enums';

export const setToLightStatusBar = (): void => {
  StatusBar.setBarStyle('light-content');
  Platform.OS === 'android' && StatusBar.setBackgroundColor(Colors.white);
};

export const setToDarkStatusBar = (): void => {
  StatusBar.setBarStyle('dark-content');
  Platform.OS === 'android' && StatusBar.setBackgroundColor(Colors.white);
};
