import _ from 'lodash';
import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Container } from 'native-base';
import { InteractionManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApolloClient } from '@apollo/react-hooks';

import { INavProps } from '../../store/interfaces';
import { LoadingSpinner } from '../../components';
import { getTransactionsPaginationApi } from './transaction.api';
import { setToDarkStatusBar } from '../../utils/theme';
import { TransactionType } from '../../graphql/transactions';
import AsyncStorageDB from '../../db/AsyncStorageDB';

const TransactionsList = React.lazy((): any => import('../../components/Stoqey/TransactionList'));

interface Props {
  route?: {
    params: {
      filter: string; // type of transactions
    };
  };

  filter?: string; // type of transactions
}

const TransactionScreen: React.FC<INavProps> = (props: Props) => {
  // UserId
  const db = AsyncStorageDB.Instance;

  const filter = _.get(props, 'route.params.filter', props && props.filter);

  const navigation = useNavigation();
  const client = useApolloClient();

  const limit = 30;
  const [page, setPage] = React.useState<number>(0); // default is 1
  const [assets, setAssets] = React.useState<TransactionType[]>([]);

  const [isAssetLoading, setLoading] = React.useState<boolean>(true);

  const handleTransactions = async (transactions: TransactionType[]) => {
    setLoading(false);
    setAssets(_.concat(assets, transactions));
  };
  //navigate to coin details.
  // const navigateToDetail = (coin: ICoin): boolean => props.navigation.navigate('Coin', { coin });
  //fetch pagination
  const handleLoadMore = (): void => {
    setPage(page + 1);
  };

  useEffect(() => {
    // Api here
    InteractionManager.runAfterInteractions(async () => {
      const user = await db.getUserAuthObject();

      if (!isEmpty(user)) {
        const owner = user.id;

        await getTransactionsPaginationApi({
          args: { owner, limit, page, filter },
          client,
          done: async (transactions: TransactionType[]) => handleTransactions(transactions),
          err: async () => handleTransactions([]),
        });
      }
    });

    const sbListener = navigation.addListener('focus', (): void => setToDarkStatusBar());
    return (): void => navigation.removeListener('focus', sbListener); // cleanup
  }, [page]);

  return (
    <Container>
      {!isAssetLoading && assets.length > 0 && (
        <React.Suspense fallback={<LoadingSpinner />}>
          <TransactionsList withAction={false} items={assets} onPress={() => {}} handleLoadMore={handleLoadMore} />
        </React.Suspense>
      )}
      {isAssetLoading && <LoadingSpinner />}
    </Container>
  );
};

export default TransactionScreen;
