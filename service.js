const unirest = require("unirest");

// Get Price Function
const getPrice = async args => {
  var type = args.type,
    margin = args.margin,
    exchangeRate = args.exchangeRate.toLowerCase(),
    newPrice;

  if (type.toLowerCase() != "sell" && type.toLowerCase() != "buy") {
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

module.exports = {
  getPrice
};
