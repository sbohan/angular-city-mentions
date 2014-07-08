
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key: 'tGjsS6Bx8KuXLhkVgS3kgAfW7',
    consumer_secret: '4owlHrsFCukPqGXyzgryQIumAkFVnp1K1xpiRuxBoQ3bzCHBN1',
    access_token_key: '14567075-DPziD4bI2JIqGAxZItrAlX4Y7gDCGJbjQMfEliT5B',
    access_token_secret: '5aFFu7Wo3xDezW5TU0NwkwlRsJVmxTz0x44u59pOX4Vhb'
});

var LinkedDeque = require("dsjslib").LinkedDeque

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

io.set('log level', 1);
// Socket.io Communication
io.sockets.on('connection', function (socket) {

  socket.emit('send:name', {
    name: 'Shaun'
  });

  setInterval(function() {

    socket.emit('frequency:locations', frequencyData);

    socket.emit('tweets:latest', latestTweets);

  //prod:
  //}, 0.001);
  //dev:
  }, 1000);

});

var towns = [
"london",
"birmingham",
"liverpool",
"leeds",
"manchester",
"coventry",
"hull",
"stoke",
"nottingham",
"plymouth",
"oxford",
"luton",
"portsmouth",
"peterborough",
"dover",
// "reading",
// "derby",
// "dudley",
"newcastle",
"cardiff",
"glasgow",
"edinburgh",
"belfast"
];

var frequencyData = {};
//var lastestTweets = new LinkedDeque(20)
var latestTweets = [];

var MAX_NUMBER_TWEETS = 20;

//Dumb implementation likely that we can optimise this using multi matching regex of all towns then checking which token matched, or something...
var checkForMatch = function(tweet) {
  if(!tweet)
    return;

  tweet = tweet.toLowerCase();
  for(i=0;i<towns.length;i++) {
    if(tweet.indexOf(towns[i]) !== -1) {
      if(!frequencyData.hasOwnProperty(towns[i])){
        frequencyData[towns[i]] = 1;
      }else{
        frequencyData[towns[i]] += 1;
      }
    }
  }
};


twit.stream('filter', {track: towns.join()}, function(stream) {
    stream.on('data', function(data) {

        checkForMatch(data.text);

        if(latestTweets.length >= MAX_NUMBER_TWEETS) {
          latestTweets.shift();
        }

        latestTweets.push(data);

        //determine matched parameter...
        //console.log(util.inspect(data));
        //console.log(frequencyData);
    });
    // Disconnect stream after five seconds
    //setTimeout(stream.destroy, 5000);
});

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
