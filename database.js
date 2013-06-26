var db = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

var EventSchema = new Schema({
    name : String,
    typeId: String
});


db.Event = mongoose.model('event', EventSchema);
exports.db = db;