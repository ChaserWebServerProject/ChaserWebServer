var express = require('express');
var router = express.Router();

var JobType = require('../models/JobType');
var Job = require('../models/Job');

const { getAllJobTypes } = require('../services/JobTypeService');

/* GET ALL JOBTYPES */
router.get('/jobtype/get_all_jobtypes', function (req, res, next) {
    getAllJobTypes()
        .exec()
        .then(jobTypes => res.json(jobTypes))
        .catch(err => res.json(err));
});

/* GET ONE JOBTYPE BY ID */
router.get('/jobtype/get_one_jobtype_by_id/:id', function (req, res, next) {
    JobType.findById(req.params.id, function (err, jobtype) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true, jobtype: jobtype });
    }).populate('jobs');
});


// CREATE NEW JOBTYPE
router.post('/jobtype/create_jobtype', function (req, res, next) {
    JobType.create(req.body, function (err) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true });
    });
});

/* UPDATE JOBTYPE */
router.put('/jobtype/delete_jobtype/:id', function (req, res, next) {
    const id = req.params.id;
    JobType.findByIdAndUpdate(id, req.body, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            JobType.findById(id)
                .then(jobtype => res.json({ success: true, jobtype: jobtype }))
                .catch(err => res.json({ success: false, err: err }));
        }
    });
});

/* DELETE JOBTYPE */
router.delete('/jobtype/delete_jobtype/:id', function (req, res, next) {
    const id = req.params.id;
    JobType.findByIdAndRemove(id, async (err) => {
        if (err) return res.json({ success: false, err: err });
        else {
            const job = await Job.findOne({ jobType: id })
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
});

module.exports = router;