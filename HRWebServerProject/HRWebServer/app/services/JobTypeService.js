
var JobType = require('../models/JobType');
var Job = require('../models/Job');

getAllJobTypes = () => {
    return JobType.find();
}

module.exports = { getAllJobTypes };
