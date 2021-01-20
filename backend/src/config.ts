import { isEmpty, get as _get } from 'lodash';
// Service account
export const serviceAccount = require('./keys/service.account.json');
export const nodeEnv = _get(process.env, 'NODE_ENV');
export const isDev = nodeEnv === 'development';

export const PORT: number = +_get(process.env, "PORT", 3099);

export const demoToken = 'stoqey.api.token.demo.hash';
export const graphqlPath = "/graphql";