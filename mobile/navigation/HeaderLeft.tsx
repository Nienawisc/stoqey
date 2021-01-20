import React, { memo } from 'react';
import { View } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale, moderateScale } from 'react-native-size-matters';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';

import { IS_ANDROID } from '../enums';
import Logo from '../components/Logo';

const HeaderLeft: React.FC<any> = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const canGoBack = navigation.dangerouslyGetState().index;
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      {canGoBack ? (
        <HeaderBackButton
          labelVisible={false}
          backImage={props => (
            <Icon
              name="keyboard-backspace"
              type="MaterialIcons"
              style={{
                color: colors.primary,
                marginHorizontal: scale(10),
              }}
              size={moderateScale(24)}
            />
          )}
          onPress={goBack}
          tintColor={colors.primary}
        />
      ) : (
        <Logo />
      )}
    </View>
  );
};

export default memo(HeaderLeft);
