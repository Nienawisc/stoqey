import { RedisPubSub as PubSub } from "graphql-redis-subscriptions";
import { StqNetworkWSEvents, StqNetworkWS } from "./marketdata/marketdata.ws";
import { TOPICS } from "./topics";

/**
 * Bind all internal events to pubsub
 */
export const bindEventsToPubSub = (pubsub: PubSub) => {

    /**
     * Add stoqey marketdata to pubsub
     */
    const stqWs = new StqNetworkWS();
    stqWs.on(StqNetworkWSEvents.onQuote, (data: any) => pubsub.publish(TOPICS.STQ_QUOTE, data));
    stqWs.on(StqNetworkWSEvents.onTrade, (data: any) => pubsub.publish(TOPICS.STQ_TRADE, data));
}