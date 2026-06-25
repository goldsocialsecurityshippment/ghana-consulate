const https = require("https");
const url = "https://ace-mobile-hub.onrender.com/api/keep-alive";
https.get(url, (res) => {
  console.log(`[${new Date().toISOString()}] Keep-alive ping: ${res.statusCode}`);
}).on("error", (e) => {
  console.error(`Keep-alive error: ${e.message}`);
});
