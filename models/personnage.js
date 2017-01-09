var mongoose = require('mongoose');
//Config
const dbName = "personnage";


var schema = new mongoose.Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique: true,
    },
    pseudo: {
        type: String,
    },
    level: {
        type: Number,
    }
});
schema.statics.create = function(userId) {

    var dbo = new model({ _user: userId });
    return dbo.save();

};
schema.statics.get = function(userId) {

    return this.find({ _user: userId });

};
var model = mongoose.model(dbName, schema);
module.exports = model;