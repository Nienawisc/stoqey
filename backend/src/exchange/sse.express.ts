import express, { Express } from "express";
import { updateUserWallet } from "../user/User.methods";

interface BodyProps {
  userId: string;
  amount: number;
  source: string;
  sourceId?: string;
}

export const exchangeServerApiInput = (appExpress: Express) => {
  appExpress.post("/updateUserWallet", async (req, res) => {
    const body: BodyProps = req.body;

    const { userId, amount, source, sourceId } = body;

    const results = await updateUserWallet(userId, amount, source, sourceId);

    res.json(results);
  });
};
