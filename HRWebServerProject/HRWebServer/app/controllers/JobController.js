var express = require('express');
var router = express.Router();
var async = require('async');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');
const {
    getAllJobs, getJobById, createJob, updateJob, deleteJob,
    filterJobByJobTypeAndProvinceOrderId, filterJobByJobTypeOrderId,
    filterJobByProvinceOrderId, filterJobBySearchContent, unJoinFromJob,
    increase_views, markJob, unMarkJob, joinToJob, filterJoinedUsersByAmount
} = require('../services/JobService');
const {
    convertDateToCompare
} = require('../../util/Util');

/* GET ALL JOBS */
router.get('/job/get_all_jobs', (req, res, next) => {
    getAllJobs()
        .exec()
        .then(jobs => res.json(jobs))
        .catch(err => res.json(err));
});

/* GET JOINED USERS BY AMOUNT */
router.get('/job/get_joined_users_by_amount/:id/:amount', (req, res, next) => {
    filterJoinedUsersByAmount(req)
        .then(joinedAmount => res.json(joinedAmount))
        .catch(err => res.json(err));
});

/* GET ALL JOBS FOR JOB GRID */
router.get('/job/get_all_jobs_for_job_grid', (req, res, next) => {
    getAllJobs()
        .sort({ dateCreated: 'desc' })
        .exec()
        .then(jobs => {
            let finalResults = JSON.parse(JSON.stringify(jobs));
            finalResults = finalResults.map(job => {
                job.deadline = job.jobExtend.deadline;
                return job;
            });
            res.json(finalResults)
        })
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

/* GET JOB BY JOBTYPE ORDER ID */
/* MOBILE APP */
router.get('/job/get_job_by_jobtype_orderid/:orderId', function (req, res, next) {
    getAllJobs()
        .sort({ dateCreated: 'desc' })
        .select('jobName orderId dateCreated')
        .exec()
        .then(jobs => {
            const orderId = req.params.orderId;
            const finalResults = filterJobByJobTypeOrderId(jobs, orderId);
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

/* SEARCH JOB BY SEARCH URL QUERIES USE POST METHOD */
router.post('/job/search_jobs_by_url_queries', function (req, res, next) {
    getAllJobs()
        .exec()
        .then(jobs => {
            const params = req.body;
            const { jobType, province, name } = params;
            const searchName = name ? name.trim() : '';
            let finalResults = [];
            if (province) {
                if (jobType) {
                    finalResults = filterJobByJobTypeAndProvinceOrderId(jobs, jobType, province);
                    finalResults = filterJobBySearchContent(finalResults, searchName);
                } else {
                    finalResults = filterJobByProvinceOrderId(jobs, province);
                    finalResults = filterJobBySearchContent(finalResults, searchName);
                }
            } else {
                if (jobType) {
                    finalResults = filterJobByJobTypeOrderId(jobs, jobType);
                    finalResults = filterJobBySearchContent(finalResults, searchName);
                } else {
                    finalResults = filterJobBySearchContent(jobs, searchName);
                }
            }
            return res.json(finalResults);
        })
        .catch(err => res.json(err));
});

// CREATE NEW JOB
router.post('/job/create_job', (req, res, next) => {
    createJob(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

/* INCREASE VIEWS OF JOB */
router.put('/job/increase_views/:id', function (req, res, next) {
    increase_views(req.params.id)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

/* MARK JOB */
router.put('/job/mark_job', function (req, res, next) {
    markJob(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

/* UNMARK JOB */
router.put('/job/un_mark_job', function (req, res, next) {
    unMarkJob(req)
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

/* JOIN TO JOB */
router.put('/job/join_to_job/:id', function (req, res, next) {
    joinToJob(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

/* UNJOIN FROM JOB */
router.put('/job/un_join_from_job/:id', function (req, res, next) {
    unJoinFromJob(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

module.exports = router;