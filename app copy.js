const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/users');
const bodyParser = require('body-parser');
// act like middleware
const jsonParser = bodyParser.json();
var crypto = require('crypto');
let key = "password";
let algo = 'aes256';

// JWT
const jwt = require('jsonwebtoken');
const jwtKey = "jwt";

mongoose.connect("mongodb+srv://mongo_user:0W5JrhO8PEzmWRNg@cluster0.ptwwm.mongodb.net/node_mongo?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.warn("connected");
});

// app.get('/', function (req, res) {
//     res.end("hello");
// })

app.post('/register', jsonParser, function (req, res) {
    var cipher = crypto.createCipheriv(algo, key);
    var cipher = crypto.createCipher(algo, key);
    var encrypted = cipher.update(req.body.password, 'utf8', 'hex');
    +cipher.final('hex');
    
    const data = new User({
        _id : new mongoose.Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password
        // password: encrypted
    });

    data.save().then((result) => {
        // res.status(201).json(result)
        jwt.sign({result}, jwtKey, {expiresIn:"300s"}, (err, token)=>{
            res.status(201).json({token})
        })
    }).catch((err) => console.warn(err));
})

app.listen(4000);