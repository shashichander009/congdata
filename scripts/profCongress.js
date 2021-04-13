var request = require("request");

function sendReq(param) {
  const URL =
    "https://2factor.in/API/V1/c0b8a159-032e-11e8-a328-0200cd936042/SMS/" +
    param +
    "/AUTOGEN/profcong%20OTP";

  request.get(URL, function (err, res, body) {
    if (err) {
      console.log(err);
    } //TODO: handle err
    else {
      console.log(body);
    }
  });
}

var mobNumbers = ["99999999999"];

for (var i = 0; i < 2; i++) {
  sendReq(mobNumbers[0]);
}
