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

//Login area ----------------

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/pages/login.html");
});

app.post('/auth', urlencodedParser,  (req, res) => {
    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
    let email = req.body.email;
    let password = req.body.password;
    let loginResponse;
    if(email && password) {
        for(let i = 0; i < obj.user.length; i++){
            if(obj.user[i].email == email && obj.user[i].password == password){
                obj.user[i].logged = true;
                let updatedData = JSON.stringify(obj, null, 2);
                fs.writeFile('user_file.json', updatedData, ()=>{
                    console.log("Success!")
                });
                res.redirect('http://localhost:3005/home');
                loginResponse = true;
                break;
            }
            loginResponse = false;
        }
        if(!loginResponse){
            res.send(__dirname + "/pages/loginError.html");
            res.end();
        }
    } else {
        res.send(__dirname + "/pages/loginError.html");
        res.end();
    }
})

//End login area ----------

//Checks if the user is logged in --------
function isLoggedIn(){
    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
    for(let i = 0; i < obj.user.length; i++){
        if(obj.user[i].logged == true){
            loginResponse = true;
            break;
        }
        loginResponse = false;
    }
    return loginResponse;
}

//Home page -----------
app.get('/home', function (req, res) {
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/home.html");
    } else {
        res.redirect("http://localhost:3005/login");
    }
});


//End home page -----------

//Logout area ------
app.post('/logout', (req, res) => {
    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
     for(let i = 0; i < obj.user.length; i++){
        if(obj.user[i].logged == true){
            obj.user[i].logged = false;
            let updatedData = JSON.stringify(obj, null, 2);
            fs.writeFile('user_file.json', updatedData, ()=>{
                console.log("Success!")
            });
            res.redirect('http://localhost:3005/login');
            break;
        }
    }
})
//End logout area -------
app.get('/addworkspace', function (req, res) {
    res.sendFile(__dirname + "/pages/" + "addworkspace.html");
});

app.get('/users', function (req, res) {
    res.sendFile(__dirname + "/" + "question3.html");
});

app.get('/showAllUsers', function (req, res) {
    const allUsers = fs.readFileSync('user_file.json', 'utf8');
    res.send(allUsers);
});


app.post('/worksent', urlencodedParser, Newwork);

function Newwork(req, res) {
    response = {
        name: req.body.name,
        building_id: req.body.building_id,
        workspace_id: req.body.workspace_id,
        address: req.body.address,
        neighborhood: req.body.neighborhood,
        size: req.body.size,
        garage: req.body.garage,
        transit: req.body.transit
    }
    if (!response.name || !response.building_id || !response.workspace_id || !response.address || !response.neighborhood || !response.size || !response.garage || !response.transit) {
        reply = {
            msg: "Please complete the form before you submit it"
        }
        res.send(reply);
        console.log(reply)
    } else {

        obj.user.push({
            name: req.body.name,
            building_id: req.body.building_id,
            workspace_id: req.body.workspace_id,
            address: req.body.address,
            neighborhood: req.body.neighborhood,
            size: req.body.size,
            garage: req.body.garage,
            transit: req.body.transit,
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
                address: req.body.address,
                neighborhood: req.body.neighborhood,
                size: req.body.size,
                garage: req.body.garage,
                transit: req.body.transit,
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