import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PaymentMethodType } from '@stoqey/client-graphql';
import { Colors } from '../../enums';
import { FONTS } from '../../utils';

interface Props {
  items: PaymentMethodType[];
}

export const PaymentMethodItem = (props: PaymentMethodType) => {
  const { type, name, info, id } = props || {};
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.icon}>
        <Text>some icon</Text>
      </View>
      <View>
        <Text style={FONTS.h3}>{name + ' ' + info}</Text>
        <Text style={FONTS.h4}>{type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const PaymentMethodList = ({ items = [] }: Props) => {
  return (
    <>
      {items.map(i => (
        <PaymentMethodItem key={i.id} {...i} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    width: '100%',
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
  },
  icon: {
    width: 50,
    height: 50,
    margin: 5,
  },
});

export default PaymentMethodList;
