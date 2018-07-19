var async = require('async');

var User = require('../models/User');
var Role = require('../models//Role');

const createRole = (req) => {
    return new Promise((resolve, reject) => {
        const role = new Role(req.body.role);
        role.save()
            .then(() => resolve(true))
            .catch(err => reject(err));
    })
}

module.exports = {
    createRole
}