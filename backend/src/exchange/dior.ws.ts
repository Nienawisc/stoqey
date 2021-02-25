import { EventEmitter } from "events";
import WebSocket from "ws";
import _ from "lodash";
import { log } from "../log";
import { JSONDATA } from "../utils";
import { DIOREVENTS } from "./dior.event";
import { OrderType } from "src/order";

const DIOR_KEY = "mykey";

const DIOR_WS = _.get(process.env, "DIOR_WS", "ws://localhost:6660");
/**
 * STQNETWORK websocket events
 */
export enum diorWSEvents {
  onTrade = "onTrade",
  onQuote = "onQuote",
  onOrders = "onOrders",

  /**
   * true / false
   */
  onReady = "onReady",

  /**
   * new Error()
   */
  onError = "onError",

  ADD = 'add',
  CANCEL = 'cancel',
  UPDATE = 'update',
  GET = 'get',

}

/**
 * @Websocket
 * Stream real-time trades for US stocks, forex and crypto.
 * @see https://stoqey.com/docs/api#websocket-price
 */
export class DiorWebSocket extends EventEmitter {
  private socket: WebSocket = null as any;

  token: string = DIOR_KEY;

  constructor(token?: string) {
    super();
    if (token) {
      this.token = token;
    }
    this.config();
  }

  /**
   * config
   */
  public config() {
    const self = this;

    // if (TZ_ON) {
    //   if (checkIfMarketIsOpen()) {
    //     return self.init();
    //   } else {
    //     log("Market is closed cannot subscribe to market data");
    //     // infinity loop
    //     return setTimeout(() => {
    //       log("FinnhubIO.config heartbeat");
    //       self.config();
    //     }, 5000);
    //   }
    // }

    self.init();
  }

  /**
   * init
   */
  private init() {
    const self = this;

    const token = self.token;

    // Emulate for test
    if (process.env.NODE_ENV === "test") {
      setTimeout(async () => {
        self.emit(diorWSEvents.onReady, true);
      }, 3000);
      return;
    }

    log("DiorWS.init startup", (token || "").slice(0, 5));

    this.socket = new WebSocket(`${DIOR_WS}?token=${token}`);


    /**
     * SELF EVENTS
     */

    this.on(diorWSEvents.ADD, (order: OrderType) => {
      const dataToSend = {
        type: diorWSEvents.ADD,
        data: order,
      };
      this.socket.send(JSON.stringify(dataToSend))
    });

    this.on(diorWSEvents.CANCEL, (orderId: string) => {
      const dataToSend = {
        type: diorWSEvents.CANCEL,
        data: orderId,
      };
      this.socket.send(JSON.stringify(dataToSend))
    });

    this.on(diorWSEvents.UPDATE, (order: OrderType) => {
      const dataToSend = {
        type: diorWSEvents.UPDATE,
        data: order,
      };
      this.socket.send(JSON.stringify(dataToSend))
    });

    this.on(DIOREVENTS.GET_STQ_ORDERS, () => {
      const dataToSend = {
        type: DIOREVENTS.GET_STQ_ORDERS,
        data: true,
      };
      this.socket.send(JSON.stringify(dataToSend))
    });

    this.socket.onopen = () => {
      log("✅✅✅: DIOR: Successfully connected socket");
      // Send message to socket
      this.socket.send(JSON.stringify({ type: DIOREVENTS.STQ_QUOTE }))
      this.emit(diorWSEvents.onReady, true);
    };

    this.socket.onerror = (error: WebSocket.ErrorEvent) => {
      log("❌❌❌: DIOR: error connecting socket", error);

      this.emit(diorWSEvents.onError, error);

      this.socket.close();
      return;
    };

    this.socket.onclose = (event: WebSocket.CloseEvent) => {
      log(`❌❌❌: DIOR: Connection Close code=${event.code} message=${event.reason}`);

      this.emit(diorWSEvents.onError, new Error(event.reason));
      setTimeout(() => self.config(), 1000);
      return;
    };

    this.socket.on("upgrade", () => {
      log("⬆⬆⬆: DIOR: Connection Upgrade");
      return;
    });

    // interface OnSocketData {
    //   data: { s: string; p: number; t: number; v: string }[];
    //   type: string;
    // }

    this.socket.onmessage = (data: WebSocket.MessageEvent): void => {
      log(`⟁⟁⟁: DIOR -> message`, data.data);
      // @ts-ignore
      const parsedData: any = JSONDATA(data.data);

      if (!parsedData) {
        return;
      }

      // TODO  check order status,
      // Order cancel
      // Order get
      // and other times
      // log('marketdata -> WS -> message', data);

      //   Check if trade
      const event = parsedData.event;
      switch (event) {
        case DIOREVENTS.STQ_ORDERS:
          this.emit(diorWSEvents.onOrders, parsedData.data);
          return;

        case DIOREVENTS.STQ_TRADE:
          this.emit(diorWSEvents.onTrade, parsedData);
          return;

        case DIOREVENTS.STQ_QUOTE:
        default:
          this.emit(diorWSEvents.onQuote, parsedData);
          return;
      }
    };
  }
}

export default DiorWebSocket;
