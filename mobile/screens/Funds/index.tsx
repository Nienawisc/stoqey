import React from 'react';
import { INavProps, IInvestInfo, TransactRouteProp } from '../../store/interfaces';
import Funds from '../../components/Funds';

import { Container, Toast } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { setToLightStatusBar } from '../../utils/theme';
import { log } from '../../config';
import EnterAmount from './EnterAmount';
import { showToast } from '../../components/Toast';

const FundsScreen: React.FC<INavProps> = () => {
  const navigation = useNavigation();
  // get the state data using react hooks (useContext)

  const route = useRoute<TransactRouteProp>();
  const singleWallet = route.params ? route.params.wallet : null;
  const backTo = route.params ? route.params.backTo : null;

  // handle sell button press ==> called from the modal
  const onSellBtnPress = (): void => {
    // transactAction(data, Transact.SELL, wallets, dispatch);
  };

  // handle buy button press ==> called from the modal
  const onBuyBtnPress = (): void => {
    // transactAction(data, Transact.BUY, wallets, dispatch);
  };
  // goBack to the first screen in the stack
  const navigateToHome = () => {
    if (backTo) {
      return navigation.navigate(backTo);
    }
    return navigation.navigate('Home');
  };

  const onContinue = (amount: number) => {
    if (amount < 5) {
      return showToast('please enter amount greater than $5', false);
    }
    log.info(`onContinue amount=${amount}`);
    return navigation.navigate('PayPal', { amount });
  };

  // make sure status bar always have a light color
  React.useEffect((): any => {
    const txListener = navigation.addListener('focus', (): void => setToLightStatusBar());
    return (): void => navigation.removeListener('focus', txListener); // cleanup
  }, []);

  return (
    <Container>
      <EnterAmount onClose={navigateToHome} onContinue={onContinue} />
    </Container>
  );
};

export default FundsScreen;
