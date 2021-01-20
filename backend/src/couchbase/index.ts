import * as ottoman from "ottoman";
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

export const createConnection = (): any => {
  return ottoman.connect({
    connectionString,
    bucketName,
    username,
    password,
  });
};

export const startCouchbaseAndNext = (): Promise<boolean> => {
  createConnection();
  log(
    "Couchbase",
    chalk.yellow(
      "...starting",
      JSON.stringify({ host: connectionString, bucket: bucketName, username, password })
    )
  );
  return new Promise((res, rej) => {
    start()
      .then(() => {
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
