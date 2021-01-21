import 'reflect-metadata';
import "dotenv/config";
import { start as startCouchbase } from "ottoman";
import { get as _get } from 'lodash';
import {ApolloServer} from 'apollo-server-express';
import {buildSchemaSync} from 'type-graphql';
import http from 'http';
import chalk from 'chalk';

import {Resolvers} from "./resolvers";
import ServerConfig from "./server.config";
import { log } from './log';
import { bindEventsToPubSub } from './events';

import { PORT, graphqlPath} from './config';
export interface Context {
    ibkrEvents: Event;
}

ServerConfig.getExpress().then(({appExpress, pubsub}) => {

    // Build schema
    const schema = buildSchemaSync({
        resolvers: Resolvers(),
        pubSub: pubsub
    })

    // build apollo server
    const server = new ApolloServer({
        schema,
        subscriptions: {
            onConnect(connectionParams, webSocket) {

            },
            onDisconnect() {

            }
        },
        introspection: true, // enables introspection of the schema
        playground: true, // enables the actual playground
        context: ({ req, res }) => {
             // get the user token from the headers
            const token = _get(req,'headers.authorization', '');
            
            return ({ req, res, pubsub })
        },
    });
    server.applyMiddleware({app: appExpress, path: graphqlPath, cors: { origin: '*'} });

    // Create  HTTP server and run
    const httpServer = http.createServer(appExpress);
    server.installSubscriptionHandlers(httpServer)

    startCouchbase().then(() => {
        httpServer.listen(Number(PORT), () => {
            log(chalk.green(`Server started on port ${PORT}`))
        });
    });

    // Add events
    bindEventsToPubSub(pubsub);

}).catch((err) => {
    log(chalk.red(`Unable to start server on port ${PORT}`, err))
    process.exit(1);
});