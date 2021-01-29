import {
  Resolver,
  Query,
  Mutation,
  Arg,
} from "type-graphql";
import isEmpty from "lodash/isEmpty";
import {
  ResType,
} from "../shared";
import PortfolioModel, { closePortfolioPosition, PortfolioType } from "./Portfolio.model";

@Resolver()
export class PortfolioResolver {

  @Query(() => [PortfolioModel])
  async portfolios(
    @Arg("owner") userId: string,
    @Arg("page") page: number,
    @Arg("limit") limit: number,
  ): Promise<PortfolioType[]> {
    try {
      const data = await PortfolioModel.pagination({
        select: ['id', 'owner', 'symbol','status', 'secType','exchange', 'action','size','entryTime', 'averageCost', 'createdAt'],
        where:  { owner: { $eq: userId } },
        limit,
        page
      });
      
      console.log(`portfolios returned are ${data && data.length}`);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  @Mutation(() => ResType)
  async closePortfolio(
    @Arg("id") portfolioId: string,
  ): Promise<ResType> {
    try {
      // If updating
      if (!isEmpty(portfolioId)) {
        // update trade now
        const closePosition = await closePortfolioPosition(portfolioId);
        if (!isEmpty(closePosition)) {
          // TODO remove amount from user account and remove position
          return { success: true, data: closePosition };
        }
      }

      throw new Error('Error closing portfolio')
    } catch (err) {
      console.error(err);
      return { success: false, message: err && err.message };
    }
  }

}

export default PortfolioResolver;
