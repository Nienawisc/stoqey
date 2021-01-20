// 6ET160887F094844V

import 'mocha';
import { expect } from 'chai';
import {  verifyPayment } from './paypal.app';

const orderId = '6ET160887F094844V';

describe('PayPal', () => {
    it('it should verify payment from user payment page', async () => {
        const verified = await verifyPayment(orderId)
        expect(verified).to.not.null;
    })
})