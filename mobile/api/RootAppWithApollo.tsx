import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { split, from as fromLinks } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { RetryLink } from 'apollo-link-retry';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import contains from 'lodash/includes';
import { getEnvironment } from '../config';
import AsyncStorageDB from '../db/AsyncStorageDB';
import { getLastChar } from '../utils';
import { log } from '../config';
import { AppEvents, APPEVENTS } from '../events';

const appEvents = AppEvents.Instance;

// eslint-disable-next-line no-unused-vars
function getApolloClient(token?: string): ApolloClient<any> {
  const { ws: wsUrl, api: hostUrl } = getEnvironment();
  log.info('apollo url', hostUrl);

  // Create an http link:
  const httpLink = new HttpLink({
    uri: hostUrl,
  });

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: wsUrl,
    options: {
      reconnect: true,
    },
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const apolloLink = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    try {
      if (graphQLErrors && graphQLErrors.forEach) {
        // Not Authorised!
        graphQLErrors.map(({ message, locations, path, originalError }) => {
          log.error('originalError', { message, originalError, locations, path });
          // not authorized
          if (contains(message, 'Expired')) {
            // Refresh to token from here
            // authHelper
            //   .refreshToken()
            //   .then(accessToken => {
            //     log.info('Got new refresh token', getLastChar(accessToken));
            //     return AsyncStorageDB.Instance.updateUserAuth({
            //       accessToken,
            //     });
            //   })
            //   .then(updatedUser => {
            //     log.error('updatedUser refresh token', updatedUser);
            //   })
            //   .catch(error => {
            //     log.error('error updatedUser refresh token', error);
            //   });

            log.error('Error when refreshing TOKEN', message);
          }
          if (contains(message, 'Not Authorised')) {
            // Ask user to login again
            log.error('RootAppWithApollo.onError NOT AUTHORISED', message);
            appEvents.emit(APPEVENTS.LOGOUT, null); // emit logout
          }
        });
        log.error(`[graphQLErrors error]: `, graphQLErrors);
      }

      if (networkError) log.error(`[Network error]: `, networkError);
    } catch (error) {
      log.error('error with graphql', error);
    }
  });

  const authLink = setContext(async (_, { headers }) => {
    // console.log('<-----------> AuthContext <-----------> BEGIN ', getLastChar(token))
    const localToken = await AsyncStorageDB.Instance.getAuthToken();
    log.info('<-----------> AuthContext <-----------> END ', getLastChar(localToken));

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: localToken,
      },
    };
  });

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 5,
      retryIf: error => !!error,
    },
  });

  const link = fromLinks([authLink, errorLink, retryLink, apolloLink]);

  // Create the client as outlined in the setup guide
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    ssrMode: false,
  });

  return client;
}

export const RootAppWithApollo = (MyRootComponent: React.FunctionComponent) => {
  return function withApollo() {
    const [client, setClient] = React.useState(null);

    React.useEffect(() => {
      (async function() {
        const token = await AsyncStorageDB.Instance.getAuthToken();
        log.info('Got local token', getLastChar(token));
        const newClient = getApolloClient(token);
        setClient(newClient);
      })();
    }, []);

    if (!client) {
      return null;
    }
    return (
      <ApolloProvider client={client}>
        <MyRootComponent />
      </ApolloProvider>
    );
  };
};
