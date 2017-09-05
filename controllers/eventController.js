var events = require('../database/events'),
  getNextId = require('./getNextId'),
  url = require('url');

var nextId = getNextId(events);

exports.getEvents = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(events);
}

exports.getEvent = function(req, res) {
  var event = events.find(event => event.id === +req.params.eventId);
  res.header("Access-Control-Allow-Origin", "*");
  res.send(event);
}

exports.searchSessions = function(req, res) {
	var term = req.query.search.toLowerCase();
  var results = [];
  events.forEach(event => {
    var matchingSessions = event.sessions.filter(session => session.name.toLowerCase().indexOf(term) > -1)
    matchingSessions = matchingSessions.map(session => {
      session.eventId = event.id;
      return session;
    })
    results = results.concat(matchingSessions);
  })
  res.header("Access-Control-Allow-Origin", "*");
  res.send(results);
}

exports.preVoter = function(req, res) {
  var event = req.body;

  event.id = 999;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.header('Access-Control-Allow-Credentials', true);
  res.send(event);
}

exports.deleteVoter = function(req, res) {
  var voterId = req.params.voterId,
      sessionId = parseInt(req.params.sessionId),
      eventId = parseInt(req.params.eventId);

  var session = events.find(event => event.id === eventId)
    .sessions.find(session => session.id === sessionId)
    
  session.voters = session.voters.filter(voter => voter !== voterId);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.header('Access-Control-Allow-Credentials', true);
  res.send(session);
}

exports.addVoter = function(req, res) {
  var voterId = req.params.voterId,
      sessionId = parseInt(req.params.sessionId),
      eventId = parseInt(req.params.eventId);

  var event = events.find(event => event.id === eventId)
  var session = event.sessions.find(session => session.id === sessionId)
    
  session.voters.push(voterId);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Credentials', true);
  res.send(session);
}

exports.preSaveEvent = function(req, res) {
  var event = req.body;

  event.id = 999;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.header('Access-Control-Allow-Credentials', true);
  res.send(event);
}

exports.saveEvent = function(req, res) {
  var event = req.body;
  
  if (event.id) {
    var index = events.findIndex(e => e.id === event.id)
    events[index] = event
  } else {
    event.id = nextId;
    nextId++;
    event.sessions = [];
    events.push(event);
  }
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.header('Access-Control-Allow-Credentials', true);
//  res.header([{"Access-Control-Allow-Origin": "*"}, {'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'}])
  res.send(event);
  res.end(); 
}


