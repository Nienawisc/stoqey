import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Form, Item, Input, Picker, Icon, Label, Textarea } from 'native-base';
import { PaymentMethodType } from '@stoqey/client-graphql';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';

import { getPaymentMethodsApi, createPaymentMethodsApi } from './paymentmethods.api';
import ButtonComponent from '../../components/Button';
import { Colors } from '../../enums';
import { useApolloClient } from '@apollo/react-hooks';
import { showToast } from '../../components/Toast';
import PaymentMethodList from './paymentmethod.list';

interface AddPaymentState {
  name: string;
  paymentMethod: string;
  details: string;
}

export const WithDrawScreen = () => {
  // Get all payment methods
  // Add payment method
  // name, type, details

  const client = useApolloClient();
  // const user = useUserInfo();
  const [showModal, setShowModal] = useState<boolean>(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);

  const [addPaymentMethod, setAddPaymentMethod] = useState<AddPaymentState>({
    name: '',
    paymentMethod: 'etransfer',
    details: '',
  });

  const resetForm = () => {
    setAddPaymentMethod({
      name: '',
      paymentMethod: 'etransfer',
      details: '',
    });
  };

  const hideShow = () => {
    setShowModal(!showModal);
  };

  const { name, paymentMethod, details } = addPaymentMethod;

  const handleChangeAddPayment = (fieldName: string) => {
    return (val: any) => {
      setAddPaymentMethod({
        ...addPaymentMethod,
        [fieldName]: val,
      });
    };
  };

  useEffect(() => {
    getPaymentMethodsApi({
      client,
      args: {
        page: 0,
        limit: 100,
        owner: '', // to be fetched from api
      },
      // error: async (error: Error) => { },
      success: async (pm: PaymentMethodType[]) => {
        setPaymentMethods(pm);
      },
    });
  }, [showModal]);

  const createPaymentMethod = () =>
    createPaymentMethodsApi({
      args: {
        type: paymentMethod,
        name,
        info: details,
        owner: '', // to be fetched from api
      },
      client,
      success: async () => {
        showToast('Successfully created payment method', true);
        resetForm();
        hideShow();
      },
      error: async (error: Error) => {
        showToast(error && error.message, false);
        hideShow();
      },
    });

  return (
    <View style={styles.root}>
      <PaymentMethodList items={paymentMethods} />
      <ButtonComponent text={'Add payment method'} onPress={() => setShowModal(!showModal)} />
      <Modal isVisible={showModal}>
        <View style={styles.modalView}>
          <Text style={styles.h3}> Add payment method </Text>
          <Form>
            <Item fixedLabel>
              <Label>Name</Label>
              <Input placeholder="e.g my e-transfer" />
            </Item>

            <Item fixedLabel>
              <Label>Type</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Payment method type"
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor="#007aff"
                selectedValue={paymentMethod}
                onValueChange={handleChangeAddPayment('paymentMethod')}>
                <Picker.Item label="E-transfer" value="etransfer" />
                <Picker.Item label="PayPal" value="paypal" />
                <Picker.Item label="Bank account" value="bank" />
              </Picker>
            </Item>

            <Item fixedLabel>
              <Label> Details</Label>
              <Input onChangeText={handleChangeAddPayment('details')} placeholder="e.g email/bank account info" />
            </Item>

            <ButtonComponent text="Save payment method" onPress={() => createPaymentMethod()} />
            <ButtonComponent text="Cancel" onPress={() => hideShow()} style={{ backgroundColor: Colors.darkGrayish }} />
          </Form>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  h3: {
    fontSize: scale(20),
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  modalView: {
    backgroundColor: 'white',
    paddingVertical: 40,
  },
});

export default WithDrawScreen;
