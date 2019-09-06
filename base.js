require("dotenv").config();
const express = require("express");
const unirest = require("unirest");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
const appPort = process.env.PORT || 3000;

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        calculatePrice(type: String, margin: Float, exchangeRate: String):calculatedPrice
    }
    
    type calculatedPrice {
        price: String,
        currency: String,
        type: String
    }
`);

var getPrice = async args => {
  var type = args.type,
    margin = args.margin,
    exchangeRate = args.exchangeRate.toUpperCase(),
    newPrice;

  if (type.toUpperCase() != "SELL" && type.toUpperCase() != "BUY") {
    throw "invalid type sent (type can only be buy or sell)";
  } else {
    return new Promise((resolve, reject) => {
      unirest
        .get("https://api.coindesk.com/v1/bpi/currentprice/USD.json")
        .headers({
          Accept: "application/json",
          "Content-Type": "application/json"
        })
        .end(async resp => {
          console.log(exchangeRate);
          console.log(resp.body);

          if (resp && resp.error) {
            return reject("invalid type sent (type can only be buy or sell)");
          } else {
            payload = JSON.parse(resp.body)["bpi"]["USD"];
            if (type.toLowerCase() == "sell") {
              newPrice = payload.rate_float - margin * payload.rate_float;
            } else if (type.toLowerCase() == "buy") {
              newPrice = payload.rate_float + margin * payload.rate_float;
            }
            return resolve({
              price: newPrice,
              currency: "NGN",
              type: type.toUpperCase()
            });
          }
        });
    });
  }
};

// Root Resolver
var root = {
  calculatePrice: getPrice
};

// Express Server and GraphQL Endpoint
var app = express();
app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

// Start Node Server
app.listen(appPort, () => {
  console.log("GraphQL Server Running - :" + process.env.PORT + "/graphql");
});
