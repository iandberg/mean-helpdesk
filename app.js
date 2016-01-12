var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// =-=-=-=-=-=-=-[ database ]=-=-=-=-=-=-=-

require('./database'); //execute the database file

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

app.get('/tickets', function (req, res) { //for testing
    Ticket.find(function (err, tickets) {
        res.json(tickets);
    });
});

app.post('/tickets', function (req, res) {
    console.log(req.body);
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
    console.log(req.body);
    Ticket.findOneAndUpdate({_id: req.params.id}, req.body, function (err, ticket) {
        console.log('updated ' + ticket.title);
    });
    res.end();
});


// =-=-=-=-=-=-=-[ 404 fallback ]=-=-=-=-=-=-=-

app.use(function (req, res) {
    res.status(404).send("Sorry, can't deal with the request");
});

// =-=-=-=-=-=-=-[ monitor port ]=-=-=-=-=-=-=-

app.listen(3050, function () {
    console.log('listening on port 3050');
});