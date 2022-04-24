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

//Signup area -------

app.get('/signup', function (req, res) {
    if(isLoggedIn()){
        res.redirect("http://localhost:3005/home");
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
                userID: (obj.user.length + 1),
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                role: req.body.role,
                workspaces: [],
                password: req.body.password
            });
        } else {
            obj.user.push({
                userID: (obj.user.length + 1),
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                role: req.body.role,
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

app.get('/login', function (req, res) {
    if(isLoggedIn()){
        res.redirect("http://localhost:3005/home");
    } else {
        res.sendFile(__dirname + "/pages/login.html");
    }
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
                userAuth.userID = obj.user[i].userID;
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

//Workspace list area --------
app.get('/workspacelist', function (req, res) {
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/workspacelist.html");
    } else {
        res.redirect("http://localhost:3005/login");
    }
});

app.get('/getworkspacelist', function (req, res) {
    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
    res.send(obj.user[userAuth.userID - 1].workspaces);
});

app.delete('/deleteworkspace', function (req, res) {
    const workspaceIndex = req.body.index;
    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
    obj.user[userAuth.userID - 1].workspaces.splice(workspaceIndex, 1);

    let data = JSON.stringify(obj);
    fs.writeFile('user_file.json', data, () => {

        console.log('user_file.JSON is updated');
    
        res.send({
            message: "Workspace deleted successfully!"
        })
    });

});
//End workspace list area --------

//Filtered workspace list area --------
app.get('/filteredworkspace', function (req, res) {
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/filteredworkspace.html");
    } else {
        res.redirect("http://localhost:3005/login");
    }
});
//Filtered workspace list area --------

//Add workspace area ---------
app.get('/addworkspace', function (req, res) {
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/" + "addworkspace.html");
    } else {
        res.redirect("http://localhost:3005/login");
    }
});

app.post('/workspacesent', (req, res) => {
    const mydata = fs.readFileSync('user_file.json', 'utf8');
    obj = JSON.parse(mydata);
    response = {
        name: req.body.name,
        workspace_id: req.body.workspace_id,
        address: req.body.address,
        neighborhood: req.body.neighborhood,
        size: req.body.size,
        garage: req.body.garage,
        transit: req.body.transit,
        type: req.body.type,
        price: req.body.price,
        smoke: req.body.smoke,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate
    }
    if (!response.name || !response.workspace_id || !response.address || !response.neighborhood || !response.size || !response.garage || !response.transit || !response.type || !response.price || !response.smoke || !response.fromDate || !response.toDate)  {
        res.send({
            success: false,
            message: "Workspace not added!"
        });
    } else {
        obj.user[userAuth.userID - 1].workspaces.push({
            name: req.body.name,
            workspace_id: req.body.workspace_id,
            address: req.body.address,
            neighborhood: req.body.neighborhood,
            size: req.body.size,
            garage: req.body.garage,
            transit: req.body.transit,
            type: req.body.workspacetype,
            price: req.body.price,
            smoke: req.body.smoke,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate
        });

        let data = JSON.stringify(obj, null, 2);
        fs.writeFile('user_file.json', data, finished);
        console.log('user_file.JSON is updated');

        function finished(err) {
            reply = {
                name: req.body.name,
                workspace_id: req.body.workspace_id,
                address: req.body.address,
                neighborhood: req.body.neighborhood,
                size: req.body.size,
                garage: req.body.garage,
                transit: req.body.transit,
                type: req.body.workspacetype,
                price: req.body.price,
                smoke: req.body.smoke,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                status: "success",
                msg: "thank you"
            }
            console.log(reply);
        }
        res.send({
            success: true,
            message: "Workspace added successfully!"
        });
    }
});

//End add workspace area ---------

//Search workspace area --------
app.get('/searchworkspace', function (req, res) {
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/" + "searchworkspace.html");
    } else {
        res.redirect("http://localhost:3005/login");
    }
});

const usedFilter ={
    filter: {}
}

const filtered = {
    workspaces: []
}

app.post('/filter', function (req, res){
    if(isLoggedIn()){
        usedFilter.filter = req.body;
        const mydata = fs.readFileSync('user_file.json', 'utf8');
        obj = JSON.parse(mydata);
        const allWorkspaces = [];
        obj.user.forEach(element => {
            if(element.role == "owner"){
                element.workspaces.forEach(workspace => {
                    allWorkspaces.push(workspace);
                })
            }
        });
        filtered.workspaces = allWorkspaces.filter((item) =>{
            for(let key in usedFilter.filter){
                if(item[key] === undefined || item[key] != usedFilter.filter[key]){
                    return false;
                }
                return true;
            }
        });
        const filterResponse = {
            success: (filtered.workspaces.length < 1) ? false :  true,
            message: (filtered.workspaces.length < 1) ?  "No workspace found!" : "Workspaces found!" 
        }
        res.send(filterResponse);
    } else {
        res.redirect("http://localhost:3005/login");
    }
});

app.get('/getfilteredworkspaces', function (req, res){
    if(isLoggedIn()){
        res.send(filtered.workspaces);
    } else {
        res.redirect("http://localhost:3005/login");
    }
})

app.get('/filteredworkspace', function(req, res){
    if(isLoggedIn()){
        res.sendFile(__dirname + "/pages/" + "filteredworkspace.html");
    } else {
        res.redirect("http://localhost:3005/login");
    }
})
//End search workspace area --------

var server = app.listen(3005, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("http://localhost:3005/login")
})
