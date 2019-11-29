// Create the Express app
const express = require("express");
const app = express();

// Enable JSON data in the HTTP request body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Include HTTP status codes (like 404 Not Found)
const HttpStatus = require('http-status-codes');

var cors = require('cors');
app.use(cors());

//var axios = require('axios');

// Enable static access to the "/public" folder
app.use(express.static('../public'));

// The userRepo holds the user and user validation logic
const userRepo = require('./user-repo');

app.post('/login', (req, res) => {
    let user = userRepo.find(
        req.body.username, req.body.password, req.body.account);
    if (!user)
        return res.status(HttpStatus.NOT_FOUND).json(
            {errorMsg: "Invalid username / password / Metamask Account"});
    return res.json({buyerSellerType: user.buyerSellerType});
});

app.post('/register', (req, res) => {
    userRepo.addUser(
        req.body.username, req.body.password, req.body.account, req.body.buyerSellerType,
        function success(user) {
            return res.json({"msg": "User successfully registered"});
        },
        function error(errorMsg) {
            return res.status(HttpStatus.CONFLICT).json({errorMsg});
        }
    );
});

app.get('/getAllSellers', (req, res) => {
    let sellers = userRepo.getAllSellers();
    if (!sellers)
        return res.status(HttpStatus.NOT_FOUND).json(
            {errorMsg: "No Sellers found"});
    return res.json({sellers: sellers});
});

var listeningPort = 8888;
var listeningHost = "localhost";

var server = app.listen(listeningPort, function () {
    var host = server.address().address
    var port = server.address().port

    if (host == "::") {
        host = listeningHost;
    }

    console.log("CarMarketPlace Server listening at http://%s:%s", host, port);
});
