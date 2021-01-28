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
import PatButton from '../../components/patButton';

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
          <View style={{
            alignItems: 'flex-end',
            marginRight: 30,
            top: '8%'
          }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Forgot')}>
              <Text style={{ fontSize: 15, color: 'grey' }}>Trouble logging in?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.endWrapperFiller}>
            <Text style={styles.text3}>Welcome Back!</Text>
            <Text style={{ color: 'grey', fontSize: 15, }}>Enter your credentials to continue</Text>
          </View>
          <View style={styles.logoColumn}>
            <View style={styles.form}>
              <FormComponent fields={fields} onSubmit={(data: any) => login(data)} buttonText={'Login'} />
            </View>
          </View>
          {/* <View style={styles.logoColumnFiller}></View> */}
          <View style={styles.footerTexts}>
          <PatButton onClick={() => props.navigation.navigate('SignUp')} buttomText={`OPS...I DON'T HAVE AN ACCOUNT YET `} style={styles.dontHaveAccountButton} textStyle={styles.textStyle}/>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
