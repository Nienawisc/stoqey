import { useState } from 'react';
import AsyncStorageDB, { UserAuthObject } from '../db/AsyncStorageDB';

export function useUserInfo(): UserAuthObject {
  const db = AsyncStorageDB.Instance;
  const [userInfo, setUserInfo] = useState<UserAuthObject>(null);

  if (!userInfo) {
    db.getUserAuthObject().then(dbData => setUserInfo(dbData));
  }

  return !userInfo ? ({} as any) : userInfo;
}

export function getUserInfo(): Promise<UserAuthObject> {
  return new Promise(resolve => {
    const db = AsyncStorageDB.Instance;
    db.getUserAuthObject()
      .then(dbData => resolve(dbData))
      .catch(() => resolve(null));
  });
}
