var mongoose = require('mongoose');
var User = require('./user')
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: 'User'},
    description: String
})

module.exports = mongoose.model('Task', taskSchema)