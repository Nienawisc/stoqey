import _, { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { Container } from 'native-base';
import moment from 'moment';

import { INavProps, ITrade } from '../../store/interfaces';
import { LoadingSpinner } from '../../components';
import { InteractionManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getTradesPaginationApi } from './trades.api';
import { useApolloClient } from '@apollo/react-hooks';
import { TradeType } from '../../graphql/trade';
import { setToDarkStatusBar } from '../../utils/theme';

const LazyTradeList = React.lazy((): any => import('../../components/Stoqey/TradesList'));

interface Props {
  route?: {
    params: {
      paginate: boolean;
    };
  };
  paginate?: boolean;
}

const TradesScreen: React.FC<INavProps> = ({ route, paginate: shouldPaginateProps = true }: Props) => {
  const navigation = useNavigation();
  const client = useApolloClient();

  // whether it should paginate or note
  const paginate: boolean = _.get(route, 'params.paginate', shouldPaginateProps);

  const limit = 30;
  const [page, setPage] = React.useState<number>(0); // default is 1
  const [assets, setAssets] = React.useState<ITrade[]>([]);

  const [isAssetLoading, setLoading] = React.useState<boolean>(true);

  const handleTrades = async (trades: TradeType[]) => {
    setLoading(false);
    if (!isEmpty(trades)) {
      const newAssets: ITrade[] = trades.map((i: TradeType) => {
        const coin: ITrade = {
          id: i.id,
          symbol: i.symbol,
          time: moment(new Date(i.createdAt)).fromNow(),
          price: '0',
          change: 1,
          changePct: 3,
          icon: `https://storage.googleapis.com/iex/api/logos/${i.symbol}.png`,
        };
        return coin;
      });
      setAssets(_.concat(assets, newAssets));
    }
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
      getTradesPaginationApi({
        args: { limit, page },
        client,
        done: async (trades: TradeType[]) => handleTrades(trades),
        err: async () => handleTrades([]),
      });

      // setLoading(false);
    });

    const sbListener = navigation.addListener('focus', (): void => setToDarkStatusBar());
    return (): void => navigation.removeListener('focus', sbListener); // cleanup
  }, [page]);

  return (
    <Container>
      {!isAssetLoading && assets.length ? (
        <React.Suspense fallback={<LoadingSpinner />}>
          <LazyTradeList
            withAction={false}
            items={assets}
            onPress={() => {}}
            handleLoadMore={paginate ? handleLoadMore : () => {}}
          />
        </React.Suspense>
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
};

export default TradesScreen;
