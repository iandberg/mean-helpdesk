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
    Ticket.create(req.body, function (err, ticket) {
        console.log('ticket saved');
        res.json(ticket);
    });
});

app.get('/tickets/:id', function (req, res) {
    Ticket.findOne({_id: req.params.id}, function (err, ticket) {
        res.json(ticket);
    });
});

app.put('/ticket/:id/comment', function (req, res) { //add a comment to ticket
    Ticket.findOneAndUpdate({_id: req.params.id}, {$push: {comments: req.body}}, function (err, ticket) {
        console.log('ticket updated');
    });
    res.end();
});

app.put('/tickets/:id', function (req, res) {
    Ticket.findOneAndUpdate({_id: req.params.id}, req.body, function (err, ticket) {
        console.log('updated "' + ticket.title +'"');
    });
    res.end();
});

app.delete('/tickets/:id', function (req, res) {
    Ticket.findOneAndRemove({_id: req.params.id}, function (err, ticket) {
        res.json(ticket);
    });
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

app.get('/users', function (req, res) {
    User.find().exec(function (err, users) {
        res.json(users);
    });
});

app.get('/users/:id', function (req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
        res.json(user);
    });
});


app.post('/users', function (req, res) {
    req.body.password = bcrypt.hashSync(req.body.password,3); 
    User.create(req.body, function (err) {
        console.log('user saved');
    });
});

app.put('/users/:id', function (req, res) {
    req.body.password = bcrypt.hashSync(req.body.password,3);
    User.findOneAndUpdate({_id: req.params.id}, req.body, function (err, user) {
        console.log('updated');
        res.json(user);
    });
});

app.post('/login', function (req, res) {
    var data = {};
    
    User.findOne({email: req.body.email}, function (err, user) {
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){ //compare submitted pass to user pass
                console.log('logged in!'); //succesful login
                if(!req.session.loggedIn){
                    req.session.loggedIn = true;
                    req.session.userName = user.name.first;
                    req.session.userID = user.id;
                }
                res.json(user);
            }else{
                data.error = 'one or both fields is not right';
                res.json(data);
            }  
        }else{
            data.error = 'cannot find user';
            res.json(data);
        }
    });
});

app.get('/user/log_status', function (req, res) {
    res.json(req.session);
})

app.get('/user/end_session', function (req, res) {
    req.session.destroy(function (err) {
        res.json(err);
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