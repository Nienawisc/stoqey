import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { INavProps, IInvestInfo, TransactRouteProp } from '../../store/interfaces';
import Invest from './Invest';
import { transactAction } from '../../store/actions';
import { Colors, Transact, IS_ANDROID } from '../../enums';
import { Store } from '../../store';

import { Container } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

const InvestScreen: React.FC<INavProps> = () => {
  const navigation = useNavigation();
  // get the state data using react hooks (useContext)

  const route = useRoute<TransactRouteProp>();
  const singleWallet = route.params ? route.params.wallet : null;
  const backTo = route.params ? route.params.backTo : null;

  // handle sell button press ==> called from the modal
  const onSellBtnPress = (data: IInvestInfo): void => {
    // transactAction(data, Transact.SELL, wallets, dispatch);
  };
  // handle buy button press ==> called from the modal
  const onBuyBtnPress = (data: IInvestInfo): void => {
    // transactAction(data, Transact.BUY, wallets, dispatch);
  };
  // goBack to the first screen in the stack
  const navigateToHome = () => {
    navigation.goBack();
  };

  // make sure status bar always have a light color
  React.useEffect((): any => {
    const txListener = navigation.addListener('focus', (): void => {
      StatusBar && StatusBar.setBarStyle('light-content');
      IS_ANDROID && StatusBar && StatusBar.setBackgroundColor(Colors.darkGrayish);
    });
    return (): void => navigation.removeListener('focus', txListener); // cleanup
  }, []);

  return (
    <Container>
      <Invest onClose={navigateToHome} onBuy={onBuyBtnPress} onSell={onSellBtnPress} />
    </Container>
  );
};

export default InvestScreen;
