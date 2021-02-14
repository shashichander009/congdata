const request = require("request");
const fs = require("fs");

var path = "./data/volunteer2.json";

// const apiUrl = "https://www.incsmw.in/api/services/workerOtp";

// const apiUrl =
//   "https://www.incsmw.in/api/services/google_form_socialchat/details";

// const apiUrl = "https://www.incsmw.in/api/services/social_chat_details";

const apiUrl = "https://www.incsmw.in/api/services/volunteers/details";

// let mobNumbers = ["1234567898"];

for (var i = 5000; i < 5005; i++) {
  sendRequest(i);
}

function sendRequest(param) {
  request.post(
    apiUrl,
    {
      json: {
        // mobile: param,
        // user_id: param,
        volunteers_id: param,
      },
    },
    (error, res, body) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`statusCode: ${res.statusCode}`);
      //   console.log(body);
      //   let data = JSON.stringify(body["user"]);

      let data = JSON.stringify(body["volunteer"]);
      fs.appendFile(path, data, function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    }
  );
}
