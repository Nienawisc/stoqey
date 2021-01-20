import * as admin from 'firebase-admin';
import { log } from '../log'
import { serviceAccount as config } from '../config';
import chalk from 'chalk';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(config as any),
    databaseURL: `https://${config.project_id}.firebaseio.com`,
  });
}

const { project_id } = config;
const auth = admin.auth;
const projectId = project_id;
log(chalk.greenBright('**************************************ProjectID********************', projectId));
export { auth, projectId };