import "reflect-metadata";
import "dotenv/config";
import "mocha";
import { expect } from "chai";
import { startCouchbaseAndNext } from "../couchbase";
import { CommonPagination } from "./common.pagination";
import { TradeModel } from "../trade";

before((done) => {
  startCouchbaseAndNext().then((started) => {
    if (started) {
      const tradeModel = TradeModel();
      console.log("app has started");
      done();
    }
  });
});

describe("Pagination", () => {
  it("it should paginate through all the trades that were made", async () => {
    const data = await CommonPagination();
    console.log("data from pagination is", data);
    expect(data).not.to.be.empty;
  });
});
