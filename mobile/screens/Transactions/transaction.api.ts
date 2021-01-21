import { ApolloClient } from '@apollo/react-hooks';
import isEmpty from 'lodash/isEmpty';
import { log } from '../../config';
import { GET_MY_TRANSACTIONS, TransactionType } from '../../graphql/transactions';

export const getTransactionsPaginationApi = async ({
  args,
  client,
  err,
  done,
}: {
  args: { owner: string; limit: number; page: number };
  client: ApolloClient<any>;
  err?: (error: Error) => Promise<any>;
  done?: (data: any[]) => Promise<any>;
}) => {
  log.info('transactions are', JSON.stringify(args));

  try {
    const { data: dataResponse }: any = await client.query({
      query: GET_MY_TRANSACTIONS,
      variables: args,
    });

    if (!dataResponse) {
      throw new Error('error getting transactions data');
    }

    const { data }: { data?: TransactionType[] } = dataResponse;

    log.info(`data response transactions ${data && data.length}`);

    if (!isEmpty(data)) {
      //   Successful
      await done(data);
      return log.info(`transactions data is successful ${data && data.length}`);
    }
    throw new Error('error getting transactions data, please try again later');
  } catch (error) {
    log.error('Error getting transactions data', error);
    await err(error);
  }
};
