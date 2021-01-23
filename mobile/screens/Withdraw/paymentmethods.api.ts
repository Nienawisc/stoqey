import { ApolloClient } from '@apollo/react-hooks';
import { PaymentMethodType, GET_PAYMENT_METHODS, CREATE_PAYMENTMETHOD_MUTATION, ResType } from '@stoqey/client-graphql';
import AsyncStorageDB from '../../db/AsyncStorageDB';
import { log } from '../../config';

interface GetPaymentMethodsApiArgs {
  page: number;
  limit: number;
  owner: string;
}

const db = AsyncStorageDB.Instance;

export const getPaymentMethodsApi = async ({
  args,
  client,
  error,
  success,
}: {
  args: GetPaymentMethodsApiArgs;
  client: ApolloClient<any>;
  error?: (error: Error) => Promise<any>;
  success?: (data: PaymentMethodType[]) => Promise<any>;
}) => {
  try {
    const user = await db.getUserAuthObject();
    const owner = user.id;
    args.owner = owner;
  
    log.info('getPaymentMethodsApi', JSON.stringify(args));

    const { data: dataResponse }: any = await client.query({
      query: GET_PAYMENT_METHODS,
      variables: args,
      fetchPolicy: 'network-only',
    });

    if (!dataResponse) {
      throw new Error('error getting login data');
    }

    const { data: paymentMethods = [] }: { data?: PaymentMethodType[] } = dataResponse;

    log.info('getPaymentMethodsApi response', paymentMethods && paymentMethods.length);

    return await success(paymentMethods);
  } catch (err) {
    log.error('Error getPaymentMethodsApi in', err);
    await error(err);
  }
};

interface CreatePaymentMethodsApiArgs {
  name: string;
  owner: string;
  type: string;
  info: string;
}

export const createPaymentMethodsApi = async ({
  args,
  client,
  error,
  success,
}: {
  args: CreatePaymentMethodsApiArgs;
  client: ApolloClient<any>;
  error?: (error: Error) => Promise<any>;
  success?: (data: ResType) => Promise<any>;
}) => {
  try {
    const user = await db.getUserAuthObject();
    const owner = user.id;
    args.owner = owner;

    log.info('createPaymentMethodsApi', JSON.stringify(args));

    const { data: dataResponse }: any = await client.mutate({
      mutation: CREATE_PAYMENTMETHOD_MUTATION,
      variables: args,
    });

    if (!dataResponse) {
      throw new Error('error creating payment method type');
    }

    const { data }: { data?: ResType } = dataResponse;

    log.info('create payment method response', JSON.stringify(data));

    if (data.success) {
      //   Successful
      return await success(data);
    }

    throw new Error('error creating payment method, please try again later');
  } catch (err) {
    log.error('Error createPaymentMethodsApi', err);
    await error(err);
  }
};
