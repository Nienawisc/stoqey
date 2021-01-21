import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { INavProps, IInvestInfo, TransactRouteProp } from '../store/interfaces';
import { Invest } from '../components';
import { transactAction } from '../store/actions';
import { Colors, Transact, IS_ANDROID } from '../enums';
import { Store } from '../store';

import { Container } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

const TransactScreen: React.FC<INavProps> = props => {
  const navigation = useNavigation();
  // get the state data using react hooks (useContext)
  const {
    state: { coins, wallets },
    dispatch,
  } = useContext(Store);

  const route = useRoute<TransactRouteProp>();
  const singleWallet = route.params ? route.params.wallet : null;
  const backTo = route.params ? route.params.backTo : null;

  // handle sell button press ==> called from the modal
  const onSellBtnPress = (data: IInvestInfo): void => {
    transactAction(data, Transact.SELL, wallets, dispatch);
  };
  // handle buy button press ==> called from the modal
  const onBuyBtnPress = (data: IInvestInfo): void => {
    transactAction(data, Transact.BUY, wallets, dispatch);
  };
  // goBack to the first screen in the stack
  const navigateToHome = () => {
    if (singleWallet) {
      return navigation.goBack(); // going back to the coin we originally navigate from
    } else {
      if (backTo) {
        return navigation.navigate(backTo);
      }
      return navigation.navigate('Accounts');
    }
  };

  // make sure status bar always have a light color
  React.useEffect((): any => {
    const txListener = navigation.addListener('focus', (): void => {
      StatusBar && StatusBar.setBarStyle('light-content');
      IS_ANDROID && StatusBar && StatusBar.setBackgroundColor(Colors.trueBlue);
    });
    return (): void => navigation.removeListener('focus', null); // cleanup
  }, []);

  return (
    <Container>
      <Invest
        wallets={singleWallet ? singleWallet : wallets}
        onClose={navigateToHome}
        onBuy={onBuyBtnPress}
        onSell={onSellBtnPress}
      />
    </Container>
  );
};

export default TransactScreen;
