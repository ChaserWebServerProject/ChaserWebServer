var Company = require('../models/Company');
var CompanyExtend = require('../models/CompanyExtend');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');

getOneCompanyByUserId = (id) => {
    return Company.findOne({ users: id })
}

module.exports = { getOneCompanyByUserId };
