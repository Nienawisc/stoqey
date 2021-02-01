import { Resolver, Query, Arg } from "type-graphql";
import { ResType } from "../shared";
import PortfolioModel, {
  PortfolioType,
} from "./Portfolio.model";

@Resolver()
export class PortfolioResolverAdmin {
  @Query(() => [PortfolioType])
  async portfolios(
    @Arg("page") page: number,
    @Arg("limit") limit: number
  ): Promise<ResType> {
    try {
      const data = await PortfolioModel.pagination({
        select: [
          "id",
          "owner",
          "symbol",
          "status",
          "secType",
          "exchange",
          "action",
          "size",
          "entryTime",
          "averageCost",
          "createdAt",
        ],
        // where: { owner: { $eq: userId } },
        limit,
        page,
      });

      console.log(`all portfolios returned are ${data && data.length}`);
      return {success: true, data};
    } catch (error) {
      console.log(error);
      return {success: false, data: []};
    }
  }
}

export default PortfolioResolverAdmin;
