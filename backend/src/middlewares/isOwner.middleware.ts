
import { Resolver, Query, Subscription, Ctx, Root, Arg, MiddlewareFn } from "type-graphql";
import { isAuth } from "../auth";
import isEmpty from "lodash/isEmpty";
import { verify } from "jsonwebtoken";

export const CompetitorDetector: MiddlewareFn = async ({ args, context }: any, next) => {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      throw new Error('No authorization');
    }

    try {
      const token = authorization.split(" ")[1];
      const verified: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

      if(isEmpty(verified && verified.userId)){
          throw new Error('No authorization, please try again')
      }
    } catch (err) {
      console.log(err);
      return null;
    }
    return next();
  };