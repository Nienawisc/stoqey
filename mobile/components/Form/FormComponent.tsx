import React, { Component, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Form, } from 'native-base';
import {  scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../enums';
import TextInput from '../../components/TextHorder/TextInput';
import PatButton from '../../components/patButton';

{/* <Ionicons name="person-outline" size={24} color="black" /> */ }
{/* <MaterialCommunityIcons name="lock" size={24} color="black" /> */ }
{/* <MaterialIcons name="person" size={24} color="black" /> */ }
{/* <MaterialIcons name="lock" size={24} color="black" /> */ }
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
  const { fields = [], buttonText = 'Submit', onSubmit, } = props;
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
          const inputIcon = label === 'Phone/email' ? 'person' : 'lock';
          return (
            <View key={i.name} {...labelProps} style={{ paddingBottom: 60 }}>
              {/* <Label>{label}</Label> */}
              {/* <Input onChangeText={handleChange(i.name)} {...inputProps} /> */}
              <TextInput
                onChangeText={handleChange(i.name)} {...inputProps}
                icon={inputIcon}
                placeholder={label}
                autoCapitalize='none'
                autoCompleteType='email'
                keyboardType='email-address'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
              />
              <View style={{
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
              }} />
            </View>
          );
        })}
      </Form>

      <View style={styles.buttonContainer}>
        <PatButton onClick={() => onSubmit(state)} buttomText={buttonText} style={styles.buttonColor}  />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    flex: 1, 
  },
  title: {
    color: Colors.white,
    fontSize: scale(18),
    paddingVertical: verticalScale(10),
    fontWeight: '600',
  },
  buttonColor: {
    backgroundColor: '#1902F7'
  },
  buttonContent: {
  fontSize: 15
  }
});
