import Constants from 'expo-constants';
export type ExpoEnvType = 'DEVELOPMENT' | 'PRODUCTION' | 'STAGING';
export interface AppEnv {
  env: ExpoEnvType;
  host: string;
  api: string;
  ws: string;
}

export function getEnvironment(): AppEnv {
  let releaseChannel = Constants.manifest.releaseChannel;

  // default in dev
  let env: ExpoEnvType = 'DEVELOPMENT';
  let host = '192.168.2.26:3099';
  let api = `http://${host}/graphql`;
  let ws = `ws://${host}/graphql`;

  // matches prod-v1, prod-v2, prod-v3
  if (releaseChannel.indexOf('prod') !== -1) {
    env = 'PRODUCTION';
    host = 'api.stoqey.com';
    api = `https://${host}/graphql`;
    ws = `wss://${host}/graphql`;
  }

  // matches staging-v1, staging-v2
  if (releaseChannel.indexOf('staging') !== -1) {
    env = 'STAGING';
    host = 'staging.stoqey.com';
    api = `https://${host}/graphql`;
    ws = `wss://${host}/graphql`;
  }

  return { env, host, api, ws }; // dev env settings
}
