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
  User.findOne({ username: username, "count": 0, "log":[] }, (err, userFound) => {
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

//add exercise by a userID
router.post("/api/exercise/add", (req, res)=>{
  const { userId, description, duration, date } = req.body;
  User.findOne({"_id": userId}, (err, userFound)=>{
    if(err) return res.json({"error": "Could not find a user with this userId"});
    const exercise = {
      "description": description,
      "duration": duration,
      "date": date
    };
    userFound.log.push(exercise);
    
    userFound.save((err, data)=>{
      if(err) return res.json({"error": "Error saving data"});
      const lenOfLog = data.log.length;
      return res.json({"username": data.username, 
                       "description": data.log[lenOfLog-1].description,
                      "duration": data.log[lenOfLog-1].duration,
                      "_id": data._id,
                      "date": data.log[lenOfLog-1].date 
                    });
    })
  })
})

module.exports = router;
