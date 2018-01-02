var express = require('express');
var router = express.Router();

var User = require('../models/User');
var UserExtend = require('../models/UserExtend');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');
var Company = require('../models/Company');


/* GET ALL USERS */
router.get('/user/get_all_users', function (req, res, next) {
    User.find(function (err, users) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true, users: users });
    });
});

/* GET ONE USER BY ID */
router.get('/user/get_one_user_by_id/:id', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true, user: user });
    }).populate('userExtend');
});


// CREATE NEW USER
router.post('/user/create_user', async (req, res, next) => {
    const reqUser = new User(req.body.user);
    const reqUserExtend = new UserExtend(req.body.user_extend);
    const resUser = await reqUser.save().catch(err => res.json({ success: false, err: err }));
    reqUserExtend.user = resUser;
    const resUserExtend = await reqUserExtend.save().catch(err => {
        resUser.remove()
            .catch(err => res.json({ success: false, err: err }));
        return res.json({ success: false, err: err });
    });
    resUser.userExtend = resUserExtend;
    resUser.save().then(resU => {
        if (req.body.user.company.trim()) {
            Company.findByIdAndUpdate(req.body.user.company, { $push: { users: resUser.id } })
                .then(() => res.json({ success: true }))
                .catch(err => res.json({ success: false, err: err }));
        } else {
            res.json({ success: true });
        }
    })
        .catch(err => { res.json({ success: false, err: err }) });
});

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