import AsyncStorage, { AsyncStorageStatic } from '@react-native-community/async-storage';
import isEmpty from 'lodash/isEmpty';
import { log } from '../config/log';

export const USER_DB_PATH = 'USER_DB_PATH';

export interface UserAuthObject {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;

  accessToken: string;
  refreshToken: string;
  expirationTime?: string;
  balance: number;
  currency: string;
}

// Require cycle:
export const JSONDATA = (data: any): Record<string, any> | string | null => {
  if (isEmpty(data) || !data) {
    return null;
  }

  try {
    if (typeof data !== 'object') {
      return JSON.parse(data);
    }
    return data;
  } catch (error) {
    log.error('error trying to parse response data', error);
    return data;
  }
};

class AsyncStorageDB {
  private static _instance: AsyncStorageDB;

  public db: AsyncStorageStatic;

  public user: UserAuthObject;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.db = AsyncStorage;
    // this.getAuthToken().then(token => {
    // 	that.updateCacheToken({ token });
    // });
  }

  /**
   * saveToDb
   */
  public async saveToDb(path: string, data: Record<string, any>): Promise<any> {
    try {
      await this.db.setItem(path, JSON.stringify(data));
    } catch (error) {
      log.error('error saving to db', error);
      return null;
    }
  }

  /**
   * deleteFromDb
   */
  public async deleteFromDb(path: string): Promise<boolean> {
    try {
      await this.db.removeItem(path);
      return true;
    } catch (error) {
      log.error('Error deleting item from DB', error);
      return false;
    }
  }

  /**
   * Read data from the db
   * @param path to the data
   */
  public async readFromDb(path: string): Promise<any> {
    try {
      const value = await this.db.getItem(path);
      if (value !== null) {
        return JSONDATA(value);
      }
      return null;
    } catch (error) {
      log.error('error getting data from db', error);
      return null;
    }
  }

  /**
 * 
   updateUserAuth
   data: Object	: Promise<any>
 */
  public async getUserAuthObject(): Promise<UserAuthObject | null> {
    try {
      const existingData = await this.readFromDb(USER_DB_PATH);
      this.user = existingData;
      return existingData;
    } catch (error) {
      log.error('Error updating user auth', error);
      return null;
    }
  }

  /**
	 * 
	   updateUserAuth
	   data: Object	: Promise<any>
	 */
  public async updateUserAuth(data: Record<string, any>): Promise<any> {
    try {
      const existingData = await this.readFromDb(USER_DB_PATH);

      const newState = {
        ...(existingData || {}),
        ...data,
      };

      // await this.updateCacheToken(newState && newState.accessToken ? { token: newState.accessToken } : {});

      await this.saveToDb(USER_DB_PATH, newState);

      return newState;
    } catch (error) {
      log.error('Error updating user auth', error);
      return null;
    }
  }

  /**
   * getAuthToken
   */
  public async getAuthToken(): Promise<string> {
    try {
      const token = await this.readFromDb(USER_DB_PATH);
      return token && token.accessToken;
    } catch (error) {
      log.error('Error getting auth token', error);
      return null;
    }
  }

  /**
   * logout
   */
  public async deleteUserData() {
    // delete user object
    try {
      const newState = {};
      await this.saveToDb(USER_DB_PATH, newState);
      return newState;
    } catch (error) {
      log.error('Error deleting user auth', error);
      return null;
    }
  }
}

export default AsyncStorageDB;
