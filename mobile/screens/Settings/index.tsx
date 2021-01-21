import React from 'react';
import { Platform, View, Text, SafeAreaView, StatusBar, Share, Linking, Clipboard, StyleSheet } from 'react-native';
import { Icon, Button } from 'native-base';
import { Colors } from '../../enums';
import * as SMS from 'expo-sms';
import * as WebBrowser from 'expo-web-browser';
import { showMessage } from 'react-native-flash-message';
import AsyncStorageDB from '../../db/AsyncStorageDB';
import { INavProps } from '../../store/interfaces';
import { scale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// terms and conditions link
const termsUrl = 'https://cryptostream-app.appducks.com/licenses';
// the invite link user share with their network. it could be different from ios to android devices
const _inviteLink = `https://cryptostream-app.appducks.com?src=${Platform.OS === 'ios' ? 'ios-link' : 'android-link'}`;
// the component sub title to display
const subTitle = `Introduce a friend to Stoqey App`;
// the body of the email or sms or social network post when sharing with the invites with friends
const message = `Hi, 

This is a random gibberish text for email and text messages to sending an invite to your customer's friends. You must modify it to fit your needs

Claim your invite now: https://cryptostream-app.appducks.com?src=${
  Platform.OS === 'ios' ? 'ios-email-invite' : 'android-email-invite'
} 

Let me know if you need help!`;

const isAndroid = Platform.OS === 'android';

const SettingsScreen = (props: INavProps): React.ReactElement<any> | any => {
  const navigation = useNavigation();

  const db = AsyncStorageDB.Instance;

  const logoutUser = async () => {
    await db.deleteUserData();
    navigation.navigate('Login', {});
  };

  //global message using showMessage function imported from react-native-flash-message package
  const _showMessage = (msg: string): void =>
    showMessage({
      message: 'Oh Snap!',
      description: msg,
      type: 'danger',
      duration: 5000,
    });
  //terms & conditions
  const onTermsPress = async (): Promise<any> =>
    await WebBrowser.openBrowserAsync(termsUrl).catch((e): void => _showMessage(e.message));
  // share using any social sharing app installed on your device
  const onShare = async (): Promise<any> =>
    await Share.share({
      message,
    }).catch((e): void => _showMessage(e.message));
  // send sms. On iOS emulator, you might receive a message that the SMS is not available because isn't on the emulator
  const onSendSMS = async (): Promise<any> => {
    const isAvailable: boolean = await SMS.isAvailableAsync();
    if (isAvailable) {
      SMS.sendSMSAsync([], message).catch((e): void => _showMessage(e.message));
    } else {
      _showMessage('SMS is not available on your device');
    }
  };
  // send email On iOS emulator, you might receive a message that the Email is not available because isn't installed on the emulator
  const onSendEmail = async (): Promise<any> =>
    await Linking.openURL(`mailto:?body=${message}`).catch((): void =>
      _showMessage('Email is not available on your device'),
    );
  // copy to clipboard
  const onCopyInvite = (): void => {
    Clipboard.setString(_inviteLink);
    showMessage({
      message: 'link is copied to clipboard',
      type: 'success',
      duration: 5000,
      icon: 'success',
    });
  };

  // set statusbar styling when the component first mounted
  React.useEffect((): any => {
    const navListener = navigation.addListener('focus', (): void => {
      StatusBar.setBarStyle('dark-content');
      isAndroid && StatusBar.setBackgroundColor(Colors.trueBlue);
    });
    return (): void => navigation.removeListener('focus', null); // cleanup
  }, []);

  const settings = [
    {
      title: 'Profile',
      items: [
        {
          name: 'Add funds(PayPal + Credit/debit card)',
          screen: 'Funds',
        },
        {
          name: 'Withdraw',
          screen: 'Withdraw',
        },
        {
          name: 'Trade',
          screen: 'Invest',
        },
        {
          name: 'Portfolio',
          screen: 'Portfolio',
        },
      ],
    },
    {
      title: 'My account',
      items: [
        {
          name: 'Change password',
          screen: 'ForgotPassword',
        },
        {
          name: 'Logout',
          screen: 'ForgotPassword',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.trueBlue} barStyle="dark-content" />

      {/* Actions */}
      {settings.map(i => {
        const { title, items } = i;

        return (
          <View key={title} style={{ width: '100%', flexDirection: 'column' }}>
            <Text style={{ fontSize: 14, color: Colors.trueBlue }}>{title}</Text>

            {items.map(o => {
              const { name, screen } = o;
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate(screen, {})}
                  key={name}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingLeft: 10,
                    marginBottom: 5,
                  }}>
                  <Text style={{ fontSize: scale(16) }}>{name}</Text>
                  <Icon name="ios-arrow-forward" active style={styles.actionIcon} />
                </TouchableOpacity>
              );
            })}

            <View style={{ height: 2, backgroundColor: Colors.gray, marginBottom: 10 }}></View>
          </View>
        );
      })}

      <Button block transparent onPress={logoutUser}>
        <Text style={[styles.subTitle, styles.terms]}>Logout</Text>
      </Button>
    </SafeAreaView>
  );
};

SettingsScreen.navigationOptions = {
  header: null,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: moderateScale(30),
  },
  iconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: moderateScale(2),
    borderColor: Colors.trueBlue,
  },
  icon: { fontSize: scale(32), color: Colors.trueBlue },
  actionIcon: { fontSize: scale(20), color: Colors.black },
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    color: Colors.black,
    paddingVertical: moderateScale(10),
  },
  subTitle: {
    fontSize: scale(14),
    color: Colors.grayish,
    lineHeight: 20,
    textAlign: 'center',
  },
  terms: { fontSize: scale(11) },
  sms: { fontWeight: '600', color: Colors.white },
});

export default SettingsScreen;
