import { ApolloClient } from '@apollo/react-hooks';
import isEmpty from 'lodash/isEmpty';
import { log } from '../../config';
import { GET_MARKETDATA, MarketDataType } from '../../graphql/marketdata';

export const getMarketDataApi = async ({
  args,
  client,
  err,
  done,
}: {
  args: any;
  client: ApolloClient<any>;
  err?: (error: Error) => Promise<any>;
  done?: (data: any[]) => Promise<any>;
}) => {
  log.info('marketDataApi', JSON.stringify(args));

  try {
    const { data: dataResponse }: any = await client.query({
      query: GET_MARKETDATA,
      variables: args,
    });

    log.info('get marketdata api', dataResponse);

    if (!dataResponse) {
      throw new Error('error getting marketdata data');
    }

    const { data }: { data?: MarketDataType[] } = dataResponse;

    log.info(`marketdata response ${data && data.length}`);

    if (!isEmpty(data)) {
      //   Successful
      await done(data);
      return log.info(`marketdata successful ${data && data.length}`);
    }
    throw new Error('error getting marketdata, please try again later');
  } catch (error) {
    log.error('Error getting marketdata', error);
    await err(error);
  }
};