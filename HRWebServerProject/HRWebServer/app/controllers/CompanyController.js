var express = require('express');
var router = express.Router();

var Company = require('../models/Company');
var CompanyExtend = require('../models/CompanyExtend');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');

const {
    getOneCompanyByUserId,
    getCompanyById,
    getAllCompanies,
    createCompany
} = require('../services/CompanyService');

/* GET ALL COMPANIES */
router.get('/company/get_all_companies', function (req, res, next) {
    getAllCompanies()
        .then(companies => res.json(companies))
        .catch(err => res.json(err));
});

/* GET ONE COMPANY BY ID */
router.get('/company/get_company_by_id/:id', function (req, res, next) {
    getCompanyById(req.params.id)
        .then(company => res.json(company))
        .catch(err => res.json(err));
});

/* GET ONE COMPANY BY USER ID */
router.get('/company/get_one_company_by_user_id', function (req, res, next) {
    const userId = "5a4e18d07b78182d0855d166";
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
    createCompany(req)
        .then((result => res.json({ success: result })))
        .catch(err => res.json({ success: false, err: err }));
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