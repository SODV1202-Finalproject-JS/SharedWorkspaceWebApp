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
    res.send("Welcome to register! Please use http://localhost:3005/signup to open a registration form");
});

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/pages/" + "signup.html");
});

app.get('/addworkspace', function (req, res) {
    res.sendFile(__dirname + "/pages/" + "addworkspace.html");
});

app.get('/users', function (req, res) {
    res.sendFile(__dirname + "/" + "question3.html");
});

app.get('/showAllUsers', function (req, res) {
    res.send(mydata);
});


app.post('/user', urlencodedParser, Newuser);

function Newuser(req, res) {
    response = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password
    }
    if (!response.name || !response.phone || !response.email || !response.role || !response.password) {
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
            role: req.body.role,
            password: req.body.password,
            logged: false
        });

        let data = JSON.stringify(obj, null, 2);
        fs.writeFile('user_file.json', data, finished);
        console.log('user_file.JSON is updated')

        function finished(err) {
            reply = {
                name: req.body.name,
                phone: req.body.phone,
                role: req.body.role,
                password: req.body.password,
                logged: false,
                status: "success",
                msg: "thank you"
            }
            res.send(reply);
            console.log(reply);
        }
    }
}


/***** Add Workspace ******/

app.post('/worksent', urlencodedParser, Newwork);

function Newwork(req, res) {
    response = {
        name: req.body.name,
        building_id: req.body.building_id,
        workspace_id: req.body.workspace_id
    }
    if (!response.name || !response.building_id || !response.workspace_id) {
        reply = {
            msg: "Please complete the form before you submit it"
        }
        res.send(reply);
        console.log(reply)
    } else {

        obj.user[0].push({
            name: req.body.name,
            building_id: req.body.building_id,
            workspace_id: req.body.workspace_id,
            logged: false
        });

        let data = JSON.stringify(obj, null, 2);
        fs.writeFile('user_file.json', data, finished);
        console.log('user_file.JSON is updated')

        function finished(err) {
            reply = {
                name: req.body.name,
                building_id: req.body.building_id,
                workspace_id: req.body.workspace_id,
                logged: false,
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