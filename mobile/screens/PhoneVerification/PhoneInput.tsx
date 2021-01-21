import React, { useState, useRef } from 'react';
import { View, Text } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale, scale } from 'react-native-size-matters';

import { Colors, Screen } from '../../enums';
import { log } from '../../config';
import styles from './phone.styles';

interface Props {
  setPhone: (phone: string) => void;
  setSentCode: (sent: boolean) => void;
  sendCode: () => void;
}

const PhoneInputComponent = ({ setPhone, setSentCode, sendCode }: Props) => {
  const [value, setValue] = useState('');
  const [valid, setValid] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);

  return (
    <>
      <View style={styles.container}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="CA"
          layout="first"
          onChangeText={text => {
            setValue(text);
            const checkValid = phoneInput.current?.isValidNumber(text);
            log.info('is valid? ' + checkValid);
            setValid(checkValid ? checkValid : false);
          }}
          onChangeFormattedText={text => {
            setPhone(text);
            log.info(`formartedText: ${text}`);
          }}
          countryPickerProps={{ withAlphaFilter: true }}
          disabled={disabled}
          withDarkTheme
          withShadow
          autoFocus
        />
      </View>
      <View
        style={{
          // padding: 10,
          paddingTop: 20,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            zIndex: -1,
            backgroundColor: valid ? Colors.green : Colors.grayish,
            // width: Screen.width - 120,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            height: moderateScale(45),
          }}
          onPress={sendCode}>
          <Text style={[styles.title, { fontSize: scale(14), fontWeight: '600' }]}>Send code</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PhoneInputComponent;
