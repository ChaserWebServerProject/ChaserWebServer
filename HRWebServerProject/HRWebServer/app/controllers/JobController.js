var express = require('express');
var router = express.Router();
var async = require('async');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');
const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
} = require('../services/JobService');
const {
    convertDateToCompare
} = require('../../util/Util');

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
            let toDay = new Date();
            let deadlineDate;
            const finalResults = jobs.filter((item) => {
                //convert to date. Compare two date.
                toDay = convertDateToCompare(toDay);
                deadlineDate = convertDateToCompare(item.jobExtend.deadline);
                return deadlineDate.getTime() >= toDay.getTime();
            }).slice(0, 10);
            res.json(finalResults);
        })
        .catch(err => res.json(err));
});

/* GET TEN HURRY JOBS */
router.get('/job/get_ten_hurry_jobs', function (req, res, next) {
    getAllJobs()
        .exec()
        .then(jobs => {
            let start = new Date();
            let end = new Date();
            end.setDate(start.getDate() + 5);
            let deadlineDate;
            const finalResults = jobs.filter((item) => {
                //convert date to compare. Compare date
                start = convertDateToCompare(start);
                end = convertDateToCompare(end);
                deadlineDate = convertDateToCompare(item.jobExtend.deadline);
                return deadlineDate.getTime() >= start.getTime() && deadlineDate.getTime() <= end.getTime();
            }).slice(0, 10);
            res.json(finalResults);
        })
        .catch(err => res.json(err));
});

/* GET ONE JOB BY ID */
router.get('/job/get_job_by_id/:id', function (req, res, next) {
    getJobById(req.params.id).exec()
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