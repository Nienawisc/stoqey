import { ApolloClient } from '@apollo/react-hooks';
import { log } from '../../config';
import { LoginResponseType, REGISTER_MUTATION } from '../../graphql/user';

export interface SignupCreds {
  firebaseToken: string;
  phone: string;
  fullname: string;
  email: string;
  password: string;
  // passwordRepeat: string;
}

export const signupApi = async ({
  creds,
  client,
  errorFunction,
  successFunction,
}: {
  creds: SignupCreds;
  client: ApolloClient<any>;
  errorFunction?: (error: Error) => Promise<any>;
  successFunction?: (data: LoginResponseType) => Promise<any>;
}) => {
  log.info('signupApi', JSON.stringify(creds));

  try {
    const { data: dataResponse }: any = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: { user: creds },
    });

    if (!dataResponse) {
      throw new Error('error getting signup data');
    }

    const { data }: { data?: LoginResponseType } = dataResponse;

    log.info('signupApi response', JSON.stringify(data));

    if (data.success) {
      //   Successful
      await successFunction(data);
      return log.info('Signup successful', JSON.stringify(data));
    }

    throw new Error('error signing up, please try again later');
  } catch (error) {
    log.error('Error signing up in', error);
    await errorFunction(error);
  }
};
