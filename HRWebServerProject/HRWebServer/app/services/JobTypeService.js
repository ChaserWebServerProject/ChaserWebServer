var JobType = require('../models/JobType');
var Job = require('../models/Job');

const getAllJobTypes = () => {
    return JobType.find().populate('jobs');
}

const getJobTypeById = (id) => {
    return JobType.findById(id).populate('jobs');
}

const createJobType = (req) => {
    return new Promise((resolve, reject) => {
        const jobType = new JobType(req.body);
        jobType.save()
            .then(() => resolve(true))
            .catch(err => reject(err));
    });
}

module.exports = {
    getAllJobTypes,
    getJobTypeById,
    createJobType
};
