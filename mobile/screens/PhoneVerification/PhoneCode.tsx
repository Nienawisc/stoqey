import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { isEmpty } from 'lodash';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

import { log } from '../../config';
import styles from './code.styles';
import { scale } from 'react-native-size-matters';

const CELL_COUNT = 6;

interface Props {
  verifyCode: (code: string) => void;
}

const PhoneCode = ({ verifyCode }: Props) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View style={styles.root}>
      <Text style={[styles.title, { fontSize: scale(16), fontWeight: '600' }]}>Enter code</Text>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={value => {
          log.info(`verification code is ${value}`);
          setValue(value);
          if (!isEmpty(value)) {
            const val = value.split('');

            if (val.length === 6) {
              return verifyCode(value);
            }
          }
        }}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PhoneCode;
