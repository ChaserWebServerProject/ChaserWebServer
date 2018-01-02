var async = require('async');

var JobType = require('../models/JobType');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');
var City = require('../models/City');
var JobType = require('../models/JobType');
var User = require('../models/User');
var Company = require('../models/Company');
var Province = require('../models/Province');

getAllJobs = () => {
    return Job.find()
        .populate('jobExtend', 'position deadline salary graduation workType amount genderRequirement')
        .populate('jobType', 'jobTypeName')
        .populate('company', 'companyName id companyExtend')
        .populate({
            path: 'city',
            select: 'cityCode cityName',
            populate: {
                path: 'province',
                select: 'provinceCode provinceName'
            }
        });
};

getOneJobById = (id) => {
    return Job.findById(id)
        .populate('jobExtend', 'position deadline salary graduation workType amount genderRequirement')
        .populate('jobType', 'jobTypeName')
        .populate('company', 'companyName id companyExtend')
        .populate({
            path: 'city',
            select: 'cityCode cityName',
            populate: {
                path: 'province',
                select: 'provinceCode provinceName'
            }
        });
};

createJob = (req) => {
    return new Promise(async (resolve, reject) => {

        async.waterfall([
            (callback) => {
                Job.create(req.body.job)
                    .then(job => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                let reqJobExtend = req.body.job_extend;
                reqJobExtend.job = job;
                JobExtend.create(reqJobExtend)
                    .then(jExtend => {
                        job.jobExtend = jExtend;
                        job.save().catch(err => reject(err));
                        return callback(null, job)
                    })
                    .catch(err => {
                        Job.remove(job)
                            .exec()
                            .catch(err => reject(err));
                        return reject(err);
                    });
            },
            (job, callback) => {
                Company.findByIdAndUpdate(job.company, { $push: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                User.findByIdAndUpdate(job.user, { $push: { createdJobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                JobType.findByIdAndUpdate(job.jobType, { $push: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                City.findByIdAndUpdate(job.city, { $push: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                return callback(null);
            }
        ], (err, result) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
};

updateJob = (req) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id;
        const body = req.body;

        async.waterfall([
            (callback) => {
                //update job data
                Job.findByIdAndUpdate(id, body)
                    .exec()
                    .then((job) => {
                        JobExtend.findOneAndUpdate({ job: id }, body)
                            .exec()
                            .catch(err => reject(err));
                        return callback(null, job);//return old job data
                    })
                    .catch(err => reject(err));
            },
            (job, callback) => {
                // job is old data
                //delete old reference data
                Company.findByIdAndUpdate(job.company, { $pull: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                JobType.findByIdAndUpdate(job.jobType, { $pull: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                City.findByIdAndUpdate(job.city, { $pull: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));

                //update new references data
                Company.findByIdAndUpdate(body.company, { $push: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                JobType.findByIdAndUpdate(body.jobType, { $push: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                City.findByIdAndUpdate(body.city, { $push: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));

                return callback(null);
            },
            (callback) => {
                getOneJobById(id)
                    .exec()
                    .then(job => callback(null, job))
                    .catch(err => reject(err));
            }
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

deleteJob = (req) => {
    return new Promise((resolve, reject) => {

        const id = req.params.id;

        async.waterfall([
            (callback) => {
                JobExtend.findOneAndRemove({ job: id })
                    .exec()
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                Job.findByIdAndRemove(id)
                    .exec()
                    .then(job => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                Company.findByIdAndUpdate(job.company, { $pull: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                User.findByIdAndUpdate(job.user, { $pull: { createdJobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                JobType.findByIdAndUpdate(job.jobType, { $pull: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                City.findByIdAndUpdate(job.city, { $pull: { jobs: job.id } })
                    .exec()
                    .catch(err => reject(err));
                return callback(null);
            }
        ], (err, result) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
};

module.exports = { getAllJobs, getOneJobById, createJob, updateJob, deleteJob };