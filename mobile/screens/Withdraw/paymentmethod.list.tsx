import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export const PaymentMethodList = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.icon}>
        <Text>some icon</Text>
      </View>
      <View>
        <Text>Payment method</Text>
        <Text>Payment type</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    width: '100%',
  },
  icon: {
      width: 50,
      height: 50,
      margin: 5,
  }
});

export default PaymentMethodList;
