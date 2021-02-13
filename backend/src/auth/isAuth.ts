import { MiddlewareFn } from "type-graphql";
import { ContextType } from "../shared/ContextType";
import { verify } from "jsonwebtoken";
import { isEmpty } from "lodash";

export const isAuth: MiddlewareFn<ContextType> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"] || '';

  if (isEmpty(authorization)) {
    throw new Error("Not Authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const verified = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = verified as any;
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated");
  }

  return next();
};
