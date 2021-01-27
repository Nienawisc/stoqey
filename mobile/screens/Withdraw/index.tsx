import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Form, Item, Input, Picker, Icon, Label, Textarea } from 'native-base';
import { PaymentMethodType } from '@stoqey/client-graphql';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useApolloClient } from '@apollo/react-hooks';

import { getPaymentMethodsApi, createPaymentMethodsApi } from './paymentmethods.api';
import ButtonComponent from '../../components/Button';
import { Colors } from '../../enums';
import { showToast } from '../../components/Toast';
import PaymentMethodList from './paymentmethod.list';
import TransactionScreen from '../Transactions/Transactions';
import { isEmpty } from 'lodash';
import { getUserStatic, useUserInfo } from '../../hooks/useUserInfo';
import { log } from '../../config';

const { width, height } = Dimensions.get('window');
const initialLayout = { width };
interface AddPaymentState {
  name: string;
  paymentMethod: string;
  details: string;
}

export const WithDrawScreen = ({ navigation }) => {
  const client = useApolloClient();
  const user = getUserStatic();

  log.info(`static user is ` + JSON.stringify(user))

  // for withdrawing
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawForm, setWithdrawForm] = useState<{ methodId: string; amount: number }>({ methodId: '', amount: 0 });
  const handleWithdrawForm = (fieldName: string) => {
    return (val: any) => {
      setWithdrawForm({
        ...withdrawForm,
        [fieldName]: val,
      });
    };
  };
  const hideWithDrawModal = () => {
    setShowWithdrawModal(!showWithdrawModal);
  };

  // for adding payment modal
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

  const fetchPaymentMethods = () =>
    getPaymentMethodsApi({
      client,
      args: {
        page: 0,
        limit: 100,
        owner: '', // to be fetched from api
      },
      error: async (error: Error) => { 
        setPaymentMethods([]);
      },
      success: async (pm: PaymentMethodType[]) => {
        setPaymentMethods(pm);
      },
    });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

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

        setTimeout(() => {
          fetchPaymentMethods();
          resetForm();
          hideShow();
        }, 1500);
      },
      error: async (error: Error) => {
        showToast(error && error.message, false);
        hideShow();
      },
    });

  /**
   * Payment methods screen
   */
  const PaymentMethodsScreen = () => {
    return (
      <>
        <PaymentMethodList items={paymentMethods} />
        <ButtonComponent text={'Add payment method'} onPress={() => setShowModal(!showModal)} />

        {!isEmpty(paymentMethods) && (
          <ButtonComponent
            text={'Withdraw money'}
            onPress={() => setShowWithdrawModal(!showWithdrawModal)}
            style={{ backgroundColor: Colors.trueYellow }}
          />
        )}
      </>
    );
  };

  const [indexTab, setIndexTab] = React.useState(0);
  const [routes] = React.useState([
    { key: 'methods', title: 'Payment methods' },
    { key: 'history', title: 'Withdraw History' },
  ]);

  const renderScene = SceneMap({
    methods: () => (
      <>
        <Text> Some text {user && user.balance}</Text>
        <PaymentMethodsScreen />
      </>
    ),
    history: () => (
      <>
        <TransactionScreen navigation={navigation} filter="withdraw" />
      </>
    ),
  });

  // if (isEmpty(user)) {
  //   return null;
  // }

  log.info(`User account is ${user && user.balance}`);

  return (
    <View style={styles.root}>
      <TabView
        navigationState={{ index: indexTab, routes }}
        renderScene={renderScene}
        onIndexChange={setIndexTab}
        initialLayout={initialLayout}
      // renderTabBar={props => <View />}
      />

      {/* BEGIN Add payment method form */}
      <Modal isVisible={showModal}>
        <View style={styles.modalView}>
          <Text style={styles.h3}> Add payment method </Text>
          <Form>
            <Item fixedLabel>
              <Label>Name</Label>
              <Input placeholder="e.g my e-transfer" onChangeText={handleChangeAddPayment('name')} />
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
      {/* END Add payment method form */}

      {/* BEGIN Withdraw money form */}
      <Modal isVisible={showWithdrawModal}>
        <View style={styles.modalView}>
          <Text style={styles.h3}> Withdraw Money </Text>
          <Form>
            <Item fixedLabel>
              <Label>Amount</Label>
              <Input
                type="numeric"
                value={`${withdrawForm.amount}`}
                keyboardType="numeric"
                placeholder="e.g my e-transfer"
                onChangeText={handleWithdrawForm('amount')}
              />
            </Item>

            <Item fixedLabel>
              <Label>Payment Method</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Payment method type"
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor="#007aff"
                selectedValue={withdrawForm.methodId}
                onValueChange={handleWithdrawForm('methodId')}>
                {paymentMethods.map(i => {
                  return <Picker.Item key={i.id} label={i.name} value={i.id} />;
                })}
              </Picker>
            </Item>

            <ButtonComponent text="Submit" onPress={() => { }} />
            <ButtonComponent
              text="Cancel"
              onPress={() => hideWithDrawModal()}
              style={{ backgroundColor: Colors.darkGrayish }}
            />
          </Form>
        </View>
      </Modal>
      {/* END Withdraw money form */}
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
