var express = require("express");
var router = express.Router();

/* GET index.html page. */
router.get("/", function (req, res, next) {
  var options = {    
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile("./ts-build/index.html", options, (err) => {
    if(err) {
      next(err);
    }

    console.log("Package manage initialized");
  });
});

module.exports = router;
