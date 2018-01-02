var express = require('express');
var router = express.Router();

var Company = require('../models/Company');
var CompanyExtend = require('../models/CompanyExtend');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');

const { getOneCompanyByUserId } = require('../services/CompanyService');

/* GET ALL COMPANIES */
router.get('/company/get_all_companies', function (req, res, next) {
    Company.find(function (err, companies) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true, companies: companies });
    });
});

/* GET ONE COMPANY BY ID */
router.get('/company/get_one_company_by_id/:id', function (req, res, next) {
    Company.findById(req.params.id, function (err, company) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true, company: company });
    }).populate('companyExtend');
});

/* GET ONE COMPANY BY USER ID */
router.get('/company/get_one_company_by_user_id', function (req, res, next) {
    const userId = "5a4b55007051a231489e738e";
    getOneCompanyByUserId(userId)
        .exec()
        .then(company => {
            let result = [];
            result.push(company ? company : {});
            res.json(result)
        })
        .catch(err => res.json(err))
});

// CREATE NEW COMPANY
router.post('/company/create_company', async (req, res, next) => {
    const reqCompany = new Company(req.body.company);
    const reqCompanyExtend = new CompanyExtend(req.body.company_extend);

    resCompany = await reqCompany.save().catch(err => res.json({ success: false, err: err }));
    reqCompanyExtend.company = resCompany;
    resCompanyExtend = await reqCompanyExtend.save().catch(err => {
        resCompany.remove()
            .catch(err => res.json({ success: false, err: err }));
        return res.json({ success: false, err: err });
    });
    resCompany.companyExtend = resCompanyExtend;
    resCompany.save().catch(err => {
        res.json({ success: false, err: err });
    });
    return res.json({ success: true });
});

/* UPDATE COMPANY */
router.put('/company/update_company/:id', function (req, res, next) {
    const id = req.params.id;
    const body = req.body;
    Company.findByIdAndUpdate(id, body, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            CompanyExtend.findOneAndUpdate({ company: id }, body)
                .catch(err => res.json({ success: false, err: err }))
                .then(() => {
                    Company.findById(id)
                        .populate('companyExtend')
                        .then(company => res.json({ success: true, company: company }))
                        .catch(err => res.json({ success: false, err: err }));
                });
        }
    });
});

/* DELETE COMPANY */
router.delete('/company/delete_company/:id', async (req, res, next) => {
    const id = req.params.id;
    CompanyExtend.findOneAndRemove({ company: id }, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            Company.findByIdAndRemove(id, async (err) => {
                if (err) return res.json({ success: false, err: err });
                else {
                    const job = await Job.findOne({ company: id })
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
        }
    });
});

module.exports = router;