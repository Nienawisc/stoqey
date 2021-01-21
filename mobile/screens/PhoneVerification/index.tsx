import React, { useState } from 'react';
import { View } from 'react-native';
import { Toast } from 'native-base';
import * as FirebaseRecaptcha from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';

import { log } from '../../config';
import PhoneCode from './PhoneCode';
import PhoneInputComponent from './PhoneInput';
import FIREBASE_CONFIG from '../../keys/firebase.config';

try {
  if (FIREBASE_CONFIG.apiKey) {
    // @ts-ignore
    firebase.initializeApp(FIREBASE_CONFIG);
  }
} catch (err) {
  // ignore app already initialized error on snack
}

interface Props {
  onVerified: (data: { phone: string; verificationToken: string }) => void;
}

export const PhoneVerification = ({ onVerified }: Props) => {
  const [phone, setPhone] = useState<string>('');
  const [sentCode, setSentCode] = useState<boolean>(false);

  // Verification
  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState('');
  const [verified, setVerified] = React.useState<boolean>(false);

  const getFirebaseAccessToken = (): Promise<string> => {
    return new Promise(res =>
      firebase // @ts-ignore
        .auth()
        .currentUser.getIdToken(/* forceRefresh */ false)
        .then(idToken => res(idToken))
        .catch(() => res(null)),
    );
  };

  const signInWithCredential = async (credential: any): Promise<string> => {
    return new Promise(res => {
      firebase // @ts-ignore
        .auth()
        .signInWithCredential(credential)
        .then((authResult: any) => res(authResult))
        .catch(() => res(null));
    });
  };

  const sendVerificationCode = async () => {
    // @ts-ignore
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    try {
      setVerificationId('');
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phone,
        // @ts-ignore
        recaptchaVerifier.current,
      );
      setVerificationId(verificationId);
      setSentCode(true);

      Toast.show({
        position: 'top',
        text: 'Enter code from phone',
        buttonText: '📲📲📲',
      });

      log.info(` VerificationId = ${verificationId}`);
    } catch (err) {
      Toast.show({
        position: 'top',
        text: 'Error: ' + err && err.message,
        buttonText: '❌',
      });
    }
  };

  const verifyCode = async (verificationCode: string) => {
    try {
      log.info(`Verification code ---------- verificationCode=${verificationCode}`);

      // @ts-ignore
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);

      const authResult = await signInWithCredential(credential);
      if (!authResult) {
        // Error
        setVerificationId('');
        return Toast.show({
          position: 'top',
          text: 'Error verifying your code',
          buttonText: '❌',
        });
      }
      // Success
      log.info('Auth results---------- ', JSON.stringify(authResult));
      setVerificationId('');
      Toast.show({
        position: 'top',
        text: 'Successfully verified phone',
        buttonText: '✅',
      });

      const accessToken = await getFirebaseAccessToken();
      log.info(`AccessToken ${accessToken}`);

      if (accessToken) {
        // send verified
        await onVerified({ phone, verificationToken: accessToken });
        return setVerified(true);
      }

      throw new Error('failed to verify code, please try again');
    } catch (err) {
      log.error(`Error verifying the smsCode ${err && err.message}`);
      Toast.show({
        position: 'top',
        text: 'Error: ' + err && err.message,
        buttonText: '❌',
      });
    }
  };

  return (
    <>
      <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={FIREBASE_CONFIG} />
      {!verified && (
        <View>
          {!sentCode ? (
            <>
              <PhoneInputComponent
                setPhone={setPhone}
                setSentCode={setSentCode}
                sendCode={() => sendVerificationCode()}
              />
            </>
          ) : (
            <PhoneCode verifyCode={verifyCode} />
          )}
        </View>
      )}
    </>
  );
};
