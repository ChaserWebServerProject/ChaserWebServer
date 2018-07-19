var async = require('async');

var User = require('../models/User');
var UserExtend = require('../models/UserExtend');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');
var Company = require('../models/Company');

const getAllUsers = () => {
    return User.find().populate('userExtend');
}

const getUserById = (id) => {
    return User.findById(id).populate('userExtend');
}

const createUser = (req) => {
    return new Promise((resolve, reject) => {
        const user = new User(req.body.user);
        const userExtend = new UserExtend(req.body.user_extend);
        user.userExtend = userExtend._id;
        userExtend.user = user._id;

        async.waterfall([
            (callback) => {
                user.save()
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                userExtend.save()
                    .then(() => callback(null))
                    .catch(async (err) => {
                        await User.remove(user)
                            .catch(err => reject(err));
                        return reject(err);
                    });
            },
            (callback) => {
                if (user.company) {
                    Company.findByIdAndUpdate(user.company, { $push: { users: user._id } })
                        .then(() => callback(null))
                        .catch((err) => reject(err));
                } else {
                    return callback(null);
                }
            }
        ], (err, result) => {
            if (err) return reject(err);
            resolve(true);
        });

    });
}

const getUserByUserNameAndPassword = (req) => {
    return User.findOne({ userName: req.body.userName, passwordHash: req.body.passwordHash });
}

const login = (req) => {
    return new Promise((resolve, reject) => {
        getUserByUserNameAndPassword(req)
        .populate('userRole')
            .exec()
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    login,
    getUserByUserNameAndPassword
}