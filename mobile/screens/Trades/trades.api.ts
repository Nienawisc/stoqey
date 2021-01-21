import { ApolloClient } from '@apollo/react-hooks';
import isEmpty from 'lodash/isEmpty';
import { log } from '../../config';
import { GET_TRADES_PAGINATION, TradeType } from '../../graphql/trade';

export const getTradesPaginationApi = async ({
  args,
  client,
  err,
  done,
}: {
  args: { limit: number; page: number };
  client: ApolloClient<any>;
  err?: (error: Error) => Promise<any>;
  done?: (data: any[]) => Promise<any>;
}) => {
  log.info('marketDataApi', JSON.stringify(args));

  try {
    const { data: dataResponse }: any = await client.query({
      query: GET_TRADES_PAGINATION,
      variables: args,
    });

    if (!dataResponse) {
      throw new Error('error getting trades data');
    }

    const { data }: { data?: TradeType[] } = dataResponse;

    log.info(`data response ${data && data.length}`);

    if (!isEmpty(data)) {
      //   Successful
      await done(data);
      return log.info(`trades data is successful ${data && data.length}`);
    }
    throw new Error('error getting trades data, please try again later');
  } catch (error) {
    log.error('Error getting trades data', error);
    await err(error);
  }
};
