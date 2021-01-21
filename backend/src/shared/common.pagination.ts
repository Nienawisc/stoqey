import * as ottoman from "ottoman";
import { Query } from "ottoman";
import { convertDates } from "../utils/date";
import { log } from "../log";

interface PaginationArgs {
  select?: any;
  where: any;
  page: number;
  limit: number;
  orderBy?: any;
}

/**
 * Common pagination
 *  where = {
      where: { owner: { $eq: "stoqey" }, _type: { $eq: "Trade" } },
    },
    page = 0,
    limit = 10,
    orderBy = { createdAt: "DESC" },
 * @param args PaginationArgs
 */
export const Pagination = async (args: PaginationArgs): Promise<any[]> => {
  const {
    select: ogSelected,
    where = {
      where: { owner: { $eq: "stoqey" }, _type: { $eq: "Trade" } },
    },
    page = 0,
    limit = 10,
    orderBy = { createdAt: "DESC" },
  } = args;

  let select = ogSelected;
  if(Array.isArray(select)){
    select = select.map(i => ({ $field: i}));
  };

  console.log('select is', JSON.stringify(select));
  const dbName = "stq";
  const offset = page * limit;
  // @ts-ignore
  const cluster = ottoman.getDefaultConnection().cluster;

  try {
    const query = new Query(where, dbName)
      .select("*")
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy)
      .build();
    //   console.log('QUERY IS', query);

    const { rows } = await cluster.query(query);
    //   const d = await TradeModel().find({ secType: "ai" });

    const completedRows = rows.map((r: any) => {
      return convertDates(r[dbName]);
    });

    log("data is", completedRows && completedRows.length);

    return completedRows;

  } catch (error) {
    log("error running pagination", error);
    return [];
  }
};
