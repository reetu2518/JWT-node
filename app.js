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

app.get('/user', verifyToken, function (req, res) {
    User.find().then((result) => {
        res.status(200).json(result);
    })
})

// middelware function
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        jwt.verify(req.token, jwtKey, (err, authData) => {
            if (err) {
                res.json({ result: err });
            } else {
                next();
            }
        })
    } else {
        res.send({ "result": "token not provided" });
    }
}

// registeration api
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

// login api
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