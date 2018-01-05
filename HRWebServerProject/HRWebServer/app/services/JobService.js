var async = require('async');

var JobType = require('../models/JobType');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');
var City = require('../models/City');
var JobType = require('../models/JobType');
var User = require('../models/User');
var Company = require('../models/Company');
var Province = require('../models/Province');

const getAllJobs = () => {
    return Job.find()
        .populate('jobExtend', 'position deadline salary graduation workType amount genderRequirement')
        .populate('jobType', 'jobTypeName')
        .populate({
            path: 'city',
            select: 'cityCode cityName',
            populate: {
                path: 'province',
                select: 'provinceCode provinceName'
            }
        })
        .populate({
            path: 'user',
            populate: {
                path: 'company',
                select: 'orderId companyName'
            }
        });
};

const getJobById = (id) => {
    return Job.findById(id)
        .populate('jobExtend', 'position deadline salary graduation workType amount genderRequirement')
        .populate('jobType', 'jobTypeName')
        .populate({
            path: 'city',
            select: 'cityCode cityName',
            populate: {
                path: 'province',
                select: 'provinceCode provinceName'
            }
        })
        .populate({
            path: 'user',
            populate: {
                path: 'company',
                select: 'orderId companyName'
            }
        });
};

const createJob = (req) => {
    return new Promise(async (resolve, reject) => {
        const job = new Job(req.body.job);
        const jobExtend = new JobExtend(req.body.job_extend);
        job.jobExtend = jobExtend._id;
        jobExtend.job = job._id;

        async.waterfall([
            (callback) => {
                job.save()
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                jobExtend.save()
                    .then(() => callback(null))
                    .catch(async (err) => {
                        await Job.remove(job)
                            .catch(err => reject(err));
                        return reject(err);
                    });
            },
            (callback) => {
                User.findByIdAndUpdate(job.user, { $push: { createdJobs: job.id } })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                JobType.findByIdAndUpdate(job.jobType, { $push: { jobs: job.id } })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                City.findByIdAndUpdate(job.city, { $push: { jobs: job.id } })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
        ], (err, result) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
};

const updateJob = (req) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id;
        const body = req.body;

        async.waterfall([
            (callback) => {
                //update job data
                Job.findByIdAndUpdate(id, body, { runValidators: true })
                    .then(async (job) => {
                        await JobExtend.findOneAndUpdate({ job: id }, body, { runValidators: true })
                            .catch(err => reject(err));
                        return callback(null, job);//return old job data
                    })
                    .catch(err => reject(err));
            },
            (job, callback) => {
                // job is old data
                //delete old reference data
                JobType.findByIdAndUpdate(job.jobType, { $pull: { jobs: job.id } })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                //delete old reference data
                City.findByIdAndUpdate(job.city, { $pull: { jobs: job.id } })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                //update new references data
                JobType.findByIdAndUpdate(body.jobType, { $push: { jobs: job.id } })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                //update new references data                
                City.findByIdAndUpdate(body.city, { $push: { jobs: job.id } })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                getJobById(id)
                    .then(job => callback(null, job))
                    .catch(err => reject(err));
            }
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const deleteJob = (req) => {
    return new Promise((resolve, reject) => {

        const id = req.params.id;

        async.waterfall([
            (callback) => {
                JobExtend.findOneAndRemove({ job: id })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                Job.findByIdAndRemove(id)
                    .then(job => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                User.findByIdAndUpdate(job.user, { $pull: { createdJobs: job.id } })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                JobType.findByIdAndUpdate(job.jobType, { $pull: { jobs: job.id } })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                City.findByIdAndUpdate(job.city, { $pull: { jobs: job.id } })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
        ], (err, result) => {
            if (err) return reject(err);
            else resolve(true);
        });
    });
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };