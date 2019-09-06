const { buildSchema } = require("graphql");

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        calculatePrice(type: String, margin: Float, exchangeRate: String):calculatedPrice
    }
    
    type calculatedPrice {
        price: Float,
        currency: String,
        type: String
    }
`);

module.exports = schema;
