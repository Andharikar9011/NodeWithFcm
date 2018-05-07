var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var admin = require("firebase-admin");

var serviceAccount = require("../nodewithfcm-firebase-adminsdk-pbjzf-bb689e449e.json");
var registrationToken = 'cBUJZUNST34:APA91bG51FCwJ5Tmtg7Ggo2Q6MXBL1oJicooNQNYp79t3X1t5O2Fivl9JbEzJ7P16Pms1kXdH9bPop5iH_WaoGLyzfc9y6mzhQohMS5pVQ2euKUhYLPhvv2J4XezCDeA2j6aevo--gBP';
console.log(serviceAccount)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nodewithfcm.firebaseio.com"
});

router.get('/', function (req, res, next) {
    var token = req.query.token;
    var msg_title = req.query.title;
    var msg_body = req.query.message;
    if(token == null) token = registrationToken;
    if(msg_title == null) msg_title = "No title";
    var message = {
        data: {
            success: '1',
            time: new Date().toLocaleDateString()
        },
        notification: {
            title: msg_title,
            body: msg_body
        },
        token: token
    };

    admin.messaging().send(message)
    .then(function(response){
        var result = 'Successfully sent message:' + response;
        res.render('push', { title: 'FCM Push', message: result });
        console.log(result);
    })
    .catch(function(error) {
        var result = 'Error sending message:' + error;
        res.render('push', { title: 'FCM Push', message: result });
        console.log(result);
    });
});

function connAndCreateDb() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: ""
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query("CREATE DATABASE IF NOT EXISTS db_node_with_fcm", function (err, result) {
            if (err) throw err;
            console.log("Database created!");
        });

        con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "db_node_with_fcm"
        });
        var sql = "CREATE TABLE IF NOT EXISTS users (id INTEGER AUTO_INCREMENT PRIMARY KEY, fcm_token VARCHAR(255))";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created!");
        });
    });
}

module.exports = router;