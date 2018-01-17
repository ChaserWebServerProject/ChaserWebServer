var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

var User = require('../models/User');
var UserExtend = require('../models/UserExtend');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');
var Company = require('../models/Company');

const {
    getAllUsers,
    getUserById,
    createUser,
    login
} = require('../services/UserService');

/* GET ALL USERS */
router.get('/user/get_all_users', function (req, res, next) {
    getAllUsers()
        .exec()
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

/* GET ONE USER BY ID */
router.get('/user/get_user_by_id/:id', function (req, res, next) {
    getUserById(req.params.id)
        .exec()
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

/* GET MARKED JOBS OF USER BY USER ID */
router.get('/user/get_marked_jobs_of_user_by_user_id/:id', function (req, res, next) {
    getUserById(req.params.id)
        .select('markedJobs')
        .populate({
            path: 'markedJobs',
            populate: {
                path: 'user',
                select: 'company',
                populate: {
                    path: 'company',
                    select: 'companyName'
                }
            }
        })
        .exec()
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// CREATE NEW USER
router.post('/user/create_user', async (req, res, next) => {
    createUser(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

//Login 
router.post('/user/login', async (req, res, next) => {
    login(req)
        .then(resUser => {
            if (resUser) {
                const userIdentity = {
                    id: resUser._id
                }
                jwt.sign({ userIdentity }, 'phai_thanh_cong_phai_giau_co', (err, token) => {
                    if (err) returnres.json({ success: false, err });
                    return res.json({ success: true, token });
                })
            } else {
                return res.json({ success: false });
            }
        })
        .catch(err => res.json({ success: false, err }));
});

//GET USER ID BY TOKEN
router.post('/user/get_user_identity_by_token', verifyToken, async (req, res, next) => {
    jwt.verify(req.token, 'phai_thanh_cong_phai_giau_co', (err, authData) => {
        if (err) return res.json(err);
        res.json(authData);
    })
});

//Verify Token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefine') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    } else {
        res.sendStatus(403);
    }
};

/* UPDATE USER */
router.put('/user/update_user/:id', function (req, res, next) {
    const id = req.params.id;
    const body = req.body;
    User.findByIdAndUpdate(id, body, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            UserExtend.findOneAndUpdate({ user: id }, body)
                .catch(err => res.json({ success: false, err: err }))
                .then(() => {
                    User.findById(id)
                        .populate('userExtend')
                        .then(user => res.json({ success: true, user: user }))
                        .catch(err => res.json({ success: false, err: err }));
                });
        }
    });
});

/* DELETE USER */
router.delete('/user/delete_user/:id', function (req, res, next) {
    const id = req.params.id;
    UserExtend.findOneAndRemove({ user: id }, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            User.findByIdAndRemove(id, async (err) => {
                if (err) return res.json({ success: false, err: err });
                else {
                    const job = await Job.findOne({ user: id })
                        .catch(err => res.json({ success: false, err: err }));
                    JobExtend.findOneAndRemove({ job: job._id })
                        .then(() => {
                            job.remove()
                                .then(() => res.json({ success: true }))
                                .catch(err => res.json({ success: false, err: err }));
                        })
                        .catch(err => res.json({ success: false, err: err }));
                }
            });
            res.json({ success: true });
        }
    });
});

module.exports = router;