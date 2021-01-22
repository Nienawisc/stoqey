import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { RedisPubSub as PubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import _get from 'lodash/get';

// import { createConnection } from "./couchbase";
import { expressfyPayPal } from "./paypal/paypal.app";

// import { verify } from "jsonwebtoken";
// import { User } from "./user";
// import { createAccessToken, createRefreshToken } from "./auth/auth";
// import { sendRefreshToken } from "./auth/sendRefreshToken";

export default class ServerConfig {
  static async getExpress() {

    const redisHost = _get(process.env, 'REDIS_HOST', 'localhost');

    // Create ioredis
    const options = {
      host: redisHost,
      port: 6379,
      retryStrategy: (times: number) => {
        // reconnect after
        return Math.min(times * 50, 2000);
      },
      scope: "auth-server",
    };
    const pubsub = new PubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options),
    });

    // 0. Setup express
    const appExpress = express();
    appExpress.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    appExpress.use(cookieParser());
    appExpress.use(express.json());
    appExpress.use(express.urlencoded({ extended: true }));
    appExpress.use((req: any, res: any, next: any) => {
      req.pubsub = pubsub;
      next();
    });
    appExpress.get("/", (_, res) => {
      res.send("hello");
    });

    // Add paypal routes
    expressfyPayPal(appExpress);

    // app.post("/refresh_token", async (req, res) => {
    //   const token = req.cookies.jid;
    //   if (!token) {
    //     return res.send({ ok: false, accessToken: "" });
    //   }

    //   let payload: any = null;
    //   try {
    //     payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    //   } catch (err) {
    //     console.log(err);
    //     return res.send({ ok: false, accessToken: "" });
    //   }

    //   const user = await User.findOne({ id: payload.userId });
    //   if (!user) {
    //     return res.send({ ok: false, accessToken: "" });
    //   }

    //   if (user.tokenVersion !== payload.tokenVersion) {
    //     return res.send({ ok: false, accessToken: "" });
    //   }

    //   sendRefreshToken(res, createRefreshToken(user));

    //   return res.send({ ok: true, accessToken: createAccessToken(user) });
    // });

    return { appExpress, pubsub };
  }
}
