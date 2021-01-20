import React, { Component, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors, Screen } from '../../enums';

export interface IField {
  name: string;
  label: string;
  inputProps?: any;
  labelProps?: any;
}

interface Props {
  fields: IField[];
  buttonText: string;
  onSubmit: (data: any) => Promise<any>;
}

export const FormComponent = (props: Props) => {
  const { fields = [], buttonText = 'Submit', onSubmit } = props;

  const [state, setState] = useState<any>(null);

  const handleChange = (fieldName: string) => {
    return val => {
      const newState = {
        ...state,
        [fieldName]: val,
      };
      setState(newState);
    };
  };

  return (
    <>
      <Form>
        {fields.map(i => {
          const { label, inputProps, labelProps } = i;
          return (
            <Item key={i.name} {...labelProps}>
              <Label>{label}</Label>
              <Input onChangeText={handleChange(i.name)} {...inputProps} />
            </Item>
          );
        })}
      </Form>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            zIndex: -1,
            backgroundColor: Colors.green,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            height: moderateScale(50),
          }}
          onPress={() => onSubmit(state)}>
          <Text style={[styles.title, { fontSize: scale(16), fontWeight: '600' }]}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  title: {
    color: Colors.white,
    fontSize: scale(18),
    paddingVertical: verticalScale(10),
    fontWeight: '600',
  },
});
