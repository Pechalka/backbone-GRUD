var	express = require('express')
	, app = express()
	, path = require('path');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser()); 
app.use(express.static(path.join(__dirname, 'public') ));

app.use(express.session({ secret: 'zzzzzzz'} ));

var id = 3;
var items = [
		{ name : 'vasa', _id : '1', typeId : '2' },
		{ name : 'peta', _id : '2' , typeId : '2'},
		{ name : 'gala', _id : '3' , typeId : '1'}
	];

app.get('/api/events', function(req, res){
	res.json(items);
});

app.post('/api/events', function(req, res){
	var newItem = req.body;
	newItem._id = ++id;
	items.push(newItem);
	res.json(newItem);	
});

app.put('/api/events/:id',function(req, res){
	var item = req.body;
	var id = req.params["id"];
	for (var i = items.length - 1; i >= 0; i--) {
		if (items[i]._id == id){
			items[i].name = item.name;
			items[i].typeId = item.typeId;
		}
	};

	res.json(item);
});

app.get('/api/events/:id',function(req, res){
	var item;
	var id = req.params["id"];
	for (var i = items.length - 1; i >= 0; i--) {
		if (items[i]._id == id){
			item = items[i];
			break;
		}
	}
	res.json(item);

});
app.delete('/api/events/:id',function(req, res){
	var item = req.body;
	var id = req.params["id"];
	var index = -1;
	for (var i = 0; i < items.length; i++) {
		if (items[i]._id == id)
			index = i;
	};

	items.splice(index, 1)

	res.json(item);
});


app.get('/api/types', function(req, res){
	res.json([{name:"type1", _id:"1"}, {name:"type2", _id:"2"}]);
})

//app.resource('/api/events', db.Event);

app.listen(8080, function(){
  console.log("Express server listening on port %d", '8080');
});