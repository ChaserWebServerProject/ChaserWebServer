var express = require('express');
var router = express.Router();

var Province = require('../models/Province');
var City = require('../models/City');

const { getAllProvinces } = require('../services/ProvinceService');

/* GET ALL PROVINCES */
router.get('/province/get_all_provinces', function (req, res, next) {
    getAllProvinces()
        .exec()
        .then(provinces => res.json(provinces))
        .catch(err => res.json(err));
});

/* GET ONE PROVINCE BY ID */
router.get('/province/get_one_province_by_id/:id', function (req, res, next) {
    Province.findById(req.params.id, function (err, province) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true, province: province });
    }).populate('cities');
});


// CREATE NEW PROVINCE
router.post('/province/create_province', function (req, res, next) {
    Province.create(req.body, function (err) {
        if (err) return res.json({ success: false, err: err });
        res.json({ success: true });
    });
});

/* UPDATE PROVINCE */
router.put('/province/update_province/:id', function (req, res, next) {
    const id = req.params.id;
    Province.findByIdAndUpdate(id, req.body, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            Province.findById(id)
                .then(province => res.json({ success: true, province: province }))
                .catch(err => res.json({ success: false, err: err }));
        }
    });
});

/* DELETE PROVINCE */
router.delete('/province/delete_province/:id', function (req, res, next) {
    const id = req.params.id;
    Province.findByIdAndRemove(id, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            City.remove({ province: id }, function (err) {
                if (err) return res.json({ success: false, err: err });
            })
            res.json({ success: true });
        }
    });
});

module.exports = router;