const serverless = require("serverless-http");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");

//Above this are third party imports
app.use(responseHeader);
app.use(bodyParser.json());
app.use(express.json());

app.post("/reply-facebook-reviews", async (req, res, next) => {
  try {
    if (
      req.body.store_id == null ||
      req.body.store_id == undefined ||
      req.body.store_id == ""
    ) {
      return res.status(400).json({
        message: "Store Id cannot be null or undefined",
      });
    }
    if (
      req.body.message == null ||
      req.body.message == undefined ||
      req.body.message == ""
    ) {
      return res.status(400).json({
        message: "Message cannot be null or undefined",
      });
    }
    if (
      req.body.openGraphStoryId == null ||
      req.body.openGraphStoryId == undefined ||
      req.body.openGraphStoryId == ""
    ) {
      return res.status(400).json({
        message: "reviewId cannot be null or undefined",
      });
    }
    let findUser = await findUserFromStoreId(req.body.store_id);
    // let fbPageId = findUser.fb_page_id;
    let pageAccessToken = findUser.page_access_token;

    //calling the Facebook comment api
    let fbComment = await axios.post(
      `https://graph.facebook.com/v12.0/${req.body.openGraphStoryId}/comments`,
      {
        message: req.body.message,
        access_token: pageAccessToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": "sb=BN6qYm9Iu3sniXEuFdcL941K",
        },
      }
    );
     if (fbComment.data != undefined) {
       return res.status(200).json({
         message: "Successfully replied to the review ",
         details: fbComment.data,
       });
     } else {
       return res.status(400).json({
         message: "Something went wrong",
         details: null,
       });
     }
  } catch (error) {
    console.log(error)
  }
});
module.exports.handler = serverless(app);
