import { Resolver, Query, Mutation, Arg } from "type-graphql";
import isEmpty from "lodash/isEmpty";
import { ResType } from "../shared";
import PortfolioModel, {
  closePortfolioPosition,
  PortfolioType,
  startPortfolioPosition,
} from "./Portfolio.model";
import { ActionType } from "@stoqey/client-graphql";

@Resolver()
export class PortfolioResolver {
  @Query(() => [PortfolioType])
  async portfolios(
    @Arg("owner") userId: string,
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
        where: { owner: { $eq: userId } },
        limit,
        page,
      });

      console.log(`portfolios returned are ${data && data.length}`);
      return {success: true, data};
    } catch (error) {
      console.log(error);
      return {success: false, data: []};
    }
  }

  @Mutation(() => ResType)
  async startPortfolio(
    @Arg("owner") owner: string,
    @Arg("size") size: number,
    @Arg("action") action: ActionType
  ): Promise<ResType> {
    try {
      // update trade now
      const startingPosition = await startPortfolioPosition({
        size,
        action,
        owner,
      });
      if (!isEmpty(startingPosition)) {
        return { success: true, data: startingPosition };
      }

      throw new Error("Error closing portfolio");
    } catch (err) {
      console.error(err);
      return { success: false, message: err && err.message };
    }
  }

  @Mutation(() => ResType)
  async closePortfolio(@Arg("id") portfolioId: string): Promise<ResType> {
    try {
      // If updating
      if (!isEmpty(portfolioId)) {
        // update trade now
        const closePosition = await closePortfolioPosition(portfolioId);
        if (!isEmpty(closePosition)) {
          return { success: true, data: closePosition };
        }
      }

      throw new Error("Error closing portfolio");
    } catch (err) {
      console.error(err);
      return { success: false, message: err && err.message };
    }
  }
}

export default PortfolioResolver;
