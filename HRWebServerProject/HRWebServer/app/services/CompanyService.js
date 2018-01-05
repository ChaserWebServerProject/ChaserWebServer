var Company = require('../models/Company');
var CompanyExtend = require('../models/CompanyExtend');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');

const getAllCompanies = () => {
    return Company.find().populate('companyExtend');
}

const getCompanyById = (id) => {
    return Company.findById(id).populate('companyExtend');
}

const getOneCompanyByUserId = (id) => {
    return Company.findOne({ users: id }).populate('companyExtend');
}

const createCompany = (req) => {
    return new Promise((resolve, reject) => {
        const company = new Company(req.body.company);
        const companyExtend = new CompanyExtend(req.body.company_extend);
        company.companyExtend = companyExtend._id;
        companyExtend.company = company._id;

        company.save()
            .then(() => {
                companyExtend.save()
                    .then(() => resolve(true))
                    .catch(async (err) => {
                        await Company.remove(company)
                            .catch(err => reject(err));
                        return reject(err)
                    })
            })
            .catch(err => reject(err));
    });
}

module.exports = {
    getOneCompanyByUserId,
    getCompanyById,
    getAllCompanies,
    createCompany
};
