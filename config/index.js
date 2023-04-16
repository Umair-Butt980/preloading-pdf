const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const envConfig = {
  DEV_CDN_URL: process.env.devUrl,
};

module.exports = { envConfig };
