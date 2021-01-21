import {
  MiddlewareFn,
} from "type-graphql";
import get from "lodash/get";
import { isAuth } from "../auth";
import isEmpty from "lodash/isEmpty";
import { verify } from "jsonwebtoken";
import { auth } from '../firebase';
import { log } from '../log';

export const FirebaseTokenVerify: MiddlewareFn = async (
  { args }: any,
  next
) => {
  const token = args && args.firebaseToken || get(args, "user.firebaseToken", ""); // args.user.firebaseToken;

  if (isEmpty(token)) {
    throw new Error("Token No authorization");
  }

  const verifyToken = (idToken: string): Promise<string | null> => {
    // idToken comes from the client app
    return new Promise((res) => {
      auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        res(uid)
      })
      .catch((error) => {
        // Handle error
        log(`Error verifying token ${error && error.token}`);
        res(null);
      });
    })
      
  };

  try {
    const verified = await verifyToken(token);

    if(!verified){
      throw new Error("No authorization, please try again");
    }
  } catch (err) {
    console.log(err);
    return null;
  }
  return next();
};
