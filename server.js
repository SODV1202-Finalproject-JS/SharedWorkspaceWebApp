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

app.use(express.static('pages'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Welcome to register! Please use http://localhost:3005/signup to open a registration form");
});

//Signup area -------

app.get('/signup', function (req, res) {
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/home.html");
    } else {
        res.sendFile(__dirname + "/pages/" + "signup.html");
    }
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
        if(response.role == "owner"){
            obj.user.push({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                role: req.body.role,
                workspaces: [],
                password: req.body.password
            });
        } else {
            obj.user.push({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                role: req.body.role,
                contracts: [],
                password: req.body.password
            });
        }

        let data = JSON.stringify(obj, null, 2);
        fs.writeFile('user_file.json', data, finished);
        console.log('user_file.JSON is updated')

        function finished(err) {
            reply = {
                name: req.body.name,
                phone: req.body.phone,
                role: req.body.role,
                password: req.body.password,
                status: "success",
                msg: "thank you"
            }
            console.log(reply);
        }
    }
    res.redirect("http://localhost:3005/home");
}

//End signup area --------

//Login area ----------------
const userAuth = {
    userLogged: false,
    userID: "",
    userName: "",
    userEmail: "",
    userRole: ""
};

//Checks if the user is logged in
function isLoggedIn(){
    return userAuth.userLogged;
}

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/pages/login.html");
});

app.post('/login',  (req, res) => {
    let ipnutEmail = req.body.email;
    let inputPassword = req.body.password;

    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
    
    const loginResponse = {
        success: false,
        message: ''
    };
    if(ipnutEmail && inputPassword) {
        for(let i = 0; i < obj.user.length; i++){
            if(obj.user[i].email == ipnutEmail && obj.user[i].password == inputPassword){
                
                //Auth
                userAuth.userLogged = true;
                userAuth.userID = i;
                userAuth.userName = obj.user[i].name;
                userAuth.userEmail = obj.user[i].email;
                userAuth.userRole = obj.user[i].role;
                
                loginResponse.success = true;
                loginResponse.message = 'Login success';

                res.status(200).json(loginResponse);
                break;
            }
        }
        if(!loginResponse.success){

            loginResponse.message = 'User not found';

            res.status(404).json(loginResponse);
        }
    } else {
        loginResponse.message = 'Empty input area';

        res.status(404).json(loginResponse);
    }
})

//End login area ----------

//Auth area -----------
app.get('/auth', function(req, res) {
    res.send(userAuth);
})
//End Auth area --------

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
    if(isLoggedIn()){
        //Logout
        userAuth.userLogged = false;
        userAuth.userName = "";
        userAuth.userEmail = "";
        userAuth.userRole = "";
        
        res.redirect("http://localhost:3005/login");
    } else {
        res.redirect("http://localhost:3005/login");
    }
})
//End logout area -------

//Add workspace area ---------
app.get('/addworkspace', function (req, res) {
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/" + "addworkspace.html");
    } else {
        res.redirect("http://localhost:3005/login");
    }
});

app.post('/worksent', urlencodedParser, Newwork);

function Newwork(req, res) {
    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
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
        obj.user[userAuth.userID].workspaces.push({
            name: req.body.name,
            building_id: req.body.building_id,
            workspace_id: req.body.workspace_id,
            address: req.body.address,
            neighborhood: req.body.neighborhood,
            size: req.body.size,
            garage: req.body.garage,
            transit: req.body.transit
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
                status: "success",
                msg: "thank you"
            }
            console.log(reply);
        }
    }
    res.redirect("http://localhost:3005/addworkspace");
}
//End add workspace area ---------



var server = app.listen(3005, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://localhost:3005")
})
