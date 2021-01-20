import 'mocha';
import { expect } from 'chai';
import MarketDataAPI from './marketdata.api';

const api = new MarketDataAPI();

const symbol = 'STQP';

describe('Market data', () => {

    it('it should get marketdata from exodus', async () => {
        const startDate = new Date('2021-01-03T12:38:00Z');
        const endDate = new Date('2021-01-05T12:38:00Z');
        const gotData = await api.getCandles(symbol,startDate, endDate, '1m');
        console.log('got market data', gotData && gotData.length);
        expect(gotData).not.to.be.null;
    })

    it('it should get quote from exodus', async () => {
        const gotData = await api.getQuote(symbol);
        console.log('got market data', gotData);
        expect(gotData).not.to.be.null;
    })

    // it('it should get marketdata from exodus', async () => {
    //     const startDate = new Date('2020-01-01');
    //     const endDate = new Date('2020-01-05');
    //     const gotData = await api.getCandles(symbol,endDate,startDate, '1');
    //     console.log('got market data', gotData);
    //     expect(gotData).not.to.be.null;
    // })

    // it('it should get marketdata from exodus', () => {
        
    // })
})