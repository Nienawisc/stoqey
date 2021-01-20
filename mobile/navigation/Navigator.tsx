import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
//local imports
import {
  HomeScreen,
  AssetsScreen,
  NewsScreen,
  AccountsScreen,
  CoinScreen,
  InviteScreen,
  Transact,
  Prices,
  LoginScreen,
  SignUpScreen,
  StoqeyScreen,
  PayPalScreen,
  TradeScreen,
  InvestScreen,
  WithdrawScreen,
  TransactionsScreen,
  ForgotPasswordScreen,
  SettingsScreen,
  FundsScreen,
  PortfolioScreen
} from '../screens';
import { screenWithoutHeader, bottomNavigationOptions, screenWithHeader } from './options';
import { Colors } from '../enums';
import { StyleSheet } from 'react-native';
// HomeStack represents 4 screens as stack navigator: Home, Coin, Asssets, Stories
/**
 * feeds/posts stack navigation
 */
const HomeStack = createStackNavigator();
const HomeStackScreens = () => (
  <HomeStack.Navigator initialRouteName="Home">
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={props =>
        screenWithHeader({
          ...props,
          headerStyle: styles.header,
          headerTintColor: '#000',
        })
      }
    />
    <HomeStack.Screen name="Coin" component={CoinScreen} options={props => screenWithoutHeader(props)} />
    <HomeStack.Screen name="Transact" component={Transact} options={props => screenWithoutHeader(props)} />
    <HomeStack.Screen name="Assets" component={AssetsScreen} options={props => screenWithoutHeader(props)} />
    <HomeStack.Screen name="Stories" component={NewsScreen} options={props => screenWithoutHeader(props)} />
  </HomeStack.Navigator>
);

// AccountsStack represents Accounts Screen
const AccountsStack = createStackNavigator();
const AccountsStackScreens = () => (
  <AccountsStack.Navigator initialRouteName="Accounts">
    <AccountsStack.Screen
      name="Accounts"
      component={AccountsScreen}
      options={props =>
        screenWithHeader(
          {
            ...props,
            headerStyle: styles.header,
            headerTintColor: '#fff',
          },
          'Portfolio',
        )
      }
    />
    <AccountsStack.Screen name="Coin" component={CoinScreen} options={props => screenWithoutHeader(props)} />
    <AccountsStack.Screen name="Transact" component={Transact} options={props => screenWithoutHeader(props)} />
  </AccountsStack.Navigator>
);

// transact represents transact operation Screen
const OpStack = createStackNavigator();
const OpStackScreens = () => (
  <OpStack.Navigator initialRouteName="Transact">
    <OpStack.Screen name="Transact" component={Transact} options={props => screenWithoutHeader(props)} />
  </OpStack.Navigator>
);
//prices Stack
const PricesStack = createStackNavigator();
const PricesStackScreens = () => (
  <PricesStack.Navigator initialRouteName="Prices">
    <PricesStack.Screen
      name="Prices"
      component={Prices}
      options={props =>
        screenWithHeader({
          ...props,
          headerStyle: styles.header,
          headerTintColor: '#fff',
        })
      }
    />
    <PricesStack.Screen name="Coin" component={CoinScreen} options={props => screenWithoutHeader(props)} />
    <PricesStack.Screen name="Transact" component={Transact} options={props => screenWithoutHeader(props)} />
  </PricesStack.Navigator>
);

//trades Stack
const TradesStack = createStackNavigator();
const TradesStackScreens = () => (
  <TradesStack.Navigator initialRouteName="Trades">
    <TradesStack.Screen
      name="Trades"
      component={TradeScreen}
      options={props =>
        screenWithHeader({
          ...props,
          headerStyle: styles.header,
          headerTintColor: '#fff',
        })
      }
    />
    <TradesStack.Screen name="Coin" component={CoinScreen} options={props => screenWithoutHeader(props)} />
    <TradesStack.Screen name="Transact" component={Transact} options={props => screenWithoutHeader(props)} />
  </TradesStack.Navigator>
);

