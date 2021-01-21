import React, { useEffect, useState } from 'react';
import PayPalCheckout from './PayPalCheckout';
import AsyncStorageDB from '../../db/AsyncStorageDB';
import { log } from '../../config';

export const PayPalScreen = ({ route }) => {
  const db = AsyncStorageDB.Instance;

  const { amount }: { amount: number } = route.params;

  log.info(`amount to transfer is ${amount}`);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const gotUser = await db.getUserAuthObject();
      if (gotUser) {
        setUser(gotUser);
      }
    };
    getData();
  }, []);

  return user && <PayPalCheckout amount={amount} userId={user.id} success={async () => {}} error={async () => {}} />;
};

export default PayPalScreen;
