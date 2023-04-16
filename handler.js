const serverless = require("serverless-http");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const { envConfig } = require("./config");


//Above this are third party imports
const { responseHeader } = require("./middleware/index");
app.use(responseHeader);
app.use(bodyParser.json());
app.use(express.json());

app.post("/preload-pdf", async (req, res, next) => {
  console.log(req.body, "<++++This is body of the params======>");
  try {
    if (
      req.body.params == null ||
      req.body.params == undefined ||
      req.body.params == ""
    ) {
      return res.status(400).json({
        message: "params cannot be null or undefined",
      });
    }

    const uri = params.imageUrl;
    const pageCount = params.metaData.page_count;
    const promises = [];

    // creating hash metaData for all the pages
    const resultHash = {};
    for (let i = pageCount; i > 0; i--) {
      const promise = axios.get(
        `${envConfig.DEV_CDN_URL}${uri}?fm=json&page=${i}`
      );
      promises.push(promise);
    }
    return Promise.allSettled(promises)
      .then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const { PixelHeight, PixelWidth } = result.value.data;
            resultHash[index] = { h: PixelHeight, w: PixelWidth };
          } else {
            console.log(`API call ${index + 1} failed:`, result.reason);
            // logger.error("API call ${index + 1} failed:", result.reason);
          }
        });
        console.log(resultHash, "<=====resultHash=======>");
        return resultHash;
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports.handler = serverless(app);