// AccountsStack represents Accounts Screen
const TransactionStack = createStackNavigator();
const TransactionStackScreens = () => (
  <TransactionStack.Navigator initialRouteName="Transactions">
    <TransactionStack.Screen
      name="Transactions"
      component={TransactionsScreen}
      options={props =>
        screenWithHeader(
          {
            ...props,
            headerStyle: styles.header,
            headerTintColor: '#fff',
          },
          'Portfolio',
        )
      }
    />
  </TransactionStack.Navigator>
);

//Invite Stack
// transact represents transact operation Screen
const InviteStack = createStackNavigator();
const InviteStackScreens = () => (
  <InviteStack.Navigator initialRouteName="Invite">
    <InviteStack.Screen name="Invite" component={InviteScreen} options={props => screenWithoutHeader(props)} />
  </InviteStack.Navigator>
);
/**
 * tab navigation
 */
const Tabs = createMaterialBottomTabNavigator();

const TabsNavigator = () => (
  <Tabs.Navigator
    barStyle={{ backgroundColor: '#F8F8F8' }}
    activeColor={Colors.black}
    inactiveColor={Colors.gray}
    initialRouteName="Home">
    <Tabs.Screen
      name="Home"
      component={HomeStackScreens}
      options={props => bottomNavigationOptions('home', 'Feather', 'Home')}
    />
    <Tabs.Screen
      name="Accounts"
      component={TransactionStackScreens}
      options={props => bottomNavigationOptions('pie-chart', 'Feather', 'Portfolio')}
    />
    <Tabs.Screen
      name="Transact"
      component={OpStackScreens}
      options={props => bottomNavigationOptions('swap', 'AntDesign', ' ', true)}
    />
    <Tabs.Screen
      name="Trades"
      component={TradesStackScreens}
      options={props => bottomNavigationOptions('bar-chart-2', 'Feather', 'Trades')}
    />
    <Tabs.Screen
      name="Settings"
      component={SettingsScreen}
      options={props => bottomNavigationOptions('gift', 'Octicons', 'Settings')}
    />
  </Tabs.Navigator>
);

// Auth represents Auth Screen
const AuthStacks = createStackNavigator();
const AuthStackScreens = () => (
  <AuthStacks.Navigator initialRouteName="Portfolio">
    <AuthStacks.Screen
      name="PayPal"
      component={PayPalScreen}
      options={props =>
        screenWithHeader(
          {
            ...props,
            headerStyle: styles.header,
            headerTintColor: '#000',
          },
          'Pay with PayPal',
        )
      }
    />
    <AuthStacks.Screen name="Withdraw" component={WithdrawScreen} options={props => screenWithHeader(props)} />
    <AuthStacks.Screen name="StoqeyScreen" component={StoqeyScreen} options={props => screenWithoutHeader(props)} />
    <AuthStacks.Screen name="Invest" component={InvestScreen} options={props => screenWithoutHeader(props)} />
    <AuthStacks.Screen name="Portfolio" component={PortfolioScreen} options={props => screenWithHeader(props)} />
    <AuthStacks.Screen name="Login" component={LoginScreen} options={props => screenWithoutHeader(props)} />
    <AuthStacks.Screen name="Forgot" component={ForgotPasswordScreen} options={props => screenWithoutHeader(props)} />
    <AuthStacks.Screen name="SignUp" component={SignUpScreen} options={props => screenWithoutHeader(props)} />
    <AuthStacks.Screen name="Funds" component={FundsScreen} options={props => screenWithoutHeader(props)} />
    <AuthStacks.Screen name="Home" component={TabsNavigator} options={props => screenWithoutHeader(props)} />
  </AuthStacks.Navigator>
);

// render navigations
const Navigator: React.FC<React.ReactNode> = (props: any) => {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <AuthStackScreens />
    </NavigationContainer>
  );
  // return (
  //   <NavigationContainer>
  //     <TabsNavigator />
  //   </NavigationContainer>
  // );
};

export default Navigator;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    borderWidth: 0,
    elevation: 0,
    shadowColor: Colors.white,
  },
});
