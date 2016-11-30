var mongoose = require('mongoose');
//Config
const dbName = "user";
const crypto = require('crypto');

function crypt(data) {
    return crypto.createHmac('sha256', data)
        .update('love chocolate')
        .digest('hex')
}

function regLike(data) {
    var res = {};
    for (var i in data) {
        try {
            res[i] = new RegExp(data[i], 'i');
        } catch (err) {
            res[i] = data[i];
        }
    }
    return res;
}
/*permission

1 user
2 owner
3 partner
4 autor
5 moderator
6 editor
7 admin

*/
//Filter
//post
function filterPost(data, level) {

    switch (level) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            var filter = {};
            if (data.pseudo) {
                filter['pseudo'] = data.pseudo;
            }
            if (data.password) {
                filter['password'] = crypt(data.password);
            }
            if (data.phone_number) {
                filter['phone_number'] = data.phone_number;
            }
            return filter;
        case 7:
            return data;
        default:
            return {};
    }
}
//put
function filterPut(data, level) {

    switch (level) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            var filter = {};
            if (data.password) {
                filter['password'] = crypt(data.password);
            }
            if (data.phone_number) {
                filter['phone_number'] = data.phone_number;
            }
            return filter;
        case 7:
            return data;
        default:
            return {};
    }
}

var schema = new mongoose.Schema({
    pseudo: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_connection: {
        type: Date,
        default: Date.now
    },
    last_update: {
        type: Date,
        default: Date.now
    },
    numberOfConnection: {
        type: Number,
        default: 0
    },
    last_ip: {
        type: String,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    credit: {
        type: Number,
    },
    mailing: {
        type: Boolean,
    },
});

// login method
schema.statics.login = function(data) {
        if (data.pseudo) {
            return this.findOne({
                pseudo: data.pseudo,
                password: crypt(data.password)
            })
        } else if (data.tel) {
            return this.findOne({
                tel: data.tel,
                password: crypt(data.password)
            })
        }

    }
    //register method
schema.statics.register = function(data) {

    var filterData = filterPost(data, 1);
    var dbObject = new model(filterData);
    return dbObject.save();


};
// Post method
schema.statics.post = function(data, level) {
    if (level >= 7) {
        var filterData = filterPost(data, level);
        var dbObject = new model(filterData);
        return dbObject.save();

    } else {
        return false;
    }
};
// updates methode
schema.statics.put = function(data, level, id) {
    if (level == 2 || level == 7) {
        var filterData = filterPut(data, level);
        filterData['last_update'] = Date.now();
        return this.findByIdAndUpdate(id, filterData);
    }
}
schema.statics.updateDate = function(id) {
    return this.findByIdAndUpdate(id, {
        last_connection: Date.now(),
        $inc: { numberOfConnection: 1 }
    });
}

// get all method
schema.statics.getAll = function(data, level) {
    if (level == 7) {
        var limit = 20;
        if (data.limit) {
            limit = data.limit;
            delete data.limit;
        }
        if (data.sort) {
            var sort = data.sort;
            delete data.sort;
            return this.find(regLike(data)).
            limit(limit).
            sort(sort);
        } else {
            return this.find(regLike(data)).
            limit(limit);
        }

    }
}

// get one method
schema.statics.get = function(data, level) {
    if (level == 2 || level == 7) {
        return this.findById(data);
    }
}

// delete method
schema.statics.remove = function(id, level) {
    if (level == 7) {
        return this.findByIdAndRemove(id);
    }
}

var model = mongoose.model(dbName, schema);
module.exports = model;