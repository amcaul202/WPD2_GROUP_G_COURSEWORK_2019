const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended:false});
const MongoClient = require('mongodb').MongoClient;
const path = require("path");
const bcrypt = require('bcrypt');

var url = "mongodb://localhost:27017/userdb";

//Connect to DB
MongoClient.connect(url, function(err, client) {
    if (err) return console.log(err)
    db = client.db('userdb')
});

module.exports = (function(app){
    app.set('views', path.join(__dirname, '/public'));

    app.get('/home', (req, res) => {
        res.render("Pages/home", {title: "home"})
    });
      
    app.get('/login', (req, res) => {
        res.render("Pages/login", {title: "login"})
    });

    app.get('/register', (req, res) => {
        res.render("Pages/register", {title: "register"})
    });

    app.get('/completeuser', (req, res) => {
        res.render("Pages/completeuser", {title: "completeuser"})
    });

    app.post('/demo',urlencodedParser,function(req,res){
        MongoClient.connect(url, function(err){
                db.collection('user').findOne({name:req.body.name}, function(err, user) {

                
                // Code to De-encryt Password [Not Functioning]
                // bcrypt.compare(req.body.pass, user.pass, function(err, res, passCorrect){
                //         var passCorrect = res
                //         return passCorrect;
                // })
                    
                    var passCorrect = passCorrect;
                    console.log();

                    if(user === null) {
                        res.end("Username Invalid");
                    } else if (user.name === req.body.name && passCorrect === true){
                        res.render('Pages/completeuser', {profileData: user});
                    } else {
                        console.log("Username/Password Incorrect!");
                        res.end("Login Invalid");
                    }
                
            });
        });
    });


    app.post('/register', urlencodedParser, function(req, res){
            const salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.pass, salt);
            console.log(hash);
            req.body.pass = hash;
            var obj = JSON.stringify(req.body);
            console.log("Final Registration Data: " + obj);
            var jsonObj = JSON.parse(obj);
            
            MongoClient.connect(url, function(err){
                db.collection('user').save(jsonObj, function(err, req){
                    if (err) return console.log(err);
                    console.log("1 Document Inserted!");
                });
                res.render("Pages/completeuser", {profileData: req.body});
        })
    });
});