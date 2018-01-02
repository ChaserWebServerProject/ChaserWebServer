var express = require('express');
var router = express.Router();
var async = require('async');

const { getAllJobs, getOneJobById, createJob, updateJob, deleteJob } = require('../services/JobService');

/* GET ALL JOBS */
router.get('/job/get_all_jobs', (req, res, next) => {
    getAllJobs().exec()
        .then(jobs => res.json(jobs))
        .catch(err => res.json(err));
});

/* GET TEN NEW JOBS */
router.get('/job/get_ten_new_jobs', (req, res, next) => {
    getAllJobs()
        .sort({ dateCreated: 'desc' })
        .exec()
        .then(jobs => {
            var finalResults = jobs.filter((item) => item.jobExtend.deadline >= new Date()).slice(0, 10);
            res.json(finalResults);
        })
        .catch(err => res.json(err));
});

/* GET TEN HURRY JOBS */
router.get('/job/get_ten_hurry_jobs', function (req, res, next) {
    getAllJobs()
        .exec()
        .then(jobs => {
            const start = new Date();
            const end = new Date();
            end.setDate(start.getDate() + 5);
            const finalResults = jobs.filter((item) => item.jobExtend.deadline >= start && item.jobExtend.deadline <= end).slice(0, 10);
            res.json(finalResults);
        })
        .catch(err => res.json(err));
});

/* GET ONE JOB BY ID */
router.get('/job/get_one_job_by_id/:id', function (req, res, next) {
    getOneJobById(req.params.id).exec()
        .then(job => res.json(job))
        .catch(err => res.json(err));
});


// CREATE NEW JOB
router.post('/job/create_job', (req, res, next) => {
    createJob(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

/* UPDATE JOB */
router.put('/job/update_job/:id', function (req, res, next) {
    updateJob(req)
        .then(result => res.json({ success: true, job: result }))
        .catch(err => res.json({ success: false, err: err }));
});

/* DELETE JOB */
router.delete('/job/delete_job/:id', function (req, res, next) {
    deleteJob(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

module.exports = router;