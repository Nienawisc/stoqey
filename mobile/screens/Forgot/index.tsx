import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, ImageBackground, Text, TextInput, TouchableOpacity } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import { Colors } from '../../enums';
import { PhoneVerification } from '../PhoneVerification';
import { FormComponent, IField } from '../../components/Form/FormComponent';

interface State {
  phone: string;
  token: string;
  fullname: string;
  email: string;
  password: string;
  passwordRepeat: string;
  step: number;
}

const ForgotPasswordScreen: React.FC<any> = () => {
  const [state, setState] = useState<State>({} as any);

  const { phone, token, fullname, email, password, passwordRepeat, step = 1 } = state;

  const handleChange = (fieldName: string) => {
    return val => {
      const newState = {
        ...state,
        [fieldName]: val,
      };
      setState(newState);
    };
  };

  const fields: IField[] = [
    {
      name: 'password',
      label: 'New Password   ',
    },
    {
      name: 'passwordRepeat',
      label: 'Repeat Password',
    },
  ];

  return (
    <View style={styles.root}>
      <View style={styles.background}>
        <View style={[styles.rect2, { backgroundColor: Colors.white }]}>
          <View style={styles.progressBarColumn}>
            {/* Progress bars */}

            <>
              <Text style={[styles.text, { paddingBottom: 60 }]}>Forgot passsword</Text>
              <PhoneVerification
                onVerified={({ phone: recievedPhone, verificationToken }) => {
                  setState({
                    ...state,
                    phone: recievedPhone,
                    token: verificationToken,
                    step: 2,
                  });
                }}
              />

              {token && <FormComponent fields={fields} onSubmit={() => {}} buttonText="Change password" />}
            </>
          </View>
          <View style={styles.buttonColumn}>
            <Text style={styles.text4}>Terms &amp; Conditions</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
  },
  background: {
    flex: 1,
  },

  text: {
    color: '#000',
    fontSize: 24,
    marginTop: 67,
    alignSelf: 'center',
  },

  text4: {
    color: '#000',
    alignSelf: 'center',
  },

  rect2: {
    flex: 1,
  },
  rect2_imageStyle: {},
  progressBar: {
    height: 40,
    flexDirection: 'row',
    marginLeft: 28,
    marginRight: 28,
  },
  icon2: {
    color: 'rgba(30,174,199,1)',
    fontSize: 40,
    width: 33,
    height: 40,
  },
  rect4: {
    width: 50,
    height: 7,
    backgroundColor: 'rgba(31,178,204,1)',
    borderRadius: 40,
    marginLeft: 6,
    marginTop: 16,
  },
  icon3: {
    color: '#1fb2cc',
    fontSize: 35,
    width: 40,
    height: 36,
    marginLeft: 4,
    marginTop: 4,
  },
  rect5: {
    width: 50,
    height: 7,
    backgroundColor: 'rgba(230, 230, 230,1)',
    opacity: 0.75,
    borderRadius: 40,
    marginTop: 16,
  },
  icon2Row: {
    height: 40,
    flexDirection: 'row',
  },
  icon2RowFiller: {
    flex: 1,
    flexDirection: 'row',
  },
  icon4: {
    color: 'rgba(255,255,255,1)',
    fontSize: 40,
    width: 34,
    height: 40,
    opacity: 0.75,
  },

  form: {
    height: 230,
  },
  name: {
    height: 59,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    flexDirection: 'row',
  },
  icon5: {
    color: 'rgba(255,255,255,1)',
    fontSize: 33,
    width: 33,
    height: 33,
    marginLeft: 15,
    alignSelf: 'center',
  },
  nameInput: {
    height: 30,
    color: 'rgba(255,255,255,1)',
    fontSize: 14,
    flex: 1,
    marginRight: 17,
    marginLeft: 13,
    marginTop: 14,
  },
  email: {
    height: 59,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    flexDirection: 'row',
    marginTop: 27,
  },
  icon6: {
    color: 'rgba(255,255,255,1)',
    fontSize: 33,
    marginLeft: 15,
    alignSelf: 'center',
  },
  emailInput: {
    height: 30,
    color: 'rgba(255,255,255,1)',
    flex: 1,
    marginRight: 17,
    marginLeft: 13,
    marginTop: 14,
  },
  nameColumn: {},
  nameColumnFiller: {
    flex: 1,
  },
  password: {
    height: 59,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    flexDirection: 'row',
  },
  icon7: {
    color: 'rgba(255,255,255,1)',
    fontSize: 33,
    marginLeft: 15,
    marginTop: 13,
  },
  passwordInput: {
    height: 30,
    color: 'rgba(255,255,255,1)',
    flex: 1,
    marginRight: 17,
    marginLeft: 13,
    marginTop: 14,
  },
  progressBarColumn: {
    marginTop: 53,
    marginLeft: 41,
    marginRight: 41,
  },
  progressBarColumnFiller: {
    flex: 1,
  },
  button: {
    height: 55,
    backgroundColor: 'rgba(247,247,247,0)',
    borderRadius: 5,
    borderColor: 'rgba(255,255,255,1)',
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 57,
  },
  text2: {
    width: 66,
    color: 'rgba(255,255,255,1)',
    alignSelf: 'center',
  },

  buttonColumn: {
    paddingTop: 10,
    marginBottom: 31,
    marginLeft: 41,
    marginRight: 41,
  },
});

export default ForgotPasswordScreen;
