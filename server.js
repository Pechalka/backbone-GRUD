var resource = require('./Resource');

var	express = require('express')
	, app = express()
	, path = require('path');

var db = require('./database').db;	


app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser()); 
app.use(express.static(path.join(__dirname, 'public') ));

app.use(express.session({ secret: 'zzzzzzz'} ));


resource(app, '/api/events', db.Event);

app.get('/api/types', function(req, res){
	res.json([{name:"type1", _id:"1"}, {name:"type2", _id:"2"}]);
})

//app.resource('/api/events', db.Event);

app.listen(3000, function(){
  console.log("Express server listening on port %d", '3000');
});