import React, { useEffect } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { View, StatusBar, ImageBackground, Text, TextInput, TouchableOpacity } from 'react-native';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

import isEmpty from 'lodash/isEmpty';

// import { CommonActions } from '@react-navigation/native';
// import { AppRoute } from '../../config/AppRoute';

import { LoginResponseType } from '@stoqey/client-graphql';
import AsyncStorageDB from '../../db/AsyncStorageDB';
import styles from './styles';
import { loginApi } from './api';
import { log } from '../../config';
import { FormComponent, IField } from '../../components/Form/FormComponent';
import { showToast } from '../../components/Toast';

const Gradient_m6QXECq = require('../../assets/Gradient_m6QXECq.png');

interface PwUn {
  email: string;
  password: string;
}

const Login: React.FC<any> = props => {
  const client = useApolloClient();
  const db = AsyncStorageDB.Instance;
  const navigation = props.navigation;

  const fields: IField[] = [
    {
      name: 'email',
      label: 'Phone/email',
      labelProps: {
        stackedLabel: true,
      },
    },
    {
      name: 'password',
      label: 'Password',
      inputProps: {
        secureTextEntry: true,
      },
      labelProps: {
        stackedLabel: true,
      },
    },
  ];

  async function login(args: PwUn) {
    return await loginApi({
      client,
      creds: args,
      errorFunction: async (error: Error) => {
        showToast(error && error.message, false);
      },
      successFunction: async (data: LoginResponseType) => {
        // set async accessToken
        // set refreshToken
        // save userData too
        const { accessToken, refreshToken, user } = data;
        await db.updateUserAuth({
          accessToken,
          refreshToken,
          ...user,
        });
        showToast('Successfully logged in ', true);
        navigation.navigate('Home', user);
      },
    });
  }

  useEffect(() => {
    const getInitAuthData = async () => {
      const authData = await db.getUserAuthObject();
      if (!isEmpty(authData)) {
        log.info('Init login data', JSON.stringify(authData));
        // setState
        navigation.replace('Home', {});
      }
    };

    getInitAuthData();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.background}>
        <View style={styles.rect}>
          <View style={styles.logoColumn}>
            <View style={styles.logo}>
              <View style={styles.endWrapperFiller}></View>
              <View style={styles.text3Column}>
                <Text style={styles.text3}>Welcome</Text>
                <View style={styles.rect7}></View>
              </View>
            </View>

            <View style={styles.form}>
              <FormComponent fields={fields} onSubmit={(data: any) => login(data)} buttonText={'Login'} />
            </View>
          </View>
          {/* <View style={styles.logoColumnFiller}></View> */}
          <View style={styles.footerTexts}>
            <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')} style={styles.button2}>
              <View style={styles.createAccountFiller}></View>
              <Text style={styles.createAccount}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate('Forgot')} style={{ alignSelf: 'flex-start' }}>
              <View style={styles.button2Filler}></View>
              <Text style={styles.needHelp}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
