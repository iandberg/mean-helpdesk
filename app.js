var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var session = require('express-session');



// =-=-=-=-=-=-=-[ database ]=-=-=-=-=-=-=-

require('./database'); //execute the database file

// =-=-=-=-=-=-=-[ session ]=-=-=-=-=-=-=-

app.use(session({secret: "sophie"}));

// =-=-=-=-=-=-=-[ views and static files ]=-=-=-=-=-=-=-

app.use(express.static('public'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

// =-=-=-=-=-=-=-[ routes ]=-=-=-=-=-=-=-


app.get('/', function (req, res) {
    res.render('index',{title: 'Mean Help Desk'});
});

// =-=-=-=-=-=-=-[ RESTful API routes ]=-=-=-=-=-=-=-

var Ticket = require('./models/ticket');
var User = require('./models/user');

app.get('/tickets', function (req, res) {
    console.log(req.session);
    Ticket.findAllRecent(function (err, tickets) { // static method defined in model file
        res.json(tickets);
    });
});

app.get('/tickets/unsolved', function (req, res) { //not in use
    Ticket.findUnsolved(function (err, tickets) {
        res.json(tickets);
    });
});

app.post('/tickets', function (req, res) {
    Ticket.create(req.body, function (err) {
        console.log('ticket saved');
    });
    res.end();
});

app.get('/tickets/:id', function (req, res) {
    Ticket.findOne({_id: req.params.id}, function (err, ticket) {
        res.json(ticket);
    });
});

app.put('/tickets/:id', function (req, res) {
    Ticket.findOneAndUpdate({_id: req.params.id}, req.body, function (err, ticket) {
        console.log('updated ' + ticket.title);
    });
    res.end();
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

app.get('/users', function (req, res) {
    User.find().exec(function (err, users) {
        res.json(users);
    });
});

app.get('/users/:id', function (req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
        res.json(user.name.full); //using a 'virtual' method to combine first and last name
    });
});


app.post('/users', function (req, res) {
    req.body.password = bcrypt.hashSync(req.body.password,3); //encrypt the password (put salt in external file)
    User.create(req.body, function (err) {
        console.log('user saved');
    });
});

app.post('/login', function (req, res) {
    var data = {};
    
    User.findOne({email: req.body.email}, function (err, user) {
        if(user){
            console.log(user.password);
            if(bcrypt.compareSync(req.body.password, user.password)){ //compare submitted pass to user pass
                console.log('logged in!'); //succesful login
//                 if(!req.session.loggedIn){
//                     req.session.loggedIn = true;
//                     req.session.userName = user.name.first;
//                     req.session.userID = user.id;
//                 }
                res.json(user);
            }else{
                console.log('one or both fields is not right');
                data.error = 'one or both fields is not right';
                res.json(data);
            }  
        }else{
            console.log('cannot find user');
            data.error = 'cannot find user';
            res.json(data);
        }
    });
});

// =-=-=-=-=-=-=-[ 404 fallback ]=-=-=-=-=-=-=-

app.use(function (req, res) {
    res.status(404).send("Sorry, can't deal with the request");
});

// =-=-=-=-=-=-=-[ monitor port ]=-=-=-=-=-=-=-

app.listen(3050, function () {
    console.log('listening on port 3050');
});