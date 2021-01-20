import EventEmitter from 'events';

export enum APPEVENTS {
  COIN = 'coin',
  LOGOUT = 'logout',
  TOAST = 'toast',
}

export class AppEvents extends EventEmitter.EventEmitter {
  private cache = {};
  private static _instance: AppEvents;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    super();
    this.setMaxListeners(0); // set a maximum of 50 event listners
  }

  /**
   * oncached
   */
  // public oncached(path: string, handle: (data: any) => void) {
  //     let that = this;
  //     this.on(path, (data) => {

  //         const cachedData = that.cache[path];
  //         // send to cache if we have cache
  //         if(cachedData){
  //             // send cache to client
  //             that.emit(path, cachedData);
  //         }
  //         this.cache[path] = data;
  //         return handle(data)
  //     })
  // }
}

/**
 * Async function for getting IBKR @connected event
 */
export const onConnected = (): Promise<boolean> => {
  const appEvents = AppEvents.Instance;

  const eventName = 'connected';
  return new Promise(resolve => {
    const handleConnected = () => {
      appEvents.removeListener(eventName, handleConnected);
      return resolve(true);
    };
    appEvents.on(eventName, handleConnected);
  });
};
