var express = require("express");
const User = require("../models/User");
var router = express.Router();

/* GET home page. */
router.get("/random", function (req, res, next) {
  res.json({ title: "Express" });
});
//Signup a new username
router.post("/api/exercise/new-user", (req, res) => {
  const { username } = req.body;
  User.findOne({ username: username }, (err, userFound) => {
    if (userFound) return res.json({ error: "Username already taken!" });
    const user = new User({
      username: username,
    });

    user.save((err, data) => {
      if (err) return res.json({ error: "Error saving in db!" });
      console.log(data);
      return res.json({ username: data.username, _id: data._id });
    });
  });
});

//get all signedup users
router.get("/api/exercise/users", (req, res)=>{
  User.find({},{"username": 1, "_id": 1}, (err, users)=>{
    if(err) return res.json({"error": "No Users found!"});
    // console.log(users);
    return res.send(users);
  });
});



module.exports = router;
