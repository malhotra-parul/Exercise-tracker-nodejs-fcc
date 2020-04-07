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
    userFound.count = userFound.log.length;
    
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
});
//view complete exercise log for any userId
router.get("/api/exercise/log",(req, res)=>{
  const { userId, from, to, limit } = req.query;

  if(!userId) return res.json({"error": "Please supply userId in query."});

  User.findOne({"_id": userId}, (err, userFound )=>{
    if(err) return res.json({"error": "No such Userid found!"});
    if(from && to && limit){
      var todate = new Date(to);
      todate.setDate(todate.getDate()+1);
      const selection = userFound.log.filter((exercise, i)=>{
        return (exercise.date >= new Date(from) && exercise.date <= todate);
      });
      return res.json({ "_id": userId,
                        "username": userFound.username,
                        "count": limit,
                        "log": selection.slice(0, limit),
                        "from": new Date(from),
                        "to": new Date(to)
      });
    }
    else if(from && to){
      var todate = new Date(to);
      todate.setDate(todate.getDate()+1);
      const selection = userFound.log.filter((exercise, i)=>{
        return (exercise.date >= new Date(from) && exercise.date <= todate);
      })
      return res.json({ "_id": userId,
                        "username": userFound.username,
                        "count": selection.length,
                        "log": selection,
                        "from": new Date(from),
                        "to": new Date(to)
      });
    }else if(limit){
      
      return res.json({ "_id": userId,
                        "username": userFound.username,
                        "count": limit,
                        "log": userFound.log.slice(0, limit) });
    }
    else{
    return res.json(userFound);
    }
  })
} )

module.exports = router;
