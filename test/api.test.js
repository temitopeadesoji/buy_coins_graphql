require('dotenv').config();

const chai = require('chai');
const expect = chai.expect;

const url = `http://localhost:`+process.env.PORT;
const request = require('supertest')(url);

describe('GraphQL', () => {

    // Tests for type buy
    it('Returns price for type buy', (done) => {
        request.post('/graphql')
        .send({ query: '{calculatePrice(type: "buy", margin: 0.2, exchangeRate: "USD") { price currency type } }'})
        .expect(200)
        .end((err, res) => {
            
            // res will contain array with one user
            if (err) return done(err);
            
            expect(res.body.data.calculatePrice).to.have.property('price');
            expect(res.body.data.calculatePrice).to.have.property('currency');
            expect(res.body.data.calculatePrice).to.have.property('type');

            done();
        })
    });

    // Tests for type sell
    it('Returns price for type sell', (done) => {
        request.post('/graphql')
        .send({ query: '{calculatePrice(type: "sell", margin: 0.2, exchangeRate: "NGN") { price currency type } }'})
        .expect(200)
        .end((err, res) => {
            
            // res will contain array with one user
            if (err) return done(err);
            
            expect(res.body.data.calculatePrice).to.have.property('price');
            expect(res.body.data.calculatePrice).to.have.property('currency');
            expect(res.body.data.calculatePrice).to.have.property('type');

            done();
        })
    })
});