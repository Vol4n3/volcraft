var mongoose = require('mongoose');
//Config
const dbName = "message";


var schema = new mongoose.Schema({
    pseudo: {
        type: String,
    },
    message: {
        type: String,
    },
    date: {
        type: Date,
    },
    msgClass: {

    }

});

// add a message
schema.statics.add = function(data) {
    var dbObject = new model(data);
    return dbObject.save();

};

// get lasted message
schema.statics.getLastest = function(date) {
    var lastedDate = date || Date.now()
    return this.find({ date: { $lte: lastedDate } }).sort('-date').limit(50);
}

// delete message
schema.statics.remove = function(id, level) {
    if (level == 7) {
        return this.findByIdAndRemove(id);
    }
}

var model = mongoose.model(dbName, schema);
module.exports = model;