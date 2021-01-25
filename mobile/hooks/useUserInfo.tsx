import { log } from '../config';
import { useState, useEffect } from 'react';
import AsyncStorageDB, { UserAuthObject } from '../db/AsyncStorageDB';

// export function useUserInfo(): UserAuthObject {
//   const [userInfo, setUserInfo] = useState<UserAuthObject>(null);
//   async function getData() {
//     const user = await getUserInfo();
//     log.info(`USER ${JSON.stringify(user)}`);
//     setUserInfo(user);
//   }

//   useEffect(() => {
//     getData();
//   }, []);

//   return userInfo;
// }

export function useUserInfo(): UserAuthObject {
  const db = AsyncStorageDB.Instance;
  const [userInfo, setUserInfo] = useState<UserAuthObject>(null);

  if (!userInfo) {
    db.getUserAuthObject().then(dbData => setUserInfo(dbData));
  }

  return !userInfo ? ({} as any) : userInfo;
}

export const getUserStatic = (): UserAuthObject => {
  return AsyncStorageDB.Instance.user;
};

export function getUserInfo(): Promise<UserAuthObject> {
  return new Promise(resolve => {
    const db = AsyncStorageDB.Instance;
    db.getUserAuthObject()
      .then(dbData => resolve(dbData))
      .catch(() => resolve(null));
  });
}
