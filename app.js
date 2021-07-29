const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/users');
const bodyParser = require('body-parser');
// act like middleware
const jsonParser = bodyParser.json();

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

    const data = new User({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password
    });

    data.save().then((result) => {
        jwt.sign({ result }, jwtKey, { expiresIn: "300s" }, (err, token) => {
            res.status(201).json({ token })
        })
    }).catch((err) => console.warn(err));
});

app.post('/login', jsonParser, function (req, res) {
    User.findOne({ email: req.body.email }).then((data) => {
        if (req.body.password == data.password) {
            jwt.sign({ data }, jwtKey, { expiresIn: "300s" }, (err, token) => {
                res.status(200).json({ token })
            })
        } else {
            console.warn("data not matched");
            res.status(500).json("data not matched")
        }
    })
})

app.listen(4000);