import { Resolver, Query, Mutation, Arg } from "type-graphql";
import isEmpty from "lodash/isEmpty";
import { ActionType, StatusType } from "@stoqey/client-graphql";
import { ResType } from "../shared";
import PortfolioModel, {
  closePortfolioPosition,
  PortfolioType,
  startPortfolioPosition,
} from "./Portfolio.model";


@Resolver()
export class PortfolioResolver {

  @Query(() => [PortfolioType])
  async myPortfolios(
    @Arg("filter", { nullable: true }) filter: StatusType,
    @Arg("owner") owner: string,
    @Arg("page", { nullable: true }) page: number,
    @Arg("limit", { nullable: true }) limit: number
  ): Promise<PortfolioType[]> {
    try {

      const wheres: any = {
        owner: { $eq: owner },
      }

      // If filter by status
      if(filter){
        wheres.status = { $eq: filter }
      };

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
        where: wheres,
        limit,
        page,
      });

      console.log(`portfolios returned are ${data && data.length}`);
      return data;
    } catch (error) {
      console.log(error);
      return [];
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
  async closePortfolio(@Arg("id") portfolioId: string,  @Arg("owner") owner: string): Promise<ResType> {
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
