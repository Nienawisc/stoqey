import { Resolver, Mutation, Arg } from "type-graphql";
import { ResType } from "../shared";
import { verifyPayment } from "./paypal.app";
import { updateUserWallet } from "../user/User.methods";

@Resolver()
export class PayPalResolver {
  @Mutation(() => ResType)
  async processPayPal(
    @Arg("owner") owner: string,
    @Arg("orderId") orderId: string,
    @Arg("amount") amount: number
  ): Promise<ResType> {
    try {

      // Verify amount with amount passed
      const { amount: receivedAmount }  = await verifyPayment(orderId);

      if(Math.round(amount) === Math.round(receivedAmount)){
          // Add amount to user's wallet
          const addedAmountToAccount = await updateUserWallet(owner, amount, 'paypal', orderId);
          return addedAmountToAccount;
      };

      throw new Error('Error adding money to the account, please try again later');
    } catch (error) {
      console.error(error);
      return { success: false, message: error && error.message };
    }
  }

}

export default PayPalResolver;
