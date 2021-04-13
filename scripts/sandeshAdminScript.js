const request = require("request");
const fs = require("fs");

const apiUrl =
  "http://congresssandesh.co.in/beta/api/admin_services/Users_list";

function sendRequest() {
  request.post(
    apiUrl,
    {
      json: {
        apiId: "YzMxYjMyMzY0Y2UxOWNhOGZjZDE1MGE0MTdlY2NlNTg=",
        limit: "5",
        search_str: "admin",
        login_user_id: "MQ==",
        type: "Approved",
        from_date: "",
        to_date: "",
        user_id: "NA==",
      },
    },
    (error, res, body) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`statusCode: ${res.statusCode}`);

      let data = JSON.stringify(body["users"]);

      console.log(data);

      // data = data + "\n";

      // fs.appendFile(path, data, function (err) {
      //   if (err) throw err;
      //   console.log("Saved!");
      // });
    }
  );
}

sendRequest();
