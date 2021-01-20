import express from "express";
import { log } from "../log";
import { PayPalPage } from "./paypal";
import { getPayPalClient } from "./paypal.config";

// @ts-ignore
import * as paypal from "@paypal/checkout-server-sdk";

interface PurchaseUnits {
  amount: {
    currency_code: string;
    value: number;
  };
}
interface OrdersResponse {
  statusCode: number;
  result: {
    /**
     *  CREATED. The order was created with the specified context.
        SAVED. The order was saved and persisted. The order status continues to be in progress until a capture is made with final_capture = true for all purchase units within the order.
        APPROVED. The customer approved the payment through the PayPal wallet or another form of guest or unbranded payment. For example, a card, bank account, or so on.
        VOIDED. All purchase units in the order are voided.
        COMPLETED. The payment was authorized or the authorized payment was captured for the order.
        PAYER_ACTION_REQUIRED. The order requires an action from the payer (e.g. 3DS authentication). Redirect the payer to the "rel":"payer-action" HATEOAS link returned as part of the response prior to authorizing or capturing the order.
     */
    status: string;
    purchase_units: [PurchaseUnits];
  };
}

interface OrderResults {
  amount: number;
  orderId: string;
}

export const verifyPayment = async (orderId: string): Promise<OrderResults | null> => {
  console.log(`verifyPayment`, orderId);
  try {
    // Construct orderApi
    const client = getPayPalClient();
    let request = new paypal.orders.OrdersGetRequest(orderId);

    // run request
    let response: OrdersResponse = await client.execute(request);

    // TODO email alerts
    log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    log(`Capture: ${JSON.stringify(response.result)}`);

    if(response.statusCode === 200){

      const unit = response.result.purchase_units[0]
      const amount = unit.amount.value;
      return { amount, orderId}
    }

    throw new Error('error verifying payment details')

  } catch (error) {
    console.log("error running payment verify", error);
    return null;
  }
};

export const expressfyPayPal = (app: express.Application) => {
  app.get("/payment/:amount/:userId", function (req, res) {
    // res.sendFile('paypal/paypal.html', {root: __dirname })
    // res.sendStatus(200);
    const amount = +req.params.amount;
    const userId = req.params.userId;

    log(`Create paypal payment`, { amount, userId });

    res.send(PayPalPage(amount, userId));
  });

  app.post("/payment/verify/:amount/:userId/:orderId", async (req, res) => {
    // res.sendFile('paypal/paypal.html', {root: __dirname })
    // res.sendStatus(200);
    const amount = +req.params.amount;
    const userId = req.params.userId;
    const orderId = req.params.orderId;

    log(`Verify paypal payment`, { amount, userId, orderId });

    try {
      await verifyPayment(orderId);
    } catch (error) {
      log("error running payment verify", error);
    }

    res.json({ completed: true });

    // Verify payment if approved
    // Check if orderDoesn't exits
    // Create order and increament user's balance
  });
};
