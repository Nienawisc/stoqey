import { ApolloClient } from '@apollo/react-hooks';
import { PaymentMethodType, GET_PAYMENT_METHODS, CREATE_PAYMENTMETHOD_MUTATION } from '@stoqey/client-graphql';
import { log } from '../../config';

interface GetPaymentMethodsApiArgs {
  page: number;
  limit: number;
  owner: string;
}

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
  log.info('getPaymentMethodsApi', JSON.stringify(args));

  try {
    const { data: dataResponse }: any = await client.query({
      query: GET_PAYMENT_METHODS,
      variables: args,
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


export const createPaymentMethodsApi = async ({
  args,
  client,
  error,
  success,
}: {
  args: GetPaymentMethodsApiArgs;
  client: ApolloClient<any>;
  error?: (error: Error) => Promise<any>;
  success?: (data: ResTy[]) => Promise<any>;
}) => {
  log.info('createPaymentMethodsApi', JSON.stringify(args));

  try {
    const { data: dataResponse }: any = await client.mutate({
      mutation: CREATE_PAYMENTMETHOD_MUTATION,
      variables: args,
    });

    if (!dataResponse) {
      throw new Error('error getting login data');
    }

    const { data: paymentMethods = [] }: { data?: PaymentMethodType[] } = dataResponse;

    log.info('createPaymentMethodsApi response', paymentMethods && paymentMethods.length);

    return await success(paymentMethods);
  } catch (err) {
    log.error('Error getPaymentMethodsApi in', err);
    await error(err);
  }
};