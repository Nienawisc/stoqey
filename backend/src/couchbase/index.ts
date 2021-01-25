import { Ottoman } from "ottoman";
import { start } from "ottoman";
import { log } from "../log";
import get from "lodash/get";
import chalk from "chalk";

const connectionString = get(
  process.env,
  "COUCHBASE_URL",
  "couchbase://localhost"
);
const bucketName = get(process.env, "COUCHBASE_BUCKET", "stq");
const username = get(process.env, "COUCHBASE_USERNAME", "admin");
const password = get(process.env, "COUCHBASE_PASSWORD", "123456");

const connectionOptions = {
  connectionString,
  bucketName,
  username,
  password,
};
export class CouchbaseService {
  private couchbaseClient: Ottoman;

  constructor() {}

  async connect(): Promise<Ottoman> {
    if (!this.couchbaseClient) {
      const ottoman = new Ottoman();
      this.couchbaseClient = await ottoman.connect(connectionOptions);
    }
    return this.couchbaseClient;
  }
}

export const startCouchbaseAndNext = (): Promise<boolean> => {
  const couchbase = new CouchbaseService();

  log(
    "Couchbase",
    chalk.yellow(
      "...starting",
      JSON.stringify({
        host: connectionString,
        bucket: bucketName,
        username,
        password,
      })
    )
  );
  return new Promise((res, rej) => {
    // @ts-ignore
    couchbase.connect()
      .then(() => start())
      .then(() => {
        // registerAllModels();
        // Register all models
        log(
          "Couchbase",
          chalk.greenBright(
            "started ✅✅✅",
            JSON.stringify({ host: connectionString, bucket: bucketName })
          )
        );
        res(true);
      })
      .catch((error) => rej(error));
  });
};


