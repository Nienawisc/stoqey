import { EventEmitter } from "events";
import WebSocket from "ws";
import _ from 'lodash';
import { log } from "../log";
import {JSONDATA} from "../utils";

const DIOR_KEY = 'mykey';

const DIOR_WS = _.get(process.env, 'DIOR_WS', 'ws://localhost:6660')
/**
 * STQNETWORK websocket events
 */
export enum StqNetworkWSEvents {

  onTrade = "onTrade",
  onQuote = "onQuote",

  /**
   * true / false
   */
  onReady = "onReady",

  /**
   * new Error()
   */
  onError = "onError",
}

/**
 * @Websocket
 * Stream real-time trades for US stocks, forex and crypto.
 * @see https://stoqey.com/docs/api#websocket-price
 */
export class DiorWebSocket extends EventEmitter {
  private socket: WebSocket = null as any;

  private symbols: string[] = [];

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
        self.emit(StqNetworkWSEvents.onReady, true);
      }, 3000);
      return;
    }

    log("StqNetwork.init startup", (token || "").slice(0, 5));

    this.socket = new WebSocket(`${DIOR_WS}?token=${token}`);

    this.socket.on("open", () => {
      self.emit(StqNetworkWSEvents.onReady, true);
    });

    this.socket.on("error", (error: Error) => {
      log("on error connecting socket", error);

      self.emit(StqNetworkWSEvents.onError, error);
      setTimeout(() => self.config(), 2000);
      return;
    });

    interface OnSocketData {
      data: { s: string; p: number; t: number; v: string }[];
      type: string;
    }

    this.socket.on("message", (data: OnSocketData): void => {
     
      // @ts-ignore
      const parsedData: any = JSONDATA(data);

      if (!parsedData) {
        return;
      }

      // TODO  check order status,
      // Order cancel
      // Order get
      // and other times
      // log('marketdata -> WS -> message', data);

    //   Check if trade
    
      if (parsedData && parsedData.action ) {
        const dataToSend = parsedData;
        // log('onTradeData', dataToSend);
        self.emit(StqNetworkWSEvents.onTrade, dataToSend);
      }


      if (parsedData && parsedData.asset ) {
        const dataToSend = parsedData
        // log('onQuote', dataToSend);
        self.emit(StqNetworkWSEvents.onQuote, dataToSend);
      }
    });
  }
}

export default DiorWebSocket;
