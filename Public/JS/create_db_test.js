const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/";
const schema = mongoose.Schema;


const userSchema = new schema({
    name: String,
    pass: String,
    aoi: String,
    phone: String,
    email: String,
    education: String,
});

const user = new mongoose.model('User', userSchema);

MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    var dbo = db.db("userdb");
    dbo.createCollection("user", function(err, res){
        if (err) console.log(err);
        console.log(dbo + "Collection Created")
    });
});

module.exports = user;