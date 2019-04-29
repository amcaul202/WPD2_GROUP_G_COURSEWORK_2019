// app.js
const express = require('express');
const bodyParser = require('body-parser');
const loginControl = require('./loginControl.js');
const MongoClient = require('mongodb').MongoClient;
const path = require("path");

// Create Express app
const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

var url = "mongodb://localhost:27017/milestonedb";
var db;

//Connect to DB
MongoClient.connect(url, function(err, client) {
  if (err) return console.log(err)
  db = client.db('milestonedb')
});

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'))  

//Set View
app.set('view engine', 'ejs');

loginControl(app);

//Setting View Destination
app.use("/public", express.static(__dirname + "/Site"));
app.set('views', path.join(__dirname, '/Site'));

//Fetching Website Pages
app.get('/', (req, res) => {
  res.render('pages/home', {title: "home"});
});

app.get('/home', (req, res) => {
  res.render("Pages/home", {title: "home"})
});

app.get('/login', (req, res) => {
  res.render("Pages/login", {title: "login"})
});

app.get('/profile', (req, res) => {
  res.render("Pages/profile", {title: "profile"})
});

app.get('/register', (req, res) => {
  res.render("Pages/register", {title: "register"})
});

app.get('/completeuser', (req, res) => {
  res.render("Pages/completeuser", {title: "completeuser"})
});

app.get('/index', (req, res) => {
  res.render('Pages/index', {title: 'index'});
});

app.get('/createproject', (req,res) => {
  res.render('Pages/createproject', {title: 'createproject'});
});

app.get('/createmilestone', (req, res) => {
  res.render('Pages/createmilestone', {title: 'createmilestone'});
});

app.get('/deleteproject', (req,res) => {
  res.render('Pages/deleteproject', {title: 'deleteproject'});
});

app.get('/deletemilestone', (req,res) => {
  res.render('Pages/deletemilestone', {title: 'deletemilestone'});
});

app.get('/updateproject', (req,res) => {
  res.render('Pages/updateproject', {title: 'updateproject'});
});

app.get('/updatemilestone', (req,res) => {
  res.render('Pages/updatemilestone', {title: 'updatemilestone'});
});

app.post('/addproject', (req, res) => {
  //Add form (createproject) to DB
  db.collection('projects').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log("Saved to Database")
    res.redirect("/projects")
  })
});

app.post('/delproject', (req, res) => {
  //Delete form (createproject) to DB
  db.collection('projects').deleteOne(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log("Deleted from Database")
    res.redirect("/projects")
  })
});

app.post('/updateproject/:id', (req, res) => {
  var id = req.param.id;
  
  db.collection('projects').find({_id:id}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('Pages/updateproject.ejs', {projects: result})
  });
  console.log(req.param.id);
});

app.post('/updateproject', (req, res) => {
  db.collection('projects').update(
    {_id:req.body._id}, 
    {$set: {projectName: req.body.projectName, 
            projectID: req.body.projectID}}, 
    function(err, result) {
      if (err) return console.log(err)

      console.log("Updated Database")
      res.redirect("/projects")
  })
});

app.post('/addmilestone', (req, res) => {
  //Insert form (createMilestone) from DB
  db.collection('milestones').save(req.body, (err, results) => {
    if (err) return console.log(err)

    console.log("Saved to Database")
    res.redirect("/milestones")
  })
});

app.post('/delmilestone', (req, res) => {
  //Delete form (createmilestone) from DB
  db.collection('milestones').deleteOne(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log("Deleted from Database")
    res.redirect("/milestones")
  })
});

app.post('/updatemilestone/:id', (req, res) => {
  var id = req.param.id;
  
  db.collection('milestones').find({_id:id}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('Pages/updatemilestone.ejs', {milestone: result})
  });

  console.log(req.param.id);
});

app.post('/updatemilestone', (req, res) => {
  db.collection('milestones').update(
    {_id:req.body._id}, 
    {$set: {milestoneName: req.body.milestoneName, 
            milestoneDesc: req.body.milestoneDesc,
            milestoneIntEnd: req.body.milestoneIntEnd,
            milestoneActEnd: req.body.milestoneActEnd,
            milestoneCompleted: req.body.milestoneCompleted}}, 
    function(err, result) {
      if (err) return console.log(err)

      console.log("Updated Database")
      res.redirect("/milestones")
  })
});

app.get('/projects', (req, res) => {
  db.collection('projects').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('Pages/projects.ejs', {projects: result})
  })
})

app.get('/milestones', (req, res) => {
  //Lists all milestones that are incomplete
  db.collection('milestones').find({milestoneCompleted: "0"}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('Pages/milestones.ejs', {milestones: result})
  })
})

app.use(express.static(__dirname + '/public'));

