import { RedisPubSub as PubSub } from "graphql-redis-subscriptions";
import { DiorWebSocket, diorWSEvents } from "./exchange/dior.ws";
import { DIOREVENTS } from "./exchange/dior.event";
import { TOPICS } from "./topics";
import { log } from "./log";

/**
 * Bind all internal events to pubsub
 */
export const bindEventsToPubSub = (pubsub: PubSub) => {

    /**
     * Add stoqey marketdata to pubsub
     */
    const stqWs = new DiorWebSocket();
    // TODO add update order, orders for client
    stqWs.on(diorWSEvents.onReady, () => log(`DiorWebSocket Ready`));
    stqWs.on(diorWSEvents.onQuote, (data: any) => pubsub.publish(TOPICS.STQ_QUOTE, data));
    stqWs.on(diorWSEvents.onTrade, (data: any) => pubsub.publish(TOPICS.STQ_TRADE, data));
}