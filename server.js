var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
var exists = fs.existsSync('user_file.json');
if (exists) {
    console.log('loading user file');
    var mydata = fs.readFileSync('user_file.json', 'utf8');

    obj = JSON.parse(mydata);
} else {


    console.log('Created new object')
    var obj = {
        user: []
    };
}

app.get('/', function (req, res) {
    res.send("Welcom to register!   Please use http://localhost:3005/signup  to open a registration form");
});
app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/" + "question2.html");
});

app.get('/users', function (req, res) {
    res.sendFile(__dirname + "/" + "question3.html");
});

app.post('/user', urlencodedParser, Newuser);


function Newuser(req, res) {
    response = {
        fn: req.body.name,
        ln: req.body.phone,
        fn: req.body.email,
        ln: req.body.registrationType,
        ln: req.body.password
    }
    if (!response.fn || !response.ln) {
        reply = {
            msg: "Please complete the form before you submit it"
        }
        res.send(reply);
        console.log(reply)
    } else {

        obj.user.push({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            registrationType: req.body.registrationType,
            password: req.body.password
        });

        let data = JSON.stringify(obj, null, 2);
        fs.writeFile('user_file.json', data, finished);
        console.log('user_file.JSON is updated')

        function finished(err) {
            reply = {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                registrationType: req.body.registrationType,
                password: req.body.password,
                status: "success",
                msg: "thank you"
            }
            res.send(reply);
            console.log(reply);
        }
    }
}

var server = app.listen(3005, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://localhost:3005")
})